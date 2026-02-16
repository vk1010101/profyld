"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import styles from './dashboard.module.css'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        profile={profile}
      />
      <div className={styles.mainContent}>
        <DashboardHeader 
          onMenuClick={() => setSidebarOpen(true)}
          profile={profile}
        />
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  )
}
