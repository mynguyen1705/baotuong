import { isMockedTestFetch, supabase } from '../lib/supabaseClient';
import { TeacherImpression, TeacherProfile } from '../types/teachers';
import { isLocalhostClient } from './isLocalhostClient';

const MY_IMPRESSION_IDS_KEY = 'baotuong_my_impression_ids';
const LEGACY_LOCAL_IMPRESSIONS_KEY = 'baotuong_local_impressions';
const LEGACY_DELETED_IMPRESSION_IDS_KEY = 'baotuong_deleted_impression_ids';

export const TEACHERS_QUERY_KEY = ['teachers'] as const;
export const TEACHER_IMPRESSIONS_QUERY_KEY = ['teacher_impressions'] as const;

export interface SupabaseTeacherImpressionRow {
  id: string;
  teacher_id: string;
  author: string;
  content: string;
  color: string;
  rotation: number;
  created_at: string;
}

export function getMyImpressionIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MY_IMPRESSION_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addMyImpressionId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getMyImpressionIds();
    if (!current.includes(id)) {
      localStorage.setItem(MY_IMPRESSION_IDS_KEY, JSON.stringify([id, ...current]));
    }
  } catch {
    // Ignore error
  }
}

export function removeMyImpressionId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getMyImpressionIds();
    const updated = current.filter((item) => item !== id);
    localStorage.setItem(MY_IMPRESSION_IDS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore error
  }
}

export function isMyImpression(id: string, isOwner?: boolean): boolean {
  if (isOwner === true) {
    return true; // Máy tính chủ sở hữu localhost có toàn quyền
  }
  if (isOwner === false) {
    return getMyImpressionIds().includes(id);
  }
  if (isLocalhostClient()) {
    return true;
  }
  return getMyImpressionIds().includes(id);
}

export function mapImpressionToSupabaseRow(
  teacherId: string,
  impression: TeacherImpression
): SupabaseTeacherImpressionRow {
  return {
    id: impression.id,
    teacher_id: teacherId,
    author: impression.studentName.trim(),
    color: (impression.className || '9A3').trim(),
    content: JSON.stringify({
      studentName: impression.studentName.trim(),
      className: (impression.className || '9A3').trim(),
      trait: impression.trait.trim(),
      detail: impression.detail.trim(),
    }),
    rotation: 0,
    created_at: impression.createdAt || new Date().toISOString(),
  };
}

export function mapRowToTeacherImpression(row: SupabaseTeacherImpressionRow): {
  teacherId: string;
  impression: TeacherImpression;
} {
  let studentName = String(row.author || 'Học sinh 9A3').trim();
  let className = row.color && row.color !== 'yellow' ? String(row.color).trim() : '9A3';
  let trait = 'Tận tâm & nhiệt huyết';
  let detail = String(row.content || '').trim();

  if (detail.startsWith('{')) {
    try {
      const parsed = JSON.parse(detail);
      if (parsed && typeof parsed === 'object') {
        if (parsed.studentName) studentName = String(parsed.studentName).trim();
        if (parsed.className) className = String(parsed.className).trim();
        if (parsed.trait) trait = String(parsed.trait).trim();
        if (parsed.detail) detail = String(parsed.detail).trim();
      }
    } catch {
      // Fallback to plain text
    }
  }

  return {
    teacherId: String(row.teacher_id),
    impression: {
      id: String(row.id),
      studentName,
      className,
      trait,
      detail,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    },
  };
}

function normalizeImpressionContentKey(imp: {
  studentName?: string;
  className?: string;
  trait?: string;
  detail?: string;
}): string {
  const s = String(imp.studentName || '').trim().toLowerCase();
  const c = String(imp.className || '9A3').trim().toLowerCase();
  const t = String(imp.trait || '').trim().toLowerCase();
  const d = String(imp.detail || '').trim().toLowerCase();
  if (!s || !t || !d) return '';
  return `${s}|${c}|${t}|${d}`;
}

/**
 * Nếu trình duyệt của học sinh còn nhận xét cũ từng lưu trong localStorage trước khi nâng cấp Supabase,
 * tự động đẩy toàn bộ lên bảng public.teacher_impressions trên Supabase rồi xóa bỏ bộ nhớ cục bộ.
 */
async function migrateLegacyLocalImpressionsToSupabase(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LEGACY_DELETED_IMPRESSION_IDS_KEY);
    const raw = localStorage.getItem(LEGACY_LOCAL_IMPRESSIONS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.removeItem(LEGACY_LOCAL_IMPRESSIONS_KEY);
      return;
    }

    const rowsToUpsert: SupabaseTeacherImpressionRow[] = [];
    for (const rec of parsed) {
      if (
        rec &&
        typeof rec.teacherId === 'string' &&
        rec.impression &&
        typeof rec.impression.id === 'string' &&
        typeof rec.impression.studentName === 'string' &&
        typeof rec.impression.trait === 'string' &&
        typeof rec.impression.detail === 'string'
      ) {
        rowsToUpsert.push(mapImpressionToSupabaseRow(rec.teacherId, rec.impression));
      }
    }

    if (rowsToUpsert.length > 0) {
      const { error } = await supabase
        .from('teacher_impressions')
        .upsert(rowsToUpsert, { onConflict: 'id', ignoreDuplicates: true });
      if (!error) {
        localStorage.removeItem(LEGACY_LOCAL_IMPRESSIONS_KEY);
      }
    } else {
      localStorage.removeItem(LEGACY_LOCAL_IMPRESSIONS_KEY);
    }
  } catch {
    // Ignore migration errors
  }
}

export async function fetchAllTeacherImpressionsFromSupabase(): Promise<
  Record<string, TeacherImpression[]>
> {
  if (isMockedTestFetch()) {
    return {};
  }

  await migrateLegacyLocalImpressionsToSupabase();

  const { data, error } = await supabase
    .from('teacher_impressions')
    .select('id, teacher_id, author, content, color, rotation, created_at')
    .order('created_at', { ascending: false });

  if (error || !Array.isArray(data)) {
    return {};
  }

  const grouped: Record<string, TeacherImpression[]> = {};
  for (const rawRow of data) {
    const { teacherId, impression } = mapRowToTeacherImpression(
      rawRow as SupabaseTeacherImpressionRow
    );
    if (!grouped[teacherId]) {
      grouped[teacherId] = [];
    }
    grouped[teacherId].push(impression);
  }

  return grouped;
}

export function mergeTeachersWithSupabaseImpressions(
  teachers: TeacherProfile[],
  impressionsByTeacher: Record<string, TeacherImpression[]>,
  replaceFromDatabase = false
): TeacherProfile[] {
  return teachers.map((teacher) => {
    const dbImps = impressionsByTeacher[teacher.id] || [];
    const baseImps = replaceFromDatabase ? [] : teacher.impressions || [];

    const map = new Map<string, TeacherImpression>();
    const seenKeys = new Set<string>();

    for (const imp of [...dbImps, ...baseImps]) {
      if (!imp || !imp.id) continue;
      const key = normalizeImpressionContentKey(imp);
      if (!map.has(imp.id) && (!key || !seenKeys.has(key))) {
        map.set(imp.id, imp);
        if (key) seenKeys.add(key);
      }
    }

    const merged = Array.from(map.values()).sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    const traitSet = new Set(teacher.personalityTraits || []);
    for (const imp of merged) {
      if (imp.trait) traitSet.add(imp.trait);
    }

    return {
      ...teacher,
      personalityTraits: Array.from(traitSet),
      impressions: merged,
    };
  });
}

export function mergeAllTeachersWithLocal(teachers: TeacherProfile[]): TeacherProfile[] {
  return mergeTeachersWithSupabaseImpressions(teachers, {}, false);
}

export async function createTeacherImpressionClient(
  teacherId: string,
  input: {
    studentName: string;
    className: string;
    trait: string;
    detail: string;
  },
  currentTeacher: TeacherProfile
): Promise<{ teacher: TeacherProfile; impression: TeacherImpression }> {
  const newImp: TeacherImpression = {
    id: `imp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    studentName: input.studentName.trim(),
    className: (input.className || '9A3').trim(),
    trait: input.trait.trim(),
    detail: input.detail.trim(),
    createdAt: new Date().toISOString(),
  };

  // 1. Ghi trực tiếp vào bảng public.teacher_impressions trên Supabase
  if (!isMockedTestFetch()) {
    const row = mapImpressionToSupabaseRow(teacherId, newImp);
    const { data, error } = await supabase
      .from('teacher_impressions')
      .insert(row)
      .select('id, teacher_id, author, content, color, rotation, created_at')
      .single();

    if (!error && data) {
      const { impression: savedImp } = mapRowToTeacherImpression(
        data as SupabaseTeacherImpressionRow
      );
      addMyImpressionId(savedImp.id);

      // Đồng bộ song song về API máy chủ
      if (typeof fetch === 'function') {
        fetch(`/api/teachers/${encodeURIComponent(teacherId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teacherId,
            impression: savedImp,
          }),
        }).catch(() => {});
      }

      const traits = currentTeacher.personalityTraits.includes(savedImp.trait)
        ? currentTeacher.personalityTraits
        : [...currentTeacher.personalityTraits, savedImp.trait];

      const updatedTeacher: TeacherProfile = {
        ...currentTeacher,
        personalityTraits: traits,
        impressions: [
          savedImp,
          ...currentTeacher.impressions.filter((i) => i.id !== savedImp.id),
        ],
        updatedAt: new Date().toISOString(),
      };

      return { teacher: updatedTeacher, impression: savedImp };
    }
  }

  // 2. Dự phòng gọi API máy chủ /api/teachers/:id
  const res = await fetch(`/api/teachers/${encodeURIComponent(teacherId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      teacherId,
      impression: newImp,
    }),
  });

  if (res.ok) {
    const data = await res.json();
    if (data?.teacher) {
      const updatedTeacher: TeacherProfile = data.teacher;
      const savedImp: TeacherImpression =
        data.impression ||
        (Array.isArray(updatedTeacher.impressions) && updatedTeacher.impressions[0]) ||
        newImp;
      addMyImpressionId(savedImp.id);
      return { teacher: updatedTeacher, impression: savedImp };
    }
  }

  throw new Error('Không thể lưu nhận xét tính cách lên cơ sở dữ liệu lúc này. Vui lòng thử lại.');
}

export async function updateTeacherImpressionClient(
  teacherId: string,
  updatedImp: TeacherImpression,
  currentTeacher: TeacherProfile
): Promise<{ teacher: TeacherProfile; impression: TeacherImpression }> {
  // 1. Cập nhật trực tiếp trên Supabase
  if (!isMockedTestFetch()) {
    const row = mapImpressionToSupabaseRow(teacherId, updatedImp);
    const { data, error } = await supabase
      .from('teacher_impressions')
      .update({
        author: row.author,
        color: row.color,
        content: row.content,
      })
      .eq('id', updatedImp.id)
      .select('id, teacher_id, author, content, color, rotation, created_at')
      .single();

    if (!error && data) {
      const { impression: savedImp } = mapRowToTeacherImpression(
        data as SupabaseTeacherImpressionRow
      );
      addMyImpressionId(savedImp.id);

      if (typeof fetch === 'function') {
        fetch(`/api/teachers/${encodeURIComponent(teacherId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teacherId,
            updateImpression: savedImp,
          }),
        }).catch(() => {});
      }

      const nextImps = currentTeacher.impressions.map((i) =>
        i.id === savedImp.id ? savedImp : i
      );
      const traitSet = new Set(currentTeacher.personalityTraits || []);
      for (const imp of nextImps) {
        if (imp.trait) traitSet.add(imp.trait);
      }

      const updatedTeacher: TeacherProfile = {
        ...currentTeacher,
        personalityTraits: Array.from(traitSet),
        impressions: nextImps,
        updatedAt: new Date().toISOString(),
      };

      return { teacher: updatedTeacher, impression: savedImp };
    }
  }

  // 2. Dự phòng qua API máy chủ
  const res = await fetch(`/api/teachers/${encodeURIComponent(teacherId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      teacherId,
      updateImpression: updatedImp,
    }),
  });

  if (res.ok) {
    const data = await res.json();
    if (data?.teacher) {
      addMyImpressionId(updatedImp.id);
      return { teacher: data.teacher, impression: data.impression || updatedImp };
    }
  }

  throw new Error('Không thể cập nhật nhận xét trên cơ sở dữ liệu lúc này. Vui lòng thử lại.');
}

export async function deleteTeacherImpressionClient(
  teacherId: string,
  impressionId: string,
  currentTeacher: TeacherProfile
): Promise<{ teacher: TeacherProfile; deletedId: string }> {
  // 1. Xóa trực tiếp trên Supabase
  if (!isMockedTestFetch()) {
    const { error } = await supabase
      .from('teacher_impressions')
      .delete()
      .eq('id', impressionId);

    if (!error) {
      removeMyImpressionId(impressionId);

      if (typeof fetch === 'function') {
        fetch(`/api/teachers/${encodeURIComponent(teacherId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teacherId,
            deleteImpressionId: impressionId,
          }),
        }).catch(() => {});
      }

      const nextImps = currentTeacher.impressions.filter((i) => i.id !== impressionId);
      const updatedTeacher: TeacherProfile = {
        ...currentTeacher,
        impressions: nextImps,
        updatedAt: new Date().toISOString(),
      };

      return { teacher: updatedTeacher, deletedId: impressionId };
    }
  }

  // 2. Dự phòng qua API máy chủ
  const res = await fetch(`/api/teachers/${encodeURIComponent(teacherId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      teacherId,
      deleteImpressionId: impressionId,
    }),
  });

  if (!res.ok) {
    throw new Error('Không thể xóa nhận xét lúc này. Vui lòng thử lại.');
  }

  removeMyImpressionId(impressionId);
  const nextImps = currentTeacher.impressions.filter((i) => i.id !== impressionId);
  const updatedTeacher: TeacherProfile = {
    ...currentTeacher,
    impressions: nextImps,
    updatedAt: new Date().toISOString(),
  };

  return { teacher: updatedTeacher, deletedId: impressionId };
}

export function formatImpressionTime(isoString?: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}
