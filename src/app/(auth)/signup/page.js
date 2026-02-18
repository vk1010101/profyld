"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, X, Loader2, Upload, FileText, Sparkles, Palette, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { themes } from '@/lib/themes'
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

  // Interactive Onboarding State
  const [step, setStep] = useState('signup') // 'signup' | 'design' | 'finishing'
  const [selectedThemeId, setSelectedThemeId] = useState('modern')
  const [backgroundTaskStatus, setBackgroundTaskStatus] = useState('idle')
  const [userId, setUserId] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

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
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      setFormError('Please upload a PDF or Word document')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setFormError('File must be less than 10MB')
      return
    }
    setCvFile(file)
    setFormError('')
  }

  const removeCv = () => {
    setCvFile(null)
    if (cvInputRef.current) cvInputRef.current.value = ''
  }

  const startBackgroundProcessing = async (user, cvFileToProcess) => {
    setBackgroundTaskStatus('processing')
    try {
      if (!cvFileToProcess) {
        setBackgroundTaskStatus('complete')
        return
      }
      const fileExt = cvFileToProcess.name.split('.').pop()
      const fileName = `${user.id}-cv.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, cvFileToProcess, { upsert: true })
      if (uploadError) {
        console.error('CV upload error:', uploadError)
        setBackgroundTaskStatus('complete')
        return
      }
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(uploadData.path)
      await supabase.from('profiles').update({ cv_url: publicUrl }).eq('user_id', user.id)
      const parseResponse = await fetch('/api/parse-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvUrl: publicUrl }),
      })
      if (parseResponse.ok) {
        const { data: extractedData } = await parseResponse.json()
        if (extractedData) {
          await supabase.from('profiles').update({
            name: extractedData.name || '',
            title: extractedData.title || '',
            tagline: extractedData.tagline || '',
            bio: extractedData.bio || '',
            contact_email: extractedData.contact_email || formData.email,
            languages: extractedData.languages || [],
          }).eq('user_id', user.id)
          if (extractedData.experiences?.length > 0) {
            const experiences = extractedData.experiences.map((exp, index) => ({
              user_id: user.id, title: exp.title || '', location: exp.location || '',
              date_range: exp.date_range || '', description: exp.description || '',
              bullet_points: exp.bullet_points || [], display_order: index,
            }))
            await supabase.from('experiences').insert(experiences)
          }
          if (extractedData.education?.length > 0) {
            const education = extractedData.education.map((edu, index) => ({
              user_id: user.id, degree: edu.degree || '', institution: edu.institution || '',
              year_range: edu.year_range || '', specialization: edu.specialization || '',
              is_primary: index === 0, display_order: index,
            }))
            await supabase.from('education').insert(education)
          }
          if (extractedData.skills?.length > 0) {
            const skills = extractedData.skills.map((skill, index) => ({
              user_id: user.id, name: skill.name || '', category: skill.category || 'technical',
              level: skill.level || 50, display_order: index,
            }))
            await supabase.from('skills').insert(skills)
          }
        }
      }
      setBackgroundTaskStatus('complete')
    } catch (error) {
      console.error('Background processing error:', error)
      setBackgroundTaskStatus('error')
    }
  }

  const handleThemeSelect = async (themeId) => {
    setSelectedThemeId(themeId)
    if (userId && themes[themeId]) {
      const selected = themes[themeId];
      const themeToSave = {
        id: themeId, name: selected.name,
        primary: selected.colors.primary, background: selected.colors.background,
        surface: selected.colors.accent || '#ffffff', textPrimary: selected.colors.text,
        textSecondary: selected.colors.secondary,
        headingFont: selected.fonts.heading.split(',')[0].replace(/['"]/g, ''),
        bodyFont: selected.fonts.body.split(',')[0].replace(/['"]/g, ''),
        gradientColor1: selected.heroGradient?.start, gradientColor2: selected.heroGradient?.end,
        gradientDirection: selected.heroGradient?.direction,
      }
      supabase.from('profiles').update({ theme: themeToSave }).eq('user_id', userId).then(() => { })
    }
  }

  const handleFinishOnboarding = () => {
    // If background processing is still running, show the finishing animation
    if (backgroundTaskStatus === 'processing') {
      setStep('finishing')
    } else {
      // Already done (or no CV) — go straight to dashboard
      router.push('/dashboard/preview')
    }
  }

  useEffect(() => {
    if (step === 'finishing' && (backgroundTaskStatus === 'complete' || backgroundTaskStatus === 'error')) {
      router.push('/dashboard/preview')
    }
  }, [step, backgroundTaskStatus, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    const newErrors = {}
    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.valid) newErrors.email = emailValidation.error
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.valid) newErrors.password = passwordValidation.error
    const usernameValidation = validateUsernameFormat(formData.username)
    if (!usernameValidation.valid) newErrors.username = usernameValidation.error
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    if (!usernameStatus.available) { setErrors({ username: 'Please choose an available username' }); return }
    setLoading(true)
    try {
      const { data, error } = await signUp({
        email: formData.email, password: formData.password, username: formData.username,
      })
      if (error) {
        if (error.message.includes('already registered')) {
          setFormError('This email is already registered. Try logging in instead.')
        } else {
          setFormError(error.message || 'Failed to create account')
        }
        setLoading(false)
        return
      }
      if (data?.user) {
        setUserId(data.user.id)
        if (data.user.identities?.length === 0) {
          setFormSuccess('Check your email to confirm your account!')
          setLoading(false)
          return
        }
        startBackgroundProcessing(data.user, cvFile)
        setStep('design')
      }
    } catch (error) {
      setFormError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const renderUsernameStatus = () => {
    if (!formData.username || formData.username.length < 3) return null
    if (usernameStatus.checking) {
      return (<span className={`${styles.statusIcon} ${styles.checking}`}><Loader2 size={14} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /></span>)
    }
    if (usernameStatus.available === true) {
      return (<span className={`${styles.statusIcon} ${styles.available}`}><Check size={14} /></span>)
    }
    if (usernameStatus.available === false) {
      return (<span className={`${styles.statusIcon} ${styles.unavailable}`}><X size={14} /></span>)
    }
    return null
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'portfoliobuilder.com'
  const cleanAppUrl = appUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const isProcessing = loading || authLoading || cvProcessing

  // ─── Educational tips for the finishing screen ───
  const TIPS = [
    { emoji: '🎨', title: 'Customize your theme', desc: 'Head to Theme settings anytime to tweak colors, fonts, and gradients.' },
    { emoji: '📱', title: 'Mobile-first design', desc: 'Every portfolio is automatically responsive across all devices.' },
    { emoji: '🔗', title: 'Share your link', desc: 'Your portfolio is live at username.profyld.com — share it everywhere.' },
    { emoji: '✏️', title: 'Click to edit', desc: 'On the preview page, click any section to jump straight to editing it.' },
    { emoji: '🚀', title: 'SEO built in', desc: 'We handle meta tags, Open Graph, and sitemap — you just focus on content.' },
    { emoji: '🌙', title: 'Dark & light mode', desc: 'Toggle between dark and light dashboard themes from the header.' },
  ]
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    if (step === 'finishing') {
      const interval = setInterval(() => {
        setTipIndex(prev => (prev + 1) % TIPS.length)
      }, 3500)
      return () => clearInterval(interval)
    }
  }, [step])

  // ─── GSAP entrance animations ───
  const overlayRef = useRef(null)

  useEffect(() => {
    if (step !== 'design' && step !== 'finishing') return
    if (!mounted) return

    const animateIn = async () => {
      const gsapModule = await import('gsap')
      const gsap = gsapModule.gsap || gsapModule.default
      const overlay = overlayRef.current
      if (!overlay) return

      // Animate headings
      gsap.fromTo(overlay.querySelectorAll('.gsap-heading'),
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out', stagger: 0.15, delay: 0.15 }
      )

      // Animate theme cards
      gsap.fromTo(overlay.querySelectorAll('.gsap-card'),
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out', stagger: 0.08, delay: 0.4 }
      )

      // Animate CTA
      gsap.fromTo(overlay.querySelectorAll('.gsap-cta'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.8 }
      )

      // Animate tips card
      gsap.fromTo(overlay.querySelectorAll('.gsap-tip'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.5 }
      )
    }
    // Small delay so DOM is painted
    const timer = setTimeout(animateIn, 50)
    return () => clearTimeout(timer)
  }, [step, mounted])

  const isFullScreen = step === 'design' || step === 'finishing'

  // ─── DESIGN STEP: Full-screen immersive theme picker ───
  const renderDesignStep = () => (
    <div ref={overlayRef} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', padding: '60px 24px',
      position: 'relative', zIndex: 10,
    }}>
      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <p className="gsap-heading" style={{
          fontSize: '12px', fontWeight: 600, letterSpacing: '3px',
          textTransform: 'uppercase', color: '#c0a878', marginBottom: '20px',
          opacity: 0,
        }}>
          One last thing
        </p>
        <h1 className="gsap-heading" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700,
          color: '#fff', marginBottom: '14px', lineHeight: 1.1, opacity: 0,
        }}>
          Choose your <span style={{ fontStyle: 'italic', color: '#c0a878' }}>style.</span>
        </h1>
        <p className="gsap-heading" style={{
          fontSize: '16px', color: 'rgba(255,255,255,0.45)', fontWeight: 300,
          maxWidth: '420px', margin: '0 auto', opacity: 0,
        }}>
          Pick a visual theme to get started. You can always change it later.
        </p>
      </div>

      {/* Theme grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px', width: '100%', maxWidth: '740px', marginBottom: '48px',
      }}>
        {Object.entries(themes).map(([id, theme]) => {
          const isSelected = selectedThemeId === id
          return (
            <button
              key={id}
              className="gsap-card"
              onClick={() => handleThemeSelect(id)}
              style={{
                position: 'relative', padding: '20px', borderRadius: '16px',
                border: 'none', cursor: 'pointer', textAlign: 'left', opacity: 0,
                background: isSelected ? 'rgba(192, 168, 120, 0.12)' : 'rgba(255,255,255,0.04)',
                outline: isSelected ? '2px solid #c0a878' : '1px solid rgba(255,255,255,0.08)',
                outlineOffset: '-1px',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => { if (!isSelected) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.outline = '1px solid rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)' } }}
              onMouseOut={(e) => { if (!isSelected) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.outline = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' } }}
            >
              {/* Gradient preview */}
              <div style={{
                width: '100%', height: '56px', borderRadius: '10px', marginBottom: '14px',
                background: `linear-gradient(${theme.heroGradient?.direction || 'to right'}, ${theme.heroGradient?.start || '#333'}, ${theme.heroGradient?.end || '#000'})`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }} />
              <h3 style={{
                fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '8px',
                fontFamily: "'Montserrat', sans-serif",
              }}>
                {theme.name}
              </h3>
              <div style={{ display: 'flex', gap: '5px' }}>
                {Object.values(theme.colors).slice(0, 4).map((color, i) => (
                  <div key={i} style={{
                    width: '14px', height: '14px', borderRadius: '50%',
                    backgroundColor: color, border: '1.5px solid rgba(255,255,255,0.15)',
                  }} />
                ))}
              </div>
              {isSelected && (
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: '#c0a878', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(192,168,120,0.4)',
                }}>
                  <Check size={13} color="#000" strokeWidth={3} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Continue button */}
      <div className="gsap-cta" style={{ width: '100%', maxWidth: '400px', opacity: 0 }}>
        <button
          onClick={handleFinishOnboarding}
          style={{
            width: '100%', padding: '18px', border: 'none', borderRadius: '50px',
            background: '#ffffff', color: '#000', fontSize: '16px', fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            fontFamily: "'Montserrat', sans-serif",
            transition: 'all 0.3s ease',
            boxShadow: '0 0 30px rgba(255,255,255,0.1)',
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(255,255,255,0.25)' }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.1)' }}
        >
          <span>Launch My Portfolio</span><ArrowRight size={18} />
        </button>
      </div>
    </div>
  )

  // ─── FINISHING STEP: Loading with educational tips ───
  const renderFinishingStep = () => (
    <div ref={overlayRef} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', padding: '40px 24px',
      position: 'relative', zIndex: 10,
    }}>
      {/* Elegant spinner */}
      <div className="gsap-heading" style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '48px', opacity: 0 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.06)', borderTopColor: '#c0a878',
          animation: 'spin 1.2s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: '10px', borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.04)', borderRightColor: 'rgba(192,168,120,0.5)',
          animation: 'spin 2s linear infinite reverse',
        }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={20} color="#c0a878" />
        </div>
      </div>

      {/* Title */}
      <h1 className="gsap-heading" style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700,
        color: '#fff', marginBottom: '8px', textAlign: 'center', opacity: 0,
      }}>
        Creating your <span style={{ fontStyle: 'italic', color: '#c0a878' }}>portfolio</span>
      </h1>
      <p className="gsap-heading" style={{
        fontSize: '15px', color: 'rgba(255,255,255,0.4)', marginBottom: '56px',
        textAlign: 'center', opacity: 0,
      }}>
        Hang tight — this won't take long
      </p>

      {/* Rotating educational tips */}
      <div className="gsap-tip" style={{ opacity: 0 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tipIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', padding: '32px 40px',
              maxWidth: '460px', width: '100%', textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>{TIPS[tipIndex].emoji}</p>
            <h3 style={{
              fontSize: '16px', fontWeight: 600, color: '#fff',
              marginBottom: '8px', fontFamily: "'Montserrat', sans-serif",
            }}>
              Pro Tip: {TIPS[tipIndex].title}
            </h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              {TIPS[tipIndex].desc}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '28px', justifyContent: 'center' }}>
          {TIPS.map((_, i) => (
            <div key={i} style={{
              width: tipIndex === i ? '24px' : '6px', height: '6px',
              borderRadius: '3px', transition: 'all 0.4s ease',
              background: tipIndex === i ? '#c0a878' : 'rgba(255,255,255,0.1)',
            }} />
          ))}
        </div>
      </div>
    </div>
  )

  // ─── Full-screen overlay portal ───
  const renderOverlay = () => {
    if (!isFullScreen) return null

    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: '#050505',
          fontFamily: "'Montserrat', sans-serif",
          overflow: 'auto',
        }}
      >
        {/* Ambient glow orb (like /about page) */}
        <div style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70vw', height: '70vw',
          background: 'radial-gradient(circle, rgba(192, 168, 120, 0.08) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Grid overlay */}
        <div style={{
          position: 'fixed', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Content */}
        {step === 'design' ? renderDesignStep() : renderFinishingStep()}
      </motion.div>
    )
  }

  return (
    <>
      <div className={styles.authCard}>
        <AnimatePresence mode="wait">
          {step === 'signup' && (
            <motion.div
              key="signup-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <div className={styles.authHeader}>
                <div className={styles.logo}>profyld.</div>
                <h1 className={styles.title}>Create Your Portfolio</h1>
                <p className={styles.subtitle}>Build your professional presence in minutes</p>
              </div>

              <form onSubmit={handleSubmit} className={styles.authForm}>
                {formError && (<div className={styles.formError}>{formError}</div>)}
                {formSuccess && (<div className={styles.formSuccess}>{formSuccess}</div>)}

                <Input label="Email" type="email" name="email" placeholder="you@example.com"
                  value={formData.email} onChange={handleChange} error={errors.email}
                  autoComplete="email" disabled={isProcessing} />
                <Input label="Password" type="password" name="password" placeholder="At least 8 characters"
                  value={formData.password} onChange={handleChange} error={errors.password}
                  autoComplete="new-password" disabled={isProcessing} />
                <Input label="Username" type="text" name="username" placeholder="yourname"
                  value={formData.username} onChange={handleChange}
                  error={errors.username || (usernameStatus.available === false ? usernameStatus.message : '')}
                  success={usernameStatus.available === true ? usernameStatus.message : ''}
                  suffix={renderUsernameStatus()} autoComplete="username" disabled={isProcessing} />

                {formData.username && formData.username.length >= 3 && usernameStatus.available && (
                  <div className={styles.usernamePreview}>
                    <p>🌐 Your portfolio will be live at:</p>
                    <div className={styles.previewUrl}>
                      <span>{formData.username.toLowerCase()}</span>.{ROOT_DOMAIN}
                    </div>
                  </div>
                )}

                <div className={styles.cvUploadSection}>
                  <label className={styles.cvLabel}><Sparkles size={16} /> Upload your CV (Optional)</label>
                  <p className={styles.cvHint}>We'll use AI to pre-fill your profile from your resume</p>
                  <input ref={cvInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleCvSelect}
                    style={{ display: 'none' }} disabled={isProcessing} />
                  {cvFile ? (
                    <div className={styles.cvSelected}>
                      <FileText size={20} />
                      <span className={styles.cvFileName}>{cvFile.name}</span>
                      <button type="button" onClick={removeCv} className={styles.cvRemove} disabled={isProcessing}><X size={16} /></button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => cvInputRef.current?.click()} className={styles.cvUploadBtn} disabled={isProcessing}>
                      <Upload size={18} /> Choose PDF or Word file
                    </button>
                  )}
                </div>

                <Turnstile onVerify={(token) => setTurnstileToken(token)} />
                <Button type="submit" fullWidth loading={isProcessing} disabled={!usernameStatus.available}>
                  Create My Portfolio
                </Button>
              </form>

              <div className={styles.authFooter}>
                Already have an account? <Link href="/login">Sign in</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Portal: renders directly into document.body, outside auth layout */}
      {mounted && createPortal(
        <AnimatePresence>{renderOverlay()}</AnimatePresence>,
        document.body
      )}

      {/* Keyframe animation for spinner */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
