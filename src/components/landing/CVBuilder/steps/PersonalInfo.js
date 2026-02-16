"use client";

import { useCV } from '../CVContext';
import styles from '../CVBuilder.module.css';

export default function PersonalInfo() {
    const { cvData, updatePersonal } = useCV();
    const { personal } = cvData;

    return (
        <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
                <span className={styles.stepEmoji}>👤</span>
                <h2 className={styles.stepTitle}>Let's start with the basics</h2>
                <p className={styles.stepSubtitle}>
                    Tell us who you are — this goes at the top of your CV!
                </p>
            </div>

            <div className={`${styles.formGrid} ${styles.twoColumn}`}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                        Full Name <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        className={styles.formInput}
                        placeholder="John Doe"
                        value={personal.fullName}
                        onChange={(e) => updatePersonal('fullName', e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                        Professional Email <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="email"
                        className={styles.formInput}
                        placeholder="john.doe@email.com"
                        value={personal.email}
                        onChange={(e) => updatePersonal('email', e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                        Phone Number <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="tel"
                        className={styles.formInput}
                        placeholder="+1 (555) 123-4567"
                        value={personal.phone}
                        onChange={(e) => updatePersonal('phone', e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                        Location <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        className={styles.formInput}
                        placeholder="City, Country"
                        value={personal.location}
                        onChange={(e) => updatePersonal('location', e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>LinkedIn Profile URL</label>
                    <input
                        type="url"
                        className={styles.formInput}
                        placeholder="https://linkedin.com/in/johndoe"
                        value={personal.linkedinUrl}
                        onChange={(e) => updatePersonal('linkedinUrl', e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Portfolio / Website</label>
                    <input
                        type="url"
                        className={styles.formInput}
                        placeholder="https://johndoe.com"
                        value={personal.portfolioUrl}
                        onChange={(e) => updatePersonal('portfolioUrl', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
