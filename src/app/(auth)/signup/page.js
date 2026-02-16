"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, X, Loader2, Upload, FileText, Sparkles } from 'lucide-react'
import Turnstile from '@/components/ui/Turnstile'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/lib/hooks/useAuth'
import { validateUsernameFormat, validateEmail, validatePassword } from '@/lib/utils/validation'
import { getClient } from '@/lib/supabase/client'
import { ROOT_DOMAIN } from '@/lib/constants'
import styles from '../auth.module.css'

export default function SignupPage() {
  const router = useRouter()
  const { signUp, loading: authLoading } = useAuth()
  const supabase = getClient()
  const cvInputRef = useRef(null)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [cvFile, setCvFile] = useState(null)
  const [cvProcessing, setCvProcessing] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState(null)

  // Username availability state
  const [usernameStatus, setUsernameStatus] = useState({
    checking: false,
    available: null,
    message: '',
  })

  // Debounced username check
  const checkUsernameAvailability = useCallback(async (username) => {
    if (!username || username.length < 3) {
      setUsernameStatus({ checking: false, available: null, message: '' })
      return
    }

    const validation = validateUsernameFormat(username)
    if (!validation.valid) {
      setUsernameStatus({ checking: false, available: false, message: validation.error })
      return
    }

    setUsernameStatus({ checking: true, available: null, message: 'Checking...' })

    try {
      const response = await fetch(`/api/username/check?username=${encodeURIComponent(username)}`)
      const data = await response.json()

      if (data.available) {
        setUsernameStatus({ checking: false, available: true, message: 'Username is available!' })
      } else {
        setUsernameStatus({ checking: false, available: false, message: data.error || 'Username is taken' })
      }
    } catch {
      setUsernameStatus({ checking: false, available: false, message: 'Error checking username' })
    }
  }, [])

  // Debounce username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username) {
        checkUsernameAvailability(formData.username)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [formData.username, checkUsernameAvailability])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    setFormError('')
  }

  const handleCvSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      setFormError('Please upload a PDF or Word document')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFormError('File must be less than 10MB')
      return
    }

    setCvFile(file)
    setFormError('')
  }

  const removeCv = () => {
    setCvFile(null)
    if (cvInputRef.current) {
      cvInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    // Validate all fields
    const newErrors = {}

    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.valid) newErrors.email = emailValidation.error

    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.valid) newErrors.password = passwordValidation.error

    const usernameValidation = validateUsernameFormat(formData.username)
    if (!usernameValidation.valid) newErrors.username = usernameValidation.error

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Check username availability one more time
    if (!usernameStatus.available) {
      setErrors({ username: 'Please choose an available username' })
      return
    }

    setLoading(true)

    try {
      // Step 1: Create the account
      const { data, error } = await signUp({
        email: formData.email,
        password: formData.password,
        username: formData.username,
      })

      if (error) {
        if (error.message.includes('already registered')) {
          setFormError('This email is already registered. Try logging in instead.')
        } else {
          setFormError(error.message || 'Failed to create account')
        }
        return
      }

      if (data?.user) {
        // Check if email confirmation is required
        if (data.user.identities?.length === 0) {
          setFormSuccess('Check your email to confirm your account!')
          return
        }

        // Step 2: If CV was uploaded, process it
        if (cvFile) {
          setCvProcessing(true)
          setFormSuccess('Account created! Processing your CV...')

          try {
            // Upload CV to storage
            const fileExt = cvFile.name.split('.').pop()
            const fileName = `${data.user.id}-cv.${fileExt}`

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('documents')
              .upload(fileName, cvFile, { upsert: true })

            if (uploadError) {
              console.error('CV upload error:', uploadError)
              // Continue anyway, just skip AI processing
              router.push('/dashboard')
              return
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('documents')
              .getPublicUrl(uploadData.path)

            // Update profile with CV URL
            await supabase
              .from('profiles')
              .update({ cv_url: publicUrl })
              .eq('user_id', data.user.id)

            // Parse CV with AI
            setFormSuccess('Extracting information from your CV...')

            const parseResponse = await fetch('/api/parse-cv', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cvUrl: publicUrl }),
            })

            if (parseResponse.ok) {
              const { data: extractedData } = await parseResponse.json()

              if (extractedData) {
                // Update profile with extracted data
                await supabase
                  .from('profiles')
                  .update({
                    name: extractedData.name || '',
                    title: extractedData.title || '',
                    tagline: extractedData.tagline || '',
                    bio: extractedData.bio || '',
                    contact_email: extractedData.contact_email || formData.email,
                    languages: extractedData.languages || [],
                  })
                  .eq('user_id', data.user.id)

                // Insert experiences
                if (extractedData.experiences?.length > 0) {
                  const experiences = extractedData.experiences.map((exp, index) => ({
                    user_id: data.user.id,
                    title: exp.title || '',
                    location: exp.location || '',
                    date_range: exp.date_range || '',
                    description: exp.description || '',
                    bullet_points: exp.bullet_points || [],
                    display_order: index,
                  }))
                  await supabase.from('experiences').insert(experiences)
                }

                // Insert education
                if (extractedData.education?.length > 0) {
                  const education = extractedData.education.map((edu, index) => ({
                    user_id: data.user.id,
                    degree: edu.degree || '',
                    institution: edu.institution || '',
                    year_range: edu.year_range || '',
                    specialization: edu.specialization || '',
                    is_primary: index === 0,
                    display_order: index,
                  }))
                  await supabase.from('education').insert(education)
                }

                // Insert skills
                if (extractedData.skills?.length > 0) {
                  const skills = extractedData.skills.map((skill, index) => ({
                    user_id: data.user.id,
                    name: skill.name || '',
                    category: skill.category || 'technical',
                    level: skill.level || 50,
                    display_order: index,
                  }))
                  await supabase.from('skills').insert(skills)
                }

                setFormSuccess('Profile created with your CV data! Redirecting...')
              }
            }
          } catch (cvError) {
            console.error('CV processing error:', cvError)
            // Continue anyway
          } finally {
            setCvProcessing(false)
          }
        }

        // Redirect to dashboard
        setTimeout(() => router.push('/dashboard'), 1000)
      }
    } catch (error) {
      setFormError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderUsernameStatus = () => {
    if (!formData.username || formData.username.length < 3) return null

    if (usernameStatus.checking) {
      return (
        <span className={`${styles.statusIcon} ${styles.checking}`}>
          <Loader2 size={14} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
        </span>
      )
    }

    if (usernameStatus.available === true) {
      return (
        <span className={`${styles.statusIcon} ${styles.available}`}>
          <Check size={14} />
        </span>
      )
    }

    if (usernameStatus.available === false) {
      return (
        <span className={`${styles.statusIcon} ${styles.unavailable}`}>
          <X size={14} />
        </span>
      )
    }

    return null
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'portfoliobuilder.com'
  const cleanAppUrl = appUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')

  const isProcessing = loading || authLoading || cvProcessing

  return (
    <div className={styles.authCard}>
      <div className={styles.authHeader}>
        <div className={styles.logo}>profyld.</div>
        <h1 className={styles.title}>Create Your Portfolio</h1>
        <p className={styles.subtitle}>Build your professional presence in minutes</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.authForm}>
        {formError && (
          <div className={styles.formError}>{formError}</div>
        )}

        {formSuccess && (
          <div className={styles.formSuccess}>{formSuccess}</div>
        )}

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          disabled={isProcessing}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="At least 8 characters"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
          disabled={isProcessing}
        />

        <Input
          label="Username"
          type="text"
          name="username"
          placeholder="yourname"
          value={formData.username}
          onChange={handleChange}
          error={errors.username || (usernameStatus.available === false ? usernameStatus.message : '')}
          success={usernameStatus.available === true ? usernameStatus.message : ''}
          suffix={renderUsernameStatus()}
          autoComplete="username"
          disabled={isProcessing}
        />

        {formData.username && formData.username.length >= 3 && usernameStatus.available && (
          <div className={styles.usernamePreview}>
            <p>🌐 Your portfolio will be live at:</p>
            <div className={styles.previewUrl}>
              <span>{formData.username.toLowerCase()}</span>.{ROOT_DOMAIN}
            </div>
          </div>
        )}

        {/* CV Upload Section */}
        <div className={styles.cvUploadSection}>
          <label className={styles.cvLabel}>
            <Sparkles size={16} />
            Upload your CV (Optional)
          </label>
          <p className={styles.cvHint}>
            We'll use AI to pre-fill your profile from your resume
          </p>

          <input
            ref={cvInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleCvSelect}
            style={{ display: 'none' }}
            disabled={isProcessing}
          />

          {cvFile ? (
            <div className={styles.cvSelected}>
              <FileText size={20} />
              <span className={styles.cvFileName}>{cvFile.name}</span>
              <button
                type="button"
                onClick={removeCv}
                className={styles.cvRemove}
                disabled={isProcessing}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => cvInputRef.current?.click()}
              className={styles.cvUploadBtn}
              disabled={isProcessing}
            >
              <Upload size={18} />
              Choose PDF or Word file
            </button>
          )}
        </div>

        {/* CAPTCHA - renders nothing if NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set */}
        <Turnstile onVerify={(token) => setTurnstileToken(token)} />

        <Button
          type="submit"
          fullWidth
          loading={isProcessing}
          disabled={!usernameStatus.available}
        >
          {cvProcessing ? 'Processing CV...' : 'Create My Portfolio'}
        </Button>
      </form>

      <div className={styles.authFooter}>
        Already have an account? <Link href="/login">Sign in</Link>
      </div>
    </div>
  )
}
