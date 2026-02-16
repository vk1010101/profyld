"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Plus, Edit2, Trash2, X, GraduationCap, Star } from 'lucide-react'
import styles from './education.module.css'

export default function EducationPage() {
  const { user } = useAuth()
  const [education, setEducation] = useState([])
  const [interests, setInterests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('education')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const [eduForm, setEduForm] = useState({
    year_range: '',
    degree: '',
    institution: '',
    specialization: '',
    is_primary: false,
  })

  const [interestForm, setInterestForm] = useState({
    name: '',
    category: 'interest',
  })

  const supabase = createClient()

  useEffect(() => {
    if (user?.id) {
      fetchData()
    }
  }, [user?.id])

  const fetchData = async () => {
    const [eduRes, intRes] = await Promise.all([
      supabase.from('education').select('*').eq('user_id', user.id).order('display_order'),
      supabase.from('interests').select('*').eq('user_id', user.id).order('display_order'),
    ])

    if (!eduRes.error) setEducation(eduRes.data || [])
    if (!intRes.error) setInterests(intRes.data || [])
    setLoading(false)
  }

  const resetForm = () => {
    setEduForm({ year_range: '', degree: '', institution: '', specialization: '', is_primary: false })
    setInterestForm({ name: '', category: 'interest' })
    setEditingId(null)
    setShowForm(false)
  }

  // Education handlers
  const handleEditEdu = (item) => {
    setEduForm({
      year_range: item.year_range || '',
      degree: item.degree || '',
      institution: item.institution || '',
      specialization: item.specialization || '',
      is_primary: item.is_primary || false,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSubmitEdu = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = { ...eduForm, user_id: user.id, display_order: editingId ? undefined : education.length }

    if (editingId) {
      await supabase.from('education').update(payload).eq('id', editingId)
    } else {
      await supabase.from('education').insert(payload)
    }

    await fetchData()
    resetForm()
    setSaving(false)
  }

  const handleDeleteEdu = async (id) => {
    if (!confirm('Delete this education entry?')) return
    await supabase.from('education').delete().eq('id', id)
    setEducation(prev => prev.filter(e => e.id !== id))
  }

  // Interest handlers
  const handleEditInterest = (item) => {
    setInterestForm({ name: item.name || '', category: item.category || 'interest' })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSubmitInterest = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = { ...interestForm, user_id: user.id, display_order: editingId ? undefined : interests.length }

    if (editingId) {
      await supabase.from('interests').update(payload).eq('id', editingId)
    } else {
      await supabase.from('interests').insert(payload)
    }

    await fetchData()
    resetForm()
    setSaving(false)
  }

  const handleDeleteInterest = async (id) => {
    if (!confirm('Delete this interest?')) return
    await supabase.from('interests').delete().eq('id', id)
    setInterests(prev => prev.filter(i => i.id !== id))
  }

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
        <h1>Education & Interests</h1>
        <p>Manage your academic background and personal interests</p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'education' ? styles.tabActive : ''}`}
          onClick={() => { setActiveTab('education'); resetForm() }}
        >
          <GraduationCap size={18} />
          Education
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'interests' ? styles.tabActive : ''}`}
          onClick={() => { setActiveTab('interests'); resetForm() }}
        >
          <Star size={18} />
          Interests & Volunteering
        </button>
      </div>

      {/* Education Tab */}
      {activeTab === 'education' && (
        <>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className={styles.addBtn}>
              <Plus size={18} /> Add Education
            </Button>
          )}

          {showForm && (
            <form onSubmit={handleSubmitEdu} className={styles.form}>
              <div className={styles.formHeader}>
                <h2>{editingId ? 'Edit' : 'Add'} Education</h2>
                <button type="button" onClick={resetForm} className={styles.closeBtn}><X size={20} /></button>
              </div>

              <div className={styles.formGrid}>
                <Input label="Year Range" value={eduForm.year_range} onChange={(e) => setEduForm(p => ({ ...p, year_range: e.target.value }))} placeholder="e.g. 2020 - 2024" />
                <Input label="Degree" value={eduForm.degree} onChange={(e) => setEduForm(p => ({ ...p, degree: e.target.value }))} placeholder="e.g. Bachelor of Design" required />
              </div>
              <Input label="Institution" value={eduForm.institution} onChange={(e) => setEduForm(p => ({ ...p, institution: e.target.value }))} placeholder="e.g. University Name" />
              <Input label="Specialization (optional)" value={eduForm.specialization} onChange={(e) => setEduForm(p => ({ ...p, specialization: e.target.value }))} placeholder="e.g. Minor in Graphic Design" />

              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={eduForm.is_primary} onChange={(e) => setEduForm(p => ({ ...p, is_primary: e.target.checked }))} />
                <span>Primary education (shown prominently)</span>
              </label>

              <div className={styles.formActions}>
                <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                <Button type="submit" loading={saving}>{editingId ? 'Update' : 'Add'}</Button>
              </div>
            </form>
          )}

          <div className={styles.list}>
            {education.length === 0 ? (
              <div className={styles.empty}><p>No education entries yet</p></div>
            ) : (
              education.map((item) => (
                <div key={item.id} className={`${styles.item} ${item.is_primary ? styles.itemPrimary : ''}`}>
                  <div className={styles.itemContent}>
                    {item.is_primary && <span className={styles.badge}>Primary</span>}
                    <span className={styles.itemYear}>{item.year_range}</span>
                    <h3>{item.degree}</h3>
                    <p>{item.institution}</p>
                    {item.specialization && <p className={styles.itemSpec}>{item.specialization}</p>}
                  </div>
                  <div className={styles.itemActions}>
                    <button onClick={() => handleEditEdu(item)} className={styles.editBtn}><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteEdu(item.id)} className={styles.deleteBtn}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Interests Tab */}
      {activeTab === 'interests' && (
        <>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className={styles.addBtn}>
              <Plus size={18} /> Add Interest
            </Button>
          )}

          {showForm && (
            <form onSubmit={handleSubmitInterest} className={styles.form}>
              <div className={styles.formHeader}>
                <h2>{editingId ? 'Edit' : 'Add'} Interest</h2>
                <button type="button" onClick={resetForm} className={styles.closeBtn}><X size={20} /></button>
              </div>

              <Input label="Name" value={interestForm.name} onChange={(e) => setInterestForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Face Painting" required />

              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input type="radio" name="category" checked={interestForm.category === 'interest'} onChange={() => setInterestForm(p => ({ ...p, category: 'interest' }))} />
                  <span>Interest / Hobby</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="category" checked={interestForm.category === 'volunteering'} onChange={() => setInterestForm(p => ({ ...p, category: 'volunteering' }))} />
                  <span>Volunteering</span>
                </label>
              </div>

              <div className={styles.formActions}>
                <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                <Button type="submit" loading={saving}>{editingId ? 'Update' : 'Add'}</Button>
              </div>
            </form>
          )}

          <div className={styles.interestsGrid}>
            <div className={styles.interestSection}>
              <h3>Interests & Hobbies</h3>
              <div className={styles.tagList}>
                {interests.filter(i => i.category === 'interest').map((item) => (
                  <div key={item.id} className={styles.tag}>
                    <span>{item.name}</span>
                    <button onClick={() => handleDeleteInterest(item.id)}><X size={14} /></button>
                  </div>
                ))}
                {interests.filter(i => i.category === 'interest').length === 0 && (
                  <p className={styles.emptyText}>No interests added</p>
                )}
              </div>
            </div>
            <div className={styles.interestSection}>
              <h3>Volunteering</h3>
              <div className={styles.tagList}>
                {interests.filter(i => i.category === 'volunteering').map((item) => (
                  <div key={item.id} className={styles.tag}>
                    <span>{item.name}</span>
                    <button onClick={() => handleDeleteInterest(item.id)}><X size={14} /></button>
                  </div>
                ))}
                {interests.filter(i => i.category === 'volunteering').length === 0 && (
                  <p className={styles.emptyText}>No volunteering added</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
