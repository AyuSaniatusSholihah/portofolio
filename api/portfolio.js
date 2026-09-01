import { query, getPool } from './_lib/db.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pool = getPool();

  // ========================================================
  // 1. GET: Ambil Seluruh Data Portofolio dari Database
  // ========================================================
  if (req.method === 'GET') {
    try {
      if (!pool) {
        return res.status(200).json({
          success: false,
          source: 'local_fallback',
          message: 'Database connection not configured yet. Fallback to static/localStorage data on client.',
        });
      }

      // Fetch all portfolio data concurrently with error tolerance for optional tables
      const [
        profileRes,
        aboutSkillsRes,
        projectsRes,
        experiencesRes,
        skillsRes,
        certRes,
        achRes,
        uploadsRes,
      ] = await Promise.all([
        query('SELECT * FROM profile_info LIMIT 1').catch(() => ({ rows: [] })),
        query('SELECT name FROM about_skills ORDER BY sort_order ASC').catch(() => ({ rows: [] })),
        query('SELECT * FROM projects ORDER BY sort_order ASC').catch(() => ({ rows: [] })),
        query('SELECT * FROM experiences ORDER BY sort_order ASC').catch(() => ({ rows: [] })),
        query('SELECT * FROM skills ORDER BY sort_order ASC').catch(() => ({ rows: [] })),
        query('SELECT * FROM certifications ORDER BY sort_order ASC').catch(() => ({ rows: [] })),
        query('SELECT * FROM achievements ORDER BY sort_order ASC').catch(() => ({ rows: [] })),
        query('SELECT * FROM uploaded_images ORDER BY uploaded_at DESC').catch(() => ({ rows: [] })),
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
        name: profile.name,
        nickname: profile.name ? profile.name.split(' ')[0] : undefined,
        profilePhoto: profile.profile_photo || '/assets/projects/FotoNia.jpg',
        aboutPhoto: profile.about_photo || profile.profile_photo || '/assets/projects/FotoNia.jpg',
        roleTitle: profile.role || 'ML Enthusiast • Web Developer',
        university: profile.university,
        bioShort: profile.bio,
        resumeLink: profile.resume_link,
        contactLinks: {
          email: profile.email,
          github: profile.github,
          linkedin: profile.linkedin,
        },
        aboutSkills: aboutSkills.length > 0 ? aboutSkills : undefined,
        projects: projectsRes.rows.map((p) => ({
          title: p.title,
          description: p.description,
          tech: Array.isArray(p.tech) ? p.tech : JSON.parse(p.tech || '[]'),
          category: p.category,
          categoryGroup: p.category_group || p.categoryGroup || 'Projek Real',
          status: p.status,
          type: p.type,
          impact: p.impact,
          link: p.link,
          github: p.github,
          image: p.image,
          images: Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]'),
          featured: p.featured,
          gradient: p.gradient || 'from-blue-900/60 to-slate-900',
        })),
        experiences: experiencesRes.rows.map((e) => ({
          role: e.role,
          organization: e.organization,
          department: e.department,
          orgSubtitle: e.org_subtitle,
          start: e.start_date,
          end: e.end_date,
          period: e.period,
          description: e.description,
          highlights: Array.isArray(e.highlights) ? e.highlights : JSON.parse(e.highlights || '[]'),
          techUsed: Array.isArray(e.tech_used) ? e.tech_used : JSON.parse(e.tech_used || '[]'),
        })),
        certifications: certRes.rows.map((c) => ({
          id: c.cert_id || `cert-${c.id}`,
          title: c.title,
          host: c.host,
          category: c.category,
          icon: c.icon || 'Award',
          color: c.color || 'blue',
          tier: c.tier || 'PROFESSIONAL',
          xp: c.xp || '+800 XP',
          stars: c.stars || 5,
          year: c.year || '2026',
          image: c.image,
          credentialId: c.credential_id,
          skills: Array.isArray(c.skills) ? c.skills : JSON.parse(c.skills || '[]'),
          description: c.description,
        })),
        achievements: achRes.rows.map((a) => ({
          id: a.ach_id || `ach-${a.id}`,
          title: a.title,
          host: a.host,
          category: a.category,
          icon: a.icon || 'Trophy',
          color: a.color || 'pink',
          tier: a.tier || 'LEGENDARY',
          xp: a.xp || '+850 XP',
          stars: a.stars || 5,
          year: a.year || '2026',
          image: a.image,
          description: a.description,
        })),
        uploadedImages: uploadsRes.rows,
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

  // ========================================================
  // 2. POST / PUT: Simpan Seluruh Perubahan Konten ke Database
  // ========================================================
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      if (!pool) {
        return res.status(503).json({
          success: false,
          source: 'local_storage_only',
          message:
            'DATABASE_URL belum dikonfigurasi di Environment Variables Vercel. Data saat ini tersimpan di browser Anda.',
        });
      }

      const body = req.body || {};
      const {
        name,
        roleTitle,
        university,
        bioShort,
        aboutLong,
        resumeLink,
        profilePhoto,
        aboutPhoto,
        contactLinks = {},
        projects = [],
        experiences = [],
        certifications = [],
        achievements = [],
        aboutSkills = [],
      } = body;

      // 1. Pastikan tabel-tabel utama sudah ada
      await query(`
        CREATE TABLE IF NOT EXISTS profile_info (
            id SERIAL PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            role VARCHAR(150) NOT NULL,
            university VARCHAR(200),
            bio TEXT,
            email VARCHAR(150),
            github VARCHAR(255),
            linkedin VARCHAR(255),
            resume_link TEXT,
            profile_photo TEXT,
            about_photo TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS projects (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            category VARCHAR(100) NOT NULL,
            category_group VARCHAR(100) DEFAULT 'Projek Real',
            description TEXT NOT NULL,
            tech JSONB DEFAULT '[]'::jsonb,
            status VARCHAR(100) NOT NULL,
            type VARCHAR(100) NOT NULL,
            impact TEXT,
            link TEXT NOT NULL,
            github TEXT,
            image TEXT,
            images JSONB DEFAULT '[]'::jsonb,
            featured BOOLEAN DEFAULT false,
            gradient VARCHAR(100) DEFAULT 'from-blue-900/60 to-slate-900',
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS experiences (
            id SERIAL PRIMARY KEY,
            role VARCHAR(200) NOT NULL,
            organization VARCHAR(200) NOT NULL,
            department VARCHAR(200),
            org_subtitle VARCHAR(200),
            start_date VARCHAR(50),
            end_date VARCHAR(50),
            period VARCHAR(100),
            description TEXT NOT NULL,
            highlights JSONB DEFAULT '[]'::jsonb,
            tech_used JSONB DEFAULT '[]'::jsonb,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS certifications (
            id SERIAL PRIMARY KEY,
            cert_id VARCHAR(50),
            title VARCHAR(255) NOT NULL,
            host VARCHAR(255) NOT NULL,
            category VARCHAR(100) NOT NULL,
            icon VARCHAR(50) DEFAULT 'Award',
            color VARCHAR(50) DEFAULT 'blue',
            tier VARCHAR(50) DEFAULT 'PROFESSIONAL',
            xp VARCHAR(50) DEFAULT '+800 XP',
            stars INT DEFAULT 5,
            year VARCHAR(50) DEFAULT '2026',
            image TEXT,
            credential_id VARCHAR(100),
            skills JSONB DEFAULT '[]'::jsonb,
            description TEXT,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS achievements (
            id SERIAL PRIMARY KEY,
            ach_id VARCHAR(50),
            title VARCHAR(255) NOT NULL,
            host VARCHAR(255) NOT NULL,
            category VARCHAR(100) NOT NULL,
            icon VARCHAR(50) DEFAULT 'Trophy',
            color VARCHAR(50) DEFAULT 'pink',
            tier VARCHAR(50) DEFAULT 'LEGENDARY',
            xp VARCHAR(50) DEFAULT '+850 XP',
            stars INT DEFAULT 5,
            year VARCHAR(50) DEFAULT '2026',
            image TEXT,
            description TEXT,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS about_skills (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            sort_order INT DEFAULT 0
        );
      `);

      // 2. Update profile_info
      await query(
        `
        INSERT INTO profile_info (id, name, role, university, bio, email, github, linkedin, resume_link, profile_photo, about_photo, updated_at)
        VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            university = EXCLUDED.university,
            bio = EXCLUDED.bio,
            email = EXCLUDED.email,
            github = EXCLUDED.github,
            linkedin = EXCLUDED.linkedin,
            resume_link = EXCLUDED.resume_link,
            profile_photo = EXCLUDED.profile_photo,
            about_photo = EXCLUDED.about_photo,
            updated_at = NOW();
      `,
        [
          name || 'Ayu Saniatus Sholihah',
          roleTitle || 'ML Enthusiast • Web Developer',
          university || 'Universitas Sebelas Maret Surakarta',
          bioShort || aboutLong || '',
          contactLinks.email || '',
          contactLinks.github || '',
          contactLinks.linkedin || '',
          resumeLink || '',
          profilePhoto || '',
          aboutPhoto || '',
        ]
      );

      // 3. Update projects
      if (Array.isArray(projects) && projects.length > 0) {
        await query('DELETE FROM projects');
        for (let i = 0; i < projects.length; i++) {
          const p = projects[i];
          await query(
            `
            INSERT INTO projects (title, category, category_group, description, tech, status, type, impact, link, github, image, images, featured, gradient, sort_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);
          `,
            [
              p.title || '',
              p.category || 'Web App',
              p.categoryGroup || p.type || 'Projek Real',
              p.description || '',
              JSON.stringify(p.tech || []),
              p.status || 'Completed',
              p.type || 'Fullstack',
              p.impact || '',
              p.link || '',
              p.github || '',
              p.image || null,
              JSON.stringify(p.images || []),
              !!p.featured,
              p.gradient || 'from-blue-900/60 to-slate-900',
              i + 1,
            ]
          );
        }
      }

      // 4. Update certifications
      if (Array.isArray(certifications) && certifications.length > 0) {
        await query('DELETE FROM certifications');
        for (let i = 0; i < certifications.length; i++) {
          const c = certifications[i];
          await query(
            `
            INSERT INTO certifications (cert_id, title, host, category, icon, color, tier, xp, stars, year, image, credential_id, skills, description, sort_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);
          `,
            [
              c.id || `cert-${i + 1}`,
              c.title || '',
              c.host || '',
              c.category || 'Web Development',
              c.icon || 'Award',
              c.color || 'blue',
              c.tier || 'PROFESSIONAL',
              c.xp || '+800 XP',
              c.stars || 5,
              c.year || '2026',
              c.image || null,
              c.credentialId || '',
              JSON.stringify(c.skills || []),
              c.description || '',
              i + 1,
            ]
          );
        }
      }

      // 5. Update achievements
      if (Array.isArray(achievements) && achievements.length > 0) {
        await query('DELETE FROM achievements');
        for (let i = 0; i < achievements.length; i++) {
          const a = achievements[i];
          await query(
            `
            INSERT INTO achievements (ach_id, title, host, category, icon, color, tier, xp, stars, year, image, description, sort_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
          `,
            [
              a.id || `ach-${i + 1}`,
              a.title || '',
              a.host || '',
              a.category || 'Competition',
              a.icon || 'Trophy',
              a.color || 'pink',
              a.tier || 'LEGENDARY',
              a.xp || '+850 XP',
              a.stars || 5,
              a.year || '2026',
              a.image || null,
              a.description || '',
              i + 1,
            ]
          );
        }
      }

      // 6. Update experiences
      if (Array.isArray(experiences) && experiences.length > 0) {
        await query('DELETE FROM experiences');
        for (let i = 0; i < experiences.length; i++) {
          const e = experiences[i];
          await query(
            `
            INSERT INTO experiences (role, organization, department, org_subtitle, start_date, end_date, period, description, highlights, tech_used, sort_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
          `,
            [
              e.role || '',
              e.organization || '',
              e.department || null,
              e.orgSubtitle || null,
              e.start || null,
              e.end || null,
              e.period || '',
              e.description || '',
              JSON.stringify(e.highlights || []),
              JSON.stringify(e.techUsed || []),
              i + 1,
            ]
          );
        }
      }

      // 7. Update about_skills
      if (Array.isArray(aboutSkills) && aboutSkills.length > 0) {
        await query('DELETE FROM about_skills');
        for (let i = 0; i < aboutSkills.length; i++) {
          await query(
            `INSERT INTO about_skills (name, sort_order) VALUES ($1, $2);`,
            [aboutSkills[i], i + 1]
          );
        }
      }

      return res.status(200).json({
        success: true,
        source: 'database',
        message: 'Semua perubahan berhasil disimpan ke Cloud Database & kini aktif secara publik! 🎉',
      });
    } catch (error) {
      console.error('Error saving portfolio data to DB:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal menyimpan ke database server',
        error: error.message,
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
