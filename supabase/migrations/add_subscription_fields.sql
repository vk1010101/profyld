-- Add subscription and payment fields to profiles table

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS subscription_expiry TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_provider TEXT, -- 'razorpay', 'stripe'
ADD COLUMN IF NOT EXISTS payment_subscription_id TEXT, -- ID from provider
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Add check constraint for valid tiers
ALTER TABLE public.profiles 
ADD CONSTRAINT check_subscription_tier 
CHECK (subscription_tier IN ('free', 'basic', 'pro'));

-- Comment on columns
COMMENT ON COLUMN public.profiles.subscription_tier IS 'Current tier: free, basic (200rs), or pro (1000rs)';
COMMENT ON COLUMN public.profiles.is_published IS 'Whether the public portfolio URL is accessible';
