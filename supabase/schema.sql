-- Duplifinance Database Schema
-- Run this in Supabase Dashboard > SQL Editor > New Query

-- ============================================
-- SITE CONTENT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section VARCHAR(100) NOT NULL,
  key VARCHAR(255) NOT NULL,
  en TEXT NOT NULL DEFAULT '',
  es TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

CREATE INDEX IF NOT EXISTS idx_site_content_section ON public.site_content(section);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_content_select" ON public.site_content;
DROP POLICY IF EXISTS "site_content_insert" ON public.site_content;
DROP POLICY IF EXISTS "site_content_update" ON public.site_content;
DROP POLICY IF EXISTS "site_content_delete" ON public.site_content;

CREATE POLICY "site_content_select" ON public.site_content FOR SELECT TO authenticated USING (true);
CREATE POLICY "site_content_insert" ON public.site_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "site_content_update" ON public.site_content FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "site_content_delete" ON public.site_content FOR DELETE TO authenticated USING (true);

-- ============================================
-- SITE IMAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.site_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  url TEXT NOT NULL,
  alt_text VARCHAR(500),
  section VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_images_select" ON public.site_images;
DROP POLICY IF EXISTS "site_images_insert" ON public.site_images;
DROP POLICY IF EXISTS "site_images_update" ON public.site_images;
DROP POLICY IF EXISTS "site_images_delete" ON public.site_images;

CREATE POLICY "site_images_select" ON public.site_images FOR SELECT TO authenticated USING (true);
CREATE POLICY "site_images_insert" ON public.site_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "site_images_update" ON public.site_images FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "site_images_delete" ON public.site_images FOR DELETE TO authenticated USING (true);

-- ============================================
-- SITE ANALYTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.site_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  visitors INTEGER DEFAULT 0,
  pageviews INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2),
  avg_duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_analytics_date ON public.site_analytics(date DESC);

ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_analytics_select" ON public.site_analytics;
CREATE POLICY "site_analytics_select" ON public.site_analytics FOR SELECT TO authenticated USING (true);

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
