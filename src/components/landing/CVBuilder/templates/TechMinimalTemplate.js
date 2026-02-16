"use client";

// Tech-Minimal CV Template - Clean, code-inspired design for developers
export default function TechMinimalTemplate({ cvData, onSectionClick }) {
    const { personal, summary, experiences, education, skills, certifications, awards } = cvData;

    const handleSectionClick = (e, section) => {
        if (onSectionClick) {
            e.stopPropagation();
            onSectionClick(section);
        }
    };

    const sectionStyle = {
        cursor: onSectionClick ? 'pointer' : 'default', // Only show pointer if interaction is enabled
        transition: 'border-color 0.2s',
    };

    const mouseEnter = (e) => {
        if (onSectionClick) e.currentTarget.style.borderColor = '#60a5fa';
    };

    const mouseLeave = (e) => {
        if (onSectionClick) e.currentTarget.style.borderColor = '#3f3f46';
    };

    return (
        <div style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            color: '#e4e4e7',
            background: '#18181b',
            padding: '40px',
            lineHeight: 1.6,
            fontSize: '9.5pt',
            minHeight: '100%'
        }}>
            {/* Terminal-style Header */}
            <header
                onClick={(e) => handleSectionClick(e, 'personal')}
                onMouseEnter={mouseEnter}
                onMouseLeave={mouseLeave}
                style={{
                    marginBottom: '32px',
                    background: '#27272a',
                    borderRadius: '8px',
                    padding: '20px 24px',
                    border: '1px solid #3f3f46',
                    ...sectionStyle
                }}>
                {/* Terminal bar */}
                <div style={{
                    display: 'flex',
                    gap: '6px',
                    marginBottom: '16px'
                }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></span>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }}></span>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></span>
                </div>

                <div style={{ color: '#22c55e' }}>
                    <span style={{ opacity: 0.7 }}>$ whoami</span>
                </div>
                <h1 style={{
                    fontSize: '18pt',
                    fontWeight: 600,
                    color: '#fafafa',
                    margin: '4px 0 8px'
                }}>
                    {personal.fullName || 'developer_name'}
                </h1>
                <div style={{ color: '#a1a1aa', marginBottom: '12px' }}>
                    <span style={{ color: '#22c55e' }}>→</span> {summary.jobTitle || 'Software Engineer'}
                </div>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    fontSize: '9pt',
                    color: '#71717a'
                }}>
                    {personal.email && <span><span style={{ color: '#60a5fa' }}>email:</span> {personal.email}</span>}
                    {personal.phone && <span><span style={{ color: '#60a5fa' }}>phone:</span> {personal.phone}</span>}
                    {personal.location && <span><span style={{ color: '#60a5fa' }}>location:</span> {personal.location}</span>}
                    {personal.linkedinUrl && <span><span style={{ color: '#60a5fa' }}>linkedin:</span> /in/...</span>}
                    {personal.githubUrl && <span><span style={{ color: '#60a5fa' }}>github:</span> @...</span>}
                </div>
            </header>

            {/* Summary / README */}
            {summary.summaryText && (
                <section
                    onClick={(e) => handleSectionClick(e, 'summary')}
                    onMouseEnter={() => { }} // No border effect on sections to keep it clean, or could add background
                    style={{ marginBottom: '28px', cursor: onSectionClick ? 'pointer' : 'default' }}>
                    <h2 style={{
                        fontSize: '10pt',
                        fontWeight: 600,
                        color: '#60a5fa',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ color: '#f472b6' }}>##</span> README.md
                    </h2>
                    <p style={{
                        margin: 0,
                        color: '#a1a1aa',
                        paddingLeft: '16px',
                        borderLeft: '2px solid #3f3f46',
                        transition: 'border-color 0.2s',
                    }}
                        onMouseEnter={(e) => { if (onSectionClick) e.currentTarget.style.borderColor = '#60a5fa' }}
                        onMouseLeave={(e) => { if (onSectionClick) e.currentTarget.style.borderColor = '#3f3f46' }}
                    >{summary.summaryText}</p>
                </section>
            )}

            {/* Tech Stack / Skills */}
            {(skills.technical?.length > 0 || skills.tools?.length > 0) && (
                <section
                    onClick={(e) => handleSectionClick(e, 'skills')}
                    style={{ marginBottom: '28px', cursor: onSectionClick ? 'pointer' : 'default' }}>
                    <h2 style={{
                        fontSize: '10pt',
                        fontWeight: 600,
                        color: '#60a5fa',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ color: '#f472b6' }}>##</span> tech_stack
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {skills.technical?.map((skill, i) => (
                            <span key={i} style={{
                                background: '#27272a',
                                border: '1px solid #3f3f46',
                                padding: '4px 12px',
                                borderRadius: '4px',
                                fontSize: '9pt',
                                color: '#22c55e'
                            }}>{skill}</span>
                        ))}
                        {skills.tools?.map((tool, i) => (
                            <span key={i} style={{
                                background: '#27272a',
                                border: '1px solid #3f3f46',
                                padding: '4px 12px',
                                borderRadius: '4px',
                                fontSize: '9pt',
                                color: '#eab308'
                            }}>{tool}</span>
                        ))}
                    </div>
                </section>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
                <section
                    onClick={(e) => handleSectionClick(e, 'experience')}
                    style={{ marginBottom: '28px', cursor: onSectionClick ? 'pointer' : 'default' }}>
                    <h2 style={{
                        fontSize: '10pt',
                        fontWeight: 600,
                        color: '#60a5fa',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ color: '#f472b6' }}>##</span> work_experience
                    </h2>
                    {experiences.map((exp, index) => (
                        <div key={exp.id || index}
                            style={{
                                marginBottom: '20px',
                                paddingLeft: '16px',
                                borderLeft: '2px solid #3f3f46',
                                transition: 'border-color 0.2s',
                            }}
                            onMouseEnter={(e) => { if (onSectionClick) e.currentTarget.style.borderColor = '#60a5fa' }}
                            onMouseLeave={(e) => { if (onSectionClick) e.currentTarget.style.borderColor = '#3f3f46' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                <div>
                                    <strong style={{ color: '#fafafa' }}>{exp.jobTitle}</strong>
                                    <span style={{ color: '#71717a' }}> @ </span>
                                    <span style={{ color: '#22c55e' }}>{exp.company}</span>
                                </div>
                                <span style={{ fontSize: '9pt', color: '#71717a' }}>
                                    {exp.startMonth?.slice(0, 3)} {exp.startYear} → {exp.isCurrent ? 'now' : `${exp.endMonth?.slice(0, 3)} ${exp.endYear}`}
                                </span>
                            </div>
                            {exp.bullets && exp.bullets.filter(b => b).length > 0 && (
                                <ul style={{
                                    margin: '8px 0 0',
                                    paddingLeft: '16px',
                                    listStyleType: 'none'
                                }}>
                                    {exp.bullets.filter(b => b).map((bullet, i) => (
                                        <li key={i} style={{
                                            marginBottom: '4px',
                                            color: '#a1a1aa',
                                            position: 'relative'
                                        }}>
                                            <span style={{ color: '#71717a', marginRight: '8px' }}>-</span>
                                            {bullet}
                                        </li>
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
                    style={{ marginBottom: '28px', cursor: onSectionClick ? 'pointer' : 'default' }}>
                    <h2 style={{
                        fontSize: '10pt',
                        fontWeight: 600,
                        color: '#60a5fa',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ color: '#f472b6' }}>##</span> education
                    </h2>
                    {education.map((edu, index) => (
                        <div key={edu.id || index} style={{
                            marginBottom: '12px',
                            paddingLeft: '16px',
                            borderLeft: '2px solid #3f3f46',
                            transition: 'border-color 0.2s',
                        }}
                            onMouseEnter={(e) => { if (onSectionClick) e.currentTarget.style.borderColor = '#60a5fa' }}
                            onMouseLeave={(e) => { if (onSectionClick) e.currentTarget.style.borderColor = '#3f3f46' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                <div>
                                    <strong style={{ color: '#fafafa' }}>{edu.degree}</strong>
                                    {edu.fieldOfStudy && <span style={{ color: '#a1a1aa' }}> in {edu.fieldOfStudy}</span>}
                                </div>
                                <span style={{ fontSize: '9pt', color: '#71717a' }}>{edu.graduationYear}</span>
                            </div>
                            <div style={{ color: '#71717a' }}>{edu.institution}</div>
                        </div>
                    ))}
                </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
                <section
                    onClick={(e) => handleSectionClick(e, 'certifications')}
                    style={{ cursor: onSectionClick ? 'pointer' : 'default' }}>
                    <h2 style={{
                        fontSize: '10pt',
                        fontWeight: 600,
                        color: '#60a5fa',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ color: '#f472b6' }}>##</span> certifications
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '8px'
                    }}>
                        {certifications.map((cert, i) => (
                            <div key={i} style={{
                                background: '#27272a',
                                border: '1px solid #3f3f46',
                                padding: '12px',
                                borderRadius: '6px',
                                transition: 'border-color 0.2s',
                            }}
                                onMouseEnter={(e) => { if (onSectionClick) e.currentTarget.style.borderColor = '#60a5fa' }}
                                onMouseLeave={(e) => { if (onSectionClick) e.currentTarget.style.borderColor = '#3f3f46' }}
                            >
                                <div style={{ color: '#fafafa', fontWeight: 500 }}>{cert.name}</div>
                                <div style={{ fontSize: '9pt', color: '#71717a' }}>{cert.issuer}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
