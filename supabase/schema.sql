-- =====================================================
-- PORTFOLIO SAAS - COMPLETE DATABASE SCHEMA
-- =====================================================
-- Run this ENTIRE script in Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste > Run
-- =====================================================
-- NOTE: Storage buckets must be created via Supabase UI
-- Go to Storage > New Bucket > Create: avatars, portfolio, documents
-- =====================================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (main user data)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username VARCHAR(20) UNIQUE NOT NULL,
  
  -- Personal info
  name VARCHAR(100) DEFAULT '',
  title VARCHAR(100) DEFAULT '',
  tagline VARCHAR(200) DEFAULT '',
  bio TEXT DEFAULT '',
  contact_email VARCHAR(100) DEFAULT '',
  profile_image_url TEXT DEFAULT '',
  cv_url TEXT DEFAULT '',
  languages JSONB DEFAULT '[]'::jsonb,
  
  -- Theme settings
  theme JSONB DEFAULT '{
    "primary": "#8B7355",
    "background": "#0A0A0A",
    "surface": "#1A1A1A",
    "textPrimary": "#FFFFFF",
    "textSecondary": "#A0A0A0",
    "headingFont": "Cormorant Garamond",
    "bodyFont": "Montserrat"
  }'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SOCIAL LINKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform VARCHAR(20) NOT NULL,
  url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EXPERIENCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date_range VARCHAR(50) DEFAULT '',
  title VARCHAR(100) DEFAULT '',
  location VARCHAR(100) DEFAULT '',
  description TEXT DEFAULT '',
  bullet_points JSONB DEFAULT '[]'::jsonb,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SKILLS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category VARCHAR(20) NOT NULL,
  name VARCHAR(50) NOT NULL,
  level INT DEFAULT 0,
  description TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EDUCATION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  year_range VARCHAR(20) DEFAULT '',
  degree VARCHAR(100) DEFAULT '',
  institution VARCHAR(100) DEFAULT '',
  specialization VARCHAR(200) DEFAULT '',
  is_primary BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INTERESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(50) NOT NULL,
  category VARCHAR(20) DEFAULT 'interest',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(100) NOT NULL,
  slug VARCHAR(100) DEFAULT '',
  cover_image_url TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROJECT IMAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ARTWORK TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.artwork (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  title VARCHAR(100) DEFAULT '',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- LOGOS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.logos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  title VARCHAR(100) DEFAULT '',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_social_links_user_id ON public.social_links(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON public.experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON public.skills(user_id);
CREATE INDEX IF NOT EXISTS idx_education_user_id ON public.education(user_id);
CREATE INDEX IF NOT EXISTS idx_interests_user_id ON public.interests(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_artwork_user_id ON public.artwork(user_id);
CREATE INDEX IF NOT EXISTS idx_logos_user_id ON public.logos(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artwork ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logos ENABLE ROW LEVEL SECURITY;

-- PROFILES: Public read, owner write
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- SOCIAL LINKS: Public read, owner write
CREATE POLICY "Social links are viewable by everyone" ON public.social_links
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own social links" ON public.social_links
  FOR ALL USING (auth.uid() = user_id);

-- EXPERIENCES: Public read, owner write
CREATE POLICY "Experiences are viewable by everyone" ON public.experiences
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own experiences" ON public.experiences
  FOR ALL USING (auth.uid() = user_id);

-- SKILLS: Public read, owner write
CREATE POLICY "Skills are viewable by everyone" ON public.skills
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own skills" ON public.skills
  FOR ALL USING (auth.uid() = user_id);

-- EDUCATION: Public read, owner write
CREATE POLICY "Education is viewable by everyone" ON public.education
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own education" ON public.education
  FOR ALL USING (auth.uid() = user_id);

-- INTERESTS: Public read, owner write
CREATE POLICY "Interests are viewable by everyone" ON public.interests
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own interests" ON public.interests
  FOR ALL USING (auth.uid() = user_id);

-- PROJECTS: Public read, owner write
CREATE POLICY "Projects are viewable by everyone" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own projects" ON public.projects
  FOR ALL USING (auth.uid() = user_id);

-- PROJECT IMAGES: Public read, owner write (via project ownership)
CREATE POLICY "Project images are viewable by everyone" ON public.project_images
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own project images" ON public.project_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_images.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- ARTWORK: Public read, owner write
CREATE POLICY "Artwork is viewable by everyone" ON public.artwork
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own artwork" ON public.artwork
  FOR ALL USING (auth.uid() = user_id);

-- LOGOS: Public read, owner write
CREATE POLICY "Logos are viewable by everyone" ON public.logos
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own logos" ON public.logos
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTION: Auto-update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- DONE! Now create storage buckets via Supabase UI:
-- 1. Go to Storage in sidebar
-- 2. Click "New Bucket"
-- 3. Create these buckets (all PUBLIC):
--    - avatars
--    - portfolio  
--    - documents
-- =====================================================
