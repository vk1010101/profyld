import styles from './auth.module.css'

export default function AuthLayout({ children }) {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authBackground}>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
      </div>
      <div className={styles.authContent}>
        {children}
      </div>
    </div>
  )
}
