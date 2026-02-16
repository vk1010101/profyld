"use client";

// Academic CV Template - Clean, scholarly style for researchers/professors
export default function AcademicTemplate({ cvData, onSectionClick }) {
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

    const mouseEnter = (e) => {
        if (onSectionClick) e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
    };

    const mouseLeave = (e) => {
        if (onSectionClick) e.currentTarget.style.background = 'transparent';
    };

    return (
        <div style={{
            fontFamily: "'Times New Roman', 'Georgia', serif",
            color: '#1a1a1a',
            padding: '48px 56px',
            background: '#ffffff',
            lineHeight: 1.65,
            fontSize: '11pt',
            maxWidth: '800px',
            margin: '0 auto',
            minHeight: '100%'
        }}>
            {/* Header - Centered, Traditional Academic Style */}
            <header
                onClick={(e) => handleSectionClick(e, 'personal')}
                onMouseEnter={mouseEnter}
                onMouseLeave={mouseLeave}
                style={{
                    textAlign: 'center',
                    marginBottom: '32px',
                    borderBottom: '2px solid #1a1a1a',
                    paddingBottom: '24px',
                    borderRadius: '4px',
                    padding: '12px',
                    ...sectionStyle
                }}>
                <h1 style={{
                    fontSize: '20pt',
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    color: '#1a1a1a',
                    margin: 0,
                    marginBottom: '8px'
                }}>
                    {personal.fullName || 'Your Name'}
                </h1>
                <div style={{
                    fontSize: '12pt',
                    fontStyle: 'italic',
                    color: '#444',
                    marginBottom: '12px'
                }}>
                    {summary.jobTitle || 'Academic Title'}
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    fontSize: '10pt',
                    color: '#555'
                }}>
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>|</span>}
                    {personal.phone && <span>{personal.phone}</span>}
                    {personal.location && <span>|</span>}
                    {personal.location && <span>{personal.location}</span>}
                </div>
            </header>

            {/* Research Interests / Summary */}
            {summary.summaryText && (
                <section
                    onClick={(e) => handleSectionClick(e, 'summary')}
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                    style={{ marginBottom: '28px', borderRadius: '4px', padding: '12px', ...sectionStyle }}>
                    <h2 style={{
                        fontSize: '12pt',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        marginBottom: '12px',
                        color: '#1a1a1a'
                    }}>Research Interests</h2>
                    <p style={{
                        margin: 0,
                        color: '#333',
                        textAlign: 'justify'
                    }}>{summary.summaryText}</p>
                </section>
            )}

            {/* Education - Comes first in academic CVs */}
            {education.length > 0 && (
                <section
                    onClick={(e) => handleSectionClick(e, 'education')}
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                    style={{ marginBottom: '28px', borderRadius: '4px', padding: '12px', ...sectionStyle }}>
                    <h2 style={{
                        fontSize: '12pt',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        marginBottom: '12px',
                        color: '#1a1a1a'
                    }}>Education</h2>
                    {education.map((edu, index) => (
                        <div key={edu.id || index} style={{
                            marginBottom: '16px',
                            display: 'grid',
                            gridTemplateColumns: '100px 1fr',
                            gap: '16px'
                        }}>
                            <div style={{
                                fontSize: '10pt',
                                color: '#555',
                                textAlign: 'right'
                            }}>
                                {edu.graduationYear}
                            </div>
                            <div>
                                <strong style={{ color: '#1a1a1a' }}>{edu.degree}</strong>
                                {edu.fieldOfStudy && <span>, {edu.fieldOfStudy}</span>}
                                <div style={{ color: '#444' }}>{edu.institution}</div>
                                {edu.gpa && <div style={{ fontSize: '10pt', color: '#666', fontStyle: 'italic' }}>GPA: {edu.gpa}</div>}
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* Academic Positions / Professional Experience */}
            {experiences.length > 0 && (
                <section
                    onClick={(e) => handleSectionClick(e, 'experience')}
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                    style={{ marginBottom: '28px', borderRadius: '4px', padding: '12px', ...sectionStyle }}>
                    <h2 style={{
                        fontSize: '12pt',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        marginBottom: '12px',
                        color: '#1a1a1a'
                    }}>Academic Appointments</h2>
                    {experiences.map((exp, index) => (
                        <div key={exp.id || index} style={{
                            marginBottom: '20px',
                            display: 'grid',
                            gridTemplateColumns: '100px 1fr',
                            gap: '16px'
                        }}>
                            <div style={{
                                fontSize: '10pt',
                                color: '#555',
                                textAlign: 'right'
                            }}>
                                {exp.startYear}–{exp.isCurrent ? 'Present' : exp.endYear}
                            </div>
                            <div>
                                <strong style={{ color: '#1a1a1a' }}>{exp.jobTitle}</strong>
                                <div style={{ color: '#444' }}>{exp.company}</div>
                                {exp.location && <div style={{ fontSize: '10pt', color: '#666', fontStyle: 'italic' }}>{exp.location}</div>}
                                {exp.bullets && exp.bullets.filter(b => b).length > 0 && (
                                    <ul style={{
                                        margin: '8px 0 0',
                                        paddingLeft: '20px',
                                        color: '#333'
                                    }}>
                                        {exp.bullets.filter(b => b).map((bullet, i) => (
                                            <li key={i} style={{ marginBottom: '4px' }}>{bullet}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* Publications-style Certifications */}
            {certifications.length > 0 && (
                <section
                    onClick={(e) => handleSectionClick(e, 'certifications')}
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                    style={{ marginBottom: '28px', borderRadius: '4px', padding: '12px', ...sectionStyle }}>
                    <h2 style={{
                        fontSize: '12pt',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        marginBottom: '12px',
                        color: '#1a1a1a'
                    }}>Certifications & Training</h2>
                    <ul style={{ margin: 0, paddingLeft: '24px' }}>
                        {certifications.map((cert, i) => (
                            <li key={i} style={{ marginBottom: '8px', color: '#333' }}>
                                <strong>{cert.name}</strong>
                                {cert.issuer && <span>, {cert.issuer}</span>}
                                {cert.date && <span style={{ color: '#666' }}> ({cert.date})</span>}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Technical Competencies */}
            {(skills.technical?.length > 0 || skills.tools?.length > 0 || skills.languages?.length > 0) && (
                <section
                    onClick={(e) => handleSectionClick(e, 'skills')}
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                    style={{ marginBottom: '28px', borderRadius: '4px', padding: '12px', ...sectionStyle }}>
                    <h2 style={{
                        fontSize: '12pt',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        marginBottom: '12px',
                        color: '#1a1a1a'
                    }}>Technical Competencies</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {skills.technical?.length > 0 && (
                            <div>
                                <strong style={{ color: '#1a1a1a' }}>Research Methods:</strong>
                                <span style={{ color: '#333', marginLeft: '8px' }}>{skills.technical.join(', ')}</span>
                            </div>
                        )}
                        {skills.tools?.length > 0 && (
                            <div>
                                <strong style={{ color: '#1a1a1a' }}>Software & Tools:</strong>
                                <span style={{ color: '#333', marginLeft: '8px' }}>{skills.tools.join(', ')}</span>
                            </div>
                        )}
                        {skills.languages?.length > 0 && (
                            <div>
                                <strong style={{ color: '#1a1a1a' }}>Languages:</strong>
                                <span style={{ color: '#333', marginLeft: '8px' }}>{skills.languages.join(', ')}</span>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Awards & Honors */}
            {awards?.length > 0 && (
                <section
                    onClick={(e) => handleSectionClick(e, 'awards')}
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                    style={{ borderRadius: '4px', padding: '12px', ...sectionStyle }}>
                    <h2 style={{
                        fontSize: '12pt',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        marginBottom: '12px',
                        color: '#1a1a1a'
                    }}>Honors & Awards</h2>
                    <ul style={{ margin: 0, paddingLeft: '24px' }}>
                        {awards.map((award, i) => (
                            <li key={i} style={{ marginBottom: '8px', color: '#333' }}>
                                <strong>{award.name}</strong>
                                {award.issuer && <span>, {award.issuer}</span>}
                                {award.date && <span style={{ color: '#666' }}> ({award.date})</span>}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
