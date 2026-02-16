"use client"

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useProfile } from '@/lib/hooks/useProfile'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Upload, X, FileText, Image as ImageIcon, Check } from 'lucide-react'
import styles from './profile.module.css'

export default function ProfilePage() {
  const { user } = useAuth()
  const { profile, loading, saving, updateProfile, uploadProfileImage, uploadCV } = useProfile(user?.id)

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    tagline: '',
    bio: '',
    contact_email: '',
    languages: [],
  })
  const [languageInput, setLanguageInput] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingCV, setUploadingCV] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)

  const imageInputRef = useRef(null)
  const cvInputRef = useRef(null)
  // Sync profile to form data on load
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        tagline: profile.tagline || '',
        bio: profile.bio || '',
        contact_email: profile.contact_email || '',
        languages: profile.languages || [],
      })
    }
  }, [profile])
  // Magic Import Function
  const handleMagicImport = async () => {
    if (!profile?.cv_url) {
      alert('Please upload a CV first')
      return
    }

    if (!confirm('Magic Import will automatically fill your profile, experiences, skills, and education based on your CV. This will append new entries. Continue?')) {
      return
    }

    setMagicLoading(true)
    try {
      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvUrl: profile.cv_url })
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to parse CV')
      }

      const data = result.data
      const supabase = createClient()

      // 1. Update Profile info
      const profileUpdates = {
        name: data.name || formData.name,
        title: data.title || formData.title,
        tagline: data.tagline || formData.tagline,
        bio: data.bio || formData.bio,
        contact_email: data.contact_email || formData.contact_email,
        languages: data.languages || formData.languages,
      }

      console.log('Updating profile...', profileUpdates);
      const { error: profileError } = await updateProfile(profileUpdates)
      if (profileError) {
        console.error('Profile update failed:', profileError);
        throw new Error('Failed to update profile: ' + profileError.message);
      }
      setFormData(prev => ({ ...prev, ...profileUpdates }))

      // 2. Add Experiences
      if (data.experiences?.length > 0) {
        console.log('Saving experiences...', data.experiences);
        const experiencesToInsert = data.experiences.map((exp, index) => ({
          user_id: user.id,
          title: exp.title,
          location: exp.location,
          date_range: exp.date_range,
          description: exp.description,
          bullet_points: exp.bullet_points || [],
          display_order: index
        }))
        const { error: expError } = await supabase.from('experiences').upsert(experiencesToInsert)
        if (expError) throw new Error('Failed to save experiences: ' + expError.message);
      }

      // 3. Add Education
      if (data.education?.length > 0) {
        console.log('Saving education...', data.education);
        const educationToInsert = data.education.map((edu, index) => ({
          user_id: user.id,
          degree: edu.degree,
          institution: edu.institution,
          year_range: edu.year_range,
          specialization: edu.specialization,
          display_order: index
        }))
        const { error: eduError } = await supabase.from('education').upsert(educationToInsert)
        if (eduError) throw new Error('Failed to save education: ' + eduError.message);
      }

      // 4. Add Skills
      if (data.skills?.length > 0) {
        console.log('Saving skills...', data.skills);
        const skillsToInsert = data.skills.map((skill, index) => ({
          user_id: user.id,
          name: skill.name,
          category: skill.category || 'technical',
          level: skill.level || 80,
          display_order: index
        }))
        const { error: skillError } = await supabase.from('skills').upsert(skillsToInsert)
        if (skillError) throw new Error('Failed to save skills: ' + skillError.message);
      }

      setSuccess(true)
      alert('Magic Import successful! Your profile has been updated.')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Magic Import Error:', err)
      alert(`Error: ${err.message}`)
    } finally {
      setMagicLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setSuccess(false)
  }

  const handleAddLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()]
      }))
      setLanguageInput('')
    }
  }

  const handleRemoveLanguage = (lang) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== lang)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await updateProfile(formData)
    if (!error) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    setUploadingImage(true)
    const { url, error } = await uploadProfileImage(file)

    if (!error && url) {
      await updateProfile({ profile_image_url: url })
    } else {
      alert('Failed to upload image')
    }
    setUploadingImage(false)
  }

  const handleCVUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type (PDF or Word)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be less than 10MB')
      return
    }

    setUploadingCV(true)
    const { url, error } = await uploadCV(file)

    if (!error && url) {
      await updateProfile({ cv_url: url })
    } else {
      alert('Failed to upload CV')
    }
    setUploadingCV(false)
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.header}>
        <h1>Edit Profile</h1>
        <p>Update your personal information and media</p>
      </div>

      <div className={styles.content}>
        {/* Left Column - Media */}
        <div className={styles.mediaSection}>
          {/* Profile Image */}
          <div className={styles.mediaCard}>
            <h3>Profile Photo</h3>
            <div className={styles.imageUpload}>
              <div className={styles.imagePreview}>
                {profile?.profile_image_url ? (
                  <img src={profile.profile_image_url} alt="Profile" />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <Button
                variant="secondary"
                size="small"
                onClick={() => imageInputRef.current?.click()}
                loading={uploadingImage}
              >
                <Upload size={16} />
                Upload Photo
              </Button>
              <p className={styles.hint}>Recommended: 400×500px, max 5MB</p>
            </div>
          </div>

          {/* CV Upload */}
          <div className={styles.mediaCard}>
            <h3>Resume / CV</h3>
            <div className={styles.cvUpload}>
              {profile?.cv_url ? (
                <div className={styles.cvPreview}>
                  <FileText size={24} />
                  <span>CV uploaded</span>
                  <a href={profile.cv_url} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </div>
              ) : (
                <p className={styles.noCv}>No CV uploaded yet</p>
              )}
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCVUpload}
                style={{ display: 'none' }}
              />
              <Button
                variant="secondary"
                size="small"
                onClick={() => cvInputRef.current?.click()}
                loading={uploadingCV}
              >
                <Upload size={16} />
                {profile?.cv_url ? 'Replace CV' : 'Upload CV'}
              </Button>
              {profile?.cv_url && (
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleMagicImport}
                  loading={magicLoading}
                  style={{ marginTop: '0.5rem', width: '100%', background: 'linear-gradient(135deg, #6e8efb, #a777e3)' }}
                >
                  ✨ Magic Import
                </Button>
              )}
              <p className={styles.hint}>PDF or Word, max 10MB</p>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <form onSubmit={handleSubmit} className={styles.formSection}>
          {success && (
            <div className={styles.successMessage}>
              <Check size={18} />
              Profile updated successfully!
            </div>
          )}

          <div className={styles.formGrid}>
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
            <Input
              label="Professional Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Product Designer"
            />
          </div>

          <Input
            label="Tagline"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            placeholder="A short catchy tagline for your hero section"
          />

          <div className={styles.textareaGroup}>
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell visitors about yourself..."
              rows={4}
            />
          </div>

          <Input
            label="Contact Email"
            name="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={handleChange}
            placeholder="hello@example.com"
          />

          {/* Languages */}
          <div className={styles.languagesSection}>
            <label>Languages</label>
            <div className={styles.languageInput}>
              <Input
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                placeholder="e.g. English (Fluent)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddLanguage()
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={handleAddLanguage}>
                Add
              </Button>
            </div>
            {formData.languages.length > 0 && (
              <div className={styles.languageTags}>
                {formData.languages.map((lang) => (
                  <span key={lang} className={styles.languageTag}>
                    {lang}
                    <button type="button" onClick={() => handleRemoveLanguage(lang)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <Button type="submit" loading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
