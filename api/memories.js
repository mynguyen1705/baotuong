// Vercel Serverless Function: /api/memories
import fs from 'node:fs/promises';
import path from 'node:path';

const MEMORIES_FILE = path.resolve(process.cwd(), 'server', 'data', 'memories.json');
const PUBLIC_FILE = path.resolve(process.cwd(), 'public', 'memories-data.json');

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function isLocalhost(req) {
  const remoteAddr = req.socket?.remoteAddress;
  if (remoteAddr) {
    const normalized = remoteAddr.replace(/^::ffff:/, '');
    if (normalized === '127.0.0.1' || normalized === '::1' || normalized === 'localhost') {
      return true;
    }
  }
  const host = (req.headers?.host || '').toLowerCase();
  return host.startsWith('localhost') || host.startsWith('127.0.0.1');
}

export default async function handler(req, res) {
  const method = (req.method || 'GET').toUpperCase();
  const isOwner = isLocalhost(req);

  let data = null;
  try {
    const content = await fs.readFile(MEMORIES_FILE, 'utf-8');
    data = JSON.parse(content);
  } catch {
    try {
      const publicContent = await fs.readFile(PUBLIC_FILE, 'utf-8');
      data = JSON.parse(publicContent);
    } catch {
      // Fallback
    }
  }

  if (method === 'GET') {
    return sendJson(res, 200, {
      success: true,
      data,
      isOwner,
    });
  }

  if (method === 'PUT') {
    if (!isOwner) {
      return sendJson(res, 403, {
        success: false,
        error: 'Chỉ chủ sở hữu (Owner) mới có quyền chỉnh sửa Trạm Ký Ức.',
      });
    }

    // In read-only serverless environments without persistent disk, return 200 with received data
    return sendJson(res, 200, {
      success: true,
      message: 'Updated memory station (read-only environment)',
    });
  }

  return sendJson(res, 405, { error: 'Method Not Allowed' });
}
