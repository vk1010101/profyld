import { getClient } from './supabase/client';

/**
 * Generic file upload utility that can be easily swapped for S3/Google Cloud
 */
export async function uploadFile(bucket, file, path, options = {}) {
    const supabase = getClient();

    const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            upsert: true,
            ...options
        });

    if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return { url: null, error: uploadError.message };
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

    return { url: publicUrl, error: null };
}

/**
 * Handle Profile Image Uploads (Avatars)
 */
export async function uploadProfileImage(file, userId) {
    if (!userId) return { url: null, error: 'User ID is required' };

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;

    return await uploadFile('avatars', file, fileName);
}

/**
 * Handle CV/Document Uploads
 */
export async function uploadCV(file, userId) {
    if (!userId) return { url: null, error: 'User ID is required' };

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-cv.${fileExt}`;

    return await uploadFile('documents', file, fileName);
}

/**
 * Handle Project/Portfolio Images
 */
export async function uploadProjectImage(file, userId, projectId) {
    if (!userId) return { url: null, error: 'User ID is required' };

    const fileExt = file.name.split('.').pop();
    const fileName = `projects/${userId}/${projectId || 'new'}-${Date.now()}.${fileExt}`;

    return await uploadFile('portfolio', file, fileName);
}

/**
 * Utility to delete files (important for being move-ready)
 */
export async function deleteFile(bucket, path) {
    const supabase = getClient();
    const { error } = await supabase.storage.from(bucket).remove([path]);
    return { error };
}
