import { promises as fs } from 'fs';
import path from 'path';

const CLOUD_IMPRESSIONS_ID = 'ff808181a09d98f701a1c10cd3967210';
const CLOUD_API_URL = `https://api.restful-api.dev/objects/${CLOUD_IMPRESSIONS_ID}`;

async function getCloudImpressions() {
  try {
    const res = await fetch(CLOUD_API_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return data?.data?.impressionsByTeacher || {};
    }
  } catch (err) {
    console.error('Error reading cloud impressions:', err);
  }
  return {};
}

async function saveCloudImpressions(impressionsByTeacher) {
  try {
    const res = await fetch(CLOUD_API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'baotuong_impressions',
        data: { impressionsByTeacher },
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('Error saving cloud impressions:', err);
    return false;
  }
}

// Hỗ trợ kết nối Redis / KV trên Vercel để lưu trữ tập trung xuyên suốt tất cả thiết bị
async function getUpstashTeachers() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}/get/baotuong_teachers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data?.result) {
      const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.teachers)) return parsed.teachers;
    }
  } catch (err) {
    console.error('Error reading teachers from Upstash Redis:', err);
  }
  return null;
}

async function setUpstashTeachers(teachers) {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return false;

  try {
    const res = await fetch(`${url}/set/baotuong_teachers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(teachers)),
    });
    return res.ok;
  } catch (err) {
    console.error('Error writing teachers to Upstash Redis:', err);
    return false;
  }
}

async function getInitialFileTeachers() {
  const primaryPath = path.join(process.cwd(), 'server', 'data', 'teachers.json');
  try {
    const data = await fs.readFile(primaryPath, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : parsed.teachers || [];
  } catch {
    try {
      const fallbackPath = path.join(process.cwd(), 'public', 'teachers-data.json');
      const data = await fs.readFile(fallbackPath, 'utf-8');
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : parsed.teachers || [];
    } catch {
      return [];
    }
  }
}

function normalizeImpressionKey(imp) {
  if (!imp) return '';
  const student = String(imp.studentName || '').trim().toLowerCase();
  const cls = String(imp.className || '9A3').trim().toLowerCase();
  const trait = String(imp.trait || '').trim().toLowerCase();
  const detail = String(imp.detail || '').trim().toLowerCase();
  if (!student || !trait || !detail) return '';
  return `${student}|${cls}|${trait}|${detail}`;
}

function mergeImpressionsLists(...lists) {
  const byId = new Map();
  const seenKeys = new Set();

  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const raw of list) {
      if (!raw || typeof raw !== 'object') continue;
      const id = String(raw.id || '').trim();
      const studentName = String(raw.studentName || '').trim();
      const className = String(raw.className || '9A3').trim();
      const trait = String(raw.trait || '').trim();
      const detail = String(raw.detail || '').trim();
      const createdAt = String(raw.createdAt || new Date().toISOString());
      if (!id || !studentName || !trait || !detail) continue;

      const key = normalizeImpressionKey({ studentName, className, trait, detail });
      if (byId.has(id)) continue;
      if (key && seenKeys.has(key)) continue;

      byId.set(id, { id, studentName, className, trait, detail, createdAt });
      if (key) seenKeys.add(key);
    }
  }

  return Array.from(byId.values()).sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });
}

function isLocalhost(req) {
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    return false;
  }

  const forwardedFor = req.headers?.['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim().length > 0) {
    const firstIp = forwardedFor.split(',')[0].trim().replace(/^::ffff:/, '');
    if (firstIp !== '127.0.0.1' && firstIp !== '::1' && firstIp !== 'localhost') {
      return false;
    }
  }

  const hostHeader = req.headers?.host;
  if (typeof hostHeader === 'string' && hostHeader.trim().length > 0) {
    const hostname = hostHeader.split(':')[0].trim().toLowerCase();
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '[::1]') {
      return false;
    }
  }

  const remoteAddr = req.socket?.remoteAddress;
  if (remoteAddr) {
    const normalized = remoteAddr.replace(/^::ffff:/, '');
    if (normalized !== '127.0.0.1' && normalized !== '::1' && normalized !== 'localhost') {
      return false;
    }
  }

  return true;
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const isOwner = isLocalhost(req);

  const [upstashTeachers, fileTeachers, cloudImpressions] = await Promise.all([
    getUpstashTeachers(),
    getInitialFileTeachers(),
    getCloudImpressions(),
  ]);

  let teachers =
    Array.isArray(upstashTeachers) && upstashTeachers.length > 0 ? upstashTeachers : fileTeachers;

  // Nếu fileTeachers có thêm giáo viên mới hoặc cảm nhận gốc, gộp không ghi đè
  const fileTeacherMap = new Map((fileTeachers || []).map((t) => [t.id, t]));
  for (const ft of fileTeachers || []) {
    if (!teachers.some((t) => t.id === ft.id)) {
      teachers.push(ft);
    }
  }

  // Tự động gộp (merge) các cảm nhận từ Cloud Store + File + Upstash xuyên suốt tất cả thiết bị (không trùng lặp, không mất dữ liệu)
  teachers = teachers.map((teacher) => {
    const fileT = fileTeacherMap.get(teacher.id);
    const cloudList = cloudImpressions[teacher.id] || [];
    const combined = mergeImpressionsLists(
      teacher.impressions || [],
      fileT?.impressions || [],
      cloudList
    );
    cloudImpressions[teacher.id] = combined;

    const traitSet = new Set(teacher.personalityTraits || fileT?.personalityTraits || []);
    for (const imp of combined) {
      if (imp.trait) traitSet.add(imp.trait);
    }

    return {
      ...teacher,
      personalityTraits: Array.from(traitSet),
      impressions: combined,
    };
  });

  if (req.method === 'GET') {
    return res.status(200).json({
      teachers,
      isOwner,
    });
  }

  if (req.method === 'POST') {
    if (!isOwner) {
      return res.status(403).json({
        error: 'Chỉ máy tính chủ sở hữu (localhost/127.0.0.1) mới có quyền thêm hoặc bớt giáo viên.',
      });
    }
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  // Trích xuất teacherId từ URL /api/teachers/:id hoặc query hoặc body
  let teacherId = '';
  if (req.query && req.query.id) {
    teacherId = String(req.query.id);
  } else if (body.teacherId) {
    teacherId = String(body.teacherId);
  } else if (req.url) {
    const segments = req.url.split('?')[0].split('/').filter(Boolean);
    if (segments.length >= 3 && segments[1] === 'teachers') {
      teacherId = decodeURIComponent(segments[2]);
    }
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    const targetIndex = teachers.findIndex((t) => t.id === teacherId);
    if (targetIndex === -1 && teacherId) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin giáo viên.' });
    }

    const targetTeacher = targetIndex !== -1 ? teachers[targetIndex] : teachers[0];
    if (!targetTeacher) {
      return res.status(404).json({ error: 'Không tìm thấy giáo viên.' });
    }

    // 0. Đồng bộ hàng loạt cảm nhận từ thiết bị khác (syncImpressions)
    if (Array.isArray(body.syncImpressions)) {
      const mergedList = mergeImpressionsLists(targetTeacher.impressions || [], body.syncImpressions);
      cloudImpressions[targetTeacher.id] = mergedList;
      await saveCloudImpressions(cloudImpressions);

      const traitSet = new Set(targetTeacher.personalityTraits || []);
      for (const imp of mergedList) {
        if (imp.trait) traitSet.add(imp.trait);
      }

      const updatedTeacher = {
        ...targetTeacher,
        personalityTraits: Array.from(traitSet),
        impressions: mergedList,
        updatedAt: new Date().toISOString(),
      };

      teachers[targetIndex !== -1 ? targetIndex : 0] = updatedTeacher;
      await setUpstashTeachers(teachers);
      return res.status(200).json({ teacher: updatedTeacher });
    }

    // 1. Thêm cảm nhận học sinh mới (gộp an toàn, chống trùng lặp và chống ghi đè)
    if (body.impression && typeof body.impression === 'object') {
      const imp = body.impression;
      const studentName = String(imp.studentName || '').trim();
      const className = String(imp.className || '9A3').trim();
      const trait = String(imp.trait || '').trim();
      const detail = String(imp.detail || '').trim();

      if (!studentName || !trait || !detail) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ tên, tính cách và kỷ niệm.' });
      }

      const candidateImp = {
        id:
          typeof imp.id === 'string' && imp.id.trim().startsWith('imp-')
            ? imp.id.trim()
            : `imp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        studentName,
        className,
        trait,
        detail,
        createdAt:
          typeof imp.createdAt === 'string' && !Number.isNaN(new Date(imp.createdAt).getTime())
            ? imp.createdAt
            : new Date().toISOString(),
      };

      const currentList = targetTeacher.impressions || [];
      const candidateKey = normalizeImpressionKey(candidateImp);
      const existingDup = currentList.find(
        (item) =>
          item.id === candidateImp.id ||
          (candidateKey && normalizeImpressionKey(item) === candidateKey)
      );
      const finalNewImp = existingDup || candidateImp;
      const updatedList = mergeImpressionsLists([finalNewImp], currentList);

      cloudImpressions[targetTeacher.id] = updatedList;
      await saveCloudImpressions(cloudImpressions);

      const traits = targetTeacher.personalityTraits || [];
      const updatedTraits = traits.includes(trait) ? traits : [...traits, trait];

      const updatedTeacher = {
        ...targetTeacher,
        personalityTraits: updatedTraits,
        impressions: updatedList,
        updatedAt: new Date().toISOString(),
      };

      teachers[targetIndex !== -1 ? targetIndex : 0] = updatedTeacher;
      await setUpstashTeachers(teachers);

      return res.status(200).json({ teacher: updatedTeacher, impression: finalNewImp });
    }

    // 2. Chỉnh sửa cảm nhận học sinh
    if (body.updateImpression && typeof body.updateImpression === 'object') {
      const up = body.updateImpression;
      const impId = String(up.id || '').trim();
      const currentList = targetTeacher.impressions || [];
      const impIndex = currentList.findIndex((i) => i.id === impId);
      if (impIndex === -1) {
        return res.status(404).json({ error: 'Không tìm thấy cảm nhận cần chỉnh sửa.' });
      }

      const currentImp = currentList[impIndex];
      const updatedImp = {
        ...currentImp,
        studentName: up.studentName !== undefined ? String(up.studentName).trim() : currentImp.studentName,
        className: up.className !== undefined ? String(up.className).trim() : currentImp.className,
        trait: up.trait !== undefined ? String(up.trait).trim() : currentImp.trait,
        detail: up.detail !== undefined ? String(up.detail).trim() : currentImp.detail,
      };

      const nextImps = [...currentList];
      nextImps[impIndex] = updatedImp;
      cloudImpressions[targetTeacher.id] = nextImps;
      await saveCloudImpressions(cloudImpressions);

      const updatedTeacher = {
        ...targetTeacher,
        impressions: nextImps,
        updatedAt: new Date().toISOString(),
      };

      teachers[targetIndex !== -1 ? targetIndex : 0] = updatedTeacher;
      await setUpstashTeachers(teachers);

      return res.status(200).json({ teacher: updatedTeacher, impression: updatedImp });
    }

    // 3. Xoá cảm nhận học sinh qua PATCH
    if (body.deleteImpressionId) {
      const impId = String(body.deleteImpressionId).trim();
      const currentList = targetTeacher.impressions || [];
      const nextImps = currentList.filter((i) => i.id !== impId);
      cloudImpressions[targetTeacher.id] = nextImps;
      await saveCloudImpressions(cloudImpressions);

      const updatedTeacher = {
        ...targetTeacher,
        impressions: nextImps,
        updatedAt: new Date().toISOString(),
      };

      teachers[targetIndex !== -1 ? targetIndex : 0] = updatedTeacher;
      await setUpstashTeachers(teachers);

      return res.status(200).json({ teacher: updatedTeacher, deletedId: impId });
    }

    // 4. Cập nhật ảnh hoặc thông tin giáo viên (Chỉ dành riêng cho Owner)
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
    ].some((key) => body[key] !== undefined);

    if (hasProfileFields) {
      if (!isOwner) {
        return res.status(403).json({
          error:
            'Chỉ máy tính chủ sở hữu (localhost/127.0.0.1) mới có quyền đổi ảnh hoặc sửa thông tin giáo viên.',
        });
      }

      if (body.photoUrl !== undefined) {
        const updatedTeacher = {
          ...targetTeacher,
          photoUrl: String(body.photoUrl),
          updatedAt: new Date().toISOString(),
        };
        teachers[targetIndex !== -1 ? targetIndex : 0] = updatedTeacher;
        await setUpstashTeachers(teachers);
        return res.status(200).json({ teacher: updatedTeacher });
      }
    }

    return res.status(200).json({ teacher: targetTeacher });
  }

  if (req.method === 'DELETE') {
    if (!isOwner) {
      return res.status(403).json({
        error:
          'Chỉ máy tính chủ sở hữu (localhost/127.0.0.1) mới có quyền xóa giáo viên khỏi bảng tổng hợp.',
      });
    }
    // Xóa giáo viên
    if (teacherId) {
      const nextTeachers = teachers.filter((t) => t.id !== teacherId);
      await setUpstashTeachers(nextTeachers);
      return res.status(200).json({ deletedId: teacherId });
    }
  }

  return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
}
