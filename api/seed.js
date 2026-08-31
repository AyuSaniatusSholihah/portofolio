import { query, getPool } from './_lib/db.js';

export default async function handler(req, res) {
  // Simple seed runner endpoint
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({
        success: false,
        message: 'Database connection not configured. Please set DATABASE_URL or POSTGRES_URL environment variable.',
      });
    }

    // 1. Create tables
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
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          description TEXT NOT NULL,
          category VARCHAR(100) NOT NULL,
          status VARCHAR(100) NOT NULL,
          type VARCHAR(100) NOT NULL,
          impact TEXT,
          link TEXT NOT NULL,
          tech JSONB DEFAULT '[]'::jsonb,
          sort_order INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS experiences (
          id SERIAL PRIMARY KEY,
          role VARCHAR(200) NOT NULL,
          organization VARCHAR(200) NOT NULL,
          department VARCHAR(200),
          start_date VARCHAR(50),
          end_date VARCHAR(50),
          description TEXT NOT NULL,
          sort_order INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS skills (
          id SERIAL PRIMARY KEY,
          category VARCHAR(50) NOT NULL,
          name VARCHAR(100) NOT NULL,
          icons VARCHAR(100),
          sort_order INT DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS about_skills (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          sort_order INT DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
          id SERIAL PRIMARY KEY,
          name VARCHAR(150),
          email VARCHAR(150) NOT NULL,
          subject VARCHAR(200),
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Seed profile_info
    await query(`
      INSERT INTO profile_info (id, name, role, university, bio, email, github, linkedin, resume_link, profile_photo)
      VALUES (
          1,
          'Ayu Saniatus Sholihah',
          'Informatics Student • Web Developer',
          'Universitas Sebelas Maret Surakarta',
          'Passionate about creating innovative web solutions that make a positive impact and developing tech solutions for social good.',
          'mailto:ayu.saniatus@gmail.com',
          'https://github.com/AyuSaniatusSholihah',
          'https://www.linkedin.com/in/ayu-saniatus-sholihah-334972272/',
          'https://drive.google.com/file/d/1V6pJ5puwtmDGhg2WBI45IYzaty-1NRor/view?usp=sharing',
          '/assets/projects/FotoNia.jpg'
      )
      ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          role = EXCLUDED.role,
          university = EXCLUDED.university,
          bio = EXCLUDED.bio,
          email = EXCLUDED.email,
          github = EXCLUDED.github,
          linkedin = EXCLUDED.linkedin,
          resume_link = EXCLUDED.resume_link,
          profile_photo = EXCLUDED.profile_photo;
    `);

    // 3. Seed about_skills
    await query('DELETE FROM about_skills');
    await query(`
      INSERT INTO about_skills (name, sort_order) VALUES
      ('Web Development', 1),
      ('AI Integration', 2),
      ('Research Writing', 3),
      ('Academic Essays', 4),
      ('Competition Entries', 5),
      ('Scientific Documentation', 6);
    `);

    // 4. Seed projects
    await query('DELETE FROM projects');
    await query(`
      INSERT INTO projects (title, description, tech, category, status, type, impact, link, sort_order) VALUES
      (
          'SIM UNS Website',
          'Official website for SIM UNS (Sekolah Ilmiah Mahasiswa) organization',
          '["React", "Vite", "SQL database", "Web Development"]'::jsonb,
          'project web',
          'Coming Soon',
          'Organization Project',
          'Providing digital presence and information platform for student scientific community',
          'https://sim.uns.ac.id',
          1
      ),
      (
          'web revitalisasi bank sampah',
          'PPKO SIM UNS Project',
          '["React", "Vite"]'::jsonb,
          'project web',
          'Front end, final',
          'Team Project',
          'Supporting SDGs Goal 12: Responsible Consumption and Production',
          'https://cointrash-five.vercel.app/',
          2
      ),
      (
          'My Journal',
          'Web journaling app with task management, gratitude journaling, and time blocking features for daily productivity',
          '["React", "Vite", "Web Development"]'::jsonb,
          'project web',
          'In Development',
          'project personal',
          'Personal productivity and self-reflection tool',
          'https://github.com/AyuSaniatusSholihah/myjournal',
          3
      ),
      (
          'Wifi Dashboard',
          'Digital wifi network management platform for Pondok Pesantren Mahasiswa Miftahul Khoirot',
          '["Network Management", "Dashboard UI", "Data Visualization"]'::jsonb,
          'project',
          'In Development',
          'project personal',
          'Streamlining wifi management and monitoring',
          'https://github.com/AyuSaniatusSholihah/wifi-MK',
          4
      ),
      (
          'E-Shrimp',
          'Digital sales platform for shrimp and processed products for coastal SMEs',
          '["html", "css", "javascript", "digital marketing"]'::jsonb,
          'Business Solution',
          'In Essay Competition, In Development',
          'Team Project (Competition)',
          'Supporting coastal communities and local SMEs',
          'https://github.com/AyuSaniatusSholihah/shrimpzone-uns',
          5
      ),
      (
          'FarmIntel',
          'AI-based digital platform for chili plant disease diagnosis and farmer community support',
          '["figma"]'::jsonb,
          'app design',
          'In Development',
          'Team Project',
          'Supporting SDGs Goal 2: Zero Hunger',
          'https://www.figma.com/design/vnPdzf9G1aQiENdSKXUDQB/AppFarmIntel?node-id=0-1&t=SP8zD30HE4jFoFt2-1',
          6
      ),
      (
          'FriendYours',
          'Anonymous digital venting platform with chatbot integration and community support features',
          '["React", "AI Chatbot", "Community Features"]'::jsonb,
          'Frontend',
          'In Development',
          'Team Project',
          'Supporting SDGs Goal 3: Good Health and Well-being',
          'https://github.com/Nabil-Fan/prototype-friendyours',
          7
      ),
      (
          'Web Math',
          'Learning media based on Braille audiobook and QR-Integrated Web technology',
          '["QR Code Integration", "Audio Technology", "Fuzzy Machine", "React & Vite"]'::jsonb,
          'Educational Technology',
          'In Essay Competition and In Development',
          'Team Project (Competition)',
          'Inclusive education for students with hearing impairments',
          'https://github.com/AyuSaniatusSholihah/frontend',
          8
      ),
      (
          'Hijaiyahku',
          'Interactive digital platform for learning Hijaiyah letters designed for hearing-impaired students',
          '["figma"]'::jsonb,
          'web design',
          'In Development',
          'Team Project',
          'Supporting SDGs Goal 4: Quality Education',
          'https://drive.google.com/file/d/10k6G0qJbjMl7_NJWOeHn-0O0-EV79m0f/view?usp=drive_link',
          9
      );
    `);

    // 5. Seed experiences
    await query('DELETE FROM experiences');
    await query(`
      INSERT INTO experiences (role, organization, department, start_date, end_date, description, sort_order) VALUES
      (
          'Talent website development in Fatisda Student Development',
          'FATISDA UNS',
          'Webdev',
          'Maret 2026',
          'Present',
          'Contributing to website development for prospective clients',
          1
      ),
      (
          'Vice Coordinator Secretary FILM 2026',
          'FILM (Festival Ilmiah Mahasiswa)',
          'SIM UNS (Sekolah Ilmiah Mahasiswa)',
          'Januari 2026',
          'Present',
          'Handling all administrative and documentation matters for the scientific festival event and assisting the coordinator',
          2
      ),
      (
          'Head of Publication and Documentation Division 2026',
          'SIM UNS (Sekolah Ilmiah Mahasiswa)',
          'Komunikasi Media dan Informasi',
          'Februari 2026',
          'Present',
          'Leading the publication and documentation division, managing all SIM social media posts, website content, and media partner coordination',
          3
      ),
      (
          'Staff Member 2026',
          'SIM UNS (Sekolah Ilmiah Mahasiswa)',
          'Kompetisi dan Prestasi',
          '2026',
          'Present',
          'Supporting student competition participation and achievement tracking, assisting in organizing training and workshops',
          4
      ),
      (
          'Secretary',
          'SKILL PAB (Open Recruitment Event)',
          'SIM UNS',
          'Juni 2025',
          'Oktober 2025',
          'Handling administrative processes for new student recruitment event, managing documentation and coordination',
          5
      ),
      (
          'Vice Secretary Division',
          'AKSI (Agenda Kegiatan Studi Banding)',
          'SIM UNS with FST UNDIP',
          'Juli 2025',
          'September 2025',
          'Assisting in secretariat duties for inter-university study event, coordinating schedules helping to find venues',
          6
      ),
      (
          'Head of Secretary Division',
          'PKS (Pekan Keluarga SIM)',
          'SIM UNS Event',
          'Oktober 2025',
          'Oktober 2025',
          'Leading secretariat operations for major SIM family week event, coordinating documentation and administrative processes',
          7
      ),
      (
          'WiFi Infrastructure Supporting Manager',
          'Pondok Pesantren Mahasiswa Miftahul Khoirot',
          NULL,
          '2025',
          'Present',
          'Managing technical infrastructure and financial records using Google Spreadsheet and web dashboard for systematic tracking',
          8
      ),
      (
          'Facilities and Infrastructure Division',
          'Pondok Pesantren Mahasiswa Miftahul Khoirot',
          NULL,
          '2025',
          'Present',
          'Oversee facility management and infrastructure development projects and summarize everything in a google spreadsheet.',
          9
      ),
      (
          'Student Council Member',
          'Dewan Ambalan',
          'Scouting Organization (High School)',
          '2022',
          '2023',
          'Active in scouting leadership development, organizing community service and character building programs',
          10
      ),
      (
          'Research Club Member',
          'KIR (Karya Ilmiah Remaja)',
          'High School Extracurricular',
          '2021',
          '2023',
          'Developing research and scientific writing skills, participating in student research competitions and academic writing contests',
          11
      );
    `);

    // 6. Seed skills
    await query('DELETE FROM skills');
    await query(`
      INSERT INTO skills (category, name, icons, sort_order) VALUES
      ('development', 'HTML, CSS, JS', 'html,css,js', 1),
      ('development', 'React & Vite', 'react,vite', 2),
      ('development', 'Figma & UI/UX', 'figma', 3),
      ('development', 'Python', 'python', 4),
      ('development', 'Git & GitHub', 'git,github', 5),
      ('development', 'SQL Database', 'mysql', 6),

      ('research', 'Academic Research', 'BookOpen', 1),
      ('research', 'Essay Writing', 'PenTool', 2),
      ('research', 'Scientific Writing', 'FileText', 3),
      ('research', 'Content Creation', 'Edit', 4),

      ('softSkills', 'Team Leadership', 'Crown', 1),
      ('softSkills', 'Project Coordination', 'Calendar', 2),
      ('softSkills', 'Communication', 'MessageSquare', 3),
      ('softSkills', 'Documentation', 'FileText', 4),
      ('softSkills', 'Time Management', 'Clock', 5),
      ('softSkills', 'Problem Solving', 'Lightbulb', 6);
    `);

    return res.status(200).json({
      success: true,
      message: 'Database tables created and seeded successfully with all portfolio content!',
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message,
    });
  }
}
