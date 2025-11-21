"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, Code, GraduationCap, Palette, Download } from "lucide-react";
import Image from "next/image";
import styles from "./About.module.css";

const About = () => {
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "experience", label: "Experience", icon: Briefcase },
        { id: "skills", label: "Skills", icon: Code },
        { id: "education", label: "Education", icon: GraduationCap },
        { id: "interests", label: "Interests", icon: Palette },
    ];

    const content = {
        profile: (
            <div className={styles.tabContent}>
                <h3>About Me</h3>
                <p>
                    Motivated and outgoing individual with strong interpersonal skills and a curious mindset.
                    I thrive in creative, collaborative environments and approach new experiences with enthusiasm and positivity.
                </p>
                <div className={styles.languages}>
                    <span className={styles.langTag}>English (Proficient)</span>
                    <span className={styles.langTag}>Hindi (Native)</span>
                </div>
            </div>
        ),
        experience: (
            <div className={styles.tabContent}>
                <h3>Experience</h3>
                <div className={styles.timeline}>
                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>June 2024</div>
                        <h4>Craft Cluster Documentation</h4>
                        <span className={styles.location}>Navakuruchi, Tamil Nadu</span>
                        <p>Visited and studied traditional bamboo craft as part of a DC Handicrafts & NIFT collaboration; documented local techniques, tools, and artisan practices for design research and cultural preservation.</p>
                    </div>
                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>June 2024</div>
                        <h4>Tannery Training</h4>
                        <span className={styles.location}>Shalimar Tanning Company</span>
                        <p>Undertook hands-on training to understand the complete leather processing cycle—from raw hide to finished leather—gaining technical knowledge of tanning, finishing, and quality control methods.</p>
                    </div>
                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>Ongoing</div>
                        <h4>Freelance Artist & Creative Professional</h4>
                        <ul className={styles.bulletList}>
                            <li>Served as a judge for a face painting competition at IIT Madras</li>
                            <li>Painted custom denim jackets on commission</li>
                            <li>Created digital artwork for Mandonna, a research organization</li>
                            <li>Modeled for a hair extension brand - Hair tales</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.subSection}>
                    <h5>Industry Visits</h5>
                    <div className={styles.visitGrid}>
                        <span>Potissimus Arrow Shoes</span>
                        <span>Calsea Footwear</span>
                        <span>CDS Soles</span>
                        <span>Orion Commerx</span>
                        <span>KH Exports</span>
                        <span>Sanghvi Sole Accessories</span>
                        <span>Prara Leathers</span>
                    </div>
                </div>
            </div>
        ),
        skills: (
            <div className={styles.tabContent}>
                <h3>Skills</h3>
                <div className={styles.skillCategory}>
                    <h5>Software</h5>
                    <div className={styles.skillGrid}>
                        {["Clo 3D", "Rhino", "Adobe Illustrator", "Adobe Indesign", "Adobe Photoshop", "MS Office", "Procreate", "Autodesk Sketchbook", "Shoemaster"].map(skill => (
                            <span key={skill} className={styles.skillPill}>{skill}</span>
                        ))}
                    </div>
                </div>
                <div className={styles.skillCategory}>
                    <h5>Technical</h5>
                    <div className={styles.skillGrid}>
                        {["Pattern Making", "Draping & Styling", "Material Handling", "Concept Visualization", "Sketching & Rendering", "Trend Research", "3D Modelling"].map(skill => (
                            <span key={skill} className={styles.skillPill}>{skill}</span>
                        ))}
                    </div>
                </div>
                <div className={styles.skillCategory}>
                    <h5>Workshops</h5>
                    <ul className={styles.workshopList}>
                        <li><strong>Aari Embroidery</strong>: Traditional hand-stitching techniques.</li>
                        <li><strong>Metal Etching</strong>: Printmaking and embossing on leather.</li>
                    </ul>
                </div>
            </div>
        ),
        education: (
            <div className={styles.tabContent}>
                <h3>Education</h3>
                <div className={styles.educationCard}>
                    <div className={styles.eduYear}>2022 - 2026</div>
                    <h4>Bachelors in Leather Design</h4>
                    <span className={styles.institution}>National Institute of Fashion Technology, Chennai</span>
                    <p className={styles.specialization}>Minor in Accessory Design • Specialization in Handmade & Luxury Design</p>
                </div>
                <div className={styles.educationRow}>
                    <div className={styles.eduMini}>
                        <span className={styles.eduYear}>2019 - 2020</span>
                        <h4>12th Grade</h4>
                        <span>Venkateshwar Int. School</span>
                    </div>
                    <div className={styles.eduMini}>
                        <span className={styles.eduYear}>2017 - 2018</span>
                        <h4>10th Grade</h4>
                        <span>Venkateshwar Int. School</span>
                    </div>
                </div>
            </div>
        ),
        interests: (
            <div className={styles.tabContent}>
                <h3>Interests</h3>
                <div className={styles.interestGrid}>
                    {["Face Painting", "Jacket Painting", "Product Design", "Resin Art"].map(interest => (
                        <div key={interest} className={styles.interestCard}>
                            {interest}
                        </div>
                    ))}
                </div>
                <div className={styles.subSection}>
                    <h5>Volunteering</h5>
                    <ul className={styles.simpleList}>
                        <li>NIFT Spectrum</li>
                        <li>Interdepartment Fest</li>
                        <li>Indian International Leather Fair</li>
                    </ul>
                </div>
            </div>
        )
    };

    return (
        <section id="about" className={styles.about}>
            <div className="container">
                <div className={styles.header}>
                    <motion.h2
                        className="section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        About Me
                    </motion.h2>
                    <div className={styles.divider}></div>
                </div>

                <div className={styles.contentWrapper}>
                    <motion.div
                        className={styles.imageColumn}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className={styles.imageFrame}>
                            <Image
                                src="/assets/profile.jpg"
                                alt="Shirika Kohli"
                                width={400}
                                height={500}
                                className={styles.profileImage}
                                priority
                            />
                            <div className={styles.imageOverlay}></div>
                        </div>
                        <div className={styles.contactInfo}>
                            <h3>Shirika Kohli</h3>
                            <p>Leather Design Student</p>
                            <a href="/assets/CV Shirika .pdf" download className={styles.downloadBtn}>
                                <Download size={18} /> Download CV
                            </a>
                        </div>
                    </motion.div>

                    <div className={styles.tabsColumn}>
                        <div className={styles.tabsHeader}>
                            {tabs.map((tab) => (
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
                </div>
            </div>
        </section>
    );
};

export default About;
