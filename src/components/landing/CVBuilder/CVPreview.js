"use client";

import { useRef, useState, useEffect } from 'react';
import { FileText, Sparkles, Wand2, ShieldCheck, AlertTriangle, Lightbulb } from 'lucide-react';
import { useCV } from './CVContext';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import AcademicTemplate from './templates/AcademicTemplate';
import TechMinimalTemplate from './templates/TechMinimalTemplate';
import styles from './CVBuilder.module.css';

const TEMPLATES = [
    {
        id: 'modern',
        name: 'Modern Minimal',
        description: 'Tech & Startups',
        component: ModernTemplate,
        gradient: 'linear-gradient(#fff, #e6fffa)'
    },
    {
        id: 'classic',
        name: 'Classic Professional',
        description: 'Corporate & Finance',
        component: ClassicTemplate,
        gradient: 'linear-gradient(#fff, #e8f0f8)'
    },
    {
        id: 'executive',
        name: 'Executive Bold',
        description: 'Leadership Roles',
        component: ExecutiveTemplate,
        gradient: 'linear-gradient(#fffdf7, #f0e6c8)'
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Designers & Artists',
        component: CreativeTemplate,
        gradient: 'linear-gradient(135deg, #667eea20, #764ba220)'
    },
    {
        id: 'academic',
        name: 'Academic',
        description: 'Research & Education',
        component: AcademicTemplate,
        gradient: 'linear-gradient(#fafafa, #f0f0f0)'
    },
    {
        id: 'tech',
        name: 'Tech Terminal',
        description: 'Developers & Engineers',
        component: TechMinimalTemplate,
        gradient: 'linear-gradient(#18181b, #27272a)'
    }
];


// Thumbnail Component
function Thumbnail({ Template, cvData, gradient }) {
    // A4 Dimensions in PX (96 DPI)
    const A4_WIDTH = 794;
    const A4_HEIGHT = 1123;

    // We want the thumbnail to be about 220px wide (fits nicely in the grid)
    const THUMB_WIDTH = 220;
    const SCALE = THUMB_WIDTH / A4_WIDTH;
    const THUMB_HEIGHT = (A4_HEIGHT * SCALE) * 0.5; // Cut length by half as requested

    return (
        <div
            className={styles.templateThumb}
            style={{
                width: `${THUMB_WIDTH}px`,
                height: `${THUMB_HEIGHT}px`,
                overflow: 'hidden',
                position: 'relative',
                background: '#fff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                margin: '0 auto 12px'
            }}
        >
            <div style={{
                width: `${A4_WIDTH}px`,
                minHeight: `${A4_HEIGHT}px`,
                transform: `scale(${SCALE})`,
                transformOrigin: 'top left',
                pointerEvents: 'none', // Disable interaction in thumbnail
                userSelect: 'none',
                background: '#fff'
            }}>
                <Template cvData={cvData} />
            </div>
        </div>
    );
}

export default function CVPreview({ onExport }) {
    const { cvData, selectedTemplate, setSelectedTemplate, goToStep } = useCV();
    const previewRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const CurrentTemplate = TEMPLATES.find(t => t.id === selectedTemplate)?.component || ModernTemplate;

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const response = await fetch('/api/analyze-cv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cvData })
            });
            const data = await response.json();
            if (data.success) {
                setAnalysis(data.analysis);
            }
        } catch (err) {
            console.error('Analysis failed:', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Allow clicking sections to navigate (Main Preview Only)
    const handleSectionClick = (section) => {
        const stepMap = {
            'personal': 1,
            'summary': 2,
            'experience': 3,
            'education': 4,
            'skills': 5,
            'certifications': 6,
            'awards': 6
        };
        const key = section.toLowerCase();
        if (stepMap[key]) {
            goToStep(stepMap[key]);
        }
    };

    const handlePrintPDF = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow && previewRef.current) {
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${cvData.personal.fullName || 'Resume'} - CV</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Georgia&family=Montserrat:wght@400;600;700;800&display=swap');
              body { margin: 0; padding: 0; }
              @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            ${previewRef.current.innerHTML}
          </body>
        </html>
      `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        }
    };

    return (
        <div className={styles.stepContent} style={{ maxWidth: '900px' }}>
            <div className={styles.stepHeader}>
                <span className={styles.stepEmoji}>🎉</span>
                <h2 className={styles.stepTitle}>Your CV is ready!</h2>
                <p className={styles.stepSubtitle}>
                    Preview, choose a template, and download your professional CV
                </p>
            </div>

            {/* Template Selector */}
            <div className={styles.templateSelector}>
                {TEMPLATES.map(template => (
                    <div
                        key={template.id}
                        className={`${styles.templateOption} ${selectedTemplate === template.id ? styles.selected : ''}`}
                        onClick={() => setSelectedTemplate(template.id)}
                    >
                        <Thumbnail
                            Template={template.component}
                            cvData={cvData}
                            gradient={template.gradient}
                        />
                        <div className={styles.templateName}>{template.name}</div>
                        <div className={styles.templateDesc}>{template.description}</div>
                    </div>
                ))}
            </div>

            {/* AI Analysis Section */}
            {!analysis ? (
                <button
                    className={styles.magicBtn}
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                >
                    {isAnalyzing ? (
                        <>Analyzing Your CV...</>
                    ) : (
                        <>
                            <Wand2 size={20} />
                            Analyze CV with AI Impact Booster
                        </>
                    )}
                </button>
            ) : (
                <div className={styles.analysisCard}>
                    <div className={styles.analysisHeader}>
                        <div className={styles.analysisSummary}>
                            <h3>AI Analysis Report</h3>
                            <p>{analysis.summary}</p>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-color)' }}>
                                <strong>Target Roles:</strong> {analysis.roleFit}
                            </div>
                        </div>
                        <div className={styles.analysisScore}>
                            <div className={styles.scoreCircle}>
                                {analysis.score}%
                            </div>
                            <span className={styles.scoreLabel}>Impact Score</span>
                        </div>
                    </div>

                    <div className={styles.analysisGrid}>
                        <div className={styles.analysisItem}>
                            <h4><ShieldCheck size={16} /> Strengths</h4>
                            <ul className={styles.analysisList}>
                                {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                        <div className={styles.analysisItem}>
                            <h4><AlertTriangle size={16} /> Improvements</h4>
                            <ul className={styles.analysisList}>
                                {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                            </ul>
                        </div>
                    </div>

                    <div className={styles.analysisItem} style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                        <h4><Lightbulb size={16} /> Pro Tips to Boost Your Score</h4>
                        <ul className={styles.analysisList}>
                            {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                </div>
            )}

            {/* CV Preview */}
            <div
                ref={previewRef}
                style={{
                    background: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    marginBottom: '2rem'
                }}
            >
                <CurrentTemplate cvData={cvData} onSectionClick={handleSectionClick} />
            </div>

            {/* Export Buttons */}
            <div className={styles.exportSection}>
                <div className={styles.exportButtons}>

                    <button
                        className={`${styles.exportBtn} ${styles.pdf}`}
                        onClick={handlePrintPDF}
                        disabled={isExporting}
                        style={{ width: '100%' }}
                    >
                        <FileText size={20} />
                        Download PDF
                    </button>
                    {/* DOCX Removed as per request */}
                </div>
                {isExporting && (
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '1rem' }}>
                        Generating your document...
                    </p>
                )}
            </div>

            {/* CTA Section */}
            <div className={styles.ctaSection}>
                <div className={styles.ctaEmoji}>✨</div>
                <h3 className={styles.ctaTitle}>But wait... A PDF can only do so much!</h3>
                <p className={styles.ctaSubtitle}>
                    Turn your CV into a stunning <strong>Digital Portfolio</strong> that stands out.
                    Add projects, images, and make it truly yours.
                </p>
                <a href="/" className={styles.ctaBtn}>
                    <Sparkles size={20} />
                    Create Your Digital Portfolio
                </a>
            </div>
        </div>
    );
}
