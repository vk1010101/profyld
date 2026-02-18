"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import styles from "./Portfolio.module.css";
import type { PortfolioProps, Project } from "@/types";
// @ts-ignore
import FreeFormElement from "@/components/builder/freeform/FreeFormElement";
// @ts-ignore
import FreeFormSection from "@/components/builder/freeform/FreeFormSection";

interface ProjectWithNumber extends Project {
    number: string;
    cover?: string;
}

interface ExtendedPortfolioProps extends PortfolioProps {
    sectionTitle?: string;
    style?: React.CSSProperties;
    id?: string;
    freeFormEnabled?: boolean;
    blockId?: string;
    elementPositions?: Record<string, { x: number; y: number; w: number; h: number }>;
}

const Portfolio = ({
    projects = [],
    sectionTitle = "Selected Works",
    style,
    id,
    freeFormEnabled = false,
    blockId,
    elementPositions = {},
}: ExtendedPortfolioProps) => {
    const [selectedProject, setSelectedProject] = useState<ProjectWithNumber | null>(null);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    if (!projects || projects.length === 0) {
        return null;
    }

    const projectsWithNumbers: ProjectWithNumber[] = projects.map((project, index) => ({
        ...project,
        number: String(index + 1).padStart(2, '0'),
        cover: project.images?.[0] || '',
    }));

    const openProject = (project: ProjectWithNumber) => {
        setSelectedProject(project);
    };

    const closeProject = () => {
        setSelectedProject(null);
    };

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
                elementId="portfolio-title"
                label="Section Title"
                position={positions['portfolio-title']}
                defaultSize={{ width: '400', height: '60' }}
                freeFormEnabled={isFreeFormActive}
                isSelected={selectedElement === 'portfolio-title' || selectedElementIds.includes('portfolio-title')}
                onSelect={onSelect}
            >
                <div className={styles.header}>
                    <h2 className="section-title">{sectionTitle}</h2>
                    <div className={styles.divider}></div>
                </div>
            </FreeFormElement>

            <FreeFormElement
                elementId="portfolio-grid"
                label="Project Grid"
                position={positions['portfolio-grid']}
                defaultSize={{ width: '100%', height: 'auto' }}
                freeFormEnabled={isFreeFormActive}
                isSelected={selectedElement === 'portfolio-grid' || selectedElementIds.includes('portfolio-grid')}
                onSelect={onSelect}
            >
                <AnimatePresence mode="wait">
                    {!selectedProject ? (
                        <motion.div
                            className={styles.projectGrid}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {projectsWithNumbers.map((project) => (
                                <motion.div
                                    key={project.slug || project.title}
                                    className={styles.projectCard}
                                    onClick={() => openProject(project)}
                                    whileHover={{ y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className={styles.cardImage}>
                                        {project.cover && (
                                            <Image
                                                src={project.cover}
                                                alt={project.title}
                                                fill
                                                className={styles.coverImage}
                                            />
                                        )}
                                        <div className={styles.overlay}>
                                            <span className={styles.viewProject}>View Project</span>
                                        </div>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <span className={styles.projectNumber}>{project.number}</span>
                                        <h3>{project.title}</h3>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            className={styles.projectDetail}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                        >
                            <button className={styles.backButton} onClick={closeProject}>
                                <ArrowLeft size={20} /> Back to Projects
                            </button>

                            <div className={styles.detailHeader}>
                                <span className={styles.detailNumber}>{selectedProject.number}</span>
                                <h2>{selectedProject.title}</h2>
                            </div>

                            <div className={styles.detailGrid}>
                                {selectedProject.images?.map((img: string, index: number) => (
                                    <motion.div
                                        key={index}
                                        className={styles.detailImageWrapper}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => setLightboxImage(img)}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${selectedProject.title} - ${index + 1}`}
                                            width={800}
                                            height={1000}
                                            className={styles.detailImage}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </FreeFormElement>
        </>
    );

    return (
        <section id={id || "portfolio"} className={styles.portfolio} style={style}>
            <div className="container">
                {freeFormEnabled ? (
                    <FreeFormSection
                        blockId={blockId}
                        blockType="portfolio"
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

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        className={styles.lightbox}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightboxImage(null)}
                    >
                        <button className={styles.closeButton} onClick={() => setLightboxImage(null)}>
                            <X size={32} />
                        </button>
                        <img src={lightboxImage} alt="Full size" className={styles.lightboxImage} />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Portfolio;
