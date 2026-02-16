-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    username VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) DEFAULT '',
    title VARCHAR(100) DEFAULT '',
    tagline VARCHAR(200) DEFAULT '',
    bio TEXT DEFAULT '',
    contact_email VARCHAR(100) DEFAULT '',
    profile_image_url TEXT DEFAULT '',
    cv_url TEXT DEFAULT '',
    languages JSONB DEFAULT '[]'::jsonb,
    theme JSONB DEFAULT '{"primary": "#8B7355", "background": "#0A0A0A", "surface": "#1A1A1A", "textPrimary": "#FFFFFF", "textSecondary": "#A0A0A0", "headingFont": "Cormorant Garamond", "bodyFont": "Montserrat"}'::jsonb,
    custom_domain VARCHAR(100) UNIQUE,
    custom_domain_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL,
    url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    date_range VARCHAR(50) DEFAULT '',
    title VARCHAR(100) DEFAULT '',
    location VARCHAR(100) DEFAULT '',
    description TEXT DEFAULT '',
    bullet_points JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    category VARCHAR(20) NOT NULL,
    name VARCHAR(50) NOT NULL,
    level INTEGER DEFAULT 0,
    description TEXT DEFAULT '',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    year_range VARCHAR(20) DEFAULT '',
    degree VARCHAR(100) DEFAULT '',
    institution VARCHAR(100) DEFAULT '',
    specialization VARCHAR(200) DEFAULT '',
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    slug VARCHAR(100) DEFAULT '',
    cover_image_url TEXT DEFAULT '',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. PROJECT IMAGES TABLE
CREATE TABLE IF NOT EXISTS project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. ARTWORK TABLE
CREATE TABLE IF NOT EXISTS artwork (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    title VARCHAR(100) DEFAULT '',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. LOGOS TABLE
CREATE TABLE IF NOT EXISTS logos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    title VARCHAR(100) DEFAULT '',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 10. INTERESTS TABLE (Was missing from original schema but used in app)
CREATE TABLE IF NOT EXISTS interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(20) DEFAULT 'interest', -- 'interest' or 'volunteering'
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11. Enable RLS (Row Level Security) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork ENABLE ROW LEVEL SECURITY;
ALTER TABLE logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;

-- 12. Create RLS Policies (Allow access to own data only for write, public read for profiles)

-- Profiles: Public Read, Owner Write
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Generic Policy Generator for other tables (Owner Read/Write)
-- Note: In a real portfolio, these should likely be public read too
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Owner write experiences" ON experiences FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public read education" ON education FOR SELECT USING (true);
CREATE POLICY "Owner write education" ON education FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Owner write skills" ON skills FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Owner write projects" ON projects FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public read artwork" ON artwork FOR SELECT USING (true);
CREATE POLICY "Owner write artwork" ON artwork FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public read logos" ON logos FOR SELECT USING (true);
CREATE POLICY "Owner write logos" ON logos FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public read interests" ON interests FOR SELECT USING (true);
CREATE POLICY "Owner write interests" ON interests FOR ALL USING (auth.uid() = user_id);

-- Storage bucket policies (Optional, if using storage)
-- insert into storage.buckets (id, name) values ('portfolio', 'portfolio');
