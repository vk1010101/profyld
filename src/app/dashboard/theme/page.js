'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, Check, Image, Palette, Layers, Upload, X } from 'lucide-react';
import { getClient } from '@/lib/supabase/client';
import { PRESET_THEMES, HEADING_FONTS, BODY_FONTS } from '@/lib/constants';
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

const defaultBackgroundSettings = {
  backgroundType: 'gradient',
  heroImage: '',
  backgroundColor: '#1a1a1a',
  gradientColor1: '#1a1a1a',
  gradientColor2: '#0a0a0a',
  gradientDirection: 'to bottom right',
  overlayOpacity: 0.7,
};

export default function ThemePage() {
  const [theme, setTheme] = useState({ ...defaultTheme, ...defaultBackgroundSettings });
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
        setTheme({ ...defaultTheme, ...defaultBackgroundSettings, ...data.theme });
      }
    }
    setLoading(false);
  };

  const updateTheme = (key, value) => {
    setTheme(prev => ({ ...prev, [key]: value }));
    setSelectedPreset(null);
  };

  const selectPreset = (preset) => {
    setTheme(prev => ({ ...prev, ...preset.theme }));
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

    await supabase
      .from('profiles')
      .update({ theme })
      .eq('user_id', user.id);

    setSaving(false);
  };

  // Generate preview background style
  const getPreviewStyle = () => {
    switch (theme.backgroundType) {
      case 'image':
        return theme.heroImage
          ? { backgroundImage: `url(${theme.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: `linear-gradient(${theme.gradientDirection}, ${theme.gradientColor1}, ${theme.gradientColor2})` };
      case 'color':
        return { backgroundColor: theme.backgroundColor };
      case 'gradient':
      default:
        return { background: `linear-gradient(${theme.gradientDirection}, ${theme.gradientColor1}, ${theme.gradientColor2})` };
    }
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

      {/* Background Type Toggle */}
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

        {/* Gradient Controls */}
        {theme.backgroundType === 'gradient' && (
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
            <div className={styles.selectWrapper}>
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

        {/* Solid Color Controls */}
        {theme.backgroundType === 'color' && (
          <div className={styles.solidColorControls}>
            <div className={styles.colorPicker}>
              <label>Background Color</label>
              <div className={styles.colorInput}>
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => updateTheme('backgroundColor', e.target.value)}
                />
                <span>{theme.backgroundColor}</span>
              </div>
            </div>
          </div>
        )}

        {/* Image Controls */}
        {theme.backgroundType === 'image' && (
          <div className={styles.imageControls}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            {theme.heroImage ? (
              <div className={styles.uploadedImage}>
                <img src={theme.heroImage} alt="Hero background" />
                <button className={styles.removeBtn} onClick={removeImage}>
                  <X size={16} /> Remove
                </button>
              </div>
            ) : (
              <button
                className={styles.uploadBtn}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload size={20} />
                {uploading ? 'Uploading...' : 'Upload Hero Image'}
              </button>
            )}
          </div>
        )}

        {/* Overlay Opacity */}
        <div className={styles.sliderWrapper}>
          <label>Overlay Opacity: {Math.round(theme.overlayOpacity * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={theme.overlayOpacity}
            onChange={(e) => updateTheme('overlayOpacity', parseFloat(e.target.value))}
          />
        </div>
      </section>

      {/* Preset Themes */}
      <section className={styles.section}>
        <h2>Preset Themes</h2>
        <div className={styles.presetsGrid}>
          {PRESET_THEMES.map(preset => (
            <button
              key={preset.id}
              className={`${styles.presetCard} ${selectedPreset === preset.id ? styles.selected : ''}`}
              onClick={() => selectPreset(preset)}
              style={{
                '--preset-bg': preset.theme.background,
                '--preset-primary': preset.theme.primary,
                '--preset-surface': preset.theme.surface,
              }}
            >
              <div className={styles.presetPreview}>
                <div className={styles.previewAccent} />
              </div>
              <span>{preset.name}</span>
              {selectedPreset === preset.id && (
                <Check size={16} className={styles.checkIcon} />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Colors */}
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

      {/* Fonts */}
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
