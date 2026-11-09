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

export function mergeTeacherImpressions(teacher: TeacherProfile): TeacherProfile {
  const deletedIds = new Set(getDeletedImpressionIds());
  const activeBase = (teacher.impressions || []).filter((imp) => !deletedIds.has(imp.id));

  const localRecords = getLocalImpressions(teacher.id);
  const map = new Map<string, TeacherImpression>();

  for (const imp of activeBase) {
    map.set(imp.id, imp);
  }

  for (const rec of localRecords) {
    if (!deletedIds.has(rec.impression.id)) {
      map.set(rec.impression.id, rec.impression);
    }
  }

  const merged = Array.from(map.values());
  merged.sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  return {
    ...teacher,
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
