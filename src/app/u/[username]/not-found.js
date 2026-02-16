import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>This portfolio doesn't exist.</p>
        <p className={styles.hint}>
          The username you're looking for might be misspelled or hasn't been claimed yet.
        </p>
        <Link href="/signup" className={styles.cta}>
          Create Your Portfolio
        </Link>
      </div>
    </div>
  );
}
