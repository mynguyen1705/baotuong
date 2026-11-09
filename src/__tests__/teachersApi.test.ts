import fs from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTeachersStore } from '../server/teachersStore';
import { createTeachersMiddleware } from '../server/teachersApiPlugin';

function invokeMiddleware(
  middleware: ReturnType<typeof createTeachersMiddleware>,
  options: {
    method: string;
    url: string;
    body?: unknown;
    remoteAddress?: string;
  }
): Promise<{ statusCode: number; body: Record<string, unknown> }> {
  return new Promise((resolve, reject) => {
    const serialized =
      options.body === undefined
        ? ''
        : typeof options.body === 'string'
          ? options.body
          : JSON.stringify(options.body);

    const req = {
      method: options.method,
      url: options.url,
      socket: {
        remoteAddress: options.remoteAddress ?? '127.0.0.1',
      },
      on(event: string, listener: (...args: unknown[]) => void) {
        if (event === 'data' && serialized) {
          listener(serialized);
        }
        if (event === 'end') {
          listener();
        }
        return this;
      },
    } as unknown as IncomingMessage;

    const res: ServerResponse = {
      statusCode: 200,
      setHeader() {},
      end(chunk?: string) {
        try {
          resolve({
            statusCode: this.statusCode,
            body: chunk ? JSON.parse(chunk) : {},
          });
        } catch (err) {
          reject(err);
        }
      },
    };

    middleware(req, res, () => {
      resolve({ statusCode: 404, body: { passthrough: true } });
    }).catch(reject);
  });
}

describe('teachersApiPlugin middleware', () => {
  let tempDir: string;
  let storageFilePath: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'baotuong-teachers-api-'));
    storageFilePath = path.join(tempDir, 'teachers.json');
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('GET /api/teachers returns 200 with the 6 default subject teachers', async () => {
    const store = createTeachersStore({ storageFilePath });
    const middleware = createTeachersMiddleware(store);

    const res = await invokeMiddleware(middleware, {
      method: 'GET',
      url: '/api/teachers',
    });

    expect(res.statusCode).toBe(200);
    const teachers = res.body.teachers as Array<Record<string, unknown>>;
    expect(Array.isArray(teachers)).toBe(true);
    expect(teachers).toHaveLength(6);
    expect(teachers[0].subject).toBe('TOÁN HỌC');
  });

  it('POST /api/teachers creates a new teacher with optional photo Data URL and returns 201', async () => {
    const store = createTeachersStore({ storageFilePath });
    const middleware = createTeachersMiddleware(store);

    const samplePhoto =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

    const postRes = await invokeMiddleware(middleware, {
      method: 'POST',
      url: '/api/teachers',
      body: {
        subject: 'TIẾNG ANH',
        honorificAndName: 'CÔ HỒNG NHUNG',
        badgeText: 'Phát âm cực chuẩn!',
        summary: 'Luôn tổ chức trò chơi giao tiếp tiếng Anh sôi nổi đầu giờ',
        detailedBio: 'Cô Hồng Nhung giúp cả lớp 9A3 tự tin thuyết trình tiếng Anh.',
        personalityTraits: ['Năng động', 'Hiện đại'],
        photoUrl: samplePhoto,
      },
    });

    expect(postRes.statusCode).toBe(201);
    const created = postRes.body.teacher as Record<string, unknown>;
    expect(created.subject).toBe('TIẾNG ANH');
    expect(created.photoUrl).toBe(samplePhoto);

    const listRes = await invokeMiddleware(middleware, {
      method: 'GET',
      url: '/api/teachers',
    });
    expect((listRes.body.teachers as unknown[]).length).toBe(7);
  });

  it('PATCH /api/teachers/:id updates teacher photo at any time and appends student impressions', async () => {
    const store = createTeachersStore({ storageFilePath });
    const middleware = createTeachersMiddleware(store);

    const listRes = await invokeMiddleware(middleware, {
      method: 'GET',
      url: '/api/teachers',
    });
    const firstId = (listRes.body.teachers as Array<{ id: string }>)[0].id;

    // 1. Update photo anytime
    const newPhoto = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/NEW_TEACHER_PHOTO';
    const patchPhotoRes = await invokeMiddleware(middleware, {
      method: 'PATCH',
      url: `/api/teachers/${firstId}`,
      body: {
        photoUrl: newPhoto,
      },
    });

    expect(patchPhotoRes.statusCode).toBe(200);
    expect((patchPhotoRes.body.teacher as { photoUrl: string }).photoUrl).toBe(newPhoto);

    // 2. Append student impression via PATCH
    const patchImpRes = await invokeMiddleware(middleware, {
      method: 'PATCH',
      url: `/api/teachers/${firstId}`,
      body: {
        impression: {
          studentName: 'Lê Hoàng Nam',
          className: '9A3',
          trait: 'Giải toán siêu tốc',
          detail: 'Thầy vẽ đường tròn trên bảng bằng tay không mà tròn xoe!',
        },
      },
    });

    expect(patchImpRes.statusCode).toBe(200);
    const updatedTeacher = patchImpRes.body.teacher as {
      photoUrl: string;
      impressions: Array<{ studentName: string; trait: string }>;
    };
    expect(updatedTeacher.photoUrl).toBe(newPhoto);
    expect(updatedTeacher.impressions[0].studentName).toBe('Lê Hoàng Nam');
  });

  it('allows DELETE /api/teachers/:id from localhost (owner) and blocks add/delete/photo edit from external devices while allowing student impressions', async () => {
    const store = createTeachersStore({ storageFilePath });
    const middleware = createTeachersMiddleware(store);

    const listRes = await invokeMiddleware(middleware, {
      method: 'GET',
      url: '/api/teachers',
    });
    expect(listRes.body.isOwner).toBe(true);
    const teachers = listRes.body.teachers as Array<{ id: string }>;
    const firstId = teachers[0].id;
    const secondId = teachers[1].id;

    // 1. External device (e.g. 192.168.1.50) cannot POST new teacher (403)
    const externalPost = await invokeMiddleware(middleware, {
      method: 'POST',
      url: '/api/teachers',
      remoteAddress: '192.168.1.50',
      body: {
        subject: 'ÂM NHẠC',
        honorificAndName: 'CÔ THU HÀ',
        badgeText: 'Hát cực hay!',
        summary: 'Mang giai điệu vui tươi đến mỗi tiết học',
      },
    });
    expect(externalPost.statusCode).toBe(403);

    // 2. External device cannot DELETE teacher (403)
    const externalDelete = await invokeMiddleware(middleware, {
      method: 'DELETE',
      url: `/api/teachers/${firstId}`,
      remoteAddress: '192.168.1.50',
    });
    expect(externalDelete.statusCode).toBe(403);

    // 3. External device CAN still submit student impression (200)
    const externalImp = await invokeMiddleware(middleware, {
      method: 'PATCH',
      url: `/api/teachers/${firstId}`,
      remoteAddress: '192.168.1.50',
      body: {
        impression: {
          studentName: 'Trần Gia Bảo',
          className: '9A3',
          trait: 'Rất tâm lý',
          detail: 'Thầy luôn động viên cả lớp trước mỗi kỳ thi.',
        },
      },
    });
    expect(externalImp.statusCode).toBe(200);

    // 4. Owner on localhost CAN delete a teacher (200)
    const ownerDelete = await invokeMiddleware(middleware, {
      method: 'DELETE',
      url: `/api/teachers/${secondId}`,
      remoteAddress: '127.0.0.1',
    });
    expect(ownerDelete.statusCode).toBe(200);
    expect(ownerDelete.body.deletedId).toBe(secondId);

    const afterDeleteList = await invokeMiddleware(middleware, {
      method: 'GET',
      url: '/api/teachers',
    });
    expect((afterDeleteList.body.teachers as unknown[]).length).toBe(5);
  });
});
