'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { getClient } from '@/lib/supabase/client';
import { SOCIAL_PLATFORMS } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from './social.module.css';

export default function SocialLinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = getClient();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('user_id', user.id)
      .order('display_order');

    if (!error && data) {
      setLinks(data);
    }
    setLoading(false);
  };

  const addLink = () => {
    setLinks(prev => [...prev, {
      id: `new-${Date.now()}`,
      platform: 'linkedin',
      url: '',
      display_order: prev.length,
      isNew: true,
    }]);
  };

  const updateLink = (id, field, value) => {
    setLinks(prev => prev.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const removeLink = async (id) => {
    const link = links.find(l => l.id === id);
    
    if (!link.isNew) {
      await supabase.from('social_links').delete().eq('id', id);
    }
    
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  const saveLinks = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    for (const link of links) {
      if (!link.url) continue;

      if (link.isNew) {
        const { id, isNew, ...linkData } = link;
        await supabase.from('social_links').insert({
          ...linkData,
          user_id: user.id,
        });
      } else {
        const { id, ...linkData } = link;
        await supabase.from('social_links').update(linkData).eq('id', id);
      }
    }

    await fetchLinks();
    setSaving(false);
  };

  if (loading) {
    return <div className={styles.loading}>Loading social links...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Social Links</h1>
        <Button onClick={saveLinks} loading={saving}>
          <Save size={18} />
          Save
        </Button>
      </div>

      <div className={styles.linksCard}>
        <div className={styles.linksList}>
          {links.map(link => (
            <div key={link.id} className={styles.linkItem}>
              <select
                value={link.platform}
                onChange={(e) => updateLink(link.id, 'platform', e.target.value)}
                className={styles.platformSelect}
              >
                {SOCIAL_PLATFORMS.map(platform => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </select>

              <Input
                placeholder="https://..."
                value={link.url}
                onChange={(e) => updateLink(link.id, 'url', e.target.value)}
              />

              <Button 
                variant="ghost" 
                size="small"
                onClick={() => removeLink(link.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}

          {links.length === 0 && (
            <p className={styles.emptyMessage}>
              No social links added yet
            </p>
          )}
        </div>

        <Button variant="secondary" onClick={addLink} fullWidth>
          <Plus size={18} />
          Add Social Link
        </Button>
      </div>
    </div>
  );
}
