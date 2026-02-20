'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, Check, Image, Palette, Layers, Upload, X } from 'lucide-react';
import { getClient } from '@/lib/supabase/client';
import { THEMES } from '@/lib/themes';
import { HEADING_FONTS, BODY_FONTS } from '@/lib/constants';
import { defaultTheme } from '@/lib/utils/theme';
import Button from '@/components/ui/Button';
import styles from './theme.module.css';

const GRADIENT_DIRECTIONS = [
  { value: 'to bottom', label: 'Top to Bottom' },
  { value: 'to top', label: 'Bottom to Top' },
  { value: 'to right', label: 'Left to Right' },
  { value: 'to left', label: 'Right to Left' },
  { value: 'to bottom right', label: 'Diagonal ↘' },
  { value: 'to bottom left', label: 'Diagonal ↙' },
  { value: 'to top right', label: 'Diagonal ↗' },
  { value: 'to top left', label: 'Diagonal ↖' },
];

const EFFECT_TYPES = ['mesh', 'aurora', 'dots', 'waves', 'grain', 'orbs'];

const EFFECT_META = [
  { id: 'mesh', label: 'Mesh', emoji: '🌈' },
  { id: 'aurora', label: 'Aurora', emoji: '🌌' },
  { id: 'dots', label: 'Dot Grid', emoji: '⚬' },
  { id: 'waves', label: 'Waves', emoji: '🌊' },
  { id: 'grain', label: 'Film Grain', emoji: '📽️' },
  { id: 'orbs', label: 'Orbs', emoji: '🔮' },
];

export default function ThemePage() {
  const [theme, setTheme] = useState({ ...defaultTheme });
  const [profile, setProfile] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const supabase = getClient();

  useEffect(() => {
    fetchTheme();
  }, []);

  // Dynamically load Google Fonts whenever fonts change so previews render correctly
  useEffect(() => {
    if (!theme.headingFont && !theme.bodyFont) return;
    const families = [theme.headingFont, theme.bodyFont]
      .filter(Boolean)
      .map(f => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700`)
      .join('&');
    const url = `https://fonts.googleapis.com/css2?${families}&display=swap`;

    // Don't add duplicates
    const existing = document.querySelector(`link[href="${url}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    }
  }, [theme.headingFont, theme.bodyFont]);

  const fetchTheme = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('theme, name, title, tagline')
      .eq('user_id', user.id)
      .single();

    if (!error && data) {
      setProfile(data);
      if (data.theme) {
        // Merge saved theme on top of defaults
        setTheme({ ...defaultTheme, ...data.theme });
        // Try to detect which preset matches
        const match = THEMES.find(t => t.id === data.theme.id);
        if (match) setSelectedPreset(match.id);
      }
    }
    setLoading(false);
  };

  const updateTheme = (key, value) => {
    setTheme(prev => ({ ...prev, [key]: value }));
    setSelectedPreset(null);
  };

  // Select a preset — spread ALL its properties (flat format) onto current theme
  const selectPreset = (preset) => {
    const { _preview, ...themeData } = preset; // strip internal preview data
    setTheme(prev => ({
      ...prev,
      ...themeData,
    }));
    setSelectedPreset(preset.id);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/hero-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(fileName, file);

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(fileName);

      updateTheme('heroImage', publicUrl);
      updateTheme('backgroundType', 'image');
    }
    setUploading(false);
  };

  const removeImage = () => {
    updateTheme('heroImage', '');
    updateTheme('backgroundType', 'gradient');
  };

  const saveTheme = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Strip _preview before saving to DB
    const { _preview, ...themeToSave } = theme;

    await supabase
      .from('profiles')
      .update({ theme: themeToSave })
      .eq('user_id', user.id);

    setSaving(false);
  };

  if (loading) {
    return <div className={styles.loading}>Loading theme...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Theme Customization</h1>
        <Button onClick={saveTheme} loading={saving}>
          <Save size={18} />
          Save Theme
        </Button>
      </div>

      {/* ── Preset Themes ── */}
      <section className={styles.section}>
        <h2>Choose a Theme</h2>
        <div className={styles.presetsGrid}>
          {THEMES.map(preset => (
            <button
              key={preset.id}
              className={`${styles.presetCard} ${selectedPreset === preset.id ? styles.selected : ''}`}
              onClick={() => selectPreset(preset)}
              style={{
                '--preset-bg': preset.background,
                '--preset-primary': preset.primary,
                '--preset-surface': preset.surface,
                '--preset-gradient1': preset.gradientColor1,
                '--preset-gradient2': preset.gradientColor2,
                '--preset-gradient-dir': preset.gradientDirection,
              }}
            >
              {/* Gradient preview bar */}
              <div className={styles.presetPreview}>
                <div className={styles.previewAccent} />
                {preset.backgroundType && !['gradient', 'color', 'image'].includes(preset.backgroundType) && (
                  <span className={styles.presetEffect}>{preset.backgroundType}</span>
                )}
              </div>

              {/* Font preview */}
              <span
                className={styles.presetFontPreview}
                style={{
                  fontFamily: `"${preset.headingFont}", serif`,
                  color: preset.textPrimary,
                }}
              >
                Aa
              </span>

              {/* Theme name */}
              <span className={styles.presetName}>{preset.name}</span>

              {/* Color dots */}
              <div className={styles.presetColors}>
                <div className={styles.presetDot} style={{ background: preset.primary }} title="Primary" />
                <div className={styles.presetDot} style={{ background: preset.background }} title="Background" />
                <div className={styles.presetDot} style={{ background: preset.surface }} title="Surface" />
              </div>

              {selectedPreset === preset.id && (
                <Check size={14} className={styles.checkIcon} />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── Background Type ── */}
      <section className={styles.section}>
        <h2>Background Type</h2>
        <div className={styles.backgroundToggle}>
          <button
            className={`${styles.toggleBtn} ${theme.backgroundType === 'gradient' ? styles.active : ''}`}
            onClick={() => updateTheme('backgroundType', 'gradient')}
          >
            <Layers size={20} />
            Gradient
          </button>
          <button
            className={`${styles.toggleBtn} ${theme.backgroundType === 'color' ? styles.active : ''}`}
            onClick={() => updateTheme('backgroundType', 'color')}
          >
            <Palette size={20} />
            Solid Color
          </button>
          <button
            className={`${styles.toggleBtn} ${theme.backgroundType === 'image' ? styles.active : ''}`}
            onClick={() => updateTheme('backgroundType', 'image')}
          >
            <Image size={20} />
            Image
          </button>
        </div>

        <h3 style={{ margin: '1.5rem 0 0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary, #888)' }}>✨ Background Effects</h3>
        <div className={styles.backgroundToggle} style={{ flexWrap: 'wrap' }}>
          {EFFECT_META.map(effect => (
            <button
              key={effect.id}
              className={`${styles.toggleBtn} ${theme.backgroundType === effect.id ? styles.active : ''}`}
              onClick={() => updateTheme('backgroundType', effect.id)}
              style={{ minWidth: '100px' }}
            >
              <span style={{ fontSize: '1.1rem' }}>{effect.emoji}</span>
              {effect.label}
            </button>
          ))}
        </div>

        {/* Gradient Controls — shown for gradient + effect types */}
        {(theme.backgroundType === 'gradient' || EFFECT_TYPES.includes(theme.backgroundType)) && (
          <div className={styles.gradientControls}>
            <div className={styles.colorsGrid}>
              <div className={styles.colorPicker}>
                <label>Color 1</label>
                <div className={styles.colorInput}>
                  <input
                    type="color"
                    value={theme.gradientColor1}
                    onChange={(e) => updateTheme('gradientColor1', e.target.value)}
                  />
                  <span>{theme.gradientColor1}</span>
                </div>
              </div>
              <div className={styles.colorPicker}>
                <label>Color 2</label>
                <div className={styles.colorInput}>
                  <input
                    type="color"
                    value={theme.gradientColor2}
                    onChange={(e) => updateTheme('gradientColor2', e.target.value)}
                  />
                  <span>{theme.gradientColor2}</span>
                </div>
              </div>
            </div>

            <div className={styles.directionSelect}>
              <label>Direction</label>
              <select
                value={theme.gradientDirection}
                onChange={(e) => updateTheme('gradientDirection', e.target.value)}
              >
                {GRADIENT_DIRECTIONS.map(dir => (
                  <option key={dir.value} value={dir.value}>{dir.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Solid Color Control */}
        {theme.backgroundType === 'color' && (
          <div className={styles.gradientControls}>
            <div className={styles.colorPicker}>
              <label>Background Color</label>
              <div className={styles.colorInput}>
                <input
                  type="color"
                  value={theme.backgroundColor || theme.background}
                  onChange={(e) => updateTheme('backgroundColor', e.target.value)}
                />
                <span>{theme.backgroundColor || theme.background}</span>
              </div>
            </div>
          </div>
        )}

        {/* Image Controls */}
        {theme.backgroundType === 'image' && (
          <div className={styles.gradientControls}>
            <div className={styles.imageUpload}>
              <input
                type="text"
                placeholder="Image URL (https://...)"
                value={theme.heroImage || ''}
                onChange={(e) => updateTheme('heroImage', e.target.value)}
                className={styles.urlInput}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  className={styles.uploadBtn}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload size={16} />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                {theme.heroImage && (
                  <button className={styles.removeBtn} onClick={removeImage}>
                    <X size={16} /> Remove
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        )}

        {/* Overlay Opacity */}
        <div className={styles.sliderWrapper}>
          <label>Overlay Opacity: {Math.round((theme.overlayOpacity || 0.5) * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={theme.overlayOpacity || 0.5}
            onChange={(e) => updateTheme('overlayOpacity', parseFloat(e.target.value))}
          />
        </div>
      </section>

      {/* ── Colors ── */}
      <section className={styles.section}>
        <h2>Colors</h2>
        <div className={styles.colorsGrid}>
          <div className={styles.colorPicker}>
            <label>Primary/Accent</label>
            <div className={styles.colorInput}>
              <input
                type="color"
                value={theme.primary}
                onChange={(e) => updateTheme('primary', e.target.value)}
              />
              <span>{theme.primary}</span>
            </div>
          </div>

          <div className={styles.colorPicker}>
            <label>Background</label>
            <div className={styles.colorInput}>
              <input
                type="color"
                value={theme.background}
                onChange={(e) => updateTheme('background', e.target.value)}
              />
              <span>{theme.background}</span>
            </div>
          </div>

          <div className={styles.colorPicker}>
            <label>Surface</label>
            <div className={styles.colorInput}>
              <input
                type="color"
                value={theme.surface}
                onChange={(e) => updateTheme('surface', e.target.value)}
              />
              <span>{theme.surface}</span>
            </div>
          </div>

          <div className={styles.colorPicker}>
            <label>Text Primary</label>
            <div className={styles.colorInput}>
              <input
                type="color"
                value={theme.textPrimary}
                onChange={(e) => updateTheme('textPrimary', e.target.value)}
              />
              <span>{theme.textPrimary}</span>
            </div>
          </div>

          <div className={styles.colorPicker}>
            <label>Text Secondary</label>
            <div className={styles.colorInput}>
              <input
                type="color"
                value={theme.textSecondary}
                onChange={(e) => updateTheme('textSecondary', e.target.value)}
              />
              <span>{theme.textSecondary}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Typography ── */}
      <section className={styles.section}>
        <h2>Typography</h2>
        <div className={styles.fontsGrid}>
          <div className={styles.fontPicker}>
            <label>Heading Font</label>
            <select
              value={theme.headingFont}
              onChange={(e) => updateTheme('headingFont', e.target.value)}
            >
              {HEADING_FONTS.map(font => (
                <option key={font.value} value={font.value}>
                  {font.name}
                </option>
              ))}
            </select>
            <p className={styles.fontPreview} style={{ fontFamily: `"${theme.headingFont}", serif` }}>
              The Quick Brown Fox
            </p>
          </div>

          <div className={styles.fontPicker}>
            <label>Body Font</label>
            <select
              value={theme.bodyFont}
              onChange={(e) => updateTheme('bodyFont', e.target.value)}
            >
              {BODY_FONTS.map(font => (
                <option key={font.value} value={font.value}>
                  {font.name}
                </option>
              ))}
            </select>
            <p className={styles.fontPreview} style={{ fontFamily: `"${theme.bodyFont}", sans-serif` }}>
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
