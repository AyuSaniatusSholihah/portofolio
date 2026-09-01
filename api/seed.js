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

    // 1. Create all tables
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
      INSERT INTO profile_info (id, name, role, university, bio, email, github, linkedin, resume_link, profile_photo, about_photo)
      VALUES (
          1,
          'Ayu Saniatus Sholihah',
          'ML Enthusiast • Web Developer',
          'Universitas Sebelas Maret Surakarta',
          'Passionate about creating innovative web solutions, applying machine learning algorithms, and developing tech solutions for social good.',
          'mailto:ayu.saniatus@gmail.com',
          'https://github.com/AyuSaniatusSholihah',
          'https://www.linkedin.com/in/ayu-saniatus-sholihah-334972272/',
          'https://drive.google.com/file/d/1V6pJ5puwtmDGhg2WBI45IYzaty-1NRor/view?usp=sharing',
          '/assets/projects/FotoNia.jpg',
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
          profile_photo = EXCLUDED.profile_photo,
          about_photo = EXCLUDED.about_photo;
    `);

    // 3. Seed about_skills
    await query('DELETE FROM about_skills');
    await query(`
      INSERT INTO about_skills (name, sort_order) VALUES
      ('Web Development', 1),
      ('Machine Learning & AI', 2),
      ('Research Writing', 3),
      ('Academic Essays', 4),
      ('Competition Entries', 5),
      ('Scientific Documentation', 6);
    `);

    // 4. Seed projects with image URLs
    await query('DELETE FROM projects');
    await query(`
      INSERT INTO projects (title, category, category_group, description, tech, status, type, impact, link, github, image, featured, gradient, sort_order) VALUES
      (
          'ChickRoute Delivery Optimization',
          'Algorithm & Graph',
          'Projek Kuliah',
          'Route-finding system for food delivery using graph algorithms (Dijkstra/A*) to find the most efficient path.',
          '["DSA", "Graph", "Java", "Algorithms"]'::jsonb,
          'Completed',
          'Projek Kuliah',
          'Optimizes multi-stop route calculation time by over 35%.',
          'https://github.com/AyuSaniatusSholihah',
          'https://github.com/AyuSaniatusSholihah',
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
          true,
          'from-amber-900/60 to-slate-900',
          1
      ),
      (
          'SMAP Project Management System',
          'Web Application',
          'Projek Kuliah',
          'Java and React based application for managing project workflows, tasks, member assignments, and deadlines.',
          '["Java", "OOP", "SQL", "UI/UX"]'::jsonb,
          'In Development',
          'Projek Kuliah',
          'Centralized collaborative management system for university teams.',
          'https://github.com/AyuSaniatusSholihah',
          'https://github.com/AyuSaniatusSholihah',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
          true,
          'from-blue-900/60 to-slate-900',
          2
      ),
      (
          'Face Recognition System',
          'AI & Machine Learning',
          'Projek Kuliah',
          'Face identification and classification system using Eigenfaces and Linear Algebra algorithms for verification.',
          '["Python", "Linear Algebra", "OpenCV", "NumPy"]'::jsonb,
          'Research Project',
          'Projek Kuliah',
          'High-accuracy lightweight biometric verification experiment.',
          'https://github.com/AyuSaniatusSholihah',
          'https://github.com/AyuSaniatusSholihah',
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
          true,
          'from-indigo-900/60 to-slate-900',
          3
      ),
      (
          'Interactive Web Design & Development',
          'Frontend & UI/UX',
          'Projek Real',
          'Responsive web design and development project focusing on smooth micro-interactions and modern aesthetics.',
          '["React", "Figma", "Vite", "Tailwind"]'::jsonb,
          'Work in Progress',
          'Projek Real',
          'Modern design system with high accessibility and fluid response.',
          'https://github.com/AyuSaniatusSholihah',
          'https://github.com/AyuSaniatusSholihah',
          'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
          true,
          'from-pink-900/60 to-slate-900',
          4
      ),
      (
          'SIM UNS Official Website',
          'Web Platform',
          'Projek Real',
          'Official web platform for SIM UNS (Sekolah Ilmiah Mahasiswa) student scientific community and repository.',
          '["React", "Vite", "SQL Database", "Tailwind"]'::jsonb,
          'Coming Soon',
          'Projek Real',
          'Digital presence and scientific research hub for hundreds of students.',
          'https://sim.uns.ac.id',
          'https://github.com/AyuSaniatusSholihah',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
          false,
          'from-cyan-900/60 to-slate-900',
          5
      ),
      (
          'Web Revitalisasi Bank Sampah (CoinTrash)',
          'Sustainability Web',
          'Projek Lomba',
          'PPKO SIM UNS digital platform supporting SDGs Goal 12: Responsible Consumption and Waste Revitalization.',
          '["React", "Vite", "Tailwind", "API"]'::jsonb,
          'Frontend Final',
          'Projek Lomba',
          'Supporting waste management digitization and community rewards.',
          'https://cointrash-five.vercel.app/',
          'https://github.com/AyuSaniatusSholihah',
          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
          false,
          'from-emerald-900/60 to-slate-900',
          6
      ),
      (
          'My Journal & Productivity',
          'Productivity Tool',
          'Projek Real',
          'Web journaling app with task management, gratitude journaling, and time blocking features for daily reflection.',
          '["React", "Vite", "LocalStorage", "CSS"]'::jsonb,
          'In Development',
          'Projek Real',
          'Daily self-reflection and productive habit formation dashboard.',
          'https://github.com/AyuSaniatusSholihah/myjournal',
          'https://github.com/AyuSaniatusSholihah/myjournal',
          'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop',
          false,
          'from-purple-900/60 to-slate-900',
          7
      ),
      (
          'FarmIntel Chili Disease Diagnostic',
          'AI & App Design',
          'Projek Lomba',
          'AI-based digital platform for chili plant disease diagnosis and farmer community agricultural support.',
          '["Figma", "UI/UX", "AI Concept", "SDGs"]'::jsonb,
          'In Development',
          'Projek Lomba',
          'Supporting SDGs Goal 2: Zero Hunger & local agricultural empowerment.',
          'https://www.figma.com/design/vnPdzf9G1aQiENdSKXUDQB/AppFarmIntel',
          'https://github.com/AyuSaniatusSholihah',
          'https://images.unsplash.com/photo-1592417817098-8f3d6eb22521?q=80&w=1000&auto=format&fit=crop',
          false,
          'from-orange-900/60 to-slate-900',
          8
      );
    `);

    // 5. Seed Certifications
    await query('DELETE FROM certifications');
    await query(`
      INSERT INTO certifications (cert_id, title, host, category, icon, color, tier, xp, stars, year, image, credential_id, skills, description, sort_order) VALUES
      (
          'cert-1',
          'Full-Stack Web Development Bootcamp',
          'Dicoding Indonesia × Google',
          'Web Development',
          'Award',
          'blue',
          'PROFESSIONAL',
          '+800 XP',
          5,
          '2025',
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
          'DCD-FSW-2025-0891',
          '["React", "Node.js", "REST API", "Tailwind"]'::jsonb,
          'Sertifikasi kompetensi intensif pemrograman web full-stack berstandar industri dengan pengujian proyek nyata.',
          1
      ),
      (
          'cert-2',
          'AI & Data Science Technology Training',
          'Digital Talent Scholarship × Kominfo',
          'Artificial Intelligence',
          'Star',
          'pink',
          'SPECIALIST',
          '+850 XP',
          5,
          '2024',
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
          'DTS-AIML-2024-512',
          '["Python", "Machine Learning", "Linear Algebra", "NumPy"]'::jsonb,
          'Pelatihan nasional kecerdasan buatan, pemodelan data saintifik, dan dasar algoritma machine learning.',
          2
      ),
      (
          'cert-3',
          'Seminar Nasional Publikasi Ilmiah & Riset SDGs',
          'Sekolah Ilmiah Mahasiswa (SIM) UNS',
          'Seminar Nasional',
          'Bookmark',
          'cyan',
          'NATIONAL CERTIFIED',
          '+700 XP',
          5,
          '2025',
          'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1000&auto=format&fit=crop',
          'SIM-NATSEM-2025-104',
          '["Scientific Writing", "Research Methodology", "SDGs Innovation"]'::jsonb,
          'Seminar nasional penulisan karya tulis ilmiah, metodologi riset terapan, dan publikasi gagasan inovatif.',
          3
      ),
      (
          'cert-4',
          'UI/UX Design Masterclass & Prototyping Workshop',
          'Figma Community × ITS Surabaya',
          'Design & Prototyping',
          'Award',
          'pink',
          'CREATIVE MASTER',
          '+750 XP',
          5,
          '2024',
          'https://images.unsplash.com/photo-1581291518655-9523c932edcf?q=80&w=1000&auto=format&fit=crop',
          'FGM-UIUX-2024-772',
          '["Figma", "Wireframing", "Design Systems", "Micro-interactions"]'::jsonb,
          'Sertifikasi workshop perancangan antarmuka pengguna interaktif, design system modular, dan usability testing.',
          4
      ),
      (
          'cert-5',
          'Workshop Database Architecture & Cloud Deployment',
          'Alibaba Cloud & Dicoding',
          'Cloud & Database',
          'Trophy',
          'blue',
          'ENGINEER',
          '+800 XP',
          5,
          '2024',
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
          'ALB-CLD-2024-331',
          '["Cloud SQL", "Relational DB", "Serverless", "Vercel"]'::jsonb,
          'Sertifikasi arsitektur database relasional terdistribusi dan integrasi deployment web serverless.',
          5
      ),
      (
          'cert-6',
          'Leadership & Student Management Training (LKMM)',
          'BEM FATISDA Universitas Sebelas Maret',
          'Leadership & Management',
          'Medal',
          'pink',
          'LEADERSHIP',
          '+650 XP',
          4,
          '2025',
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop',
          'FATISDA-LKMM-2025-021',
          '["Leadership", "Organizational Management", "Public Speaking"]'::jsonb,
          'Pelatihan manajemen kepemimpinan mahasiswa tingkat madya dan tata kelola administrasi organisasi.',
          6
      );
    `);

    // 6. Seed Achievements
    await query('DELETE FROM achievements');
    await query(`
      INSERT INTO achievements (ach_id, title, host, category, icon, color, tier, xp, stars, year, image, description, sort_order) VALUES
      (
          'ach-1',
          'First Runner-Up National Essay Competition',
          'POSKO UNS (2025)',
          'Essay / Research',
          'Trophy',
          'pink',
          'LEGENDARY',
          '+850 XP',
          5,
          '2025',
          'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=1000&auto=format&fit=crop',
          'Awarded 1st Runner-Up for innovative academic essay research presented to national judges at POSKO UNS.',
          1
      ),
      (
          'ach-2',
          'Most Favorite Poster Design',
          'NIPRO – ITS (2024)',
          'Design & Visual',
          'Star',
          'blue',
          'EPIC',
          '+750 XP',
          5,
          '2024',
          'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop',
          'Voted Most Favorite Poster in national engineering exhibition organized by ITS Surabaya.',
          2
      ),
      (
          'ach-3',
          'Finalist National Young Inventors Award',
          'BRIN (2022)',
          'Innovation & Tech',
          'Award',
          'pink',
          'DIAMOND',
          '+900 XP',
          5,
          '2022',
          'https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=1000&auto=format&fit=crop',
          'Selected as national finalist in technology & invention research competition held by BRIN Indonesia.',
          3
      ),
      (
          'ach-4',
          '2nd Place Women''s Team Badminton',
          'UNS Badminton UKM (2025)',
          'Sport & Teamwork',
          'Medal',
          'cyan',
          'GOLD TIER',
          '+650 XP',
          4,
          '2025',
          'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop',
          'Achieved 2nd place in competitive university women team championship, showing leadership & agility.',
          4
      ),
      (
          'ach-5',
          'Finalist National Literacy LKTI',
          'BEM Polinema (2024)',
          'Scientific Writing',
          'Bookmark',
          'pink',
          'SPECIAL',
          '+700 XP',
          4,
          '2024',
          'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop',
          'Top finalist in national scientific paper competition addressing sustainable technology & education.',
          5
      ),
      (
          'ach-6',
          '2nd Place PCPDA Women''s Team Badminton',
          'Kudus Regency (2022)',
          'Sport Tournament',
          'Medal',
          'pink',
          'GOLD TIER',
          '+600 XP',
          4,
          '2022',
          'https://images.unsplash.com/photo-1511067007772-9da289417f32?q=80&w=1000&auto=format&fit=crop',
          'Secured 2nd place representing school team in regional regency championship tournament.',
          6
      );
    `);

    // 7. Seed Media Uploads Library
    await query('DELETE FROM uploaded_images');
    await query(`
      INSERT INTO uploaded_images (name, url, category, caption) VALUES
      ('Foto Profil Nia Resmi', '/assets/projects/FotoNia.jpg', 'profile', 'Foto profil Nia untuk landing page hero'),
      ('Sertifikat Dicoding Full-Stack', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop', 'certificate', 'Sertifikat kelulusan fullstack bootcamp Dicoding Indonesia'),
      ('Sertifikat Kominfo AI DTS', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop', 'certificate', 'Sertifikasi Digital Talent Scholarship Kominfo tema Artificial Intelligence'),
      ('Piala Juara Lomba Esai POSKO UNS', 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=1000&auto=format&fit=crop', 'achievement', 'Trophy penghargaan 1st Runner-Up Lomba Esai Nasional'),
      ('Cover Projek ChickRoute', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop', 'project', 'Cover preview projek algoritma graf pengantaran'),
      ('Cover Projek CoinTrash', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop', 'project', 'Cover preview projek web revitalisasi bank sampah');
    `);

    // 8. Seed experiences
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

    // 9. Seed skills
    await query('DELETE FROM skills');
    await query(`
      INSERT INTO skills (category, name, icons, sort_order) VALUES
      ('development', 'HTML, CSS, JS', 'html,css,js', 1),
      ('development', 'React & Vite', 'react,vite', 2),
      ('development', 'PHP & Laravel', 'php,laravel', 3),
      ('development', 'Python & Machine Learning', 'python', 4),
      ('development', 'Figma & UI/UX', 'figma', 5),
      ('development', 'Git & GitHub', 'git,github', 6),
      ('development', 'MySQL Database', 'mysql', 7),

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
      message: 'Database tables created and seeded successfully with full certificate, achievement, project images, and media library!',
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
