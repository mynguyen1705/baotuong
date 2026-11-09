import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'server', 'data', 'teachers.json');
      const data = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      return res.status(200).json({
        teachers: parsed.teachers || parsed,
        isOwner: false,
      });
    } catch {
      try {
        const publicPath = path.join(process.cwd(), 'public', 'teachers-data.json');
        const data = await fs.readFile(publicPath, 'utf-8');
        const parsed = JSON.parse(data);
        return res.status(200).json({
          teachers: parsed.teachers || parsed,
          isOwner: false,
        });
      } catch {
        return res.status(500).json({ error: 'Cannot load teachers' });
      }
    }
  }

  return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
}

