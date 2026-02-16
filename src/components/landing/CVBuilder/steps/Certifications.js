"use client";

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCV } from '../CVContext';
import styles from '../CVBuilder.module.css';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);

export default function Certifications() {
    const { cvData, addCertification, removeCertification, addAward, removeAward } = useCV();
    const { certifications, awards } = cvData;

    const [certForm, setCertForm] = useState({
        name: '',
        issuer: '',
        month: '',
        year: '',
        credentialUrl: ''
    });

    const [awardForm, setAwardForm] = useState({
        name: '',
        issuer: '',
        year: ''
    });

    const handleAddCertification = () => {
        if (!certForm.name || !certForm.issuer) return;
        addCertification({
            ...certForm,
            date: certForm.month && certForm.year ? `${certForm.month} ${certForm.year}` : certForm.year
        });
        setCertForm({ name: '', issuer: '', month: '', year: '', credentialUrl: '' });
    };

    const handleAddAward = () => {
        if (!awardForm.name) return;
        addAward(awardForm);
        setAwardForm({ name: '', issuer: '', year: '' });
    };

    return (
        <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
                <span className={styles.stepEmoji}>⭐</span>
                <h2 className={styles.stepTitle}>Any extra gold stars?</h2>
                <p className={styles.stepSubtitle}>
                    Certifications and awards make you stand out! (Optional)
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Certifications Section */}
                <div>
                    <h3 style={{
                        fontSize: '1.125rem',
                        color: 'var(--accent-color)',
                        marginBottom: '1rem',
                        fontWeight: 600
                    }}>
                        Certifications
                    </h3>

                    {/* Existing Certifications */}
                    {certifications.length > 0 && (
                        <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {certifications.map((cert) => (
                                <div
                                    key={cert.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.75rem 1rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                >
                                    <div>
                                        <div style={{ color: '#fff', fontWeight: 500 }}>{cert.name}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                                            {cert.issuer} {cert.date && `• ${cert.date}`}
                                        </div>
                                    </div>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => removeCertification(cert.id)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Certification Form */}
                    <div className={styles.repeatableItem}>
                        <div className={styles.formGrid}>
                            <div className={`${styles.formGrid} ${styles.twoColumn}`}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Certification Name</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="AWS Certified Solutions Architect"
                                        value={certForm.name}
                                        onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Issuing Organization</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="Amazon Web Services"
                                        value={certForm.issuer}
                                        onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className={`${styles.formGrid} ${styles.twoColumn}`}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Date Obtained</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <select
                                            className={styles.formSelect}
                                            value={certForm.month}
                                            onChange={(e) => setCertForm({ ...certForm, month: e.target.value })}
                                            style={{ flex: 1 }}
                                        >
                                            <option value="">Month</option>
                                            {MONTHS.map(month => (
                                                <option key={month} value={month}>{month}</option>
                                            ))}
                                        </select>
                                        <select
                                            className={styles.formSelect}
                                            value={certForm.year}
                                            onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
                                            style={{ flex: 1 }}
                                        >
                                            <option value="">Year</option>
                                            {YEARS.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Credential URL (Optional)</label>
                                    <input
                                        type="url"
                                        className={styles.formInput}
                                        placeholder="https://..."
                                        value={certForm.credentialUrl}
                                        onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                className={styles.addItemBtn}
                                onClick={handleAddCertification}
                                style={{ marginTop: '0.5rem' }}
                            >
                                <Plus size={18} /> Add Certification
                            </button>
                        </div>
                    </div>
                </div>

                {/* Awards Section */}
                <div>
                    <h3 style={{
                        fontSize: '1.125rem',
                        color: 'var(--accent-color)',
                        marginBottom: '1rem',
                        fontWeight: 600
                    }}>
                        Awards & Achievements
                    </h3>

                    {/* Existing Awards */}
                    {awards.length > 0 && (
                        <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {awards.map((award) => (
                                <div
                                    key={award.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.75rem 1rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                >
                                    <div>
                                        <div style={{ color: '#fff', fontWeight: 500 }}>{award.name}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                                            {award.issuer} {award.year && `• ${award.year}`}
                                        </div>
                                    </div>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => removeAward(award.id)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Award Form */}
                    <div className={styles.repeatableItem}>
                        <div className={`${styles.formGrid} ${styles.twoColumn}`}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Award Name</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    placeholder="Employee of the Year"
                                    value={awardForm.name}
                                    onChange={(e) => setAwardForm({ ...awardForm, name: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Issuer</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    placeholder="Company or Organization"
                                    value={awardForm.issuer}
                                    onChange={(e) => setAwardForm({ ...awardForm, issuer: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Year</label>
                                <select
                                    className={styles.formSelect}
                                    value={awardForm.year}
                                    onChange={(e) => setAwardForm({ ...awardForm, year: e.target.value })}
                                >
                                    <option value="">Select year</option>
                                    {YEARS.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <button
                                    type="button"
                                    className={styles.addItemBtn}
                                    onClick={handleAddAward}
                                    style={{ width: '100%' }}
                                >
                                    <Plus size={18} /> Add Award
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
