"use client";

import { useState, useEffect, useRef } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { useCV } from '../CVContext';
import styles from '../CVBuilder.module.css';

const ACTION_VERBS = [
    'Led', 'Managed', 'Developed', 'Created', 'Increased',
    'Reduced', 'Implemented', 'Designed', 'Launched', 'Achieved',
    'Improved', 'Delivered', 'Built', 'Executed', 'Streamlined'
];

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const EMPLOYMENT_TYPES = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Freelance'
];

const emptyExperience = {
    company: '',
    jobTitle: '',
    employmentType: 'Full-time',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    isCurrent: false,
    location: '',
    bullets: ['']
};

export default function Experience() {
    const { cvData, addExperience, updateExperience, removeExperience } = useCV();
    const { experiences } = cvData;
    const [localExperiences, setLocalExperiences] = useState(
        experiences.length > 0 ? experiences : [{ ...emptyExperience, id: Date.now() }]
    );

    // Sync initial empty experience to context if needed
    const initialized = useRef(false);
    useEffect(() => {
        if (!initialized.current) {
            if (experiences.length === 0 && localExperiences.length > 0) {
                localExperiences.forEach(exp => addExperience(exp));
            }
            initialized.current = true;
        }
    }, [addExperience, experiences.length, localExperiences]);

    const handleAddExperience = () => {
        const newExp = { ...emptyExperience, id: Date.now() };
        setLocalExperiences([...localExperiences, newExp]);
        addExperience(newExp);
    };

    const handleRemoveExperience = (id) => {
        if (localExperiences.length === 1) return;
        setLocalExperiences(localExperiences.filter(exp => exp.id !== id));
        removeExperience(id);
    };

    const handleUpdateExperience = (id, field, value) => {
        const updated = localExperiences.map(exp =>
            exp.id === id ? { ...exp, [field]: value } : exp
        );
        setLocalExperiences(updated);

        const exp = updated.find(e => e.id === id);
        if (exp) {
            updateExperience(id, exp);
        }
    };

    const handleAddBullet = (expId) => {
        const updated = localExperiences.map(exp => {
            if (exp.id === expId) {
                return { ...exp, bullets: [...exp.bullets, ''] };
            }
            return exp;
        });
        setLocalExperiences(updated);
    };

    const handleUpdateBullet = (expId, bulletIndex, value) => {
        const updated = localExperiences.map(exp => {
            if (exp.id === expId) {
                const newBullets = [...exp.bullets];
                newBullets[bulletIndex] = value;
                return { ...exp, bullets: newBullets };
            }
            return exp;
        });
        setLocalExperiences(updated);

        const exp = updated.find(e => e.id === expId);
        if (exp) {
            updateExperience(expId, exp);
        }
    };

    const handleRemoveBullet = (expId, bulletIndex) => {
        const updated = localExperiences.map(exp => {
            if (exp.id === expId && exp.bullets.length > 1) {
                const newBullets = exp.bullets.filter((_, i) => i !== bulletIndex);
                return { ...exp, bullets: newBullets };
            }
            return exp;
        });
        setLocalExperiences(updated);
    };

    const insertActionVerb = (expId, bulletIndex, verb) => {
        const exp = localExperiences.find(e => e.id === expId);
        if (exp) {
            const currentBullet = exp.bullets[bulletIndex] || '';
            const newValue = currentBullet ? `${verb} ${currentBullet}` : `${verb} `;
            handleUpdateBullet(expId, bulletIndex, newValue);
        }
    };

    // Sync to context when leaving
    const syncToContext = () => {
        localExperiences.forEach(exp => {
            if (experiences.find(e => e.id === exp.id)) {
                updateExperience(exp.id, exp);
            } else {
                addExperience(exp);
            }
        });
    };

    return (
        <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
                <span className={styles.stepEmoji}>💼</span>
                <h2 className={styles.stepTitle}>Time to brag!</h2>
                <p className={styles.stepSubtitle}>
                    What awesome things have you accomplished? Start with your most recent role.
                </p>
            </div>

            <div className={styles.repeatableSection}>
                {localExperiences.map((exp, index) => (
                    <div key={exp.id} className={styles.repeatableItem}>
                        <div className={styles.itemHeader}>
                            <span className={styles.itemNumber}>Experience #{index + 1}</span>
                            {localExperiences.length > 1 && (
                                <button
                                    className={styles.removeBtn}
                                    onClick={() => handleRemoveExperience(exp.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        <div className={styles.formGrid}>
                            <div className={`${styles.formGrid} ${styles.twoColumn}`}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>
                                        Company Name <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="Google, Microsoft, etc."
                                        value={exp.company}
                                        onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>
                                        Job Title <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="Software Engineer"
                                        value={exp.jobTitle}
                                        onChange={(e) => handleUpdateExperience(exp.id, 'jobTitle', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={`${styles.formGrid} ${styles.twoColumn}`}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Employment Type</label>
                                    <select
                                        className={styles.formSelect}
                                        value={exp.employmentType}
                                        onChange={(e) => handleUpdateExperience(exp.id, 'employmentType', e.target.value)}
                                    >
                                        {EMPLOYMENT_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Location</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="San Francisco, CA"
                                        value={exp.location}
                                        onChange={(e) => handleUpdateExperience(exp.id, 'location', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.dateRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Start Date</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <select
                                            className={styles.formSelect}
                                            value={exp.startMonth}
                                            onChange={(e) => handleUpdateExperience(exp.id, 'startMonth', e.target.value)}
                                            style={{ flex: 1 }}
                                        >
                                            <option value="">Month</option>
                                            {MONTHS.map(month => (
                                                <option key={month} value={month}>{month}</option>
                                            ))}
                                        </select>
                                        <select
                                            className={styles.formSelect}
                                            value={exp.startYear}
                                            onChange={(e) => handleUpdateExperience(exp.id, 'startYear', e.target.value)}
                                            style={{ flex: 1 }}
                                        >
                                            <option value="">Year</option>
                                            {YEARS.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {!exp.isCurrent && (
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>End Date</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <select
                                                className={styles.formSelect}
                                                value={exp.endMonth}
                                                onChange={(e) => handleUpdateExperience(exp.id, 'endMonth', e.target.value)}
                                                style={{ flex: 1 }}
                                            >
                                                <option value="">Month</option>
                                                {MONTHS.map(month => (
                                                    <option key={month} value={month}>{month}</option>
                                                ))}
                                            </select>
                                            <select
                                                className={styles.formSelect}
                                                value={exp.endYear}
                                                onChange={(e) => handleUpdateExperience(exp.id, 'endYear', e.target.value)}
                                                style={{ flex: 1 }}
                                            >
                                                <option value="">Year</option>
                                                {YEARS.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.checkboxWrapper}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    id={`current-${exp.id}`}
                                    checked={exp.isCurrent}
                                    onChange={(e) => handleUpdateExperience(exp.id, 'isCurrent', e.target.checked)}
                                />
                                <label className={styles.checkboxLabel} htmlFor={`current-${exp.id}`}>
                                    I currently work here
                                </label>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Achievements & Responsibilities <span className={styles.required}>*</span>
                                </label>

                                <div className={styles.actionVerbHint}>
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                                        Start with:
                                    </span>
                                    {ACTION_VERBS.slice(0, 8).map(verb => (
                                        <button
                                            key={verb}
                                            type="button"
                                            className={styles.verbChip}
                                            onClick={() => {
                                                const focusedIndex = exp.bullets.length - 1;
                                                insertActionVerb(exp.id, focusedIndex, verb);
                                            }}
                                        >
                                            {verb}
                                        </button>
                                    ))}
                                </div>

                                <div className={styles.bulletsList} style={{ marginTop: '1rem' }}>
                                    {exp.bullets.map((bullet, bulletIndex) => (
                                        <div key={bulletIndex} className={styles.bulletItem}>
                                            <input
                                                type="text"
                                                className={`${styles.formInput} ${styles.bulletInput}`}
                                                placeholder="Led a team of 5 engineers to deliver product 2 weeks ahead of schedule..."
                                                value={bullet}
                                                onChange={(e) => handleUpdateBullet(exp.id, bulletIndex, e.target.value)}
                                            />
                                            {exp.bullets.length > 1 && (
                                                <button
                                                    className={styles.bulletRemove}
                                                    onClick={() => handleRemoveBullet(exp.id, bulletIndex)}
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {exp.bullets.length < 5 && (
                                    <button
                                        type="button"
                                        className={styles.addBulletBtn}
                                        onClick={() => handleAddBullet(exp.id)}
                                    >
                                        <Plus size={16} /> Add another achievement
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                <button className={styles.addItemBtn} onClick={handleAddExperience}>
                    <Plus size={20} /> Add Another Experience
                </button>
            </div>
        </div>
    );
}
