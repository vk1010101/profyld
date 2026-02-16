-- =====================================================
-- CUSTOM DOMAIN SUPPORT MIGRATION
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add custom domain columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS custom_domain VARCHAR(100) UNIQUE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS custom_domain_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS domain_verification_token VARCHAR(64) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS plan VARCHAR(20) DEFAULT 'free';

-- Index for fast domain lookups
CREATE INDEX IF NOT EXISTS idx_profiles_custom_domain 
ON public.profiles(custom_domain) 
WHERE custom_domain IS NOT NULL;

-- Index for plan-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles(plan);

-- =====================================================
-- DONE! Custom domain columns added.
-- =====================================================
