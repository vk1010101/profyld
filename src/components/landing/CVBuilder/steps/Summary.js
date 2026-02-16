"use client";

import { useState } from 'react';
import { useCV } from '../CVContext';
import styles from '../CVBuilder.module.css';

const INDUSTRIES = [
    'Technology / Software',
    'Finance / Banking',
    'Healthcare',
    'Marketing / Advertising',
    'Education',
    'Manufacturing',
    'Retail / E-commerce',
    'Consulting',
    'Government / Public Sector',
    'Non-profit',
    'Media / Entertainment',
    'Legal',
    'Real Estate',
    'Hospitality / Tourism',
    'Construction',
    'Transportation / Logistics',
    'Other'
];

const EXPERIENCE_LEVELS = [
    { value: '0-1', label: 'Entry Level (0-1 years)' },
    { value: '1-3', label: 'Junior (1-3 years)' },
    { value: '3-5', label: 'Mid-Level (3-5 years)' },
    { value: '5-10', label: 'Senior (5-10 years)' },
    { value: '10+', label: 'Executive (10+ years)' },
];

export default function Summary() {
    const { cvData, updateSummary } = useCV();
    const { summary } = cvData;
    const [charCount, setCharCount] = useState(summary.summaryText?.length || 0);

    const handleSummaryChange = (value) => {
        setCharCount(value.length);
        updateSummary('summaryText', value);
    };

    const getCharCountClass = () => {
        if (charCount === 0) return '';
        if (charCount < 100) return styles.warning;
        if (charCount <= 300) return styles.good;
        return styles.warning;
    };

    return (
        <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
                <span className={styles.stepEmoji}>🚀</span>
                <h2 className={styles.stepTitle}>Your elevator pitch</h2>
                <p className={styles.stepSubtitle}>
                    Tell the world who you are in 2-3 sentences!
                </p>
            </div>

            <div className={styles.formGrid}>
                <div className={`${styles.formGrid} ${styles.twoColumn}`}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            Current / Desired Job Title <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.formInput}
                            placeholder="e.g., Senior Software Engineer"
                            value={summary.jobTitle}
                            onChange={(e) => updateSummary('jobTitle', e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            Years of Experience <span className={styles.required}>*</span>
                        </label>
                        <select
                            className={styles.formSelect}
                            value={summary.yearsExperience}
                            onChange={(e) => updateSummary('yearsExperience', e.target.value)}
                        >
                            <option value="">Select experience level</option>
                            {EXPERIENCE_LEVELS.map(level => (
                                <option key={level.value} value={level.value}>
                                    {level.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                        Industry / Field <span className={styles.required}>*</span>
                    </label>
                    <select
                        className={styles.formSelect}
                        value={summary.industry}
                        onChange={(e) => updateSummary('industry', e.target.value)}
                    >
                        <option value="">Select your industry</option>
                        {INDUSTRIES.map(industry => (
                            <option key={industry} value={industry}>
                                {industry}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                        Professional Summary <span className={styles.required}>*</span>
                    </label>
                    <textarea
                        className={styles.formTextarea}
                        placeholder="Results-driven software engineer with 5+ years of experience building scalable web applications. Passionate about clean code and user experience. Seeking to leverage expertise in React and Node.js to drive innovation at a forward-thinking company."
                        value={summary.summaryText}
                        onChange={(e) => handleSummaryChange(e.target.value)}
                        rows={5}
                    />
                    <div className={`${styles.charCount} ${getCharCountClass()}`}>
                        {charCount}/300 characters {charCount >= 100 && charCount <= 300 && '✓ Perfect length!'}
                    </div>
                </div>
            </div>
        </div>
    );
}
