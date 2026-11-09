import type { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Plugin } from 'vite';
import {
  createWishesStore,
  DuplicateWishError,
  WishNotFoundError,
  WishesStore,
  WishesStoreOptions,
  WishValidationError,
} from './wishesStore';

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
      if (body.length > 32 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

export function createWishesMiddleware(store: WishesStore) {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const urlPath = (req.url || '').split('?')[0];
    if (urlPath !== '/api/wishes' && !urlPath.startsWith('/api/wishes/')) {
      next();
      return;
    }

    const method = (req.method || 'GET').toUpperCase();

    if (urlPath === '/api/wishes' && method === 'GET') {
      try {
        const wishes = await store.listWishes();
        sendJson(res, 200, { wishes });
      } catch {
        sendJson(res, 500, {
          error: 'Không thể đọc danh sách lời chúc từ máy chủ. Vui lòng thử lại sau.',
        });
      }
      return;
    }

    if (urlPath === '/api/wishes' && method === 'POST') {
      try {
        const rawBody = await readRequestBody(req);
        let parsed: Record<string, unknown> = {};
        try {
          parsed = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {};
        } catch {
          sendJson(res, 400, { error: 'Dữ liệu gửi lên không đúng định dạng JSON.' });
          return;
        }

        const created = await store.addWish({
          senderName: typeof parsed.senderName === 'string' ? parsed.senderName : '',
          className: typeof parsed.className === 'string' ? parsed.className : '',
          message: typeof parsed.message === 'string' ? parsed.message : '',
        });

        sendJson(res, 201, { wish: created });
      } catch (err: unknown) {
        if (err instanceof WishValidationError) {
          sendJson(res, 400, {
            error: err.message,
            fieldErrors: err.fieldErrors,
          });
          return;
        }
        if (err instanceof DuplicateWishError) {
          sendJson(res, 409, {
            error: err.message,
          });
          return;
        }
        sendJson(res, 500, {
          error: 'Có lỗi phía máy chủ khi lưu lời chúc. Vui lòng thử lại.',
        });
      }
      return;
    }

    if (urlPath.startsWith('/api/wishes/') && (method === 'PATCH' || method === 'PUT')) {
      const wishId = decodeURIComponent(urlPath.slice('/api/wishes/'.length).trim());
      if (!wishId) {
        sendJson(res, 400, { error: 'Mã lời chúc không hợp lệ.' });
        return;
      }
      try {
        const rawBody = await readRequestBody(req);
        let parsed: Record<string, unknown> = {};
        try {
          parsed = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {};
        } catch {
          sendJson(res, 400, { error: 'Dữ liệu gửi lên không đúng định dạng JSON.' });
          return;
        }

        const updated = await store.updateWish(wishId, {
          senderName: typeof parsed.senderName === 'string' ? parsed.senderName : undefined,
          className: typeof parsed.className === 'string' ? parsed.className : undefined,
          message: typeof parsed.message === 'string' ? parsed.message : undefined,
        });

        sendJson(res, 200, { wish: updated });
      } catch (err: unknown) {
        if (err instanceof WishNotFoundError) {
          sendJson(res, 404, { error: err.message });
          return;
        }
        if (err instanceof WishValidationError) {
          sendJson(res, 400, { error: err.message, fieldErrors: err.fieldErrors });
          return;
        }
        sendJson(res, 500, { error: 'Có lỗi phía máy chủ khi cập nhật lời chúc.' });
      }
      return;
    }

    if (urlPath.startsWith('/api/wishes/') && method === 'DELETE') {
      const wishId = decodeURIComponent(urlPath.slice('/api/wishes/'.length).trim());
      if (!wishId) {
        sendJson(res, 400, { error: 'Mã lời chúc không hợp lệ.' });
        return;
      }
      try {
        await store.deleteWish(wishId);
        sendJson(res, 200, { success: true, message: 'Đã xóa lời chúc thành công.' });
      } catch (err: unknown) {
        if (err instanceof WishNotFoundError) {
          sendJson(res, 404, { error: err.message });
          return;
        }
        sendJson(res, 500, { error: 'Có lỗi phía máy chủ khi xóa lời chúc.' });
      }
      return;
    }

    sendJson(res, 405, { error: 'Phương thức không được hỗ trợ.' });
  };
}

export function wishesApiPlugin(options?: WishesStoreOptions): Plugin {
  const store = createWishesStore(options);
  const middleware = createWishesMiddleware(store);

  return {
    name: 'baotuong-wishes-api',
    async buildStart() {
      try {
        const wishes = await store.listWishes();
        if (Array.isArray(wishes) && wishes.length > 0) {
          const publicFile = path.resolve(process.cwd(), 'public', 'wishes-data.json');
          await fs.mkdir(path.dirname(publicFile), { recursive: true });
          await fs.writeFile(
            publicFile,
            JSON.stringify({ wishes }, null, 2),
            'utf-8'
          );
        }
      } catch {
        // Ignore snapshot write errors in restricted environments
      }
    },
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
