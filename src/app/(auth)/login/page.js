"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Turnstile from '@/components/ui/Turnstile'
import { useAuth } from '@/lib/hooks/useAuth'
import { validateEmail, validatePassword } from '@/lib/utils/validation'
import styles from '../auth.module.css'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, loading: authLoading } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    // Validate fields
    const newErrors = {}

    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.valid) newErrors.email = emailValidation.error

    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.valid) newErrors.password = passwordValidation.error

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      const { data, error } = await signIn({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        if (error.message.includes('Invalid login')) {
          setFormError('Invalid email or password')
        } else if (error.message.includes('Email not confirmed')) {
          setFormError('Please confirm your email address first')
        } else {
          setFormError(error.message || 'Failed to sign in')
        }
        return
      }

      if (data?.user) {
        router.push('/dashboard')
      }
    } catch (error) {
      setFormError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authContainer}>
      <Link href="/" style={{
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        fontFamily: 'var(--font-playfair), "Playfair Display", serif',
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#000',
        textDecoration: 'none',
        zIndex: 20
      }}>
        profyld.
      </Link>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.logo}>profyld.</div>
          <h1 className={styles.title}>Sign In</h1>
          <p className={styles.subtitle}>Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {formError && (
            <div className={styles.formError}>{formError}</div>
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
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
          />

          {/* CAPTCHA */}
          <Turnstile onVerify={(token) => setTurnstileToken(token)} />

          <Button
            type="submit"
            fullWidth
            loading={loading || authLoading}
          >
            Sign In
          </Button>
        </form>

        <div className={styles.authFooter}>
          Don&apos;t have an account? <Link href="/signup">Create one</Link>
        </div>
      </div>
      )
}
