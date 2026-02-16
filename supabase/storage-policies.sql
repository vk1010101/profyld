-- =====================================================
-- STORAGE POLICIES FOR ALL BUCKETS
-- =====================================================
-- Run this AFTER creating the buckets via UI
-- Supabase Dashboard > SQL Editor > New Query > Paste > Run
-- =====================================================

-- =====================================================
-- AVATARS BUCKET POLICIES
-- =====================================================

-- Public can view all avatars
CREATE POLICY "Public read access for avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Authenticated users can upload avatars
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Users can update their own avatars
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own avatars
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- PORTFOLIO BUCKET POLICIES (projects, artwork, logos)
-- =====================================================

-- Public can view all portfolio images
CREATE POLICY "Public read access for portfolio"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

-- Authenticated users can upload portfolio images
CREATE POLICY "Authenticated users can upload portfolio"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

-- Users can update their own portfolio images
CREATE POLICY "Users can update own portfolio"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own portfolio images
CREATE POLICY "Users can delete own portfolio"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- DOCUMENTS BUCKET POLICIES (CVs, resumes)
-- =====================================================

-- Public can view all documents (CVs are meant to be downloadable)
CREATE POLICY "Public read access for documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

-- Authenticated users can upload documents
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Users can update their own documents
CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- DONE! Storage is now configured.
-- =====================================================
