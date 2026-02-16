-- Create portfolio_blocks table
CREATE TABLE IF NOT EXISTS portfolio_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    block_type TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    config JSONB DEFAULT '{}',
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_blocks_user_order ON portfolio_blocks(user_id, display_order);

-- Add has_blocks flag to profiles for hybrid migration
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_blocks BOOLEAN DEFAULT false;

-- Enable RLS
ALTER TABLE portfolio_blocks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see all blocks (public read)
CREATE POLICY "Public read blocks" ON portfolio_blocks
    FOR SELECT USING (true);

-- Policy: Users can manage their own blocks
CREATE POLICY "Users manage own blocks" ON portfolio_blocks
    FOR ALL USING (auth.uid() = user_id);

-- Policy: Tiered block limits (Free: 10, Pro: 30, Pro+: 50)
CREATE POLICY "Block count limit" ON portfolio_blocks
    FOR INSERT WITH CHECK (
        (SELECT count(*) FROM portfolio_blocks pb WHERE pb.user_id = auth.uid()) <
        CASE (SELECT COALESCE(plan, 'free') FROM profiles WHERE user_id = auth.uid())
            WHEN 'pro_plus' THEN 50
            WHEN 'pro' THEN 30
            ELSE 10
        END
    );
