-- Database Schema for Portfolio
-- Supports: Vercel Postgres, Neon, Supabase, Railway, etc.

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
    category VARCHAR(50) NOT NULL, -- 'development', 'research', 'softSkills'
    name VARCHAR(100) NOT NULL,
    icons VARCHAR(100),            -- Icon slug / Lucide icon name
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
