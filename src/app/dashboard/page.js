"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Upload, Smartphone, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import StatsCard from '@/components/dashboard/StatsCard'
import NextSteps from '@/components/dashboard/NextSteps'
import PerformanceInsights from '@/components/dashboard/PerformanceInsights'
import RecentActivity from '@/components/dashboard/RecentActivity'
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton'
import { getPortfolioUrl } from '@/lib/utils/portfolio'
import styles from './page.module.css'

export default function DashboardPage() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({
    experiences: 0,
    skills: 0,
    projects: 0,
    hasTheme: false,
    hasPhoto: false,
  })
  const [analytics, setAnalytics] = useState({
    views: 0,
    uniqueVisitors: 0,
    ctaClicks: 0,
    topReferrers: [],
    viewsTrend: null,
    period: '7 days',
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [mobileLayoutNeeded, setMobileLayoutNeeded] = useState(false)

  // Fetch core profile stats immediately (blocking)
  useEffect(() => {
    const fetchCoreStats = async () => {
      if (!profile?.user_id) return

      const supabase = createClient()

      // Only fetch essential profile counts - fast queries
      const [experiencesResult, skillsResult, projectsResult] = await Promise.all([
        supabase.from('experiences').select('id', { count: 'exact', head: true }).eq('user_id', profile.user_id),
        supabase.from('skills').select('id', { count: 'exact', head: true }).eq('user_id', profile.user_id),
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('user_id', profile.user_id),
      ])

      setStats({
        experiences: experiencesResult.count || 0,
        skills: skillsResult.count || 0,
        projects: projectsResult.count || 0,
        hasTheme: !!profile?.theme,
        hasPhoto: !!profile?.profile_image_url,
      })

      // Check if any blocks have custom layout without mobile positions
      if (profile?.has_blocks) {
        const { data: blocks } = await supabase
          .from('portfolio_blocks')
          .select('config')
          .eq('user_id', profile.user_id)

        if (blocks) {
          const needsMobile = blocks.some(b =>
            b.config?._hasCustomLayout &&
            (!b.config?._positions?.mobile || Object.keys(b.config._positions.mobile || {}).length === 0)
          )
          setMobileLayoutNeeded(needsMobile)
        }
      }

      setLoading(false) // Page ready to display!
    }

    fetchCoreStats()
  }, [profile])

  // Fetch analytics in background (non-blocking, cached)
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!profile?.user_id) return

      // Analytics API is cached for 30 min, so this is fast
      try {
        const analyticsRes = await fetch('/api/analytics/stats?days=7')
        if (analyticsRes.ok) {
          const data = await analyticsRes.json()
          setAnalytics({
            views: data.views || 0,
            uniqueVisitors: data.uniqueVisitors || 0,
            ctaClicks: data.ctaClicks || 0,
            topReferrers: data.topReferrers || [],
            viewsTrend: data.viewsTrend || null,
            period: data.period || '7 days',
          })
        }
      } catch (error) {
        // Silently fail - analytics is non-critical
      }

      // Fetch recent activity (Aggregated from user actions and external events)
      try {
        const supabase = createClient()

        // Parallel fetch for all activity sources
        const [ctaRes, projectsRes, expRes, skillsRes] = await Promise.all([
          supabase.from('cta_events').select('*').eq('portfolio_user_id', profile.user_id).order('created_at', { ascending: false }).limit(5),
          supabase.from('projects').select('id, title, created_at').eq('user_id', profile.user_id).order('created_at', { ascending: false }).limit(5),
          supabase.from('experiences').select('id, position, company, created_at').eq('user_id', profile.user_id).order('created_at', { ascending: false }).limit(5),
          supabase.from('skills').select('id, name, created_at').eq('user_id', profile.user_id).order('created_at', { ascending: false }).limit(5)
        ])

        // Format and combine all events
        const activities = [
          ...(ctaRes.data || []).map(e => ({
            type: e.event_type === 'resume_download' ? 'resume' : 'interaction',
            label: e.event_type === 'resume_download' ? 'Resume Downloaded' : 'New Interaction',
            description: e.event_data?.email ? `by ${e.event_data.email}` : 'Visitor interacted with your profile',
            timestamp: new Date(e.created_at)
          })),
          ...(projectsRes.data || []).map(p => ({
            type: 'project',
            label: 'Project Added',
            description: `You added "${p.title}"`,
            timestamp: new Date(p.created_at)
          })),
          ...(expRes.data || []).map(e => ({
            type: 'experience',
            label: 'Experience Added',
            description: `Added ${e.position} at ${e.company}`,
            timestamp: new Date(e.created_at)
          })),
          ...(skillsRes.data || []).map(s => ({
            type: 'skill',
            label: 'Skill Added',
            description: `You added "${s.name}" to your skills`,
            timestamp: new Date(s.created_at)
          }))
        ]

        // Sort by newest first and take top 5
        const sortedActivity = activities
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 5)

        setRecentActivity(sortedActivity)

      } catch (error) {
        console.error("Failed to fetch activity:", error)
      }
    }

    fetchAnalytics()
  }, [profile])

  // Calculate completion
  const completionItems = [
    { key: 'profile', done: !!profile?.name && !!profile?.title },
    { key: 'experience', done: stats.experiences > 0 },
    { key: 'projects', done: stats.projects > 0 },
    { key: 'photo', done: stats.hasPhoto },
    { key: 'theme', done: stats.hasTheme },
  ]
  const completedCount = completionItems.filter(item => item.done).length
  const completionPercentage = Math.round((completedCount / completionItems.length) * 100)

  // Determine banner message
  const getBannerMessage = () => {
    if (stats.projects === 0) {
      return "You're 1 project away from 'Interview-Ready'!"
    }
    if (!stats.hasPhoto) {
      return "Add a professional photo to stand out!"
    }
    if (completionPercentage === 100) {
      return "Your portfolio is complete! Time to share it with the world."
    }
    return "Keep building your portfolio to impress recruiters!"
  }

  // Next steps data
  const nextSteps = [
    {
      type: 'projects',
      title: 'Add projects',
      description: 'Showcase your impact and skills',
      href: '/dashboard/projects',
      action: stats.projects === 0 ? 'Add' : null,
      completed: stats.projects > 0,
    },
    {
      type: 'photo',
      title: 'Upload a photo',
      description: 'Add a professional photo',
      href: '/dashboard/profile',
      action: !stats.hasPhoto ? 'Upload' : null,
      completed: stats.hasPhoto,
    },
    {
      type: 'theme',
      title: 'Customize your theme',
      description: 'Choose a visual style that fits you',
      href: '/dashboard/theme',
      completed: stats.hasTheme,
    },
    {
      type: 'domain',
      title: 'Connect your domain',
      description: 'Use your own branded URL',
      href: '/dashboard/domain',
      completed: !!profile?.custom_domain,
    },
  ]

  const portfolioUrl = profile?.username ? getPortfolioUrl(profile.username) : null

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className={styles.dashboard}>
      {/* Hero Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <h1 className={styles.bannerTitle}>{getBannerMessage()}</h1>
          <p className={styles.bannerSubtitle}>
            Boost your chances by showcasing a project. Need more? You can also upload a professional photo.
          </p>
          <div className={styles.bannerActions}>
            <Link href="/dashboard/projects" className={styles.primaryBtn}>
              <Plus size={16} />
              Add Project
            </Link>
            <Link href="/dashboard/profile" className={styles.secondaryBtn}>
              <Upload size={16} />
              Upload Photo
            </Link>
          </div>
        </div>
        <div className={styles.bannerProgress}>
          <div className={styles.progressCircle}>
            <svg viewBox="0 0 100 100">
              <circle
                className={styles.progressBg}
                cx="50" cy="50" r="42"
              />
              <circle
                className={styles.progressFill}
                cx="50" cy="50" r="42"
                strokeDasharray={`${completionPercentage * 2.64} 264`}
              />
            </svg>
            <span className={styles.progressValue}>{completionPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Mobile Layout Notice */}
      {mobileLayoutNeeded && (
        <div className={styles.mobileNotice}>
          <div className={styles.noticeIcon}>
            <Smartphone size={20} />
          </div>
          <div className={styles.noticeContent}>
            <h3 className={styles.noticeTitle}>
              <AlertTriangle size={16} /> Mobile Layout Needs Attention
            </h3>
            <p className={styles.noticeText}>
              You&apos;ve customized your desktop layout with free-form positioning.
              Set up a mobile version to ensure your portfolio looks great on all devices.
            </p>
            <Link href="/dashboard/preview" className={styles.noticeAction}>
              Open Builder
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatsCard
          label="Portfolio Views"
          value={analytics.views}
          trend={analytics.viewsTrend}
          period={analytics.period}
        />
        <StatsCard
          label="Unique Visitors"
          value={analytics.uniqueVisitors}
          period={analytics.period}
        />
        <StatsCard
          label="CTA Clicks"
          value={analytics.ctaClicks}
          period={analytics.period}
        />
        <StatsCard
          label="Projects"
          value={stats.projects}
          period="Total"
        />
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <PerformanceInsights
            referrers={analytics.topReferrers}
            topProject={null}
          />
          <RecentActivity activities={recentActivity} />
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <NextSteps
            steps={nextSteps}
            completionPercentage={completionPercentage}
          />
        </div>
      </div>
    </div>
  )
}
