'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from './StatsCard.module.css';

export default function StatsCard({
    label,
    value,
    trend = null,  // percentage change, positive or negative
    period = '7 days',
    icon: Icon = null
}) {
    const isPositive = trend > 0;
    const showTrend = trend !== null && trend !== 0;

    return (
        <div className={styles.card}>
            {Icon && (
                <div className={styles.iconWrapper}>
                    <Icon size={18} />
                </div>
            )}
            <div className={styles.content}>
                <span className={styles.value}>{value.toLocaleString()}</span>
                <div className={styles.meta}>
                    {showTrend && (
                        <span className={`${styles.trend} ${isPositive ? styles.positive : styles.negative}`}>
                            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {isPositive ? '+' : ''}{trend}%
                        </span>
                    )}
                    <span className={styles.period}>{period}</span>
                </div>
                <span className={styles.label}>{label}</span>
            </div>
        </div>
    );
}
