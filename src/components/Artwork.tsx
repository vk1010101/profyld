"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./Portfolio.module.css";
import type { ArtworkProps } from "@/types";
// @ts-ignore
import FreeFormElement from "@/components/builder/freeform/FreeFormElement";
// @ts-ignore
import FreeFormSection from "@/components/builder/freeform/FreeFormSection";

interface ArtworkItem {
    id: string;
    imageUrl: string;
    title?: string;
}

interface ExtendedArtworkProps extends ArtworkProps {
    sectionTitle?: string;
    style?: React.CSSProperties;
    id?: string;
    freeFormEnabled?: boolean;
    blockId?: string;
    elementPositions?: Record<string, { x: number; y: number; w: number; h: number }>;
}

const Artwork = ({
    artworkImages = [],
    sectionTitle = "Artwork",
    style,
    id,
    freeFormEnabled = false,
    blockId,
    elementPositions = {},
}: ExtendedArtworkProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!artworkImages || artworkImages.length === 0) {
        return null;
    }

    const normalizedArtwork: ArtworkItem[] = artworkImages.map((item, index) => ({
        id: String(index),
        imageUrl: typeof item === 'string' ? item : item,
        title: `Artwork ${index + 1}`,
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
                elementId="artwork-title"
                label="Section Title"
                position={positions['artwork-title']}
                defaultSize={{ width: '400', height: '50' }}
                freeFormEnabled={isFreeFormActive}
                isSelected={selectedElement === 'artwork-title' || selectedElementIds.includes('artwork-title')}
                onSelect={onSelect}
            >
                <h2 className="section-title">{sectionTitle}</h2>
            </FreeFormElement>

            <FreeFormElement
                elementId="artwork-grid"
                label="Artwork Grid"
                position={positions['artwork-grid']}
                defaultSize={{ width: '100%', height: 'auto' }}
                freeFormEnabled={isFreeFormActive}
                isSelected={selectedElement === 'artwork-grid' || selectedElementIds.includes('artwork-grid')}
                onSelect={onSelect}
            >
                <div className={styles.grid}>
                    {normalizedArtwork.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className={styles.item}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedImage(item.imageUrl)}
                        >
                            <img src={item.imageUrl} alt={item.title} loading="lazy" />
                            <div className={styles.overlay}>
                                <span>View</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </FreeFormElement>
        </>
    );

    return (
        <section id={id || "artwork"} className={styles.portfolio} style={style || { background: "var(--color-surface)" }}>
            <div className="container">
                {freeFormEnabled ? (
                    <FreeFormSection
                        blockId={blockId}
                        blockType="artwork"
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

export default Artwork;
