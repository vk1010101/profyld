import styles from './DashboardSkeleton.module.css';

export default function DashboardSkeleton() {
    return (
        <div className={styles.container}>
            {/* Hero Banner Skeleton */}
            <div className={`${styles.skeleton} ${styles.banner}`} />

            {/* Stats Grid Skeleton */}
            <div className={styles.statsGrid}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`${styles.skeleton} ${styles.statCard}`} />
                ))}
            </div>

            {/* Content Grid Skeleton */}
            <div className={styles.contentGrid}>
                <div className={styles.leftColumn}>
                    <div className={`${styles.skeleton} ${styles.largeBox}`} />
                    <div className={`${styles.skeleton} ${styles.mediumBox}`} />
                </div>
                <div className={styles.rightColumn}>
                    <div className={`${styles.skeleton} ${styles.largeBox}`} />
                </div>
            </div>
        </div>
    );
}
