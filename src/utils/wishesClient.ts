import { CreateWishInput, WishItem } from '../types/wishes';

const WISHES_API_ENDPOINT = '/api/wishes';

export async function fetchWishes(signal?: AbortSignal): Promise<WishItem[]> {
  const response = await fetch(WISHES_API_ENDPOINT, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
    signal,
  });

  let data: { wishes?: WishItem[]; error?: string } = {};
  try {
    data = (await response.json()) as { wishes?: WishItem[]; error?: string };
  } catch {
    // Ignore JSON parse error and fall back to status message
  }

  if (!response.ok) {
    throw new Error(data.error || 'Không thể tải danh sách lời chúc từ máy chủ.');
  }

  return Array.isArray(data.wishes) ? data.wishes : [];
}

export async function submitWish(input: CreateWishInput): Promise<WishItem> {
  const response = await fetch(WISHES_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
  });

  let data: { wish?: WishItem; error?: string } = {};
  try {
    data = (await response.json()) as { wish?: WishItem; error?: string };
  } catch {
    // Ignore JSON parse error and fall back to status message
  }

  if (!response.ok || !data.wish) {
    throw new Error(data.error || 'Không thể gửi lời chúc lúc này. Vui lòng thử lại.');
  }

  return data.wish;
}

