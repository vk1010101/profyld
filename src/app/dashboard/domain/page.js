'use client';

import DomainSettings from '@/components/dashboard/DomainSettings';
import styles from './domain.module.css';

export default function DomainPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Domain Settings</h1>
                <p className={styles.subtitle}>
                    Connect your custom domain to make your portfolio truly yours
                </p>
            </div>
            <DomainSettings />
        </div>
    );
}
