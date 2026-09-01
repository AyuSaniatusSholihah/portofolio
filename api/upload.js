import { query, getPool } from './_lib/db.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pool = getPool();

  // 1. GET: Fetch all uploaded images or filter by category
  if (req.method === 'GET') {
    try {
      if (!pool) {
        return res.status(200).json({
          success: true,
          source: 'mock',
          message: 'Database not connected, returning fallback mock images',
          data: [
            {
              id: 1,
              name: 'Foto Profil Nia Resmi',
              url: '/assets/projects/FotoNia.jpg',
              category: 'profile',
              caption: 'Foto profil Nia untuk landing page hero',
            },
            {
              id: 2,
              name: 'Sertifikat Dicoding Full-Stack',
              url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
              category: 'certificate',
              caption: 'Sertifikat kelulusan fullstack bootcamp Dicoding Indonesia',
            },
            {
              id: 3,
              name: 'Sertifikat Kominfo AI DTS',
              url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
              category: 'certificate',
              caption: 'Sertifikasi Digital Talent Scholarship Kominfo tema Artificial Intelligence',
            },
            {
              id: 4,
              name: 'Piala Juara Lomba Esai POSKO UNS',
              url: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=1000&auto=format&fit=crop',
              category: 'achievement',
              caption: 'Trophy penghargaan 1st Runner-Up Lomba Esai Nasional',
            },
            {
              id: 5,
              name: 'Cover Projek ChickRoute',
              url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
              category: 'project',
              caption: 'Cover preview projek algoritma graf pengantaran',
            },
          ],
        });
      }

      const category = req.query.category;
      let sql = 'SELECT * FROM uploaded_images';
      const params = [];

      if (category && category !== 'all') {
        sql += ' WHERE category = $1';
        params.push(category);
      }

      sql += ' ORDER BY uploaded_at DESC';

      const result = await query(sql, params);
      return res.status(200).json({
        success: true,
        source: 'database',
        data: result.rows,
      });
    } catch (error) {
      console.error('Error fetching uploaded images:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch uploaded images',
        error: error.message,
      });
    }
  }

  // 2. POST: Store new uploaded image record (URL or Base64 data)
  if (req.method === 'POST') {
    try {
      const { name, url, category = 'general', caption = '', file_size = null, mime_type = null } = req.body || {};

      if (!url) {
        return res.status(400).json({
          success: false,
          message: 'Parameter "url" (image URL or Base64 data URI) is required',
        });
      }

      const imageName = name || `image-${Date.now()}`;

      if (!pool) {
        // Fallback for offline/local environment without Postgres config
        return res.status(201).json({
          success: true,
          source: 'memory',
          message: 'Image recorded (offline mock mode - save to local storage)',
          data: {
            id: Date.now(),
            name: imageName,
            url,
            category,
            caption,
            file_size,
            mime_type,
            uploaded_at: new Date().toISOString(),
          },
        });
      }

      // Ensure uploaded_images table exists
      await query(`
        CREATE TABLE IF NOT EXISTS uploaded_images (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            url TEXT NOT NULL,
            category VARCHAR(100) DEFAULT 'general',
            file_size INT,
            mime_type VARCHAR(100),
            caption TEXT,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      const insertSql = `
        INSERT INTO uploaded_images (name, url, category, caption, file_size, mime_type)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const result = await query(insertSql, [imageName, url, category, caption, file_size, mime_type]);

      return res.status(201).json({
        success: true,
        message: 'Image successfully uploaded and saved to database! ✨',
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error saving image to DB:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to save image to database',
        error: error.message,
      });
    }
  }

  // 3. DELETE: Delete an image record by ID
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Image ID is required' });
      }

      if (!pool) {
        return res.status(200).json({ success: true, message: 'Image deleted (mock mode)' });
      }

      await query('DELETE FROM uploaded_images WHERE id = $1', [id]);
      return res.status(200).json({
        success: true,
        message: 'Image removed from database successfully',
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete image',
        error: error.message,
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
