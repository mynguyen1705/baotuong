import { promises as fs } from 'fs';
import path from 'path';

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://dludapuvvqzotyrkeimy.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable__bZnVMn_mCMPYwuc9XRBvw_MmXUSaCW';

const SUPABASE_IMPRESSIONS_REST_URL = `${SUPABASE_URL}/rest/v1/teacher_impressions`;

function getSupabaseHeaders(extra = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

function mapImpressionToRow(teacherId, imp) {
  return {
    id: String(imp.id),
    teacher_id: String(teacherId),
    author: String(imp.studentName || 'Học sinh 9A3').trim(),
    color: String(imp.className || '9A3').trim(),
    content: JSON.stringify({
      studentName: String(imp.studentName || 'Học sinh 9A3').trim(),
      className: String(imp.className || '9A3').trim(),
      trait: String(imp.trait || '').trim(),
      detail: String(imp.detail || '').trim(),
    }),
    rotation: 0,
    created_at: imp.createdAt || new Date().toISOString(),
  };
}

function mapRowToImpression(row) {
  let studentName = String(row.author || 'Học sinh 9A3').trim();
  let className = row.color && row.color !== 'yellow' ? String(row.color).trim() : '9A3';
  let trait = 'Tận tâm & nhiệt huyết';
  let detail = String(row.content || '').trim();

  if (detail.startsWith('{')) {
    try {
      const parsed = JSON.parse(detail);
      if (parsed && typeof parsed === 'object') {
        if (parsed.studentName) studentName = String(parsed.studentName).trim();
        if (parsed.className) className = String(parsed.className).trim();
        if (parsed.trait) trait = String(parsed.trait).trim();
        if (parsed.detail) detail = String(parsed.detail).trim();
      }
    } catch {
      // Fallback plain text
    }
  }

  return {
    teacherId: String(row.teacher_id),
    impression: {
      id: String(row.id),
      studentName,
      className,
      trait,
      detail,
      createdAt: row.created_at
        ? new Date(row.created_at).toISOString()
        : new Date().toISOString(),
    },
  };
}

async function fetchSupabaseImpressionsByTeacher() {
  try {
    const res = await fetch(
      `${SUPABASE_IMPRESSIONS_REST_URL}?select=id,teacher_id,author,content,color,rotation,created_at&order=created_at.desc`,
      {
        method: 'GET',
        headers: getSupabaseHeaders(),
        cache: 'no-store',
      }
    );
    if (!res.ok) return {};
    const rows = await res.json();
    if (!Array.isArray(rows)) return {};
    const grouped = {};
    for (const row of rows) {
      const { teacherId, impression } = mapRowToImpression(row);
      if (!grouped[teacherId]) grouped[teacherId] = [];
      grouped[teacherId].push(impression);
    }
    return grouped;
  } catch (err) {
    console.error('Error reading Supabase impressions:', err);
    return {};
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

  const [fileTeachers, supabaseImpressions] = await Promise.all([
    getInitialFileTeachers(),
    fetchSupabaseImpressionsByTeacher(),
  ]);

  let teachers = (fileTeachers || []).map((teacher) => {
    const dbList = supabaseImpressions[teacher.id] || [];
    const combined = mergeImpressionsLists(dbList);

    const traitSet = new Set(teacher.personalityTraits || []);
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

  // Trích xuất teacherId từ URL /api/teachers/:id hoặc query (?id= / ?match=) hoặc body
  let teacherId = '';
  if (req.query?.id) {
    teacherId = String(req.query.id);
  } else if (req.query?.match) {
    teacherId = String(req.query.match);
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

    // 0. Đồng bộ hàng loạt cảm nhận từ thiết bị khác lên Supabase (syncImpressions)
    if (Array.isArray(body.syncImpressions)) {
      const rows = body.syncImpressions
        .filter((imp) => imp && imp.id && imp.studentName && imp.trait && imp.detail)
        .map((imp) => mapImpressionToRow(targetTeacher.id, imp));

      if (rows.length > 0) {
        await fetch(`${SUPABASE_IMPRESSIONS_REST_URL}?on_conflict=id`, {
          method: 'POST',
          headers: getSupabaseHeaders({
            Prefer: 'resolution=merge-duplicates,return=minimal',
          }),
          body: JSON.stringify(rows),
        });
      }

      const mergedList = mergeImpressionsLists(
        targetTeacher.impressions || [],
        body.syncImpressions
      );
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
      return res.status(200).json({ teacher: updatedTeacher });
    }

    // 1. Thêm cảm nhận học sinh mới trực tiếp vào Supabase
    if (body.impression && typeof body.impression === 'object') {
      const imp = body.impression;
      const studentName = String(imp.studentName || '').trim();
      const className = String(imp.className || '9A3').trim();
      const trait = String(imp.trait || '').trim();
      const detail = String(imp.detail || '').trim();

      if (!studentName || !trait || !detail) {
        return res
          .status(400)
          .json({ error: 'Vui lòng điền đầy đủ tên, tính cách và kỷ niệm.' });
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

      const row = mapImpressionToRow(targetTeacher.id, candidateImp);
      const insertRes = await fetch(`${SUPABASE_IMPRESSIONS_REST_URL}?on_conflict=id`, {
        method: 'POST',
        headers: getSupabaseHeaders({
          Prefer: 'resolution=merge-duplicates,return=representation',
        }),
        body: JSON.stringify(row),
      });

      if (!insertRes.ok) {
        return res
          .status(500)
          .json({ error: 'Không thể lưu nhận xét lên cơ sở dữ liệu Supabase.' });
      }

      const currentList = targetTeacher.impressions || [];
      const updatedList = mergeImpressionsLists([candidateImp], currentList);
      const traits = targetTeacher.personalityTraits || [];
      const updatedTraits = traits.includes(trait) ? traits : [...traits, trait];

      const updatedTeacher = {
        ...targetTeacher,
        personalityTraits: updatedTraits,
        impressions: updatedList,
        updatedAt: new Date().toISOString(),
      };

      return res.status(200).json({ teacher: updatedTeacher, impression: candidateImp });
    }

    // 2. Chỉnh sửa cảm nhận học sinh trực tiếp trên Supabase
    if (body.updateImpression && typeof body.updateImpression === 'object') {
      const up = body.updateImpression;
      const impId = String(up.id || '').trim();
      if (!impId) {
        return res.status(400).json({ error: 'Mã cảm nhận không hợp lệ.' });
      }

      const currentList = targetTeacher.impressions || [];
      const existingImp = currentList.find((i) => i.id === impId);

      const updatedImp = {
        id: impId,
        studentName:
          up.studentName !== undefined
            ? String(up.studentName).trim()
            : existingImp?.studentName || 'Học sinh 9A3',
        className:
          up.className !== undefined
            ? String(up.className).trim()
            : existingImp?.className || '9A3',
        trait:
          up.trait !== undefined ? String(up.trait).trim() : existingImp?.trait || '',
        detail:
          up.detail !== undefined ? String(up.detail).trim() : existingImp?.detail || '',
        createdAt: existingImp?.createdAt || new Date().toISOString(),
      };

      const row = mapImpressionToRow(targetTeacher.id, updatedImp);
      const patchRes = await fetch(
        `${SUPABASE_IMPRESSIONS_REST_URL}?id=eq.${encodeURIComponent(impId)}`,
        {
          method: 'PATCH',
          headers: getSupabaseHeaders({ Prefer: 'return=representation' }),
          body: JSON.stringify({
            author: row.author,
            color: row.color,
            content: row.content,
          }),
        }
      );

      if (!patchRes.ok) {
        return res
          .status(500)
          .json({ error: 'Không thể cập nhật nhận xét trên cơ sở dữ liệu Supabase.' });
      }

      const nextImps = currentList.some((i) => i.id === impId)
        ? currentList.map((i) => (i.id === impId ? updatedImp : i))
        : [updatedImp, ...currentList];

      const updatedTeacher = {
        ...targetTeacher,
        impressions: nextImps,
        updatedAt: new Date().toISOString(),
      };

      return res.status(200).json({ teacher: updatedTeacher, impression: updatedImp });
    }

    // 3. Xoá cảm nhận học sinh trực tiếp trên Supabase
    if (body.deleteImpressionId) {
      const impId = String(body.deleteImpressionId).trim();
      const delRes = await fetch(
        `${SUPABASE_IMPRESSIONS_REST_URL}?id=eq.${encodeURIComponent(impId)}`,
        {
          method: 'DELETE',
          headers: getSupabaseHeaders(),
        }
      );

      if (!delRes.ok) {
        return res
          .status(500)
          .json({ error: 'Không thể xóa nhận xét trên cơ sở dữ liệu Supabase.' });
      }

      const currentList = targetTeacher.impressions || [];
      const nextImps = currentList.filter((i) => i.id !== impId);

      const updatedTeacher = {
        ...targetTeacher,
        impressions: nextImps,
        updatedAt: new Date().toISOString(),
      };

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
    if (teacherId) {
      return res.status(200).json({ deletedId: teacherId });
    }
  }

  return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
}
