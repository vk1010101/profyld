-- Add onboarding_completed flag to profiles table
-- This replaces the localStorage-based approach so the flag persists across devices
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
