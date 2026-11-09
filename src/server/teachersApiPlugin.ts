import fs from 'node:fs/promises';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import {
  createTeachersStore,
  TeacherNotFoundError,
  TeachersStore,
  TeachersStoreOptions,
  TeacherValidationError,
} from './teachersStore';

const MAX_BODY_SIZE_BYTES = 5 * 1024 * 1024; // 5MB to support teacher photo Data URLs

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

/**
 * Kiểm tra xem yêu cầu có được gửi trực tiếp từ máy chủ của chủ sở hữu (localhost / 127.0.0.1 / ::1) hay không.
 * Thiết bị khác trong mạng LAN hoặc qua proxy sẽ có địa chỉ IP khác.
 */
export function isLocalhostRequest(req: IncomingMessage): boolean {
  const reqWithMeta = req as IncomingMessage & {
    socket?: { remoteAddress?: string };
    headers?: Record<string, string | string[] | undefined>;
  };
  const remoteAddr = reqWithMeta.socket?.remoteAddress;
  if (remoteAddr) {
    const normalized = remoteAddr.replace(/^::ffff:/, '');
    if (normalized !== '127.0.0.1' && normalized !== '::1' && normalized !== 'localhost') {
      return false;
    }
  }

  const forwardedFor = reqWithMeta.headers?.['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim().length > 0) {
    const firstIp = forwardedFor.split(',')[0].trim().replace(/^::ffff:/, '');
    if (firstIp !== '127.0.0.1' && firstIp !== '::1' && firstIp !== 'localhost') {
      return false;
    }
  }

  const hostHeader = reqWithMeta.headers?.host;
  if (typeof hostHeader === 'string' && hostHeader.trim().length > 0) {
    const hostname = hostHeader.split(':')[0].trim().toLowerCase();
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '[::1]') {
      return false;
    }
  }

  return true;
}

export function createTeachersMiddleware(store: TeachersStore) {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const urlPath = (req.url || '').split('?')[0];
    if (urlPath !== '/api/teachers' && !urlPath.startsWith('/api/teachers/')) {
      next();
      return;
    }

    const method = (req.method || 'GET').toUpperCase();
    const isOwner = isLocalhostRequest(req);

    if (urlPath === '/api/teachers' && method === 'GET') {
      try {
        const teachers = await store.listTeachers();
        sendJson(res, 200, { teachers, isOwner });
      } catch {
        sendJson(res, 500, {
          error: 'Không thể tải danh sách giáo viên từ máy chủ. Vui lòng thử lại.',
        });
      }
      return;
    }

    if (urlPath === '/api/teachers' && method === 'POST') {
      if (!isOwner) {
        sendJson(res, 403, {
          error:
            'Chỉ máy tính chủ sở hữu (localhost/127.0.0.1) mới có quyền thêm hoặc bớt giáo viên.',
        });
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

        const traits = Array.isArray(parsed.personalityTraits)
          ? parsed.personalityTraits.filter((t): t is string => typeof t === 'string')
          : typeof parsed.personalityTraits === 'string'
            ? parsed.personalityTraits.split(',').map((s) => s.trim())
            : undefined;

        const created = await store.addTeacher({
          subject: typeof parsed.subject === 'string' ? parsed.subject : '',
          honorificAndName:
            typeof parsed.honorificAndName === 'string' ? parsed.honorificAndName : '',
          badgeText: typeof parsed.badgeText === 'string' ? parsed.badgeText : '',
          badgeSide:
            parsed.badgeSide === 'left' || parsed.badgeSide === 'right'
              ? parsed.badgeSide
              : undefined,
          summary: typeof parsed.summary === 'string' ? parsed.summary : '',
          personalityTraits: traits,
          detailedBio: typeof parsed.detailedBio === 'string' ? parsed.detailedBio : undefined,
          memorableQuote:
            typeof parsed.memorableQuote === 'string' ? parsed.memorableQuote : undefined,
          photoUrl: typeof parsed.photoUrl === 'string' ? parsed.photoUrl : undefined,
        });

        sendJson(res, 201, { teacher: created });
      } catch (err: unknown) {
        if (err instanceof TeacherValidationError) {
          sendJson(res, 400, {
            error: err.message,
            fieldErrors: err.fieldErrors,
          });
          return;
        }
        if ((err as Error)?.message === 'Payload too large') {
          sendJson(res, 413, {
            error: 'Ảnh tải lên quá lớn (tối đa 5MB). Vui lòng chọn ảnh nhỏ hơn.',
          });
          return;
        }
        sendJson(res, 500, {
          error: 'Có lỗi phía máy chủ khi lưu giáo viên mới.',
        });
      }
      return;
    }

    if (urlPath.startsWith('/api/teachers/') && method === 'DELETE') {
      const subPath = urlPath.slice('/api/teachers/'.length).trim();
      if (subPath.includes('/impressions/')) {
        const [rawTeacherId, rawImpId] = subPath.split('/impressions/');
        const teacherId = decodeURIComponent(rawTeacherId || '');
        const impId = decodeURIComponent(rawImpId || '');
        try {
          const updatedTeacher = await store.deleteImpression(teacherId, impId);
          sendJson(res, 200, { teacher: updatedTeacher, deletedId: impId });
        } catch (err: unknown) {
          sendJson(res, 500, { error: 'Không thể xóa cảm nhận.' });
        }
        return;
      }

      if (!isOwner) {
        sendJson(res, 403, {
          error:
            'Chỉ máy tính chủ sở hữu (localhost/127.0.0.1) mới có quyền xóa giáo viên khỏi bảng tổng hợp.',
        });
        return;
      }

      const teacherId = decodeURIComponent(urlPath.slice('/api/teachers/'.length).trim());
      if (!teacherId) {
        sendJson(res, 400, { error: 'Thiếu mã định danh giáo viên.' });
        return;
      }

      try {
        await store.deleteTeacher(teacherId);
        sendJson(res, 200, { deletedId: teacherId });
      } catch (err: unknown) {
        if (err instanceof TeacherNotFoundError) {
          sendJson(res, 404, { error: err.message });
          return;
        }
        sendJson(res, 500, { error: 'Không thể xóa giáo viên. Vui lòng thử lại.' });
      }
      return;
    }

    if (urlPath.startsWith('/api/teachers/') && (method === 'PATCH' || method === 'PUT')) {
      const teacherId = decodeURIComponent(urlPath.slice('/api/teachers/'.length).trim());
      if (!teacherId) {
        sendJson(res, 400, { error: 'Thiếu mã định danh giáo viên.' });
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

        let updatedTeacher = null;

        // 1. Check if updating teacher fields or photoUrl (Owner-only)
        const hasProfileFields = [
          'subject',
          'honorificAndName',
          'badgeText',
          'badgeSide',
          'summary',
          'personalityTraits',
          'detailedBio',
          'memorableQuote',
          'photoUrl',
        ].some((key) => parsed[key] !== undefined);

        if (hasProfileFields) {
          if (!isOwner) {
            sendJson(res, 403, {
              error:
                'Chỉ máy tính chủ sở hữu (localhost/127.0.0.1) mới có quyền đổi ảnh hoặc sửa thông tin giáo viên.',
            });
            return;
          }

          const traits = Array.isArray(parsed.personalityTraits)
            ? parsed.personalityTraits.filter((t): t is string => typeof t === 'string')
            : typeof parsed.personalityTraits === 'string'
              ? parsed.personalityTraits.split(',').map((s) => s.trim())
              : undefined;

          updatedTeacher = await store.updateTeacher(teacherId, {
            subject: typeof parsed.subject === 'string' ? parsed.subject : undefined,
            honorificAndName:
              typeof parsed.honorificAndName === 'string' ? parsed.honorificAndName : undefined,
            badgeText: typeof parsed.badgeText === 'string' ? parsed.badgeText : undefined,
            badgeSide:
              parsed.badgeSide === 'left' || parsed.badgeSide === 'right'
                ? parsed.badgeSide
                : undefined,
            summary: typeof parsed.summary === 'string' ? parsed.summary : undefined,
            personalityTraits: traits,
            detailedBio:
              typeof parsed.detailedBio === 'string' ? parsed.detailedBio : undefined,
            memorableQuote:
              typeof parsed.memorableQuote === 'string' ? parsed.memorableQuote : undefined,
            photoUrl: typeof parsed.photoUrl === 'string' ? parsed.photoUrl : undefined,
          });
        }

        // 2. Check if appending a student impression (Allowed for all students/devices)
        if (parsed.impression && typeof parsed.impression === 'object') {
          const imp = parsed.impression as Record<string, unknown>;
          updatedTeacher = await store.addImpression(teacherId, {
            studentName: typeof imp.studentName === 'string' ? imp.studentName : '',
            className: typeof imp.className === 'string' ? imp.className : '9A3',
            trait: typeof imp.trait === 'string' ? imp.trait : '',
            detail: typeof imp.detail === 'string' ? imp.detail : '',
          });
        }

        // 3. Check if updating an existing student impression
        if (parsed.updateImpression && typeof parsed.updateImpression === 'object') {
          const up = parsed.updateImpression as Record<string, unknown>;
          const impId = typeof up.id === 'string' ? up.id : '';
          updatedTeacher = await store.updateImpression(teacherId, impId, {
            studentName: typeof up.studentName === 'string' ? up.studentName : undefined,
            className: typeof up.className === 'string' ? up.className : undefined,
            trait: typeof up.trait === 'string' ? up.trait : undefined,
            detail: typeof up.detail === 'string' ? up.detail : undefined,
          });
        }

        // 4. Check if deleting a student impression via PATCH
        if (typeof parsed.deleteImpressionId === 'string' && parsed.deleteImpressionId.trim()) {
          updatedTeacher = await store.deleteImpression(teacherId, parsed.deleteImpressionId.trim());
        }

        if (!updatedTeacher) {
          const list = await store.listTeachers();
          updatedTeacher = list.find((t) => t.id === teacherId) ?? null;
          if (!updatedTeacher) {
            throw new TeacherNotFoundError();
          }
        }

        sendJson(res, 200, { teacher: updatedTeacher });
      } catch (err: unknown) {
        if (err instanceof TeacherValidationError) {
          sendJson(res, 400, {
            error: err.message,
            fieldErrors: err.fieldErrors,
          });
          return;
        }
        if (err instanceof TeacherNotFoundError) {
          sendJson(res, 404, { error: err.message });
          return;
        }
        if ((err as Error)?.message === 'Payload too large') {
          sendJson(res, 413, {
            error: 'Ảnh tải lên quá lớn (tối đa 5MB). Vui lòng chọn ảnh nhỏ hơn.',
          });
          return;
        }
        sendJson(res, 500, {
          error: 'Có lỗi phía máy chủ khi cập nhật thông tin giáo viên.',
        });
      }
      return;
    }

    sendJson(res, 405, { error: 'Phương thức không được hỗ trợ.' });
  };
}

export function teachersApiPlugin(options?: TeachersStoreOptions): Plugin {
  const store = createTeachersStore(options);
  const middleware = createTeachersMiddleware(store);

  return {
    name: 'baotuong-teachers-api',
    async buildStart() {
      try {
        const teachers = await store.listTeachers();
        if (Array.isArray(teachers) && teachers.length > 0) {
          const publicFile = path.resolve(process.cwd(), 'public', 'teachers-data.json');
          await fs.mkdir(path.dirname(publicFile), { recursive: true });
          await fs.writeFile(
            publicFile,
            JSON.stringify({ teachers, isOwner: false }, null, 2),
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
