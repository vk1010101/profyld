"use client";

// Classic Professional CV Template
export default function ClassicTemplate({ cvData, onSectionClick }) {
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
        if (onSectionClick) e.currentTarget.style.background = 'rgba(30, 58, 95, 0.05)';
    };

    const mouseLeave = (e) => {
        if (onSectionClick) e.currentTarget.style.background = 'transparent';
    };

    return (
        <div style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            color: '#1a1a1a',
            padding: '40px',
            background: '#ffffff',
            lineHeight: 1.6,
            fontSize: '10pt',
            minHeight: '100%'
        }}>
            {/* Header */}
            <header
                onClick={(e) => handleSectionClick(e, 'personal')}
                onMouseEnter={mouseEnter}
                onMouseLeave={mouseLeave}
                style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px solid #1e3a5f', paddingBottom: '16px', ...sectionStyle }}>
                <h1 style={{
                    fontSize: '26pt',
                    fontWeight: 400,
                    color: '#1e3a5f',
                    margin: 0,
                    marginBottom: '4px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                }}>
                    {personal.fullName || 'Your Name'}
                </h1>
                <div style={{
                    fontSize: '12pt',
                    color: '#4a4a4a',
                    fontStyle: 'italic',
                    marginBottom: '12px'
                }}>
                    {summary.jobTitle || 'Professional Title'}
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '20px',
                    fontSize: '9pt',
                    color: '#4a4a4a'
                }}>
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>|</span>}
                    {personal.phone && <span>{personal.phone}</span>}
                    {personal.location && <span>|</span>}
                    {personal.location && <span>{personal.location}</span>}
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
                        color: '#1e3a5f',
                        borderBottom: '1px solid #cccccc',
                        paddingBottom: '4px',
                        marginBottom: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Professional Summary
                    </h2>
                    <p style={{ margin: 0, textAlign: 'justify' }}>{summary.summaryText}</p>
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
                        color: '#1e3a5f',
                        borderBottom: '1px solid #cccccc',
                        paddingBottom: '4px',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Professional Experience
                    </h2>
                    {experiences.map((exp, index) => (
                        <div key={exp.id || index} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <strong style={{ fontSize: '11pt' }}>{exp.jobTitle}</strong>
                                <span style={{ fontSize: '9pt', fontStyle: 'italic' }}>
                                    {exp.startMonth} {exp.startYear} – {exp.isCurrent ? 'Present' : `${exp.endMonth} ${exp.endYear}`}
                                </span>
                            </div>
                            <div style={{ fontStyle: 'italic', color: '#4a4a4a' }}>
                                {exp.company}{exp.location && `, ${exp.location}`}
                            </div>
                            {exp.bullets && exp.bullets.filter(b => b).length > 0 && (
                                <ul style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
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
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                    style={{ marginBottom: '20px', padding: '8px', borderRadius: '4px', ...sectionStyle }}>
                    <h2 style={{
                        fontSize: '11pt',
                        fontWeight: 700,
                        color: '#1e3a5f',
                        borderBottom: '1px solid #cccccc',
                        paddingBottom: '4px',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Education
                    </h2>
                    {education.map((edu, index) => (
                        <div key={edu.id || index} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <strong>{edu.institution}</strong>
                                <span style={{ fontSize: '9pt', fontStyle: 'italic' }}>{edu.graduationYear}</span>
                            </div>
                            <div style={{ fontStyle: 'italic' }}>{edu.degree} in {edu.fieldOfStudy}</div>
                            {edu.gpa && <div style={{ fontSize: '9pt' }}>GPA: {edu.gpa}</div>}
                            {edu.honors && <div style={{ fontSize: '9pt', fontStyle: 'italic' }}>{edu.honors}</div>}
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
                        color: '#1e3a5f',
                        borderBottom: '1px solid #cccccc',
                        paddingBottom: '4px',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Skills
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {skills.technical?.length > 0 && (
                            <div>
                                <strong>Technical Skills:</strong> {skills.technical.join(', ')}
                            </div>
                        )}
                        {skills.soft?.length > 0 && (
                            <div>
                                <strong>Professional Skills:</strong> {skills.soft.join(', ')}
                            </div>
                        )}
                        {skills.languages?.length > 0 && (
                            <div>
                                <strong>Languages:</strong> {skills.languages.join(', ')}
                            </div>
                        )}
                        {skills.tools?.length > 0 && (
                            <div>
                                <strong>Software & Tools:</strong> {skills.tools.join(', ')}
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
                        color: '#1e3a5f',
                        borderBottom: '1px solid #cccccc',
                        paddingBottom: '4px',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Certifications
                    </h2>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {certifications.map((cert, index) => (
                            <li key={cert.id || index}>
                                <strong>{cert.name}</strong> — {cert.issuer}
                                {cert.date && ` (${cert.date})`}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
