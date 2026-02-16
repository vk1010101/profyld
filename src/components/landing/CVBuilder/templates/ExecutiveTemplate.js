"use client";

// Executive Bold CV Template
export default function ExecutiveTemplate({ cvData, onSectionClick }) {
    const { personal, summary, experiences, education, skills, certifications, awards } = cvData;

    const handleSectionClick = (e, section) => {
        if (onSectionClick) {
            e.stopPropagation();
            onSectionClick(section);
        }
    };

    const sectionStyle = {
        cursor: onSectionClick ? 'pointer' : 'default',
        transition: 'background 0.2s',
    };

    const mouseEnter = (e) => {
        if (onSectionClick) e.currentTarget.style.boxShadow = '0 0 0 2px rgba(184, 134, 11, 0.3)';
    };

    const mouseLeave = (e) => {
        if (onSectionClick) e.currentTarget.style.boxShadow = 'none';
    };

    return (
        <div style={{
            fontFamily: "'Montserrat', 'Arial', sans-serif",
            color: '#2c2c2c',
            padding: '40px',
            background: '#fffdf7',
            lineHeight: 1.5,
            fontSize: '10pt',
            minHeight: '100%'
        }}>
            {/* Header */}
            <header
                onClick={(e) => handleSectionClick(e, 'personal')}
                onMouseEnter={mouseEnter}
                onMouseLeave={mouseLeave}
                style={{ marginBottom: '28px', borderRadius: '4px', padding: '10px', ...sectionStyle }}>
                <h1 style={{
                    fontSize: '28pt',
                    fontWeight: 800,
                    color: '#1a1a1a',
                    margin: 0,
                    marginBottom: '6px',
                    letterSpacing: '-0.5px'
                }}>
                    {personal.fullName || 'Your Name'}
                </h1>
                <div style={{
                    fontSize: '14pt',
                    color: '#b8860b',
                    fontWeight: 600,
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                }}>
                    {summary.jobTitle || 'Professional Title'}
                </div>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    fontSize: '9pt',
                    color: '#555555',
                    borderTop: '3px solid #b8860b',
                    paddingTop: '12px'
                }}>
                    {personal.email && <span>✉ {personal.email}</span>}
                    {personal.phone && <span>☎ {personal.phone}</span>}
                    {personal.location && <span>◎ {personal.location}</span>}
                    {personal.linkedinUrl && <span>⬡ LinkedIn Profile</span>}
                </div>
            </header>

            {/* Executive Summary Box */}
            {summary.summaryText && (
                <section
                    onClick={(e) => handleSectionClick(e, 'summary')}
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                    style={{
                        marginBottom: '24px',
                        padding: '16px 20px',
                        background: 'linear-gradient(135deg, #f8f5e6 0%, #fffdf7 100%)',
                        border: '1px solid #e0d5b8',
                        borderLeft: '4px solid #b8860b',
                        borderRadius: '0 8px 8px 0',
                        ...sectionStyle
                    }}>
                    <h2 style={{
                        fontSize: '10pt',
                        fontWeight: 700,
                        color: '#b8860b',
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                        letterSpacing: '1px'
                    }}>
                        Executive Summary
                    </h2>
                    <p style={{ margin: 0, fontStyle: 'italic', color: '#3a3a3a' }}>{summary.summaryText}</p>
                </section>
            )}

            {/* Professional Experience */}
            {experiences.length > 0 && (
                <section
                    onClick={(e) => handleSectionClick(e, 'experience')}
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                    style={{ marginBottom: '24px', borderRadius: '4px', padding: '10px', ...sectionStyle }}>
                    <h2 style={{
                        fontSize: '12pt',
                        fontWeight: 800,
                        color: '#1a1a1a',
                        textTransform: 'uppercase',
                        marginBottom: '16px',
                        letterSpacing: '1px',
                        paddingBottom: '8px',
                        borderBottom: '2px solid #b8860b'
                    }}>
                        Professional Experience
                    </h2>
                    {experiences.map((exp, index) => (
                        <div key={exp.id || index} style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: '11pt', fontWeight: 700, color: '#1a1a1a' }}>{exp.jobTitle}</div>
                                    <div style={{ fontSize: '10pt', color: '#b8860b', fontWeight: 600 }}>{exp.company}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '9pt', fontWeight: 600, color: '#555555' }}>
                                        {exp.startMonth} {exp.startYear} – {exp.isCurrent ? 'Present' : `${exp.endMonth} ${exp.endYear}`}
                                    </div>
                                    {exp.location && <div style={{ fontSize: '8pt', color: '#777777' }}>{exp.location}</div>}
                                </div>
                            </div>
                            {exp.bullets && exp.bullets.filter(b => b).length > 0 && (
                                <ul style={{ margin: '10px 0 0', paddingLeft: '18px' }}>
                                    {exp.bullets.filter(b => b).map((bullet, i) => (
                                        <li key={i} style={{ marginBottom: '5px', color: '#3a3a3a' }}>
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* Two Column Layout for Education & Skills */}
            <div style={{ display: 'flex', gap: '30px' }}>
                {/* Education Column */}
                {education.length > 0 && (
                    <section
                        onClick={(e) => handleSectionClick(e, 'education')}
                        onMouseEnter={mouseEnter}
                        onMouseLeave={mouseLeave}
                        style={{ flex: 1, borderRadius: '4px', padding: '10px', ...sectionStyle }}>
                        <h2 style={{
                            fontSize: '11pt',
                            fontWeight: 800,
                            color: '#1a1a1a',
                            textTransform: 'uppercase',
                            marginBottom: '12px',
                            letterSpacing: '1px',
                            paddingBottom: '6px',
                            borderBottom: '2px solid #b8860b'
                        }}>
                            Education
                        </h2>
                        {education.map((edu, index) => (
                            <div key={edu.id || index} style={{ marginBottom: '12px' }}>
                                <div style={{ fontWeight: 700, color: '#1a1a1a' }}>{edu.institution}</div>
                                <div style={{ fontSize: '9pt', color: '#3a3a3a' }}>
                                    {edu.degree} in {edu.fieldOfStudy}
                                </div>
                                <div style={{ fontSize: '9pt', color: '#777777' }}>
                                    {edu.graduationYear}
                                    {edu.gpa && ` | GPA: ${edu.gpa}`}
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Skills Column */}
                {(skills.technical?.length > 0 || skills.soft?.length > 0) && (
                    <section
                        onClick={(e) => handleSectionClick(e, 'skills')}
                        onMouseEnter={mouseEnter}
                        onMouseLeave={mouseLeave}
                        style={{ flex: 1, borderRadius: '4px', padding: '10px', ...sectionStyle }}>
                        <h2 style={{
                            fontSize: '11pt',
                            fontWeight: 800,
                            color: '#1a1a1a',
                            textTransform: 'uppercase',
                            marginBottom: '12px',
                            letterSpacing: '1px',
                            paddingBottom: '6px',
                            borderBottom: '2px solid #b8860b'
                        }}>
                            Core Competencies
                        </h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {[...(skills.technical || []), ...(skills.soft || [])].map((skill, index) => (
                                <span
                                    key={index}
                                    style={{
                                        padding: '4px 10px',
                                        background: '#f0e6c8',
                                        border: '1px solid #d4c49a',
                                        borderRadius: '4px',
                                        fontSize: '8pt',
                                        color: '#5a4a2a'
                                    }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Certifications */}
            {certifications.length > 0 && (
                <section
                    onClick={(e) => handleSectionClick(e, 'certifications')}
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                    style={{ marginTop: '24px', borderRadius: '4px', padding: '10px', ...sectionStyle }}>
                    <h2 style={{
                        fontSize: '11pt',
                        fontWeight: 800,
                        color: '#1a1a1a',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                        letterSpacing: '1px',
                        paddingBottom: '6px',
                        borderBottom: '2px solid #b8860b'
                    }}>
                        Certifications
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {certifications.map((cert, index) => (
                            <div
                                key={cert.id || index}
                                style={{
                                    padding: '8px 14px',
                                    background: '#f8f5e6',
                                    border: '1px solid #d4c49a',
                                    borderRadius: '6px'
                                }}
                            >
                                <div style={{ fontWeight: 600, fontSize: '9pt', color: '#1a1a1a' }}>{cert.name}</div>
                                <div style={{ fontSize: '8pt', color: '#777777' }}>{cert.issuer}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
