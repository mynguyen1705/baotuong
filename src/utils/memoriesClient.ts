import { DEFAULT_MEMORIES_DATA } from '../data/defaultMemories';
import {
  MemoryItem,
  MemorySlotId,
  MemoryStationData,
  UpdateMemoryPayload,
  UpdateStationMetaPayload,
} from '../types/memories';
import { isLocalhostClient } from './isLocalhostClient';

export const MEMORIES_LOCAL_STORAGE_KEY = 'baotuong_memories_data_v1';

export function loadMemoriesFromLocal(): MemoryStationData | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(MEMORIES_LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.memories) && parsed.memories.length >= 11) {
      return parsed as MemoryStationData;
    }
  } catch {
    // Ignore invalid JSON in local storage
  }
  return null;
}

export function saveMemoriesToLocal(data: MemoryStationData): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(MEMORIES_LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore quota errors in localStorage
  }
}

export async function fetchMemoriesClient(): Promise<{
  data: MemoryStationData;
  isOwner: boolean;
}> {
  const localOwner = isLocalhostClient();

  if (typeof fetch === 'undefined') {
    const cached = loadMemoriesFromLocal() || structuredClone(DEFAULT_MEMORIES_DATA);
    return { data: cached, isOwner: localOwner };
  }

  // 1. Thử gọi API backend
  try {
    const res = await fetch('/api/memories');
    if (res.ok) {
      const payload = await res.json();
      if (payload && payload.success && payload.data && Array.isArray(payload.data.memories)) {
        saveMemoriesToLocal(payload.data);
        return {
          data: payload.data,
          isOwner: Boolean(payload.isOwner && localOwner),
        };
      }
    }
  } catch {
    // Fallback to static file or local cache
  }

  // 2. Thử đọc file tĩnh /memories-data.json
  try {
    const staticRes = await fetch('/memories-data.json');
    if (staticRes.ok) {
      const staticData = await staticRes.json();
      if (staticData && Array.isArray(staticData.memories) && staticData.memories.length === 11) {
        saveMemoriesToLocal(staticData);
        return { data: staticData, isOwner: localOwner };
      }
    }
  } catch {
    // Fallback to local
  }

  // 3. Fallback sang localStorage hoặc default seeded data
  const localCached = loadMemoriesFromLocal() || structuredClone(DEFAULT_MEMORIES_DATA);
  return { data: localCached, isOwner: localOwner };
}

export async function saveMemorySlotClient(
  slotId: MemorySlotId,
  payload: UpdateMemoryPayload
): Promise<{ success: boolean; item?: MemoryItem; error?: string }> {
  const localOwner = isLocalhostClient();
  if (!localOwner) {
    return { success: false, error: 'Chỉ chủ sở hữu trên máy localhost mới có quyền thay đổi ảnh.' };
  }

  // Optimistic update local
  const current = loadMemoriesFromLocal() || structuredClone(DEFAULT_MEMORIES_DATA);
  const idx = current.memories.findIndex((m) => m.id === slotId);
  let updatedItem: MemoryItem | undefined;

  if (idx !== -1) {
    current.memories[idx] = {
      ...current.memories[idx],
      photoUrl: payload.photoUrl,
      caption: payload.caption ?? current.memories[idx].caption,
      date: payload.date ?? current.memories[idx].date,
      tag: payload.tag ?? current.memories[idx].tag,
    };
    current.lastUpdated = new Date().toISOString();
    updatedItem = current.memories[idx];
    saveMemoriesToLocal(current);
  }

  // Gọi API server
  if (typeof fetch !== 'undefined') {
    try {
      const res = await fetch(`/api/memories/slot/${slotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Lỗi khi cập nhật ảnh lên server.' };
      }
      return { success: true, item: data.item || updatedItem };
    } catch {
      // Local update succeeded even if network offline
    }
  }

  return { success: true, item: updatedItem };
}

export async function saveStationMetaClient(
  payload: UpdateStationMetaPayload
): Promise<{ success: boolean; data?: MemoryStationData; error?: string }> {
  const localOwner = isLocalhostClient();
  if (!localOwner) {
    return { success: false, error: 'Chỉ chủ sở hữu trên máy localhost mới có quyền sửa tiêu đề/trích dẫn.' };
  }

  const current = loadMemoriesFromLocal() || structuredClone(DEFAULT_MEMORIES_DATA);
  if (payload.title) current.title = payload.title.trim();
  if (payload.subtitle) current.subtitle = payload.subtitle.trim();
  if (payload.quote) current.quote = payload.quote.trim();
  if (payload.authorNote) current.authorNote = payload.authorNote.trim();
  current.lastUpdated = new Date().toISOString();
  saveMemoriesToLocal(current);

  if (typeof fetch !== 'undefined') {
    try {
      const res = await fetch('/api/memories/meta', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Lỗi khi cập nhật thông tin lên server.' };
      }
      return { success: true, data: data.data || current };
    } catch {
      // Local succeeded
    }
  }

  return { success: true, data: current };
}

