"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import styles from "./Portfolio.module.css";

const projects = [
    {
        id: "zenia",
        title: "ZENIA",
        number: "01",
        cover: "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0003.jpg",
        images: [
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0003.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0004.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0005.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0006.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0007.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0008.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0009.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0010.jpg",
        ]
    },
    {
        id: "midnight-tether",
        title: "MIDNIGHT TETHER",
        number: "02",
        cover: "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0015.jpg",
        images: [
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0015.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0016.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0017.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0018.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0019.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0020.jpg",
        ]
    },
    {
        id: "terra-sheath",
        title: "TERRA SHEATH",
        number: "03",
        cover: "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0009.jpg",
        images: [
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0009.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0010.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0011.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0012.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0013.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0014.jpg",
        ]
    },
    {
        id: "patina-crate",
        title: "THE PATINA CRATE",
        number: "04",
        cover: "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0021.jpg",
        images: [
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0021.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0022.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0023.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0024.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0025.jpg",
            "/assets/portfolio/PORTFOLIO (1)_pages-to-jpg-0026.jpg",
        ]
    },
    {
        id: "strata-vessel",
        title: "STRATA VESSEL",
        number: "05",
        cover: "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0030.jpg",
        images: [
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0030.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0031.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0032.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0033.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0034.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0035.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0036.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0037.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0038.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0039.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0040.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0041.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0042.jpg",
        ]
    },
    {
        id: "misc",
        title: "MISCELLANEOUS",
        number: "06",
        cover: "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0043.jpg",
        images: [
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0043.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0044.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0045.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0046.jpg",
            "/assets/portfolio/PORTFOLIO (4)_pages-to-jpg-0047.jpg",
        ]
    }
];

const Portfolio = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [lightboxImage, setLightboxImage] = useState(null);

    const openProject = (project) => {
        setSelectedProject(project);
        // Removed scroll to top to maintain context
    };

    const closeProject = () => {
        setSelectedProject(null);
    };

    return (
        <section id="portfolio" className={styles.portfolio}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className="section-title">Selected Works</h2>
                    <div className={styles.divider}></div>
                </div>

                <AnimatePresence mode="wait">
                    {!selectedProject ? (
                        <motion.div
                            className={styles.projectGrid}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {projects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    className={styles.projectCard}
                                    onClick={() => openProject(project)}
                                    whileHover={{ y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className={styles.cardImage}>
                                        <Image
                                            src={project.cover}
                                            alt={project.title}
                                            fill
                                            className={styles.coverImage}
                                        />
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
                                {selectedProject.images.map((img, index) => (
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
            </div>
        </section>
    );
};

export default Portfolio;
