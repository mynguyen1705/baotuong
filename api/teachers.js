import { promises as fs } from 'fs';
import path from 'path';

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

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let teachers = await getUpstashTeachers();
  if (!teachers || teachers.length === 0) {
    teachers = await getInitialFileTeachers();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      teachers,
      isOwner: false,
    });
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
    // segments e.g. ['api', 'teachers', 'teacher-1']
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

    // 1. Thêm cảm nhận học sinh mới
    if (body.impression && typeof body.impression === 'object') {
      const imp = body.impression;
      const studentName = String(imp.studentName || '').trim();
      const className = String(imp.className || '9A3').trim();
      const trait = String(imp.trait || '').trim();
      const detail = String(imp.detail || '').trim();

      if (!studentName || !trait || !detail) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ tên, tính cách và kỷ niệm.' });
      }

      const newImp = {
        id: `imp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        studentName,
        className,
        trait,
        detail,
        createdAt: new Date().toISOString(),
      };

      const traits = targetTeacher.personalityTraits || [];
      const updatedTraits = traits.includes(trait) ? traits : [...traits, trait];

      const updatedTeacher = {
        ...targetTeacher,
        personalityTraits: updatedTraits,
        impressions: [newImp, ...(targetTeacher.impressions || [])],
        updatedAt: new Date().toISOString(),
      };

      teachers[targetIndex !== -1 ? targetIndex : 0] = updatedTeacher;
      await setUpstashTeachers(teachers);

      return res.status(200).json({ teacher: updatedTeacher, impression: newImp });
    }

    // 2. Chỉnh sửa cảm nhận học sinh
    if (body.updateImpression && typeof body.updateImpression === 'object') {
      const up = body.updateImpression;
      const impId = String(up.id || '').trim();
      const impIndex = (targetTeacher.impressions || []).findIndex((i) => i.id === impId);
      if (impIndex === -1) {
        return res.status(404).json({ error: 'Không tìm thấy cảm nhận cần chỉnh sửa.' });
      }

      const currentImp = targetTeacher.impressions[impIndex];
      const updatedImp = {
        ...currentImp,
        studentName: up.studentName !== undefined ? String(up.studentName).trim() : currentImp.studentName,
        className: up.className !== undefined ? String(up.className).trim() : currentImp.className,
        trait: up.trait !== undefined ? String(up.trait).trim() : currentImp.trait,
        detail: up.detail !== undefined ? String(up.detail).trim() : currentImp.detail,
      };

      const nextImps = [...targetTeacher.impressions];
      nextImps[impIndex] = updatedImp;

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
      const nextImps = (targetTeacher.impressions || []).filter((i) => i.id !== impId);

      const updatedTeacher = {
        ...targetTeacher,
        impressions: nextImps,
        updatedAt: new Date().toISOString(),
      };

      teachers[targetIndex !== -1 ? targetIndex : 0] = updatedTeacher;
      await setUpstashTeachers(teachers);

      return res.status(200).json({ teacher: updatedTeacher, deletedId: impId });
    }

    // 4. Cập nhật ảnh giáo viên (nếu có)
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

    return res.status(200).json({ teacher: targetTeacher });
  }

  if (req.method === 'DELETE') {
    // Xóa giáo viên
    if (teacherId) {
      const nextTeachers = teachers.filter((t) => t.id !== teacherId);
      await setUpstashTeachers(nextTeachers);
      return res.status(200).json({ deletedId: teacherId });
    }
  }

  return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
}
