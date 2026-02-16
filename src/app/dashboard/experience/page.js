"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Plus, Edit2, Trash2, X, Check, GripVertical } from 'lucide-react'
import styles from './experience.module.css'

export default function ExperiencePage() {
  const { user } = useAuth()
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    date_range: '',
    title: '',
    location: '',
    description: '',
    bullet_points: [],
  })
  const [bulletInput, setBulletInput] = useState('')

  const supabase = createClient()

  useEffect(() => {
    if (user?.id) {
      fetchExperiences()
    }
  }, [user?.id])

  const fetchExperiences = async () => {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('user_id', user.id)
      .order('display_order', { ascending: true })

    if (!error) {
      setExperiences(data || [])
    }
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      date_range: '',
      title: '',
      location: '',
      description: '',
      bullet_points: [],
    })
    setBulletInput('')
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (exp) => {
    setFormData({
      date_range: exp.date_range || '',
      title: exp.title || '',
      location: exp.location || '',
      description: exp.description || '',
      bullet_points: exp.bullet_points || [],
    })
    setEditingId(exp.id)
    setShowForm(true)
  }

  const handleAddBullet = () => {
    if (bulletInput.trim()) {
      setFormData(prev => ({
        ...prev,
        bullet_points: [...prev.bullet_points, bulletInput.trim()]
      }))
      setBulletInput('')
    }
  }

  const handleRemoveBullet = (index) => {
    setFormData(prev => ({
      ...prev,
      bullet_points: prev.bullet_points.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      ...formData,
      user_id: user.id,
      display_order: editingId ? undefined : experiences.length,
    }

    if (editingId) {
      const { error } = await supabase
        .from('experiences')
        .update(payload)
        .eq('id', editingId)

      if (!error) {
        await fetchExperiences()
        resetForm()
      }
    } else {
      const { error } = await supabase
        .from('experiences')
        .insert(payload)

      if (!error) {
        await fetchExperiences()
        resetForm()
      }
    }

    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience?')) return

    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)

    if (!error) {
      setExperiences(prev => prev.filter(e => e.id !== id))
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading experiences...</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Experience</h1>
          <p>Manage your work history and internships</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Add Experience
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formHeader}>
            <h2>{editingId ? 'Edit Experience' : 'Add Experience'}</h2>
            <button type="button" onClick={resetForm} className={styles.closeBtn}>
              <X size={20} />
            </button>
          </div>

          <div className={styles.formGrid}>
            <Input
              label="Date Range"
              value={formData.date_range}
              onChange={(e) => setFormData(prev => ({ ...prev, date_range: e.target.value }))}
              placeholder="e.g. June 2024 - August 2024"
            />
            <Input
              label="Title / Role"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Summer Internship"
              required
            />
          </div>

          <Input
            label="Location / Company"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g. ABC Company, New York"
          />

          <div className={styles.textareaGroup}>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your responsibilities and achievements..."
              rows={3}
            />
          </div>

          {/* Bullet Points */}
          <div className={styles.bulletsSection}>
            <label>Key Points (optional)</label>
            <div className={styles.bulletInput}>
              <Input
                value={bulletInput}
                onChange={(e) => setBulletInput(e.target.value)}
                placeholder="Add a bullet point"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddBullet()
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={handleAddBullet}>
                Add
              </Button>
            </div>
            {formData.bullet_points.length > 0 && (
              <ul className={styles.bulletList}>
                {formData.bullet_points.map((point, index) => (
                  <li key={index}>
                    <span>{point}</span>
                    <button type="button" onClick={() => handleRemoveBullet(index)}>
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.formActions}>
            <Button type="button" variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editingId ? 'Update' : 'Add'} Experience
            </Button>
          </div>
        </form>
      )}

      {/* List */}
      <div className={styles.list}>
        {experiences.length === 0 ? (
          <div className={styles.empty}>
            <p>No experiences added yet</p>
            <p>Add your work history, internships, or freelance work.</p>
          </div>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} className={styles.item}>
              <div className={styles.itemHandle}>
                <GripVertical size={18} />
              </div>
              <div className={styles.itemContent}>
                <div className={styles.itemDate}>{exp.date_range}</div>
                <h3>{exp.title}</h3>
                {exp.location && <p className={styles.itemLocation}>{exp.location}</p>}
                {exp.description && <p className={styles.itemDesc}>{exp.description}</p>}
                {exp.bullet_points?.length > 0 && (
                  <ul className={styles.itemBullets}>
                    {exp.bullet_points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={styles.itemActions}>
                <button onClick={() => handleEdit(exp)} className={styles.editBtn}>
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(exp.id)} className={styles.deleteBtn}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
