import { TeacherImpression, TeacherProfile } from '../types/teachers';
import { isLocalhostClient } from './isLocalhostClient';

const MY_IMPRESSION_IDS_KEY = 'baotuong_my_impression_ids';
const DELETED_IMPRESSION_IDS_KEY = 'baotuong_deleted_impression_ids';
const LOCAL_IMPRESSIONS_KEY = 'baotuong_local_impressions';

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

export function getDeletedImpressionIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DELETED_IMPRESSION_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addDeletedImpressionId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getDeletedImpressionIds();
    if (!current.includes(id)) {
      localStorage.setItem(DELETED_IMPRESSION_IDS_KEY, JSON.stringify([id, ...current]));
    }
  } catch {
    // Ignore error
  }
}

interface LocalImpressionRecord {
  teacherId: string;
  impression: TeacherImpression;
}

export function getLocalImpressions(teacherId?: string): LocalImpressionRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_IMPRESSIONS_KEY);
    if (!raw) return [];
    const parsed: LocalImpressionRecord[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    if (teacherId) {
      return parsed.filter((rec) => rec.teacherId === teacherId);
    }
    return parsed;
  } catch {
    return [];
  }
}

export function saveLocalImpression(teacherId: string, impression: TeacherImpression): void {
  if (typeof window === 'undefined') return;
  try {
    const records = getLocalImpressions();
    const filtered = records.filter(
      (rec) => !(rec.teacherId === teacherId && rec.impression.id === impression.id)
    );
    localStorage.setItem(
      LOCAL_IMPRESSIONS_KEY,
      JSON.stringify([{ teacherId, impression }, ...filtered])
    );
  } catch {
    // Ignore localStorage errors
  }
}

export function removeLocalImpression(teacherId: string, impressionId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const records = getLocalImpressions();
    const updated = records.filter(
      (rec) => !(rec.teacherId === teacherId && rec.impression.id === impressionId)
    );
    localStorage.setItem(LOCAL_IMPRESSIONS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore error
  }
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

export function mergeTeacherImpressions(teacher: TeacherProfile): TeacherProfile {
  const deletedIds = new Set(getDeletedImpressionIds());
  const activeBase = (teacher.impressions || []).filter((imp) => !deletedIds.has(imp.id));

  const localRecords = getLocalImpressions(teacher.id);
  const map = new Map<string, TeacherImpression>();
  const seenKeys = new Set<string>();
  const serverIds = new Set<string>();
  const serverKeys = new Set<string>();

  for (const imp of activeBase) {
    const key = normalizeImpressionContentKey(imp);
    if (!map.has(imp.id) && (!key || !seenKeys.has(key))) {
      map.set(imp.id, imp);
      if (key) seenKeys.add(key);
    }
    serverIds.add(imp.id);
    if (key) serverKeys.add(key);
  }

  const unsyncedForTeacher: TeacherImpression[] = [];
  for (const rec of localRecords) {
    const imp = rec.impression;
    if (deletedIds.has(imp.id)) continue;
    const key = normalizeImpressionContentKey(imp);
    if (map.has(imp.id)) {
      if (getMyImpressionIds().includes(imp.id)) {
        map.set(imp.id, imp);
      }
      continue;
    }
    if (key && seenKeys.has(key)) {
      continue;
    }
    map.set(imp.id, imp);
    if (key) seenKeys.add(key);
    if (!serverIds.has(imp.id) && (!key || !serverKeys.has(key))) {
      unsyncedForTeacher.push(imp);
    }
  }

  // Tự động đồng bộ các cảm nhận còn lưu cục bộ trên thiết bị khác lên máy chủ web chính thức
  if (unsyncedForTeacher.length > 0 && typeof fetch !== 'undefined') {
    fetch(`/api/teachers/${encodeURIComponent(teacher.id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        teacherId: teacher.id,
        syncImpressions: unsyncedForTeacher,
      }),
    }).catch(() => {});
  }

  const merged = Array.from(map.values());
  merged.sort((a, b) => {
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
}

export function mergeAllTeachersWithLocal(teachers: TeacherProfile[]): TeacherProfile[] {
  return teachers.map((t) => mergeTeacherImpressions(t));
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
