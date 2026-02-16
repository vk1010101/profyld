"use client";

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCV } from '../CVContext';
import styles from '../CVBuilder.module.css';

const DEGREE_TYPES = [
    'High School Diploma',
    'Associate Degree',
    "Bachelor's Degree",
    "Master's Degree",
    'PhD / Doctorate',
    'Bootcamp / Certificate',
    'Professional Certification',
    'Other'
];

const YEARS = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() + 5 - i);

const emptyEducation = {
    institution: '',
    degree: '',
    fieldOfStudy: '',
    graduationYear: '',
    gpa: '',
    relevantCoursework: '',
    honors: ''
};

export default function Education() {
    const { cvData, addEducation, updateEducation, removeEducation } = useCV();
    const { education } = cvData;
    const [localEducation, setLocalEducation] = useState(
        education.length > 0 ? education : [{ ...emptyEducation, id: Date.now() }]
    );

    // Sync initial empty education to context if needed
    const initialized = useRef(false);
    useEffect(() => {
        if (!initialized.current) {
            if (education.length === 0 && localEducation.length > 0) {
                localEducation.forEach(edu => addEducation(edu));
            }
            initialized.current = true;
        }
    }, [addEducation, education.length, localEducation]);

    const handleAddEducation = () => {
        const newEdu = { ...emptyEducation, id: Date.now() };
        setLocalEducation([...localEducation, newEdu]);
        addEducation(newEdu);
    };

    const handleRemoveEducation = (id) => {
        if (localEducation.length === 1) return;
        setLocalEducation(localEducation.filter(edu => edu.id !== id));
        removeEducation(id);
    };

    const handleUpdateEducation = (id, field, value) => {
        const updated = localEducation.map(edu =>
            edu.id === id ? { ...edu, [field]: value } : edu
        );
        setLocalEducation(updated);

        const edu = updated.find(e => e.id === id);
        if (edu) {
            updateEducation(id, edu);
        }
    };

    return (
        <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
                <span className={styles.stepEmoji}>🎓</span>
                <h2 className={styles.stepTitle}>Where'd you get all those smarts?</h2>
                <p className={styles.stepSubtitle}>
                    Add your educational background, starting with the most recent.
                </p>
            </div>

            <div className={styles.repeatableSection}>
                {localEducation.map((edu, index) => (
                    <div key={edu.id} className={styles.repeatableItem}>
                        <div className={styles.itemHeader}>
                            <span className={styles.itemNumber}>Education #{index + 1}</span>
                            {localEducation.length > 1 && (
                                <button
                                    className={styles.removeBtn}
                                    onClick={() => handleRemoveEducation(edu.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Institution Name <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    placeholder="Stanford University"
                                    value={edu.institution}
                                    onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                                />
                            </div>

                            <div className={`${styles.formGrid} ${styles.twoColumn}`}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>
                                        Degree Type <span className={styles.required}>*</span>
                                    </label>
                                    <select
                                        className={styles.formSelect}
                                        value={edu.degree}
                                        onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                                    >
                                        <option value="">Select degree</option>
                                        {DEGREE_TYPES.map(degree => (
                                            <option key={degree} value={degree}>{degree}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>
                                        Field of Study <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="Computer Science"
                                        value={edu.fieldOfStudy}
                                        onChange={(e) => handleUpdateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={`${styles.formGrid} ${styles.twoColumn}`}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Graduation Year</label>
                                    <select
                                        className={styles.formSelect}
                                        value={edu.graduationYear}
                                        onChange={(e) => handleUpdateEducation(edu.id, 'graduationYear', e.target.value)}
                                    >
                                        <option value="">Select year</option>
                                        {YEARS.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>GPA (Optional)</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="3.8 / 4.0"
                                        value={edu.gpa}
                                        onChange={(e) => handleUpdateEducation(edu.id, 'gpa', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Relevant Coursework (Optional)</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    placeholder="Data Structures, Machine Learning, Web Development..."
                                    value={edu.relevantCoursework}
                                    onChange={(e) => handleUpdateEducation(edu.id, 'relevantCoursework', e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Honors & Awards (Optional)</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    placeholder="Dean's List, Summa Cum Laude..."
                                    value={edu.honors}
                                    onChange={(e) => handleUpdateEducation(edu.id, 'honors', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button className={styles.addItemBtn} onClick={handleAddEducation}>
                    <Plus size={20} /> Add Another Education
                </button>
            </div>
        </div>
    );
}
