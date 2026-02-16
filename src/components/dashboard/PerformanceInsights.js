'use client';

import { Linkedin, Github, Globe, ChevronRight } from 'lucide-react';
import styles from './PerformanceInsights.module.css';

const referrerIcons = {
    linkedin: Linkedin,
    github: Github,
    direct: Globe,
};

export default function PerformanceInsights({
    referrers = [],
    topProject = null
}) {
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Performance Insights</h3>

            {/* Top Referrers */}
            <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Top Referrers</h4>
                <div className={styles.referrersList}>
                    {referrers.map((ref, index) => {
                        const Icon = referrerIcons[ref.type] || Globe;
                        return (
                            <div key={index} className={styles.referrerItem}>
                                <div className={styles.referrerIcon}>
                                    <Icon size={18} />
                                </div>
                                <span className={styles.referrerName}>{ref.name}</span>
                                <span className={styles.referrerCount}>({ref.clicks} clicks)</span>
                                <ChevronRight size={16} className={styles.arrow} />
                            </div>
                        );
                    })}
                    {referrers.length === 0 && (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📊</div>
                            <span className={styles.emptyText}>No traffic data</span>
                            <span className={styles.emptySub}>Share your portfolio to see stats</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Best Performing Project */}
            <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Best Performing Project</h4>
                {topProject ? (
                    <div className={styles.projectCard}>
                        <div className={styles.projectIcon}>
                            {topProject.icon || '🚀'}
                        </div>
                        <span className={styles.projectName}>{topProject.name}</span>
                        <span className={styles.projectClicks}>({topProject.clicks} clicks)</span>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🚀</div>
                        <span className={styles.emptyText}>No top project</span>
                        <span className={styles.emptySub}>Add projects to track performance</span>
                    </div>
                )}
            </div>
        </div>
    );
}
