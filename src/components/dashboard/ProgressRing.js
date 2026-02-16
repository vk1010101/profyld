'use client';

import styles from './ProgressRing.module.css';

export default function ProgressRing({
    percentage = 0,
    size = 120,
    strokeWidth = 8,
    color = '#c19a6b'
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className={styles.container} style={{ width: size, height: size }}>
            <svg className={styles.ring} width={size} height={size}>
                {/* Background circle */}
                <circle
                    className={styles.background}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    className={styles.progress}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ stroke: color }}
                />
            </svg>
            <div className={styles.label}>
                <span className={styles.percentage}>{percentage}%</span>
            </div>
        </div>
    );
}
