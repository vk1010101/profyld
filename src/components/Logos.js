"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./Portfolio.module.css"; // Reusing portfolio styles

const logoImages = [
    "/assets/logos/WhatsApp Image 2025-11-20 at 9.44.23 PM (1).jpeg",
    "/assets/logos/WhatsApp Image 2025-11-20 at 9.44.23 PM.jpeg"
];

const Logos = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <section id="logos" className={styles.portfolio}>
            <div className="container">
                <h2 className="section-title">Logo Design</h2>
                <div className={styles.grid} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                    {logoImages.map((src, index) => (
                        <motion.div
                            key={index}
                            className={styles.item}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedImage(src)}
                            style={{ aspectRatio: "1/1" }}
                        >
                            <img src={src} alt={`Logo Item ${index + 1}`} loading="lazy" style={{ objectFit: "contain", padding: "1rem", background: "#fff" }} />
                            <div className={styles.overlay}>
                                <span style={{ color: "#000", borderColor: "#000" }}>View</span>
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

export default Logos;
