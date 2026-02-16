"use client"

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Plus, Edit2, Trash2, X, Upload, Image as ImageIcon, FolderOpen } from 'lucide-react'
import styles from './projects.module.css'

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({ title: '' })
  const [projectImages, setProjectImages] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)

  const fileInputRef = useRef(null)
  const supabase = createClient()

  useEffect(() => {
    if (user?.id) fetchProjects()
  }, [user?.id])

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_images(*)')
      .eq('user_id', user.id)
      .order('display_order', { ascending: true })

    if (!error) setProjects(data || [])
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({ title: '' })
    setProjectImages([])
    setEditingId(null)
    setShowForm(false)
    setSelectedProject(null)
  }

  const handleEdit = (project) => {
    setFormData({ title: project.title || '' })
    setProjectImages(project.project_images || [])
    setEditingId(project.id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    setSaving(true)

    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const payload = {
      title: formData.title,
      slug,
      user_id: user.id,
      cover_image_url: projectImages[0]?.image_url || '',
      display_order: editingId ? undefined : projects.length,
    }

    if (editingId) {
      await supabase.from('projects').update(payload).eq('id', editingId)
    } else {
      const { data } = await supabase.from('projects').insert(payload).select().single()
      if (data) {
        // Add images to new project
        for (const img of projectImages) {
          if (!img.id) { // New image
            await supabase.from('project_images').insert({
              project_id: data.id,
              image_url: img.image_url,
              display_order: projectImages.indexOf(img),
            })
          }
        }
      }
    }

    await fetchProjects()
    resetForm()
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and all its images?')) return

    await supabase.from('project_images').delete().eq('project_id', id)
    await supabase.from('projects').delete().eq('id', id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    const newImages = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > 10 * 1024 * 1024) continue // 10MB limit

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('portfolio')
        .upload(fileName, file)

      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(fileName)

        if (editingId) {
          // Add to existing project
          const { data: imgData } = await supabase.from('project_images').insert({
            project_id: editingId,
            image_url: publicUrl,
            display_order: projectImages.length,
          }).select().single()

          if (imgData) newImages.push(imgData)
        } else {
          newImages.push({ image_url: publicUrl, isNew: true })
        }
      }
    }

    setProjectImages(prev => [...prev, ...newImages])
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveImage = async (image, index) => {
    if (image.id) {
      await supabase.from('project_images').delete().eq('id', image.id)
    }
    setProjectImages(prev => prev.filter((_, i) => i !== index))
  }

  const openProjectDetail = (project) => {
    setSelectedProject(project)
    setProjectImages(project.project_images || [])
    setEditingId(project.id)
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading projects...</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Projects</h1>
          <p>Manage your portfolio projects and images</p>
        </div>
        {!showForm && !selectedProject && (
          <Button onClick={() => setShowForm(true)}>
            <Plus size={18} /> Add Project
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {showForm && !selectedProject && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formHeader}>
            <h2>{editingId ? 'Edit' : 'Create'} Project</h2>
            <button type="button" onClick={resetForm} className={styles.closeBtn}><X size={20} /></button>
          </div>

          <Input
            label="Project Title"
            value={formData.title}
            onChange={(e) => setFormData({ title: e.target.value })}
            placeholder="e.g. Brand Identity Design"
            required
          />

          {/* Image Upload */}
          <div className={styles.imageSection}>
            <label>Project Images</label>
            <div className={styles.imageGrid}>
              {projectImages.map((img, index) => (
                <div key={img.id || index} className={styles.imageThumb}>
                  <img src={img.image_url} alt="" />
                  <button type="button" onClick={() => handleRemoveImage(img, index)} className={styles.removeImg}>
                    <X size={14} />
                  </button>
                  {index === 0 && <span className={styles.coverBadge}>Cover</span>}
                </div>
              ))}
              <button type="button" onClick={() => fileInputRef.current?.click()} className={styles.uploadBtn} disabled={uploading}>
                {uploading ? <div className={styles.miniSpinner}></div> : <><Upload size={20} /><span>Upload</span></>}
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
            <p className={styles.hint}>First image will be used as cover. Max 10MB each.</p>
          </div>

          <div className={styles.formActions}>
            <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingId ? 'Update' : 'Create'} Project</Button>
          </div>
        </form>
      )}

      {/* Project Detail View */}
      {selectedProject && (
        <div className={styles.detailView}>
          <div className={styles.detailHeader}>
            <button onClick={() => { setSelectedProject(null); setEditingId(null); setProjectImages([]) }} className={styles.backBtn}>
              ← Back to Projects
            </button>
            <h2>{selectedProject.title}</h2>
          </div>

          <div className={styles.imageSection}>
            <div className={styles.sectionHeader}>
              <h3>Images ({projectImages.length})</h3>
              <Button size="small" onClick={() => fileInputRef.current?.click()} loading={uploading}>
                <Upload size={16} /> Add Images
              </Button>
            </div>
            <div className={styles.imageGrid}>
              {projectImages.map((img, index) => (
                <div key={img.id || index} className={styles.imageThumb}>
                  <img src={img.image_url} alt="" />
                  <button type="button" onClick={() => handleRemoveImage(img, index)} className={styles.removeImg}>
                    <X size={14} />
                  </button>
                  {index === 0 && <span className={styles.coverBadge}>Cover</span>}
                </div>
              ))}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
          </div>
        </div>
      )}

      {/* Projects List */}
      {!showForm && !selectedProject && (
        <div className={styles.list}>
          {projects.length === 0 ? (
            <div className={styles.empty}>
              <FolderOpen size={48} />
              <p>No projects yet</p>
              <p>Create your first project to showcase your work.</p>
            </div>
          ) : (
            <div className={styles.projectGrid}>
              {projects.map((project) => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.cardImage} onClick={() => openProjectDetail(project)}>
                    {project.cover_image_url ? (
                      <img src={project.cover_image_url} alt={project.title} />
                    ) : (
                      <div className={styles.noImage}><ImageIcon size={32} /></div>
                    )}
                    <div className={styles.cardOverlay}>
                      <span>{project.project_images?.length || 0} images</span>
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <h3>{project.title}</h3>
                    <div className={styles.cardActions}>
                      <button onClick={() => handleEdit(project)}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(project.id)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
