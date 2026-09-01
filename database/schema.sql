-- Database Schema for Portfolio
-- Supports: Vercel Postgres, Neon, Supabase, Railway, Local Postgres

-- 1. Profile Info
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

-- 2. Projects (With direct image and gallery support)
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
    image TEXT,                                -- Main cover image (URL or data URI)
    images JSONB DEFAULT '[]'::jsonb,          -- Multi-image gallery URLs
    featured BOOLEAN DEFAULT false,
    gradient VARCHAR(100) DEFAULT 'from-blue-900/60 to-slate-900',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Experiences
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

-- 4. Certifications (Sertifikat Kompetensi & Bootcamp)
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
    image TEXT,                                -- Certificate image URL or uploaded base64 data
    credential_id VARCHAR(100),
    skills JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Achievements (Prestasi & Penghargaan Lomba)
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
    image TEXT,                                -- Trophy/Certificate image URL or uploaded base64 data
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Uploaded Media / Images Library
CREATE TABLE IF NOT EXISTS uploaded_images (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,                         -- Image URL or base64 data URI
    category VARCHAR(100) DEFAULT 'general',   -- 'certificate', 'project', 'achievement', 'profile', 'story', 'general'
    file_size INT,                             -- Size in bytes
    mime_type VARCHAR(100),                    -- 'image/jpeg', 'image/png', 'image/webp'
    caption TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Skills & Tech Stack
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- 'development', 'research', 'softSkills'
    name VARCHAR(100) NOT NULL,
    icons VARCHAR(100),            -- Icon slug / Lucide icon name
    sort_order INT DEFAULT 0
);

-- 8. About Skills Tags
CREATE TABLE IF NOT EXISTS about_skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sort_order INT DEFAULT 0
);

-- 9. Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
