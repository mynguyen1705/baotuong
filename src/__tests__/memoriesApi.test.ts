import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http, { IncomingMessage, ServerResponse } from 'node:http';
import { createMemoriesStore } from '../server/memoriesStore';
import { handleMemoriesApiRequest } from '../server/memoriesApiPlugin';

describe('Memories API & RBAC Endpoint Tests', () => {
  let tempDir: string;
  let testFilePath: string;
  let store: ReturnType<typeof createMemoriesStore>;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'memories-api-test-'));
    testFilePath = path.join(tempDir, 'memories.json');
    store = createMemoriesStore({ filePath: testFilePath });
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore
    }
  });

  function mockRequest(
    method: string,
    url: string,
    body: Record<string, unknown> | null,
    remoteAddress: string = '127.0.0.1'
  ) {
    const req = {
      method,
      url,
      socket: { remoteAddress },
      headers: {},
      on: (event: string, cb: (data?: unknown) => void) => {
        if (event === 'data' && body) {
          cb(JSON.stringify(body));
        }
        if (event === 'end') {
          cb();
        }
        return req;
      },
    } as unknown as IncomingMessage;

    let statusCode = 200;
    const headers: Record<string, string> = {};
    let responseBody = '';

    const res = {
      get statusCode() {
        return statusCode;
      },
      set statusCode(val: number) {
        statusCode = val;
      },
      setHeader: (key: string, val: string) => {
        headers[key.toLowerCase()] = val;
      },
      end: (data?: string) => {
        if (data) responseBody = data;
      },
    } as unknown as ServerResponse;

    return { req, res, getStatusCode: () => statusCode, getBody: () => JSON.parse(responseBody || '{}') };
  }

  it('GET /api/memories cho phép mọi người (Guest) đọc dữ liệu trạm ký ức', async () => {
    const { req, res, getStatusCode, getBody } = mockRequest('GET', '/api/memories', null, '192.168.1.100');
    const handled = await handleMemoriesApiRequest(req, res, store);

    expect(handled).toBe(true);
    expect(getStatusCode()).toBe(200);
    const body = getBody();
    expect(body.success).toBe(true);
    expect(body.data.memories.length).toBe(13);
    expect(body.isOwner).toBe(false); // Guest không phải Owner
  });

  it('GET /api/memories từ localhost đánh dấu isOwner = true', async () => {
    const { req, res, getStatusCode, getBody } = mockRequest('GET', '/api/memories', null, '127.0.0.1');
    const handled = await handleMemoriesApiRequest(req, res, store);

    expect(handled).toBe(true);
    expect(getStatusCode()).toBe(200);
    const body = getBody();
    expect(body.isOwner).toBe(true); // Localhost là Owner
  });

  it('PUT /api/memories/slot/4 từ thiết bị khách lạ (Guest) bị chặn 403 Forbidden', async () => {
    const { req, res, getStatusCode, getBody } = mockRequest(
      'PUT',
      '/api/memories/slot/4',
      { photoUrl: 'https://evil.com/hack.jpg' },
      '192.168.1.50'
    );
    const handled = await handleMemoriesApiRequest(req, res, store);

    expect(handled).toBe(true);
    expect(getStatusCode()).toBe(403);
    expect(getBody().error).toMatch(/quyền/i);
  });

  it('PUT /api/memories/slot/4 từ Owner localhost cho phép cập nhật ảnh thành công', async () => {
    const { req, res, getStatusCode, getBody } = mockRequest(
      'PUT',
      '/api/memories/slot/4',
      { photoUrl: 'data:image/jpeg;base64,newphoto', caption: 'Ảnh mới' },
      '127.0.0.1'
    );
    const handled = await handleMemoriesApiRequest(req, res, store);

    expect(handled).toBe(true);
    expect(getStatusCode()).toBe(200);
    expect(getBody().success).toBe(true);
    expect(getBody().item.photoUrl).toBe('data:image/jpeg;base64,newphoto');
  });

  it('PUT /api/memories/meta từ Owner cho phép sửa tiêu đề và trích dẫn', async () => {
    const { req, res, getStatusCode, getBody } = mockRequest(
      'PUT',
      '/api/memories/meta',
      { title: 'Trạm Kỷ Niệm 9A3', quote: 'Mãi yêu tập thể 9A3' },
      '::1'
    );
    const handled = await handleMemoriesApiRequest(req, res, store);

    expect(handled).toBe(true);
    expect(getStatusCode()).toBe(200);
    expect(getBody().data.title).toBe('Trạm Kỷ Niệm 9A3');
  });
});

