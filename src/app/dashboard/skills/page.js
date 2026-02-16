'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { getClient } from '@/lib/supabase/client';
import { SKILL_CATEGORIES } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from './skills.module.css';

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = getClient();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', user.id)
      .order('category')
      .order('display_order');

    if (!error && data) {
      setSkills(data);
    }
    setLoading(false);
  };

  const addSkill = (category) => {
    setSkills(prev => [...prev, {
      id: `new-${Date.now()}`,
      category,
      name: '',
      level: 75, // Default to 75% proficiency
      description: '',
      display_order: prev.filter(s => s.category === category).length,
      isNew: true,
    }]);
  };

  const updateSkill = (id, field, value) => {
    setSkills(prev => prev.map(skill =>
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const removeSkill = async (id) => {
    const skill = skills.find(s => s.id === id);

    if (!skill.isNew) {
      await supabase.from('skills').delete().eq('id', id);
    }

    setSkills(prev => prev.filter(s => s.id !== id));
  };

  const saveSkills = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    for (const skill of skills) {
      if (skill.isNew) {
        const { id, isNew, ...skillData } = skill;
        await supabase.from('skills').insert({
          ...skillData,
          user_id: user.id,
        });
      } else {
        const { id, ...skillData } = skill;
        await supabase.from('skills').update(skillData).eq('id', id);
      }
    }

    await fetchSkills();
    setSaving(false);
  };

  const getSkillsByCategory = (category) =>
    skills.filter(s => s.category === category);

  // Get proficiency label based on level
  const getProficiencyLabel = (level) => {
    if (level >= 90) return 'Expert';
    if (level >= 75) return 'Advanced';
    if (level >= 50) return 'Intermediate';
    if (level >= 25) return 'Beginner';
    return 'Learning';
  };

  if (loading) {
    return <div className={styles.loading}>Loading skills...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Skills</h1>
        <Button onClick={saveSkills} loading={saving}>
          <Save size={18} />
          Save All
        </Button>
      </div>

      <p className={styles.description}>
        Add your skills with proficiency levels. The progress bar will display on your portfolio.
      </p>

      {SKILL_CATEGORIES.map(category => (
        <div key={category.id} className={styles.categorySection}>
          <div className={styles.categoryHeader}>
            <h2>{category.name}</h2>
            <Button
              variant="ghost"
              size="small"
              onClick={() => addSkill(category.id)}
            >
              <Plus size={16} />
              Add
            </Button>
          </div>

          <div className={styles.skillsList}>
            {getSkillsByCategory(category.id).map(skill => (
              <div key={skill.id} className={styles.skillItem}>
                <div className={styles.skillRow}>
                  <Input
                    placeholder="Skill name"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => removeSkill(skill.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                {/* Proficiency slider for ALL categories */}
                <div className={styles.levelSlider}>
                  <div className={styles.sliderHeader}>
                    <span className={styles.sliderLabel}>Proficiency</span>
                    <span className={styles.levelBadge}>
                      {getProficiencyLabel(skill.level || 0)} ({skill.level || 0}%)
                    </span>
                  </div>
                  <div className={styles.sliderContainer}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.level || 0}
                      onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <div
                      className={styles.sliderProgress}
                      style={{ width: `${skill.level || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {getSkillsByCategory(category.id).length === 0 && (
              <p className={styles.emptyMessage}>
                No {category.name.toLowerCase()} added yet. Click Add to get started.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

