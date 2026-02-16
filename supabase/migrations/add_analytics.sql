-- Analytics Migration for Portfolio Dashboard
-- Adds page_views, cta_events, and download_codes tables

-- Page views tracking
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  visitor_hash TEXT,  -- Anonymized visitor fingerprint (hashed IP + UA)
  page_path TEXT,
  referrer TEXT,
  referrer_domain TEXT,  -- Extracted domain for grouping (e.g., 'linkedin.com')
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CTA Events (downloads, contact form, social clicks)
CREATE TABLE IF NOT EXISTS cta_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,  -- 'resume_download', 'contact_form', 'social_click'
  event_data JSONB,  -- { email, social_platform, etc. }
  visitor_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Download verification codes (for resume email verification)
CREATE TABLE IF NOT EXISTS download_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code TEXT NOT NULL,  -- 6-digit code
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast dashboard queries
CREATE INDEX IF NOT EXISTS idx_page_views_user_date ON page_views(portfolio_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_referrer ON page_views(portfolio_user_id, referrer_domain);
CREATE INDEX IF NOT EXISTS idx_cta_events_user_date ON cta_events(portfolio_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cta_events_type ON cta_events(portfolio_user_id, event_type);
CREATE INDEX IF NOT EXISTS idx_download_codes_lookup ON download_codes(email, code, portfolio_user_id);

-- RLS policies for page_views
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own page views" ON page_views
  FOR SELECT USING (portfolio_user_id = auth.uid());

CREATE POLICY "Anyone can insert page views" ON page_views
  FOR INSERT WITH CHECK (true);

-- RLS policies for cta_events
ALTER TABLE cta_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own CTA events" ON cta_events
  FOR SELECT USING (portfolio_user_id = auth.uid());

CREATE POLICY "Anyone can insert CTA events" ON cta_events
  FOR INSERT WITH CHECK (true);

-- RLS policies for download_codes
ALTER TABLE download_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own download codes" ON download_codes
  FOR SELECT USING (portfolio_user_id = auth.uid());

CREATE POLICY "Anyone can insert download codes" ON download_codes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update download codes" ON download_codes
  FOR UPDATE WITH CHECK (true);
