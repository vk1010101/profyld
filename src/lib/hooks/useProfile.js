'use client';

import { useState, useEffect, useCallback } from 'react';
import { getClient } from '../supabase/client';
import { uploadProfileImage, uploadCV } from '../storage';
import { updateProfileData } from '../data/profile';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Ensure supabase client is stable across renders
  const [supabase] = useState(() => getClient());

  // Fetch current user's profile
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return null;
    }

    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setProfile(data);
    }

    setLoading(false);
    return data;
  }, [supabase]);

  // Update profile
  const updateProfile = async (updates) => {
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error: updateError } = await updateProfileData(supabase, user.id, updates);

    if (updateError) {
      setError(updateError.message);
      return { data: null, error: updateError };
    }

    setProfile(data);
    return { data, error: null };
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Wrapper helpers that use the centralized storage utility
  const uploadProfileImageWrapper = async (file) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { url: null, error: 'Not authenticated' };
    return await uploadProfileImage(file, user.id);
  };

  const uploadCVWrapper = async (file) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { url: null, error: 'Not authenticated' };
    return await uploadCV(file, user.id);
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadProfileImage: uploadProfileImageWrapper,
    uploadCV: uploadCVWrapper,
  };
}

// Fetch profile by username (for public pages)
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
