// Server-side data fetching utilities
// This file does NOT have 'use client' so it can be used in Server Components

/**
 * Fetch profile by username (for public pages - Server Components)
 */
export async function getProfileByUsername(supabase, username) {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username.toLowerCase())
        .single();

    if (error || !profile) {
        return null;
    }

    // Fetch related data
    const [
        { data: experiences },
        { data: skills },
        { data: education },
        { data: interests },
        { data: socialLinks },
        { data: projects },
        { data: artwork },
        { data: logos },
    ] = await Promise.all([
        supabase.from('experiences').select('*').eq('user_id', profile.user_id).order('display_order'),
        supabase.from('skills').select('*').eq('user_id', profile.user_id).order('display_order'),
        supabase.from('education').select('*').eq('user_id', profile.user_id).order('display_order'),
        supabase.from('interests').select('*').eq('user_id', profile.user_id).order('display_order'),
        supabase.from('social_links').select('*').eq('user_id', profile.user_id).order('display_order'),
        supabase.from('projects').select('*, project_images(*)').eq('user_id', profile.user_id).order('display_order'),
        supabase.from('artwork').select('*').eq('user_id', profile.user_id).order('display_order'),
        supabase.from('logos').select('*').eq('user_id', profile.user_id).order('display_order'),
    ]);

    return {
        profile,
        experiences: experiences || [],
        skills: skills || [],
        education: education || [],
        interests: interests || [],
        socialLinks: socialLinks || [],
        projects: projects || [],
        artwork: artwork || [],
        logos: logos || [],
    };
}

/**
 * Update user profile
 * This abstraction allows us to eventually swap Supabase for Drizzle/SQL 
 * without changing component logic.
 */
export async function updateProfileData(supabase, userId, updates) {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

    return { data, error };
}

/**
 * Update related data (experiences, skills, etc.)
 */
export async function upsertProfileSection(supabase, table, userId, data) {
    const { data: result, error } = await supabase
        .from(table)
        .upsert({ ...data, user_id: userId })
        .select()
        .single();

    return { data: result, error };
}

