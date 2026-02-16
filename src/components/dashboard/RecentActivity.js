'use client';

import { FileText, Palette, Briefcase, FolderOpen, Settings } from 'lucide-react';
import styles from './RecentActivity.module.css';

const activityIcons = {
    resume: FileText,
    theme: Palette,
    skills: Settings,
    experience: Briefcase,
    project: FolderOpen,
};

export default function RecentActivity({ activities = [] }) {
    const formatTime = (timestamp) => {
        const now = new Date();
        const date = new Date(timestamp);
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className={styles.container}>
            <h4 className={styles.title}>Recent Activity</h4>
            <div className={styles.list}>
                {activities.map((activity, index) => {
                    const Icon = activityIcons[activity.type] || FileText;
                    return (
                        <div key={index} className={styles.item}>
                            <div className={styles.icon}>
                                <Icon size={14} />
                            </div>
                            <div className={styles.content}>
                                <span className={styles.label}>{activity.label}</span>
                                <span className={styles.description}>{activity.description}</span>
                            </div>
                            <span className={styles.time}>{formatTime(activity.timestamp)}</span>
                        </div>
                    );
                })}
                {activities.length === 0 && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>⏳</div>
                        <span className={styles.emptyText}>No activity yet</span>
                        <span className={styles.emptySub}>Actions you take will appear here</span>
                    </div>
                )}
            </div>
        </div>
    );
}
