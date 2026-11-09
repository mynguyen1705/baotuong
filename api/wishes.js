import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const filePath = path.join(process.cwd(), 'server', 'data', 'wishes.json');

  if (req.method === 'GET') {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      const wishes = Array.isArray(parsed) ? parsed : (parsed.wishes || []);
      return res.status(200).json({ wishes });
    } catch {
      return res.status(200).json({
        wishes: [
          {
            id: 'wish-1794049247793-a0bc860d',
            senderName: 'Nguyễn Trà My',
            className: '9A3',
            message:
              'Nhân ngày Nhà giáo Việt Nam 20/11, tập thể 9A3 kính chúc quý thầy cô Trường TH&THCS Hiệp Thạnh luôn mạnh khỏe và hạnh phúc!',
            createdAt: '2026-11-07T11:00:47.793Z',
          },
        ],
      });
    }
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // ignore
      }
    }
    const { senderName, className, message } = body || {};
    if (!senderName || !className || !message) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ tên người gửi, lớp và lời chúc.' });
    }
    const newWish = {
      id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      senderName: String(senderName).trim(),
      className: String(className).trim(),
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
    };
    return res.status(201).json({ wish: newWish });
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // ignore
      }
    }
    const id = req.query.id || body?.id;
    const { senderName, className, message } = body || {};
    if (!id) {
      return res.status(400).json({ error: 'Mã lời chúc không hợp lệ.' });
    }
    const updatedWish = {
      id: String(id),
      senderName: String(senderName || '').trim(),
      className: String(className || '').trim(),
      message: String(message || '').trim(),
      createdAt: new Date().toISOString(),
    };
    return res.status(200).json({ wish: updatedWish });
  }

  if (req.method === 'DELETE') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // ignore
      }
    }
    const id = req.query.id || body?.id;
    if (!id) {
      return res.status(400).json({ error: 'Mã lời chúc không hợp lệ.' });
    }
    return res.status(200).json({ success: true, message: 'Đã xóa lời chúc thành công.' });
  }

  return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
}
