"use client"

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import { Upload, Trash2, X, Image as ImageIcon } from 'lucide-react'
import styles from './artwork.module.css'

export default function ArtworkPage() {
  const { user } = useAuth()
  const [artwork, setArtwork] = useState([])
  const [logos, setLogos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('artwork')

  const fileInputRef = useRef(null)
  const supabase = createClient()

  useEffect(() => {
    if (user?.id) fetchData()
  }, [user?.id])

  const fetchData = async () => {
    const [artRes, logoRes] = await Promise.all([
      supabase.from('artwork').select('*').eq('user_id', user.id).order('display_order'),
      supabase.from('logos').select('*').eq('user_id', user.id).order('display_order'),
    ])

    if (!artRes.error) setArtwork(artRes.data || [])
    if (!logoRes.error) setLogos(logoRes.data || [])
    setLoading(false)
  }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    const table = activeTab === 'artwork' ? 'artwork' : 'logos'
    const currentItems = activeTab === 'artwork' ? artwork : logos

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > 10 * 1024 * 1024) continue

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`

      const { error } = await supabase.storage.from('portfolio').upload(fileName, file)

      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(fileName)

        await supabase.from(table).insert({
          user_id: user.id,
          image_url: publicUrl,
          display_order: currentItems.length,
        })
      }
    }

    await fetchData()
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = async (id) => {
    const table = activeTab === 'artwork' ? 'artwork' : 'logos'
    await supabase.from(table).delete().eq('id', id)

    if (activeTab === 'artwork') {
      setArtwork(prev => prev.filter(a => a.id !== id))
    } else {
      setLogos(prev => prev.filter(l => l.id !== id))
    }
  }

  const currentItems = activeTab === 'artwork' ? artwork : logos

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Artwork & Logos</h1>
          <p>Manage your artwork gallery and logo designs</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'artwork' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('artwork')}
        >
          <ImageIcon size={18} />
          Artwork ({artwork.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'logos' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('logos')}
        >
          <ImageIcon size={18} />
          Logos ({logos.length})
        </button>
      </div>

      {/* Upload Button */}
      <div className={styles.uploadSection}>
        <Button onClick={() => fileInputRef.current?.click()} loading={uploading}>
          <Upload size={18} />
          Upload {activeTab === 'artwork' ? 'Artwork' : 'Logos'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
        <p className={styles.hint}>Select multiple images to upload at once. Max 10MB each.</p>
      </div>

      {/* Gallery */}
      <div className={styles.gallery}>
        {currentItems.length === 0 ? (
          <div className={styles.empty}>
            <ImageIcon size={48} />
            <p>No {activeTab} uploaded yet</p>
            <p>Upload images to display in your portfolio.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {currentItems.map((item) => (
              <div key={item.id} className={styles.item}>
                <img src={item.image_url} alt="" />
                <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
