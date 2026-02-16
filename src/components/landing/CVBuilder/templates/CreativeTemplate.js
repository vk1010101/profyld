"use client";

// Creative CV Template - Bold colors, unique layout for designers/artists
export default function CreativeTemplate({ cvData, onSectionClick }) {
    const { personal, summary, experiences, education, skills, certifications, awards } = cvData;

    const handleSectionClick = (e, section) => {
        if (onSectionClick) {
            e.stopPropagation();
            onSectionClick(section);
        }
    };

    const sectionStyle = {
        cursor: onSectionClick ? 'pointer' : 'default', // Only show pointer if interaction is enabled
        transition: 'background 0.2s',
    };

    // Sidebar hover effect (darker blue/purple)
    const sidebarEnter = (e) => {
        if (onSectionClick) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
    };
    const sidebarLeave = (e) => {
        if (onSectionClick) e.currentTarget.style.background = 'transparent';
    };

    // Main content hover effect (light purple)
    const mainEnter = (e) => {
        if (onSectionClick) e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
    };
    const mainLeave = (e) => {
        if (onSectionClick) e.currentTarget.style.background = 'transparent';
    };

    return (
        <div style={{
            fontFamily: "'Poppins', 'Montserrat', sans-serif",
            color: '#1a1a2e',
            background: 'linear-gradient(135deg, #667eea05 0%, #764ba205 100%)',
            padding: '0',
            lineHeight: 1.6,
            fontSize: '10pt',
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            minHeight: '100%'
        }}>
            {/* Left Sidebar - Accent Color */}
            <aside style={{
                background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                padding: '40px 24px',
            }}>
                {/* Photo placeholder */}
                <div
                    onClick={(e) => handleSectionClick(e, 'personal')}
                    onMouseEnter={(e) => { if (onSectionClick) e.currentTarget.style.opacity = 0.8 }}
                    onMouseLeave={(e) => { if (onSectionClick) e.currentTarget.style.opacity = 1 }}
                    style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        margin: '0 auto 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36pt',
                        fontWeight: 700,
                        cursor: onSectionClick ? 'pointer' : 'default',
                        transition: 'opacity 0.2s'
                    }}>
                    {personal.fullName ? personal.fullName.charAt(0) : '?'}
                </div>

                {/* Contact Info */}
                <div
                    onClick={(e) => handleSectionClick(e, 'personal')}
                    onMouseEnter={sidebarEnter}
                    onMouseLeave={sidebarLeave}
                    style={{ marginBottom: '32px', borderRadius: '4px', padding: '8px', cursor: onSectionClick ? 'pointer' : 'default', transition: 'background 0.2s' }}>
                    <h3 style={{
                        fontSize: '10pt',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        marginBottom: '16px',
                        opacity: 0.8
                    }}>Contact</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '9pt' }}>
                        {personal.email && <div>📧 {personal.email}</div>}
                        {personal.phone && <div>📱 {personal.phone}</div>}
                        {personal.location && <div>📍 {personal.location}</div>}
                        {personal.linkedinUrl && <div>🔗 LinkedIn</div>}
                        {personal.portfolioUrl && <div>🌐 Portfolio</div>}
                    </div>
                </div>

                {/* Skills */}
                {(skills.technical?.length > 0 || skills.tools?.length > 0) && (
                    <div
                        onClick={(e) => handleSectionClick(e, 'skills')}
                        onMouseEnter={sidebarEnter}
                        onMouseLeave={sidebarLeave}
                        style={{ marginBottom: '32px', borderRadius: '4px', padding: '8px', cursor: onSectionClick ? 'pointer' : 'default', transition: 'background 0.2s' }}>
                        <h3 style={{
                            fontSize: '10pt',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            marginBottom: '16px',
                            opacity: 0.8
                        }}>Skills</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {[...(skills.technical || []), ...(skills.tools || [])].map((skill, i) => (
                                <span key={i} style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    fontSize: '8pt'
                                }}>{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages */}
                {skills.languages?.length > 0 && (
                    <div
                        onClick={(e) => handleSectionClick(e, 'skills')}
                        onMouseEnter={sidebarEnter}
                        onMouseLeave={sidebarLeave}
                        style={{ borderRadius: '4px', padding: '8px', cursor: onSectionClick ? 'pointer' : 'default', transition: 'background 0.2s' }}>
                        <h3 style={{
                            fontSize: '10pt',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            marginBottom: '16px',
                            opacity: 0.8
                        }}>Languages</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '9pt' }}>
                            {skills.languages.map((lang, i) => (
                                <div key={i}>{lang}</div>
                            ))}
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main style={{ padding: '40px 36px', background: '#ffffff' }}>
                {/* Header */}
                <header
                    onClick={(e) => handleSectionClick(e, 'personal')}
                    onMouseEnter={mainEnter}
                    onMouseLeave={mainLeave}
                    style={{ marginBottom: '32px', borderRadius: '4px', padding: '10px', ...sectionStyle }}>
                    <h1 style={{
                        fontSize: '28pt',
                        fontWeight: 700,
                        color: '#1a1a2e',
                        margin: 0,
                        marginBottom: '4px'
                    }}>
                        {personal.fullName || 'Your Name'}
                    </h1>
                    <div style={{
                        fontSize: '14pt',
                        color: '#667eea',
                        fontWeight: 600
                    }}>
                        {summary.jobTitle || 'Creative Professional'}
                    </div>
                </header>

                {/* About / Summary */}
                {summary.summaryText && (
                    <section
                        onClick={(e) => handleSectionClick(e, 'summary')}
                        onMouseEnter={mainEnter}
                        onMouseLeave={mainLeave}
                        style={{ marginBottom: '28px', borderRadius: '4px', padding: '8px', ...sectionStyle }}>
                        <h2 style={{
                            fontSize: '11pt',
                            fontWeight: 700,
                            color: '#667eea',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '12px',
                            paddingBottom: '8px',
                            borderBottom: '2px solid #667eea'
                        }}>About Me</h2>
                        <p style={{ margin: 0, color: '#4a4a68' }}>{summary.summaryText}</p>
                    </section>
                )}

                {/* Experience */}
                {experiences.length > 0 && (
                    <section
                        onClick={(e) => handleSectionClick(e, 'experience')}
                        onMouseEnter={mainEnter}
                        onMouseLeave={mainLeave}
                        style={{ marginBottom: '28px', borderRadius: '4px', padding: '8px', ...sectionStyle }}>
                        <h2 style={{
                            fontSize: '11pt',
                            fontWeight: 700,
                            color: '#667eea',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '12px',
                            paddingBottom: '8px',
                            borderBottom: '2px solid #667eea'
                        }}>Experience</h2>
                        {experiences.map((exp, index) => (
                            <div key={exp.id || index} style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <div>
                                        <strong style={{ fontSize: '11pt', color: '#1a1a2e' }}>{exp.jobTitle}</strong>
                                        <span style={{ color: '#667eea', marginLeft: '8px' }}>@ {exp.company}</span>
                                    </div>
                                    <span style={{ fontSize: '9pt', color: '#888', fontStyle: 'italic' }}>
                                        {exp.startMonth} {exp.startYear} - {exp.isCurrent ? 'Present' : `${exp.endMonth} ${exp.endYear}`}
                                    </span>
                                </div>
                                {exp.bullets && exp.bullets.filter(b => b).length > 0 && (
                                    <ul style={{ margin: '8px 0 0', paddingLeft: '20px', color: '#4a4a68' }}>
                                        {exp.bullets.filter(b => b).map((bullet, i) => (
                                            <li key={i} style={{ marginBottom: '4px' }}>{bullet}</li>
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
                        onMouseEnter={mainEnter}
                        onMouseLeave={mainLeave}
                        style={{ marginBottom: '28px', borderRadius: '4px', padding: '8px', ...sectionStyle }}>
                        <h2 style={{
                            fontSize: '11pt',
                            fontWeight: 700,
                            color: '#667eea',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '12px',
                            paddingBottom: '8px',
                            borderBottom: '2px solid #667eea'
                        }}>Education</h2>
                        {education.map((edu, index) => (
                            <div key={edu.id || index} style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong style={{ color: '#1a1a2e' }}>{edu.degree} in {edu.fieldOfStudy}</strong>
                                    <span style={{ fontSize: '9pt', color: '#888' }}>{edu.graduationYear}</span>
                                </div>
                                <div style={{ color: '#4a4a68' }}>{edu.institution}</div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Certifications & Awards */}
                {(certifications.length > 0 || awards?.length > 0) && (
                    <section
                        onClick={(e) => handleSectionClick(e, 'certifications')}
                        onMouseEnter={mainEnter}
                        onMouseLeave={mainLeave}
                        style={{ borderRadius: '4px', padding: '8px', ...sectionStyle }}>
                        <h2 style={{
                            fontSize: '11pt',
                            fontWeight: 700,
                            color: '#667eea',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '12px',
                            paddingBottom: '8px',
                            borderBottom: '2px solid #667eea'
                        }}>Achievements</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {certifications.map((cert, i) => (
                                <div key={i} style={{
                                    background: '#f8f9ff',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0f0'
                                }}>
                                    <strong style={{ color: '#1a1a2e' }}>{cert.name}</strong>
                                    <div style={{ fontSize: '9pt', color: '#888' }}>{cert.issuer}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
