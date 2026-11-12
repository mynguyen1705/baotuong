import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  fetchMemoriesClient,
  saveMemorySlotClient,
  saveStationMetaClient,
  loadMemoriesFromLocal,
  saveMemoriesToLocal,
} from '../utils/memoriesClient';
import { DEFAULT_MEMORIES_DATA } from '../data/defaultMemories';
import { MemoryStationData } from '../types/memories';

describe('memoriesClient Utility Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('lưu trữ và khôi phục dữ liệu từ localStorage', () => {
    const mockData: MemoryStationData = {
      ...DEFAULT_MEMORIES_DATA,
      title: 'Kỷ Niệm Thân Thương 9A3',
    };
    saveMemoriesToLocal(mockData);

    const loaded = loadMemoriesFromLocal();
    expect(loaded).toBeDefined();
    expect(loaded?.title).toBe('Kỷ Niệm Thân Thương 9A3');
    expect(loaded?.memories.length).toBe(12);
  });

  it('fetchMemoriesClient lấy thành công từ API server khi server online', async () => {
    const mockServerData: MemoryStationData = {
      ...DEFAULT_MEMORIES_DATA,
      quote: 'Kính chúc thầy cô vạn sự bình an',
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockServerData,
        isOwner: true,
      }),
    });

    const result = await fetchMemoriesClient();
    expect(result.data.quote).toBe('Kính chúc thầy cô vạn sự bình an');
    expect(result.isOwner).toBe(true);

    // Đồng thời kiểm tra dữ liệu đã được cache vào localStorage
    const cached = loadMemoriesFromLocal();
    expect(cached?.quote).toBe('Kính chúc thầy cô vạn sự bình an');
  });

  it('fetchMemoriesClient fallback sang static file hoặc localStorage khi API lỗi', async () => {
    // Lưu trước vào local
    saveMemoriesToLocal({
      ...DEFAULT_MEMORIES_DATA,
      title: 'Offline Cached Memory',
    });

    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await fetchMemoriesClient();
    expect(result.data.title).toBe('Offline Cached Memory');
  });

  it('saveMemorySlotClient gọi đúng PUT endpoint và cập nhật local', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        item: {
          id: 4,
          row: 2,
          photoUrl: 'data:image/jpeg;base64,newphoto',
          caption: 'Ảnh lớp 9A3',
        },
      }),
    });

    const res = await saveMemorySlotClient(4, {
      photoUrl: 'data:image/jpeg;base64,newphoto',
      caption: 'Ảnh lớp 9A3',
    });

    expect(res.success).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/memories/slot/4',
      expect.objectContaining({ method: 'PUT' })
    );
  });
});

