"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./Portfolio.module.css"; // Reusing portfolio styles for consistency

const artworkImages = [
    "/assets/artwork/WhatsApp Image 2025-11-20 at 9.44.22 PM (1).jpeg",
    "/assets/artwork/WhatsApp Image 2025-11-20 at 9.44.22 PM (2).jpeg",
    "/assets/artwork/WhatsApp Image 2025-11-20 at 9.44.22 PM.jpeg",
    "/assets/artwork/WhatsApp Image 2025-11-20 at 9.44.23 PM (2).jpeg"
];

const Artwork = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <section id="artwork" className={styles.portfolio} style={{ background: "var(--surface)" }}>
            <div className="container">
                <h2 className="section-title">Artwork</h2>
                <div className={styles.grid}>
                    {artworkImages.map((src, index) => (
                        <motion.div
                            key={index}
                            className={styles.item}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedImage(src)}
                        >
                            <img src={src} alt={`Artwork Item ${index + 1}`} loading="lazy" />
                            <div className={styles.overlay}>
                                <span>View</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {selectedImage && (
                <div className={styles.lightbox} onClick={() => setSelectedImage(null)}>
                    <div className={styles.lightboxContent}>
                        <img src={selectedImage} alt="Full size" />
                        <button className={styles.closeBtn} onClick={() => setSelectedImage(null)}>×</button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Artwork;
