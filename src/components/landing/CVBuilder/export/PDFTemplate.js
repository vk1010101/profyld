import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
    family: 'Inter',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf' },
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.ttf', fontWeight: 700 }
    ]
});

// Styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Inter',
        fontSize: 10,
        color: '#333',
        lineHeight: 1.5,
    },
    section: {
        marginBottom: 15,
    },
    header: {
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#319795',
    },
    name: {
        fontSize: 24,
        fontWeight: 700,
        color: '#1a202c',
        marginBottom: 4,
    },
    title: {
        fontSize: 12,
        color: '#319795',
        fontWeight: 500,
        marginBottom: 8,
    },
    contact: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        fontSize: 9,
        color: '#4a5568',
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 700,
        color: '#319795',
        textTransform: 'uppercase',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    expItem: {
        marginBottom: 12,
    },
    expHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    jobTitle: {
        fontWeight: 700,
        color: '#1a202c',
    },
    company: {
        color: '#4a5568',
    },
    date: {
        fontSize: 9,
        color: '#718096',
    },
    bullet: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    bulletPoint: {
        width: 10,
        fontSize: 10,
    },
    bulletText: {
        flex: 1,
    },
    skillRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    skillLabel: {
        fontWeight: 700,
        width: 80,
    },
    skillValue: {
        flex: 1,
        color: '#4a5568',
    }
});

// Helper to format dates
const formatDate = (startMonth, startYear, endMonth, endYear, isCurrent) => {
    const start = `${startMonth} ${startYear}`;
    const end = isCurrent ? 'Present' : `${endMonth} ${endYear}`;
    return `${start} - ${end}`;
};

export const PDFDocument = ({ cvData, template }) => {
    const { personal, summary, experiences, education, skills, certifications } = cvData;

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{personal.fullName || 'Your Name'}</Text>
                    <Text style={styles.title}>{summary.jobTitle || 'Professional Title'}</Text>
                    <View style={styles.contact}>
                        {personal.email && <Text>{personal.email}</Text>}
                        {personal.phone && <Text>• {personal.phone}</Text>}
                        {personal.location && <Text>• {personal.location}</Text>}
                        {personal.linkedinUrl && <Text>• LinkedIn</Text>}
                    </View>
                </View>

                {/* Summary */}
                {summary.summaryText && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Summary</Text>
                        <Text>{summary.summaryText}</Text>
                    </View>
                )}

                {/* Experience */}
                {experiences.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Work Experience</Text>
                        {experiences.map((exp, i) => (
                            <View key={i} style={styles.expItem}>
                                <View style={styles.expHeader}>
                                    <Text>
                                        <Text style={styles.jobTitle}>{exp.jobTitle}</Text>
                                        <Text style={styles.company}> at {exp.company}</Text>
                                    </Text>
                                    <Text style={styles.date}>
                                        {formatDate(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.isCurrent)}
                                    </Text>
                                </View>
                                {exp.location && (
                                    <Text style={{ fontSize: 9, color: '#718096', marginBottom: 2 }}>{exp.location}</Text>
                                )}
                                {exp.bullets && exp.bullets.filter(b => b).map((bullet, idx) => (
                                    <View key={idx} style={styles.bullet}>
                                        <Text style={styles.bulletPoint}>•</Text>
                                        <Text style={styles.bulletText}>{bullet}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {education.map((edu, i) => (
                            <View key={i} style={styles.expItem}>
                                <View style={styles.expHeader}>
                                    <Text>
                                        <Text style={styles.jobTitle}>{edu.degree}</Text>
                                        <Text style={styles.company}> in {edu.fieldOfStudy}</Text>
                                    </Text>
                                    <Text style={styles.date}>{edu.graduationYear}</Text>
                                </View>
                                <Text style={styles.company}>{edu.institution}</Text>
                                {edu.gpa && <Text style={{ fontSize: 9, color: '#718096' }}>GPA: {edu.gpa}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {(skills.technical?.length > 0 || skills.soft?.length > 0 || skills.tools?.length > 0) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        {skills.technical?.length > 0 && (
                            <View style={styles.skillRow}>
                                <Text style={styles.skillLabel}>Technical:</Text>
                                <Text style={styles.skillValue}>{skills.technical.join(', ')}</Text>
                            </View>
                        )}
                        {skills.soft?.length > 0 && (
                            <View style={styles.skillRow}>
                                <Text style={styles.skillLabel}>Soft Skills:</Text>
                                <Text style={styles.skillValue}>{skills.soft.join(', ')}</Text>
                            </View>
                        )}
                        {skills.tools?.length > 0 && (
                            <View style={styles.skillRow}>
                                <Text style={styles.skillLabel}>Tools:</Text>
                                <Text style={styles.skillValue}>{skills.tools.join(', ')}</Text>
                            </View>
                        )}
                        {skills.languages?.length > 0 && (
                            <View style={styles.skillRow}>
                                <Text style={styles.skillLabel}>Languages:</Text>
                                <Text style={styles.skillValue}>{skills.languages.join(', ')}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Certifications</Text>
                        {certifications.map((cert, i) => (
                            <View key={i} style={{ marginBottom: 4 }}>
                                <Text>
                                    <Text style={{ fontWeight: 700 }}>{cert.name}</Text>
                                    <Text> — {cert.issuer}</Text>
                                    {cert.date && <Text style={{ fontSize: 9, color: '#718096' }}> ({cert.date})</Text>}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

            </Page>
        </Document>
    );
};
