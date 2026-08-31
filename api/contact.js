import { query, getPool } from './_lib/db.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body || {};

  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required' });
  }

  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please set DATABASE_URL or POSTGRES_URL environment variable.',
      });
    }

    const result = await query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING id, created_at',
      [name || 'Anonymous', email, subject || 'Portfolio Contact', message]
    );

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save message',
      error: error.message,
    });
  }
}
