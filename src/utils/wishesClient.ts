import { CreateWishInput, WishItem } from '../types/wishes';
import { isLocalhostClient } from './isLocalhostClient';
import { validateWishInput } from './validateWish';

const WISHES_API_ENDPOINT = '/api/wishes';
const WISHES_PUBLIC_FALLBACK = '/wishes-data.json';
const LOCAL_STORAGE_KEY = 'baotuong_local_wishes';
const MY_WISH_IDS_KEY = 'baotuong_my_wish_ids';
const DELETED_WISH_IDS_KEY = 'baotuong_deleted_wish_ids';

const DEFAULT_SEED_WISHES: WishItem[] = [
  {
    id: 'wish-1794055311352-b2f47b2e',
    senderName: 'Nguyễn Trà My',
    className: '9A3',
    message: 'Cảm ơn Thầy cô đã bên cạnh',
    createdAt: '2026-11-07T12:41:51.352Z',
  },
  {
    id: 'wish-1794049247793-a0bc860d',
    senderName: 'Nguyễn Minh Khang',
    className: '9A3',
    message:
      'Nhân ngày Nhà giáo Việt Nam 20/11, tập thể 9A3 kính chúc quý thầy cô Trường TH&THCS Hiệp Thạnh luôn mạnh khỏe và hạnh phúc!',
    createdAt: '2026-11-07T11:00:47.793Z',
  },
];

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

function getDeletedWishIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DELETED_WISH_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function addDeletedWishId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getDeletedWishIds();
    if (!current.includes(id)) {
      localStorage.setItem(DELETED_WISH_IDS_KEY, JSON.stringify([id, ...current]));
    }
  } catch {
    // Ignore error
  }
}

function getLocalWishes(): WishItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalWish(wish: WishItem): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalWishes();
    const updated = [wish, ...current.filter((w) => w.id !== wish.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore localStorage quotas or errors
  }
}

function removeLocalWish(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalWishes();
    const updated = current.filter((w) => w.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore error
  }
}

export async function fetchWishes(signal?: AbortSignal): Promise<WishItem[]> {
  let fetchedWishes: WishItem[] = [];
  let fetchSucceeded = false;

  // 1. Thử gọi API máy chủ /api/wishes trước
  try {
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
        fetchedWishes = data.wishes;
        fetchSucceeded = true;
      }
    }
  } catch {
    // Bỏ qua lỗi và chuyển sang fallback tĩnh
  }

  // 2. Nếu API không khả dụng (ví dụ trên hosting tĩnh Vercel), đọc tệp /wishes-data.json
  if (!fetchSucceeded) {
    try {
      const fallbackRes = await fetch(WISHES_PUBLIC_FALLBACK, {
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store',
        signal,
      });

      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        if (Array.isArray(fallbackData?.wishes)) {
          fetchedWishes = fallbackData.wishes;
          fetchSucceeded = true;
        }
      }
    } catch {
      // Tiếp tục fallback bộ nhớ cục bộ
    }
  }

  // 3. Nếu cả 2 đều không tải được (ngoại tuyến hoàn toàn), lấy danh sách mặc định
  if (!fetchSucceeded || fetchedWishes.length === 0) {
    fetchedWishes = DEFAULT_SEED_WISHES;
  }

  // 4. Lọc bỏ các lời chúc đã bị xóa trên thiết bị này
  const deletedIds = new Set(getDeletedWishIds());
  const activeFetched = fetchedWishes.filter((item) => !deletedIds.has(item.id));

  // 5. Đồng bộ thêm các lời chúc người dùng vừa gửi / cập nhật trên thiết bị này (localStorage)
  const localWishes = getLocalWishes();
  const map = new Map<string, WishItem>();

  for (const item of activeFetched) {
    map.set(item.id, item);
  }
  for (const localItem of localWishes) {
    if (!deletedIds.has(localItem.id)) {
      map.set(localItem.id, localItem);
    }
  }

  const merged = Array.from(map.values());
  merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return merged;
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

  // 1. Thử gửi lên API máy chủ nếu có
  try {
    const response = await fetch(WISHES_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(validation.cleaned),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.wish) {
        saveLocalWish(data.wish);
        addMyWishId(data.wish.id);
        return data.wish;
      }
    } else {
      // Nếu máy chủ báo lỗi trùng hoặc xác thực nghiệp vụ (400, 409), đọc thông báo lỗi an toàn
      try {
        const errData = await response.json();
        let serverMsg: string | null = null;
        if (typeof errData?.error === 'string') {
          serverMsg = errData.error;
        } else if (typeof errData?.error?.message === 'string') {
          serverMsg = errData.error.message;
        }
        if (serverMsg && response.status !== 404 && response.status !== 405) {
          throw new Error(serverMsg);
        }
      } catch (parseErr: unknown) {
        if (parseErr instanceof Error && parseErr.message && !parseErr.message.includes('JSON')) {
          throw parseErr;
        }
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error && !err.message.includes('fetch') && !err.message.includes('NetworkError')) {
      throw err;
    }
  }

  // 2. Chế độ dự phòng khi chạy tĩnh trên Vercel: Lưu trực tiếp vào thiết bị của học sinh
  const localCreatedWish: WishItem = {
    id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    senderName: validation.cleaned.senderName,
    className: validation.cleaned.className,
    message: validation.cleaned.message,
    createdAt: new Date().toISOString(),
  };

  saveLocalWish(localCreatedWish);
  addMyWishId(localCreatedWish.id);
  return localCreatedWish;
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

  // 1. Thử gửi lên API máy chủ nếu có
  try {
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
        saveLocalWish(data.wish);
        addMyWishId(data.wish.id);
        return data.wish;
      }
    }
  } catch {
    // Tiếp tục lưu trữ cục bộ
  }

  // 2. Cập nhật trong bộ nhớ cục bộ
  const currentLocal = getLocalWishes();
  const existing = currentLocal.find((w) => w.id === id);
  const updatedWish: WishItem = {
    id,
    senderName: validation.cleaned.senderName,
    className: validation.cleaned.className,
    message: validation.cleaned.message,
    createdAt: existing?.createdAt || new Date().toISOString(),
  };

  saveLocalWish(updatedWish);
  addMyWishId(id);
  return updatedWish;
}

export async function deleteWish(id: string): Promise<void> {
  // 1. Thử gửi lên API máy chủ nếu có
  try {
    await fetch(`${WISHES_API_ENDPOINT}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });
  } catch {
    // Tiếp tục cập nhật cục bộ
  }

  // 2. Đánh dấu xóa và xóa khỏi bộ nhớ thiết bị
  addDeletedWishId(id);
  removeLocalWish(id);
  removeMyWishId(id);
}
