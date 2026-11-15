const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://dludapuvvqzotyrkeimy.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable__bZnVMn_mCMPYwuc9XRBvw_MmXUSaCW';

const SUPABASE_WISHES_REST_URL = `${SUPABASE_URL}/rest/v1/wishes`;

function getSupabaseHeaders(extra = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

function mapRowToWish(row) {
  return {
    id: String(row.id),
    senderName: String(row.sender_name || '').trim(),
    className: String(row.class_name || '9A3').trim(),
    message: String(row.message || '').trim(),
    createdAt: row.created_at
      ? new Date(row.created_at).toISOString()
      : new Date().toISOString(),
  };
}

async function fetchSupabaseWishes() {
  const res = await fetch(
    `${SUPABASE_WISHES_REST_URL}?select=id,sender_name,class_name,message,created_at&order=created_at.desc`,
    {
      method: 'GET',
      headers: getSupabaseHeaders(),
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    throw new Error(`Supabase GET wishes failed: ${res.status}`);
  }
  const rows = await res.json();
  return Array.isArray(rows) ? rows.map(mapRowToWish) : [];
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const urlPath = (req.url || '').split('?')[0];
  const idMatch = urlPath.match(/\/api\/wishes\/([^/]+)$/);
  const wishId =
    (idMatch ? decodeURIComponent(idMatch[1]) : null) ||
    req.query?.id ||
    req.query?.match ||
    null;

  try {
    if (req.method === 'GET') {
      const wishes = await fetchSupabaseWishes();
      return res.status(200).json({ wishes });
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

    if (req.method === 'POST') {
      if (Array.isArray(body.syncWishes) || Array.isArray(body.wishes)) {
        const list = body.syncWishes || body.wishes;
        const rows = list
          .filter((w) => w && w.id && w.senderName && w.message)
          .map((w) => ({
            id: String(w.id).trim(),
            sender_name: String(w.senderName).trim(),
            class_name: String(w.className || '9A3').trim(),
            message: String(w.message).trim(),
            created_at: w.createdAt || new Date().toISOString(),
          }));

        if (rows.length > 0) {
          await fetch(`${SUPABASE_WISHES_REST_URL}?on_conflict=id`, {
            method: 'POST',
            headers: getSupabaseHeaders({
              Prefer: 'resolution=merge-duplicates,return=minimal',
            }),
            body: JSON.stringify(rows),
          });
        }
        const wishes = await fetchSupabaseWishes();
        return res.status(200).json({ wishes });
      }

      const { id: clientId, senderName, className, message, createdAt } = body;
      if (!senderName || !className || !message) {
        return res
          .status(400)
          .json({ error: 'Vui lòng điền đầy đủ tên người gửi, lớp và lời chúc.' });
      }

      const row = {
        id:
          typeof clientId === 'string' && clientId.trim().startsWith('wish-')
            ? clientId.trim()
            : `wish-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        sender_name: String(senderName).trim(),
        class_name: String(className).trim(),
        message: String(message).trim(),
        created_at:
          typeof createdAt === 'string' && !Number.isNaN(new Date(createdAt).getTime())
            ? createdAt
            : new Date().toISOString(),
      };

      const insertRes = await fetch(`${SUPABASE_WISHES_REST_URL}?on_conflict=id`, {
        method: 'POST',
        headers: getSupabaseHeaders({
          Prefer: 'resolution=merge-duplicates,return=representation',
        }),
        body: JSON.stringify(row),
      });

      if (!insertRes.ok) {
        return res.status(500).json({ error: 'Không thể lưu lời chúc lên Supabase.' });
      }

      const insertedRows = await insertRes.json();
      const created =
        Array.isArray(insertedRows) && insertedRows[0]
          ? mapRowToWish(insertedRows[0])
          : mapRowToWish(row);

      return res.status(201).json({ wish: created });
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      const targetId = wishId || body.id;
      if (!targetId) {
        return res.status(400).json({ error: 'Mã lời chúc không hợp lệ.' });
      }

      const updatePayload = {};
      if (body.senderName) updatePayload.sender_name = String(body.senderName).trim();
      if (body.className) updatePayload.class_name = String(body.className).trim();
      if (body.message) updatePayload.message = String(body.message).trim();

      const patchRes = await fetch(
        `${SUPABASE_WISHES_REST_URL}?id=eq.${encodeURIComponent(String(targetId))}`,
        {
          method: 'PATCH',
          headers: getSupabaseHeaders({ Prefer: 'return=representation' }),
          body: JSON.stringify(updatePayload),
        }
      );

      if (!patchRes.ok) {
        return res.status(500).json({ error: 'Không thể cập nhật lời chúc trên Supabase.' });
      }

      const updatedRows = await patchRes.json();
      if (!Array.isArray(updatedRows) || updatedRows.length === 0) {
        return res.status(404).json({ error: 'Không tìm thấy lời chúc.' });
      }

      return res.status(200).json({ wish: mapRowToWish(updatedRows[0]) });
    }

    if (req.method === 'DELETE') {
      const targetId = wishId || body.id;
      if (!targetId) {
        return res.status(400).json({ error: 'Mã lời chúc không hợp lệ.' });
      }

      const delRes = await fetch(
        `${SUPABASE_WISHES_REST_URL}?id=eq.${encodeURIComponent(String(targetId))}`,
        {
          method: 'DELETE',
          headers: getSupabaseHeaders(),
        }
      );

      if (!delRes.ok) {
        return res.status(500).json({ error: 'Không thể xóa lời chúc trên Supabase.' });
      }

      return res.status(200).json({ success: true, message: 'Đã xóa lời chúc thành công.' });
    }

    return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
  } catch (err) {
    console.error('Error in /api/wishes:', err);
    return res.status(500).json({ error: 'Lỗi máy chủ khi xử lý lời chúc.' });
  }
}
