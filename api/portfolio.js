import { query, getPool } from './_lib/db.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({
        success: false,
        message: 'Database connection not configured yet. Fallback to static data on client.',
      });
    }

    // Fetch all portfolio data concurrently
    const [profileRes, aboutSkillsRes, projectsRes, experiencesRes, skillsRes] = await Promise.all([
      query('SELECT * FROM profile_info LIMIT 1'),
      query('SELECT name FROM about_skills ORDER BY sort_order ASC'),
      query('SELECT * FROM projects ORDER BY sort_order ASC'),
      query('SELECT * FROM experiences ORDER BY sort_order ASC'),
      query('SELECT * FROM skills ORDER BY sort_order ASC'),
    ]);

    const profile = profileRes.rows[0] || {};
    const aboutSkills = aboutSkillsRes.rows.map((row) => row.name);
    
    // Group skills by category
    const skillGroups = {
      development: [],
      research: [],
      softSkills: [],
    };

    skillsRes.rows.forEach((s) => {
      if (skillGroups[s.category]) {
        skillGroups[s.category].push({
          name: s.name,
          icons: s.icons,
          icon: s.icons,
        });
      }
    });

    const data = {
      profilePhoto: profile.profile_photo || '/assets/projects/FotoNia.jpg',
      resumeLink: profile.resume_link,
      contactLinks: {
        email: profile.email,
        github: profile.github,
        linkedin: profile.linkedin,
      },
      aboutSkills,
      projects: projectsRes.rows.map((p) => ({
        title: p.title,
        description: p.description,
        tech: Array.isArray(p.tech) ? p.tech : JSON.parse(p.tech || '[]'),
        category: p.category,
        status: p.status,
        type: p.type,
        impact: p.impact,
        link: p.link,
      })),
      experiences: experiencesRes.rows.map((e) => ({
        role: e.role,
        organization: e.organization,
        department: e.department,
        start: e.start_date,
        end: e.end_date,
        description: e.description,
      })),
      skillGroups,
    };

    return res.status(200).json({
      success: true,
      source: 'database',
      data,
    });
  } catch (error) {
    console.error('Error fetching portfolio data from DB:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve data from database',
      error: error.message,
    });
  }
}
