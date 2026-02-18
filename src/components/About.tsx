"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, Code, GraduationCap, Palette, Download, LucideIcon } from "lucide-react";
import Image from "next/image";
import styles from "./About.module.css";
import type { AboutProps, Experience, Education, SoftwareSkill, Workshop } from "@/types";
// @ts-ignore
import FreeFormElement from "@/components/builder/freeform/FreeFormElement";
// @ts-ignore
import FreeFormSection from "@/components/builder/freeform/FreeFormSection";
// @ts-ignore  
import VerifiedDownloadButton from "@/components/portfolio/VerifiedDownloadButton";

interface ProfileInfo {
    name: string;
    title: string;
    bio: string;
    profileImage: string;
    languages: string[];
    cvUrl: string;
}

interface Skills {
    software: SoftwareSkill[];
    technical: string[];
    workshops: Workshop[];
}

interface EducationData {
    primary?: Education & { isPrimary?: boolean; is_primary?: boolean };
    other?: Education[];
}

interface TabItem {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface InterestsData {
    hobbies: string[];
    volunteering: string[];
}

const emptyDefaults = {
    profile: {
        name: "",
        title: "",
        bio: "",
        profileImage: "",
        languages: [],
        cvUrl: "",
    },
    experiences: [] as Experience[],
    skills: {
        software: [] as SoftwareSkill[],
        technical: [] as string[],
        workshops: [] as Workshop[],
    },
    education: [] as Education[],
    interests: [] as string[],
};

const About = ({
    profile = emptyDefaults.profile,
    experience = emptyDefaults.experiences,
    skills = emptyDefaults.skills,
    education = emptyDefaults.education,
    interests = emptyDefaults.interests,
    sectionTitle = "About Me",
    portfolioUserId,
    style,
    id,
    freeFormEnabled = false,
    blockId,
    elementPositions = {},

    // Smart Block Visibility Props
    showBio = true,
    showSkills = true,
    showExperience = true,
    showEducation = true,
    showInterests = true,
}: AboutProps & {
    sectionTitle?: string;
    portfolioUserId?: string;
    style?: React.CSSProperties;
    id?: string;
    freeFormEnabled?: boolean;
    blockId?: string;
    elementPositions?: Record<string, { x: number; y: number; w: number; h: number }>;
    showBio?: boolean | string;
    showSkills?: boolean | string;
    showExperience?: boolean | string;
    showEducation?: boolean | string;
    showInterests?: boolean | string;
}) => {
    const [activeTab, setActiveTab] = useState<string>("profile");

    // Helper to coerce boolean/string
    const isVisible = (val: boolean | string | undefined) => val === true || val === 'true';

    const profileData: ProfileInfo = { ...emptyDefaults.profile, ...profile };
    const experiencesData: Experience[] = experience?.length ? experience : emptyDefaults.experiences;
    const skillsData: any = { ...emptyDefaults.skills, ...skills };

    let educationData: Education[] = [];
    if (Array.isArray(education)) {
        educationData = education;
    } else if ((education as EducationData)?.primary || (education as EducationData)?.other) {
        const eduData = education as EducationData;
        educationData = [
            ...(eduData.primary ? [{ ...eduData.primary, isPrimary: true }] : []),
            ...(eduData.other || []).map(e => ({ ...e, isPrimary: false }))
        ];
    }

    let interestsData: InterestsData = { hobbies: [], volunteering: [] };
    if (Array.isArray(interests)) {
        interestsData.hobbies = interests;
    } else if ((interests as InterestsData)?.hobbies) {
        interestsData = interests as InterestsData;
    }

    const allTabs: TabItem[] = [
        { id: "profile", label: "Profile", icon: User },
        { id: "experience", label: "Experience", icon: Briefcase },
        { id: "skills", label: "Skills", icon: Code },
        { id: "education", label: "Education", icon: GraduationCap },
        { id: "interests", label: "Interests", icon: Palette },
    ];

    const tabs = allTabs.filter(tab => {
        if (tab.id === 'profile') return isVisible(showBio);
        if (tab.id === 'experience') return isVisible(showExperience);
        if (tab.id === 'skills') return isVisible(showSkills);
        if (tab.id === 'education') return isVisible(showEducation);
        if (tab.id === 'interests') return isVisible(showInterests);
        return true;
    });

    // Reset active tab if it gets hidden
    if (!tabs.find(t => t.id === activeTab) && tabs.length > 0) {
        setActiveTab(tabs[0].id);
    }

    const content: Record<string, React.ReactNode> = {
        profile: (
            <div className={styles.tabContent}>
                <h3>About Me</h3>
                <p>{profileData.bio}</p>
                {profileData.languages && profileData.languages.length > 0 && (
                    <div className={styles.languages}>
                        {profileData.languages.map((lang: string, index: number) => (
                            <span key={index} className={styles.langTag}>{lang}</span>
                        ))}
                    </div>
                )}
            </div>
        ),
        experience: (
            <div className={styles.tabContent}>
                <h3>Experience</h3>
                <div className={styles.timeline}>
                    {experiencesData.map((exp: Experience) => (
                        <div key={exp.id} className={styles.timelineItem}>
                            <div className={styles.timelineDate}>{exp.dateRange || exp.date_range}</div>
                            <h4>{exp.title}</h4>
                            {exp.location && <span className={styles.location}>{exp.location}</span>}
                            {exp.description && <p>{exp.description}</p>}
                        </div>
                    ))}
                </div>
            </div>
        ),
        skills: (
            <div className={styles.tabContent}>
                <h3>Skills</h3>
                {skillsData.software?.length > 0 && (
                    <div className={styles.skillsGrid}>
                        <h5>Software</h5>
                        {skillsData.software.map((skill: SoftwareSkill, index: number) => (
                            <div key={skill.name || index} className={styles.skillBar}>
                                <span>{skill.name}</span>
                                <div className={styles.barTrack}>
                                    <motion.div
                                        className={styles.barFill}
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${skill.level}%` }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {skillsData.technical?.length > 0 && (
                    <div className={styles.tagCloud}>
                        <h5>Technical Skills</h5>
                        {skillsData.technical.map((skill: any, index: number) => {
                            const label = typeof skill === 'string' ? skill : (skill?.name || String(skill));
                            // Use index as fallback key to prevent "[object Object]" collision
                            return <span key={`${index}-${label.substring(0, 10)}`} className={styles.tag}>{label}</span>;
                        })}
                    </div>
                )}
                {skillsData.workshops?.length > 0 && (
                    <div className={styles.workshopSection}>
                        <h5>Workshops & Certifications</h5>
                        <ul className={styles.workshopList}>
                            {skillsData.workshops.map((workshop: Workshop, index: number) => (
                                <li key={workshop.name || index}>
                                    <strong>{workshop.name}</strong>: {workshop.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        ),
        education: (
            <div className={styles.tabContent}>
                <h3>Education</h3>
                {educationData.filter((e: Education) => e.isPrimary || e.is_primary).map((edu: Education, idx: number) => (
                    <div key={edu.id || idx} className={styles.educationCard}>
                        <div className={styles.eduYear}>{edu.yearRange || edu.year_range}</div>
                        <h4>{edu.degree}</h4>
                        <span className={styles.institution}>{edu.institution}</span>
                        {edu.specialization && (
                            <p className={styles.specialization}>{edu.specialization}</p>
                        )}
                    </div>
                ))}
                <div className={styles.educationRow}>
                    {educationData.filter((e: Education) => !e.isPrimary && !e.is_primary).map((edu: Education, idx: number) => (
                        <div key={edu.id || idx} className={styles.eduMini}>
                            <span className={styles.eduYear}>{edu.yearRange || edu.year_range}</span>
                            <h4>{edu.degree}</h4>
                            <span>{edu.institution}</span>
                        </div>
                    ))}
                </div>
            </div>
        ),
        interests: (
            <div className={styles.tabContent}>
                <h3>Interests</h3>
                {interestsData.hobbies?.length > 0 && (
                    <div className={styles.interestGrid}>
                        {interestsData.hobbies.map((interest: any, index: number) => {
                            const label = typeof interest === 'string' ? interest : (interest?.name || String(interest));
                            return (
                                <div key={`${index}-${label.substring(0, 10)}`} className={styles.interestCard}>
                                    {label}
                                </div>
                            );
                        })}
                    </div>
                )}
                {interestsData.volunteering?.length > 0 && (
                    <div className={styles.subSection}>
                        <h5>Volunteering</h5>
                        {interestsData.volunteering.map((v: any, index: number) => {
                            const label = typeof v === 'string' ? v : (v?.name || String(v));
                            return <div key={`${index}-${label.substring(0, 10)}`} className={styles.volunteerCard}>{label}</div>;
                        })}
                    </div>
                )}
            </div>
        ),
    };

    // Render the main About content — with or without free-form wrappers
    const renderContent = (
        selectedElement: string | null,
        onSelect: (id: string) => void,
        _: any,
        positions: Record<string, any>,
        isFreeFormActive: boolean,
        selectedElementIds: string[] = []
    ): React.ReactNode => (
        <>
            <FreeFormElement
                elementId="about-title"
                label="Section Title"
                position={positions['about-title']}
                defaultSize={{ width: '400', height: '60' }}
                freeFormEnabled={isFreeFormActive}
                isSelected={selectedElement === 'about-title' || selectedElementIds.includes('about-title')}
                onSelect={onSelect}
            >
                <div className={styles.header}>
                    <motion.h2
                        className="section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {sectionTitle}
                    </motion.h2>
                    <div className={styles.divider}></div>
                </div>
            </FreeFormElement>

            <div className={styles.contentWrapper}>
                <FreeFormElement
                    elementId="about-image"
                    label="Profile Image"
                    position={positions['about-image']}
                    defaultSize={{ width: '400', height: '600' }}
                    freeFormEnabled={isFreeFormActive}
                    isSelected={selectedElement === 'about-image' || selectedElementIds.includes('about-image')}
                    onSelect={onSelect}
                >
                    <motion.div
                        className={styles.imageColumn}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className={styles.imageFrame}>
                            <Image
                                src={profileData.profileImage || "/assets/profile-placeholder.jpg"}
                                alt={profileData.name || "Profile"}
                                width={400}
                                height={500}
                                className={styles.profileImage}
                                priority
                            />
                            <div className={styles.imageOverlay}></div>
                        </div>
                        <div className={styles.contactInfo}>
                            <h3>{profileData.name}</h3>
                            <p>{profileData.title}</p>
                            {profileData.cvUrl && portfolioUserId ? (
                                <VerifiedDownloadButton
                                    portfolioUserId={portfolioUserId}
                                    ownerName={profileData.name}
                                    className={styles.downloadBtn}
                                />
                            ) : profileData.cvUrl ? (
                                <a
                                    href={profileData.cvUrl}
                                    download
                                    className={styles.downloadBtn}
                                    style={{ textDecoration: 'none', display: 'inline-flex' }}
                                >
                                    <Download size={18} /> Download CV
                                </a>
                            ) : null}
                        </div>
                    </motion.div>
                </FreeFormElement>

                <FreeFormElement
                    elementId="about-tabs"
                    label="Tabs Panel"
                    position={positions['about-tabs']}
                    defaultSize={{ width: '550', height: '500' }}
                    freeFormEnabled={isFreeFormActive}
                    isSelected={selectedElement === 'about-tabs' || selectedElementIds.includes('about-tabs')}
                    onSelect={onSelect}
                >
                    <div className={styles.tabsColumn}>
                        <div className={styles.tabsHeader}>
                            {tabs.map((tab: TabItem) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ""}`}
                                >
                                    <tab.icon size={18} />
                                    <span>{tab.label}</span>
                                    {activeTab === tab.id && (
                                        <motion.div
                                            className={styles.activeIndicator}
                                            layoutId="activeTab"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className={styles.tabBody}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {content[activeTab]}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </FreeFormElement>
            </div>
        </>
    );

    return (
        <section id={id || "about"} className={styles.about} style={style}>
            <div className="container">
                {freeFormEnabled ? (
                    <FreeFormSection
                        blockId={blockId}
                        blockType="about"
                        freeFormEnabled={freeFormEnabled}
                        positions={elementPositions}
                    >
                        {renderContent}
                    </FreeFormSection>
                ) : (
                    <div style={{ position: 'relative', minHeight: '600px', width: '100%' }}>
                        {renderContent(null, () => { }, null, elementPositions, false, [])}
                    </div>
                )}
            </div>
        </section>
    );
};

export default About;
