import { promises as fs } from 'fs';
import path from 'path';

const CLOUD_WISHES_ID = 'ff808181a09d98f701a1c10cd30f720f';
const CLOUD_WISHES_URL = `https://api.restful-api.dev/objects/${CLOUD_WISHES_ID}`;

async function getCloudWishes() {
  try {
    const res = await fetch(CLOUD_WISHES_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data?.wishes) && data.data.wishes.length > 0) {
        return data.data.wishes;
      }
    }
  } catch (err) {
    console.error('Error reading cloud wishes:', err);
  }
  return null;
}

async function saveCloudWishes(wishes) {
  try {
    const res = await fetch(CLOUD_WISHES_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'baotuong_wishes',
        data: { wishes },
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('Error saving cloud wishes:', err);
    return false;
  }
}

// Hỗ trợ kết nối Redis / KV trên Vercel để lưu trữ tập trung xuyên suốt tất cả thiết bị
async function getUpstashWishes() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}/get/baotuong_wishes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data?.result) {
      const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading from Upstash Redis:', err);
  }
  return null;
}

async function setUpstashWishes(wishes) {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return false;

  try {
    const res = await fetch(`${url}/set/baotuong_wishes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(wishes)),
    });
    return res.ok;
  } catch (err) {
    console.error('Error writing to Upstash Redis:', err);
    return false;
  }
}

async function getInitialFileWishes() {
  const filePath = path.join(process.cwd(), 'server', 'data', 'wishes.json');
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : parsed.wishes || [];
  } catch {
    return [
      {
        id: 'wish-1794235620000-baokhoi',
        senderName: 'Nguyễn Đức Bảo Khôi',
        className: '9A3',
        message:
          'Cảm ơn tất cả thầy cô đã đồng hành cùng chúng em suốt thời gian qua, thầy cô luôn tận tâm chỉ bảo, giảng bài. Dù đôi lúc lớp vẫn còn ồn ào và chưa tập trung nhưng thầy cô vẫn cố gắng đưa đò sang sông. Thầy cô là những người lái đò, những người âm thầm hi sinh mà em sẽ không bao giờ quên được!',
        createdAt: '2026-11-09T15:07:00.000Z',
      },
      {
        id: 'wish-1794049247793-a0bc860d',
        senderName: 'Nguyễn Trà My',
        className: '9A3',
        message:
          'Nhân ngày Nhà giáo Việt Nam 20/11, tập thể 9A3 kính chúc quý thầy cô Trường TH&THCS Hiệp Thạnh luôn mạnh khỏe và hạnh phúc!',
        createdAt: '2026-11-07T11:00:47.793Z',
      },
    ];
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Lấy danh sách lời chúc: ưu tiên Redis -> Cloud Store -> tệp mặc định
  let cloudWishes = await getUpstashWishes();
  if (!cloudWishes) {
    cloudWishes = await getCloudWishes();
  }
  if (!cloudWishes) {
    cloudWishes = await getInitialFileWishes();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ wishes: cloudWishes });
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

    const updated = [newWish, ...cloudWishes.filter((w) => w.id !== newWish.id)];
    await setUpstashWishes(updated);
    await saveCloudWishes(updated);

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

    const index = cloudWishes.findIndex((w) => w.id === String(id));
    if (index === -1) {
      return res.status(404).json({ error: 'Không tìm thấy lời chúc.' });
    }

    const updatedWish = {
      ...cloudWishes[index],
      senderName: senderName ? String(senderName).trim() : cloudWishes[index].senderName,
      className: className ? String(className).trim() : cloudWishes[index].className,
      message: message ? String(message).trim() : cloudWishes[index].message,
    };

    cloudWishes[index] = updatedWish;
    await setUpstashWishes(cloudWishes);
    await saveCloudWishes(cloudWishes);

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

    const filtered = cloudWishes.filter((w) => w.id !== String(id));
    await setUpstashWishes(filtered);
    await saveCloudWishes(filtered);

    return res.status(200).json({ success: true, message: 'Đã xóa lời chúc thành công.' });
  }

  return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
}
