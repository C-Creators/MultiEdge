-- Supabase Database Schema for Duplifinance Admin
-- Run this in your Supabase SQL Editor to set up the required tables

-- ============================================
-- 1. SITE CONTENT TABLE
-- Stores all translatable text content
-- ============================================
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section VARCHAR(100) NOT NULL,
  key VARCHAR(255) NOT NULL,
  en TEXT NOT NULL DEFAULT '',
  es TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint on section + key
  UNIQUE(section, key)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);
CREATE INDEX IF NOT EXISTS idx_site_content_updated ON site_content(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read/write
CREATE POLICY "Allow authenticated read" ON site_content
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert" ON site_content
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON site_content
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON site_content
  FOR DELETE TO authenticated USING (true);

-- ============================================
-- 2. SITE IMAGES TABLE (metadata)
-- Optional: stores image metadata
-- ============================================
CREATE TABLE IF NOT EXISTS site_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  url TEXT NOT NULL,
  alt_text VARCHAR(500),
  section VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage images
CREATE POLICY "Allow authenticated read" ON site_images
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert" ON site_images
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON site_images
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON site_images
  FOR DELETE TO authenticated USING (true);

-- ============================================
-- 3. SITE ANALYTICS TABLE (optional)
-- For custom analytics tracking
-- ============================================
CREATE TABLE IF NOT EXISTS site_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  visitors INTEGER DEFAULT 0,
  pageviews INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2),
  avg_duration INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(date)
);

CREATE INDEX IF NOT EXISTS idx_site_analytics_date ON site_analytics(date DESC);

-- Enable Row Level Security
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read" ON site_analytics
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow service role insert" ON site_analytics
  FOR INSERT TO service_role WITH CHECK (true);

-- ============================================
-- 4. STORAGE BUCKET
-- Run this in Storage settings or via SQL
-- ============================================
-- Note: You'll need to create the storage bucket manually in Supabase Dashboard
-- Go to Storage > Create new bucket > Name: "site-images" > Public: true

-- ============================================
-- 5. CREATE ADMIN USER
-- Replace with your email
-- ============================================
-- Use the Supabase Auth UI or this SQL (in the Dashboard):
-- 
-- INSERT INTO auth.users (
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   raw_app_meta_data,
--   raw_user_meta_data
-- ) VALUES (
--   'admin@duplifinance.com',
--   crypt('your-secure-password', gen_salt('bf')),
--   NOW(),
--   '{"provider":"email","providers":["email"]}',
--   '{"name":"Admin"}'
-- );
--
-- Or simply use the Authentication tab in Supabase Dashboard to create a user.
