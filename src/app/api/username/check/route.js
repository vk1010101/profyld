import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateUsernameFormat as validateUsername } from '@/lib/utils/validation'
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rateLimit'

export async function GET(request) {
  // --- RATE LIMITING ---
  const ip = getClientIP(request)
  const { allowed, remaining } = rateLimit(ip, RATE_LIMITS.usernameCheck.limit, RATE_LIMITS.usernameCheck.windowMs)
  if (!allowed) {
    return NextResponse.json(
      { available: false, error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': remaining.toString() } }
    )
  }

  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json(
      { available: false, error: 'Username is required' },
      { status: 400 }
    )
  }

  // Validate username format first
  const validation = validateUsername(username)
  if (!validation.valid) {
    return NextResponse.json(
      { available: false, error: validation.error },
      { status: 200 }
    )
  }

  const normalizedUsername = username.toLowerCase().trim()

  // Block reserved usernames
  const blockedUsernames = [
    'admin', 'api', 'dashboard', 'login', 'signup', 'register',
    'settings', 'profile', 'support', 'help', 'contact', 'about',
    'terms', 'privacy', 'legal', 'pricing', 'features', 'blog',
    'status', 'system', 'null', 'undefined', 'void', 'root', 'webmaster'
  ]

  if (blockedUsernames.includes(normalizedUsername)) {
    return NextResponse.json({ available: false, error: 'This username is reserved' })
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', normalizedUsername)
      .single()

    if (error && error.code === 'PGRST116') {
      // No rows returned = username is available
      return NextResponse.json({ available: true })
    }

    if (error) {
      console.error('Username check error:', error)
      return NextResponse.json(
        { available: false, error: 'Error checking username' },
        { status: 500 }
      )
    }

    // Username exists
    return NextResponse.json({ available: false, error: 'Username is taken' })

  } catch (error) {
    console.error('Username check error:', error)
    return NextResponse.json(
      { available: false, error: 'Error checking username' },
      { status: 500 }
    )
  }
}
