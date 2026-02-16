-- =====================================================
-- THEME & BACKGROUND CUSTOMIZATION MIGRATION
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add section_settings to profiles to store per-section customization
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS section_settings JSONB DEFAULT '{}'::jsonb;

-- Add comment to explain usage
COMMENT ON COLUMN public.profiles.section_settings IS 'Stores per-section styles like background type, colors, images';

-- =====================================================
-- DONE! Section settings column added.
-- =====================================================
