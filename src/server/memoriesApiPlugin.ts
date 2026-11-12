import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { createMemoriesStore, MemoriesStore } from './memoriesStore';
import { isLocalhostRequest } from './teachersApiPlugin';
import { MemorySlotId } from '../types/memories';

const MAX_BODY_SIZE_BYTES = 5 * 1024 * 1024; // 5MB for photo Data URLs

function sendJson(res: ServerResponse, statusCode: number, payload: unknown): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!req.on) {
      resolve('');
      return;
    }
    let body = '';
    req.on('data', (chunk: { toString(): string } | string) => {
      body += chunk.toString();
      if (body.length > MAX_BODY_SIZE_BYTES) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

export async function handleMemoriesApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
  store: MemoriesStore
): Promise<boolean> {
  const url = req.url || '';
  if (!url.startsWith('/api/memories')) {
    return false;
  }

  const method = (req.method || 'GET').toUpperCase();
  const isOwner = isLocalhostRequest(req);

  // 1. GET /api/memories (Public: Guest & Owner đều đọc được)
  if (method === 'GET' && (url === '/api/memories' || url === '/api/memories/')) {
    try {
      const data = await store.getStationData();
      sendJson(res, 200, {
        success: true,
        data,
        isOwner,
      });
    } catch (err) {
      sendJson(res, 500, {
        success: false,
        error: err instanceof Error ? err.message : 'Internal Server Error',
        isOwner,
      });
    }
    return true;
  }

  // 2. PUT /api/memories/slot/:id (Chỉ Owner có quyền)
  const slotMatch = url.match(/^\/api\/memories\/slot\/(\d+)/);
  if (method === 'PUT' && slotMatch) {
    if (!isOwner) {
      sendJson(res, 403, {
        success: false,
        error: 'Chỉ chủ sở hữu (Owner trên máy localhost) mới có quyền thay đổi ảnh Trạm Ký Ức.',
      });
      return true;
    }

    try {
      const slotId = parseInt(slotMatch[1], 10) as MemorySlotId;
      const rawBody = await readRequestBody(req);
      const parsed = JSON.parse(rawBody || '{}');
      if (!parsed.photoUrl) {
        sendJson(res, 400, {
          success: false,
          error: 'Thiếu đường dẫn hoặc dữ liệu ảnh (photoUrl).',
        });
        return true;
      }

      const item = await store.updateSlot(slotId, parsed);
      sendJson(res, 200, {
        success: true,
        item,
      });
    } catch (err) {
      sendJson(res, 400, {
        success: false,
        error: err instanceof Error ? err.message : 'Dữ liệu không hợp lệ',
      });
    }
    return true;
  }

  // 3. PUT /api/memories/meta (Chỉ Owner có quyền sửa tiêu đề & trích dẫn)
  if (method === 'PUT' && (url === '/api/memories/meta' || url === '/api/memories/meta/')) {
    if (!isOwner) {
      sendJson(res, 403, {
        success: false,
        error: 'Chỉ chủ sở hữu (Owner) mới có quyền chỉnh sửa tiêu đề và trích dẫn Trạm Ký Ức.',
      });
      return true;
    }

    try {
      const rawBody = await readRequestBody(req);
      const parsed = JSON.parse(rawBody || '{}');
      const data = await store.updateMeta(parsed);
      sendJson(res, 200, {
        success: true,
        data,
      });
    } catch (err) {
      sendJson(res, 400, {
        success: false,
        error: err instanceof Error ? err.message : 'Dữ liệu không hợp lệ',
      });
    }
    return true;
  }

  return false;
}

export function memoriesApiPlugin(options?: { filePath?: string }): Plugin {
  const store = createMemoriesStore(options);

  return {
    name: 'vite-plugin-memories-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const handled = await handleMemoriesApiRequest(req, res, store);
          if (!handled) {
            next();
          }
        } catch (err) {
          console.error('[memoriesApiPlugin Error]', err);
          const hasSent = Boolean((res as unknown as { headersSent?: boolean }).headersSent);
          if (!hasSent) {
            sendJson(res, 500, {
              success: false,
              error: 'Lỗi máy chủ nội bộ khi xử lý Trạm Ký Ức',
            });
          }
        }
      });
    },
  };
}
