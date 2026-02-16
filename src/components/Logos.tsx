"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./Portfolio.module.css";
import type { LogosProps } from "@/types";
// @ts-ignore
import FreeFormElement from "@/components/builder/freeform/FreeFormElement";
// @ts-ignore
import FreeFormSection from "@/components/builder/freeform/FreeFormSection";

interface LogoItem {
    id: string;
    imageUrl: string;
    title?: string;
}

interface ExtendedLogosProps extends LogosProps {
    sectionTitle?: string;
    style?: React.CSSProperties;
    id?: string;
    freeFormEnabled?: boolean;
    blockId?: string;
    elementPositions?: Record<string, { x: number; y: number; w: number; h: number }>;
}

const Logos = ({
    logoImages = [],
    sectionTitle = "Logo Design",
    style,
    id,
    freeFormEnabled = false,
    blockId,
    elementPositions = {},
}: ExtendedLogosProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!logoImages || logoImages.length === 0) {
        return null;
    }

    const normalizedLogos: LogoItem[] = logoImages.map((item, index) => ({
        id: String(index),
        imageUrl: typeof item === 'string' ? item : item,
        title: `Logo ${index + 1}`,
    }));

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
                elementId="logos-title"
                label="Section Title"
                position={positions['logos-title']}
                defaultSize={{ width: '400', height: '50' }}
                freeFormEnabled={isFreeFormActive}
                isSelected={selectedElement === 'logos-title' || selectedElementIds.includes('logos-title')}
                onSelect={onSelect}
            >
                <h2 className="section-title">{sectionTitle}</h2>
            </FreeFormElement>

            <FreeFormElement
                elementId="logos-grid"
                label="Logo Grid"
                position={positions['logos-grid']}
                defaultSize={{ width: '100%', height: 'auto' }}
                freeFormEnabled={isFreeFormActive}
                isSelected={selectedElement === 'logos-grid' || selectedElementIds.includes('logos-grid')}
                onSelect={onSelect}
            >
                <div className={styles.grid} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                    {normalizedLogos.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className={styles.item}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedImage(item.imageUrl)}
                            style={{ aspectRatio: "1/1" }}
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                loading="lazy"
                                style={{ objectFit: "contain", padding: "1rem", background: "#fff" }}
                            />
                            <div className={styles.overlay}>
                                <span style={{ color: "#000", borderColor: "#000" }}>View</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </FreeFormElement>
        </>
    );

    return (
        <section id={id || "logos"} className={styles.portfolio} style={style}>
            <div className="container">
                {freeFormEnabled ? (
                    <FreeFormSection
                        blockId={blockId}
                        blockType="logos"
                        freeFormEnabled={freeFormEnabled}
                        positions={elementPositions}
                    >
                        {renderContent}
                    </FreeFormSection>
                ) : (
                    <div style={{ position: 'relative', height: '600px', width: '100%' }}>
                        {renderContent(null, () => { }, null, elementPositions, false, [])}
                    </div>
                )}
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
