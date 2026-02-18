"use client";

import styles from "./Contact.module.css";
import { Mail, Instagram, Linkedin, Twitter, Github, Globe, Youtube, LucideIcon } from "lucide-react";
import type { ContactProps, SocialLink } from "@/types";
// @ts-ignore
import FreeFormElement from "@/components/builder/freeform/FreeFormElement";
// @ts-ignore
import FreeFormSection from "@/components/builder/freeform/FreeFormSection";

// Icon mapping for social platforms
const iconMap: Record<string, LucideIcon> = {
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
    github: Github,
    youtube: Youtube,
    website: Globe,
    mail: Mail,
};

interface ExtendedContactProps extends ContactProps {
    sectionTitle?: string;
    style?: React.CSSProperties;
    id?: string;
    freeFormEnabled?: boolean;
    blockId?: string;
    elementPositions?: Record<string, { x: number; y: number; w: number; h: number }>;
}

const Contact = ({
    name = "User",
    contactEmail = "",
    linkedinUrl = "",
    socialLinks = [],
    sectionTitle = "Get In Touch",
    style,
    id,
    freeFormEnabled = false,
    blockId,
    elementPositions = {},
}: ExtendedContactProps) => {

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
                elementId="contact-title"
                label="Section Title"
                position={positions['contact-title']}
                defaultSize={{ width: '400', height: '50' }}
                freeFormEnabled={isFreeFormActive}
                isSelected={selectedElement === 'contact-title' || selectedElementIds.includes('contact-title')}
                onSelect={onSelect}
            >
                <h2 className="section-title">{sectionTitle}</h2>
            </FreeFormElement>

            <FreeFormElement
                elementId="contact-cards"
                label="Contact Cards"
                position={positions['contact-cards']}
                defaultSize={{ width: '100%', height: 'auto' }}
                freeFormEnabled={isFreeFormActive}
                isSelected={selectedElement === 'contact-cards' || selectedElementIds.includes('contact-cards')}
                onSelect={onSelect}
            >
                <div className={styles.content}>
                    <div className={styles.card}>
                        <h3>Collaboration</h3>
                        <p>Like what I do? Let&apos;s discuss what I can do for your brand.</p>
                        <a
                            href={linkedinUrl || `mailto:${contactEmail}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.btn}
                        >
                            Start a Project
                        </a>
                    </div>

                    <div className={styles.card}>
                        <h3>Job Enquiries</h3>
                        <p>Available for interesting freelance projects and full-time roles.</p>
                        <a href={`mailto:${contactEmail}`} className={styles.btn}>
                            Send Enquiry
                        </a>
                    </div>
                </div>
            </FreeFormElement>

            <FreeFormElement
                elementId="contact-socials"
                label="Social Links"
                position={positions['contact-socials']}
                defaultSize={{ width: '300', height: '50' }}
                freeFormEnabled={isFreeFormActive}
                isSelected={selectedElement === 'contact-socials' || selectedElementIds.includes('contact-socials')}
                onSelect={onSelect}
            >
                <div className={styles.socials}>
                    {socialLinks?.map((link: SocialLink, index: number) => {
                        const IconComponent = iconMap[link.platform] || Globe;
                        return (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label={link.platform}
                            >
                                <IconComponent size={24} />
                            </a>
                        );
                    })}
                    {contactEmail && (
                        <a href={`mailto:${contactEmail}`} className={styles.socialLink} aria-label="Email">
                            <Mail size={24} />
                        </a>
                    )}
                </div>
            </FreeFormElement>

            <FreeFormElement
                elementId="contact-footer"
                label="Footer"
                position={positions['contact-footer']}
                defaultSize={{ width: '100%', height: '40' }}
                freeFormEnabled={isFreeFormActive}
                isSelected={selectedElement === 'contact-footer' || selectedElementIds.includes('contact-footer')}
                onSelect={onSelect}
            >
                <footer className={styles.footer}>
                    <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
                </footer>
            </FreeFormElement>
        </>
    );

    return (
        <section id={id || "contact"} className={styles.contact} style={style}>
            <div className="container">
                {freeFormEnabled ? (
                    <FreeFormSection
                        blockId={blockId}
                        blockType="contact"
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

export default Contact;
