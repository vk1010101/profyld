'use client';

import { Eye, Globe, CheckCircle, AlertTriangle, Shield, Search } from 'lucide-react';
import styles from './SidebarStatus.module.css';

export default function SidebarStatus({
    livePreviewEnabled = false,
    domainConnected = false,
    portfolioPublished = false,
    sslActive = false,
    seoStatus = 'warning' // 'ok', 'warning', 'error'
}) {
    const statusItems = [
        {
            label: 'Live Preview',
            active: livePreviewEnabled,
            icon: Eye,
            activeColor: '#22c55e',
        },
        {
            label: 'Domain',
            active: domainConnected,
            icon: Globe,
            activeColor: '#22c55e',
            inactiveLabel: 'Not Connected',
        },
        {
            label: 'Portfolio Published',
            active: portfolioPublished,
            icon: CheckCircle,
            activeColor: '#22c55e',
        },
        {
            label: 'SSL Active',
            active: sslActive,
            icon: Shield,
            activeColor: '#22c55e',
        },
        {
            label: 'SEO',
            active: seoStatus === 'ok',
            icon: Search,
            activeColor: seoStatus === 'ok' ? '#22c55e' : '#f59e0b',
            inactiveLabel: seoStatus === 'error' ? 'Missing Meta' : 'Needs Attention',
        },
    ];

    return (
        <div className={styles.container}>
            {statusItems.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div
                        key={index}
                        className={`${styles.item} ${item.active ? styles.active : styles.inactive}`}
                    >
                        <div
                            className={styles.indicator}
                            style={{ backgroundColor: item.active ? item.activeColor : '#ef4444' }}
                        />
                        <Icon size={14} className={styles.icon} />
                        <span className={styles.label}>{item.label}</span>
                        {!item.active && item.inactiveLabel && (
                            <span className={styles.warning}>{item.inactiveLabel}</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
