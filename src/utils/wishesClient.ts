import { supabase, isMockedTestFetch } from '../lib/supabaseClient';
import { CreateWishInput, WishItem } from '../types/wishes';
import { isLocalhostClient } from './isLocalhostClient';
import { validateWishInput } from './validateWish';

const WISHES_API_ENDPOINT = '/api/wishes';
const LEGACY_LOCAL_STORAGE_KEY = 'baotuong_local_wishes';
const MY_WISH_IDS_KEY = 'baotuong_my_wish_ids';

export const WISHES_QUERY_KEY = ['wishes'] as const;

interface SupabaseWishRow {
  id: string;
  sender_name: string;
  class_name: string;
  message: string;
  created_at: string;
}

function mapRowToWish(row: SupabaseWishRow): WishItem {
  return {
    id: String(row.id),
    senderName: String(row.sender_name || '').trim(),
    className: String(row.class_name || '9A3').trim(),
    message: String(row.message || '').trim(),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export function getMyWishIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MY_WISH_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addMyWishId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getMyWishIds();
    if (!current.includes(id)) {
      localStorage.setItem(MY_WISH_IDS_KEY, JSON.stringify([id, ...current]));
    }
  } catch {
    // Ignore error
  }
}

export function removeMyWishId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getMyWishIds();
    const updated = current.filter((item) => item !== id);
    localStorage.setItem(MY_WISH_IDS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore error
  }
}

export function isMyWish(id: string): boolean {
  if (isLocalhostClient()) {
    return true; // Máy chủ chính của chủ sở hữu có toàn quyền
  }
  return getMyWishIds().includes(id);
}

/**
 * Nếu trình duyệt của học sinh còn dữ liệu cũ từng bị kẹt trong localStorage trước khi nâng cấp Supabase,
 * tự động đẩy toàn bộ lên bảng public.wishes trên Supabase rồi xóa bỏ bộ nhớ cục bộ.
 */
async function migrateLegacyLocalWishesToSupabase(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(LEGACY_LOCAL_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY);
      return;
    }

    const rowsToUpsert: SupabaseWishRow[] = parsed
      .filter(
        (item: Partial<WishItem>) =>
          item &&
          typeof item.id === 'string' &&
          typeof item.senderName === 'string' &&
          typeof item.message === 'string' &&
          item.senderName.trim().length > 0 &&
          item.message.trim().length > 0
      )
      .map((item: WishItem) => ({
        id: item.id.trim(),
        sender_name: item.senderName.trim(),
        class_name: (item.className || '9A3').trim(),
        message: item.message.trim(),
        created_at: item.createdAt || new Date().toISOString(),
      }));

    if (rowsToUpsert.length > 0) {
      const { error } = await supabase
        .from('wishes')
        .upsert(rowsToUpsert, { onConflict: 'id', ignoreDuplicates: true });
      if (!error) {
        localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY);
      }
    } else {
      localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY);
    }
  } catch {
    // Ignore migration errors
  }
}

export async function fetchWishes(signal?: AbortSignal): Promise<WishItem[]> {
  // 1. Đọc trực tiếp từ Supabase (cơ sở dữ liệu chung cho mọi thiết bị)
  if (!isMockedTestFetch()) {
    await migrateLegacyLocalWishesToSupabase();

    const { data, error } = await supabase
      .from('wishes')
      .select('id, sender_name, class_name, message, created_at')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      return data.map((row) => mapRowToWish(row as SupabaseWishRow));
    }
  }

  // 2. Dự phòng qua API máy chủ /api/wishes (cũng kết nối trực tiếp với Supabase)
  const response = await fetch(WISHES_API_ENDPOINT, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
    signal,
  });

  if (response.ok) {
    const data = await response.json();
    if (Array.isArray(data?.wishes)) {
      return data.wishes;
    }
  }

  throw new Error('Không thể tải danh sách lời chúc từ cơ sở dữ liệu. Vui lòng thử lại.');
}

export async function submitWish(input: CreateWishInput): Promise<WishItem> {
  const validation = validateWishInput(input);
  if (!validation.valid) {
    const firstError =
      validation.fieldErrors.senderName ||
      validation.fieldErrors.className ||
      validation.fieldErrors.message ||
      'Dữ liệu gửi lên không đúng định dạng.';
    throw new Error(firstError);
  }

  const candidateWish: WishItem = {
    id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    senderName: validation.cleaned.senderName,
    className: validation.cleaned.className,
    message: validation.cleaned.message,
    createdAt: new Date().toISOString(),
  };

  // 1. Ghi trực tiếp lên bảng public.wishes trên Supabase
  if (!isMockedTestFetch()) {
    const { data, error } = await supabase
      .from('wishes')
      .insert({
        id: candidateWish.id,
        sender_name: candidateWish.senderName,
        class_name: candidateWish.className,
        message: candidateWish.message,
        created_at: candidateWish.createdAt,
      })
      .select('id, sender_name, class_name, message, created_at')
      .single();

    if (!error && data) {
      const saved = mapRowToWish(data as SupabaseWishRow);
      addMyWishId(saved.id);

      // Đồng bộ song song về API máy chủ nếu đang chạy kèm server
      if (typeof fetch === 'function') {
        fetch(WISHES_API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(saved),
        }).catch(() => {});
      }

      return saved;
    }
  }

  // 2. Dự phòng gọi qua /api/wishes (kết nối Supabase từ phía server)
  const response = await fetch(WISHES_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      ...validation.cleaned,
      id: candidateWish.id,
      createdAt: candidateWish.createdAt,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    if (data?.wish) {
      addMyWishId(data.wish.id);
      return data.wish;
    }
  } else {
    let serverMsg: string | null = null;
    try {
      const errData = await response.json();
      if (typeof errData?.error === 'string') {
        serverMsg = errData.error;
      } else if (typeof errData?.error?.message === 'string') {
        serverMsg = errData.error.message;
      }
    } catch {
      // Ignore parse error
    }
    if (serverMsg) {
      throw new Error(serverMsg);
    }
  }

  throw new Error('Không thể lưu lời chúc lên cơ sở dữ liệu lúc này. Vui lòng thử lại.');
}

export async function updateWish(id: string, input: Partial<CreateWishInput>): Promise<WishItem> {
  const validation = validateWishInput(input);
  if (!validation.valid) {
    const firstError =
      validation.fieldErrors.senderName ||
      validation.fieldErrors.className ||
      validation.fieldErrors.message ||
      'Dữ liệu lời chúc không hợp lệ.';
    throw new Error(firstError);
  }

  // 1. Cập nhật trực tiếp trên Supabase
  if (!isMockedTestFetch()) {
    const { data, error } = await supabase
      .from('wishes')
      .update({
        sender_name: validation.cleaned.senderName,
        class_name: validation.cleaned.className,
        message: validation.cleaned.message,
      })
      .eq('id', id)
      .select('id, sender_name, class_name, message, created_at')
      .single();

    if (!error && data) {
      const updated = mapRowToWish(data as SupabaseWishRow);
      addMyWishId(updated.id);

      if (typeof fetch === 'function') {
        fetch(`${WISHES_API_ENDPOINT}/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(validation.cleaned),
        }).catch(() => {});
      }

      return updated;
    }
  }

  // 2. Dự phòng gọi API máy chủ
  const response = await fetch(`${WISHES_API_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(validation.cleaned),
  });

  if (response.ok) {
    const data = await response.json();
    if (data?.wish) {
      addMyWishId(data.wish.id);
      return data.wish;
    }
  }

  throw new Error('Không thể cập nhật lời chúc trên cơ sở dữ liệu lúc này. Vui lòng thử lại.');
}

export async function deleteWish(id: string): Promise<void> {
  // 1. Xóa trực tiếp trên Supabase
  if (!isMockedTestFetch()) {
    const { error } = await supabase.from('wishes').delete().eq('id', id);
    if (!error) {
      removeMyWishId(id);
      if (typeof fetch === 'function') {
        fetch(`${WISHES_API_ENDPOINT}/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { Accept: 'application/json' },
        }).catch(() => {});
      }
      return;
    }
  }

  // 2. Dự phòng gọi API máy chủ
  const response = await fetch(`${WISHES_API_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Không thể xóa lời chúc lúc này. Vui lòng thử lại.');
  }

  removeMyWishId(id);
}
