"use client";

// Modern Minimal CV Template
export default function ModernTemplate({ cvData, onSectionClick }) {
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
        if (onSectionClick) e.currentTarget.style.background = 'rgba(49, 151, 149, 0.1)';
    };

    const mouseLeave = (e) => {
        if (onSectionClick) e.currentTarget.style.background = 'transparent';
    };

    return (
        <div style={{
            fontFamily: "'Inter', 'Roboto', sans-serif",
            color: '#2d3748',
            padding: '40px',
            background: '#ffffff',
            lineHeight: 1.5,
            fontSize: '10pt',
            minHeight: '100%'
        }}>
            {/* Header */}
            <header
                onClick={(e) => handleSectionClick(e, 'personal')}
                onMouseEnter={mouseEnter}
                onMouseLeave={mouseLeave}
                style={{ marginBottom: '24px', borderBottom: '2px solid #319795', paddingBottom: '16px', ...sectionStyle }}>
                <h1 style={{
                    fontSize: '24pt',
                    fontWeight: 700,
                    color: '#1a202c',
                    margin: 0,
                    marginBottom: '4px'
                }}>
                    {personal.fullName || 'Your Name'}
                </h1>
                <div style={{
                    fontSize: '12pt',
                    color: '#319795',
                    fontWeight: 500,
                    marginBottom: '8px'
                }}>
                    {summary.jobTitle || 'Professional Title'}
                </div>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    fontSize: '9pt',
                    color: '#4a5568'
                }}>
                    {personal.email && <span>📧 {personal.email}</span>}
                    {personal.phone && <span>📱 {personal.phone}</span>}
                    {personal.location && <span>📍 {personal.location}</span>}
                    {personal.linkedinUrl && <span>🔗 LinkedIn</span>}
                </div>
            </header>

            {/* Professional Summary */}
            {summary.summaryText && (
                <section
                    onClick={(e) => handleSectionClick(e, 'summary')}
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                    style={{ marginBottom: '20px', padding: '8px', borderRadius: '4px', ...sectionStyle }}>
                    <h2 style={{
                        fontSize: '11pt',
                        fontWeight: 700,
                        color: '#319795',
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                        letterSpacing: '0.5px'
                    }}>
                        Professional Summary
                    </h2>
                    <p style={{ margin: 0, color: '#4a5568' }}>{summary.summaryText}</p>
                </section>
            )}

            {/* Work Experience */}
            {experiences.length > 0 && (
                <section
                    onClick={(e) => handleSectionClick(e, 'experience')}
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                    style={{ marginBottom: '20px', padding: '8px', borderRadius: '4px', ...sectionStyle }}>
                    <h2 style={{
                        fontSize: '11pt',
                        fontWeight: 700,
                        color: '#319795',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                        letterSpacing: '0.5px'
                    }}>
                        Work Experience
                    </h2>
                    {experiences.map((exp, index) => (
                        <div key={exp.id || index} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <div>
                                    <strong style={{ color: '#1a202c' }}>{exp.jobTitle}</strong>
                                    <span style={{ color: '#4a5568' }}> at {exp.company}</span>
                                </div>
                                <span style={{ fontSize: '9pt', color: '#718096' }}>
                                    {exp.startMonth} {exp.startYear} - {exp.isCurrent ? 'Present' : `${exp.endMonth} ${exp.endYear}`}
                                </span>
                            </div>
                            {exp.location && (
                                <div style={{ fontSize: '9pt', color: '#718096', marginTop: '2px' }}>{exp.location}</div>
                            )}
                            {exp.bullets && exp.bullets.filter(b => b).length > 0 && (
                                <ul style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
                                    {exp.bullets.filter(b => b).map((bullet, i) => (
                                        <li key={i} style={{ marginBottom: '4px', color: '#4a5568' }}>{bullet}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section
                    onClick={(e) => handleSectionClick(e, 'education')}
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                    style={{ marginBottom: '20px', padding: '8px', borderRadius: '4px', ...sectionStyle }}>
                    <h2 style={{
                        fontSize: '11pt',
                        fontWeight: 700,
                        color: '#319795',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                        letterSpacing: '0.5px'
                    }}>
                        Education
                    </h2>
                    {education.map((edu, index) => (
                        <div key={edu.id || index} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <div>
                                    <strong style={{ color: '#1a202c' }}>{edu.degree}</strong>
                                    <span style={{ color: '#4a5568' }}> in {edu.fieldOfStudy}</span>
                                </div>
                                <span style={{ fontSize: '9pt', color: '#718096' }}>{edu.graduationYear}</span>
                            </div>
                            <div style={{ color: '#4a5568' }}>{edu.institution}</div>
                            {edu.gpa && <div style={{ fontSize: '9pt', color: '#718096' }}>GPA: {edu.gpa}</div>}
                        </div>
                    ))}
                </section>
            )}

            {/* Skills */}
            {(skills.technical?.length > 0 || skills.soft?.length > 0 || skills.tools?.length > 0) && (
                <section
                    onClick={(e) => handleSectionClick(e, 'skills')}
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                    style={{ marginBottom: '20px', padding: '8px', borderRadius: '4px', ...sectionStyle }}>
                    <h2 style={{
                        fontSize: '11pt',
                        fontWeight: 700,
                        color: '#319795',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                        letterSpacing: '0.5px'
                    }}>
                        Skills
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {skills.technical?.length > 0 && (
                            <div>
                                <strong style={{ color: '#1a202c', fontSize: '9pt' }}>Technical:</strong>
                                <span style={{ color: '#4a5568', marginLeft: '8px' }}>{skills.technical.join(' • ')}</span>
                            </div>
                        )}
                        {skills.soft?.length > 0 && (
                            <div>
                                <strong style={{ color: '#1a202c', fontSize: '9pt' }}>Soft Skills:</strong>
                                <span style={{ color: '#4a5568', marginLeft: '8px' }}>{skills.soft.join(' • ')}</span>
                            </div>
                        )}
                        {skills.languages?.length > 0 && (
                            <div>
                                <strong style={{ color: '#1a202c', fontSize: '9pt' }}>Languages:</strong>
                                <span style={{ color: '#4a5568', marginLeft: '8px' }}>{skills.languages.join(' • ')}</span>
                            </div>
                        )}
                        {skills.tools?.length > 0 && (
                            <div>
                                <strong style={{ color: '#1a202c', fontSize: '9pt' }}>Tools:</strong>
                                <span style={{ color: '#4a5568', marginLeft: '8px' }}>{skills.tools.join(' • ')}</span>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
                <section
                    onClick={(e) => handleSectionClick(e, 'certifications')}
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                    style={{ padding: '8px', borderRadius: '4px', ...sectionStyle }}>
                    <h2 style={{
                        fontSize: '11pt',
                        fontWeight: 700,
                        color: '#319795',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                        letterSpacing: '0.5px'
                    }}>
                        Certifications
                    </h2>
                    {certifications.map((cert, index) => (
                        <div key={cert.id || index} style={{ marginBottom: '8px' }}>
                            <strong style={{ color: '#1a202c' }}>{cert.name}</strong>
                            <span style={{ color: '#4a5568' }}> — {cert.issuer}</span>
                            {cert.date && <span style={{ fontSize: '9pt', color: '#718096' }}> ({cert.date})</span>}
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}
