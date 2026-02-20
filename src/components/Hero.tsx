"use client";

import { motion } from "framer-motion";
import styles from "./Hero.module.css";
import type { HeroProps, PersonalInfo } from "@/types";
import { useTheme } from "@/components/context/ThemeContext";
// @ts-ignore
import FreeFormElement from "@/components/builder/freeform/FreeFormElement";
// @ts-ignore
import FreeFormSection from "@/components/builder/freeform/FreeFormSection";
// @ts-ignore
import BackgroundEffect from "@/components/effects/BackgroundEffect";

type BackgroundType = 'image' | 'color' | 'gradient' | 'mesh' | 'aurora' | 'dots' | 'waves' | 'grain' | 'orbs';

interface ExtendedHeroProps extends HeroProps {
    backgroundType?: BackgroundType;
    heroImage?: string;
    backgroundColor?: string;
    gradientColor1?: string;
    gradientColor2?: string;
    gradientDirection?: string;
    overlayOpacity?: number;
    // Effect props — passed explicitly so effects work on public pages without ThemeContext
    primaryColor?: string;
    // Smart Block Props
    title?: string;
    subtitle?: string;
    tagline?: string;
    // Free-form props
    freeFormEnabled?: boolean;
    blockId?: string;
    elementPositions?: Record<string, { x: number; y: number; w: number; h: number }>;
}

// Effect-based background types that use BackgroundEffect component
const EFFECT_TYPES = ['mesh', 'aurora', 'dots', 'waves', 'grain', 'orbs'];

const Hero = ({
    personal = {} as PersonalInfo,
    // Direct props from Smart Block Config
    title: configTitle,
    subtitle: configSubtitle,
    tagline: configTagline,

    backgroundType = 'gradient',
    heroImage,
    backgroundColor = '#1a1a1a',
    gradientColor1 = '#1a1a1a',
    gradientColor2 = '#0a0a0a',
    gradientDirection = 'to bottom right',
    overlayOpacity = 0.7,
    primaryColor: primaryColorProp,
    freeFormEnabled = false,
    blockId,
    elementPositions = {},
}: ExtendedHeroProps) => {
    // Priority: Config Prop > Personal Data > Default
    const name = configTitle || personal.name || "Your Name";
    const title = configSubtitle || personal.title || "Your Title";
    const tagline = configTagline || personal.tagline || "Your professional tagline";

    // Use theme context for defaults
    const { themeConfig } = useTheme();
    const heroGradient = themeConfig?.heroGradient || { start: '#1a1a1a', end: '#0a0a0a', direction: 'to bottom right' };

    // Check if the current type is an effect type
    const isEffectType = EFFECT_TYPES.includes(backgroundType);

    // Generate background style based on type
    const getBackgroundStyle = (): React.CSSProperties => {
        // For effect types, use the gradient as the base background
        if (isEffectType) {
            const g1 = gradientColor1 !== '#1a1a1a' ? gradientColor1 : heroGradient.start;
            const g2 = gradientColor2 !== '#0a0a0a' ? gradientColor2 : heroGradient.end;
            const dir = gradientDirection !== 'to bottom right' ? gradientDirection : heroGradient.direction;
            return { background: `linear-gradient(${dir}, ${g1}, ${g2})` };
        }

        switch (backgroundType) {
            case 'image':
                return heroImage
                    ? { backgroundImage: `url(${heroImage})` }
                    : { background: `linear-gradient(${gradientDirection || heroGradient.direction}, ${gradientColor1 || heroGradient.start}, ${gradientColor2 || heroGradient.end})` };
            case 'color':
                return { backgroundColor };
            case 'gradient':
            default:
                const g1 = gradientColor1 !== '#1a1a1a' ? gradientColor1 : heroGradient.start;
                const g2 = gradientColor2 !== '#0a0a0a' ? gradientColor2 : heroGradient.end;
                const dir = gradientDirection !== 'to bottom right' ? gradientDirection : heroGradient.direction;
                return { background: `linear-gradient(${dir}, ${g1}, ${g2})` };
        }
    };

    // Get primary color for effects — prefer explicit prop, then ThemeContext, then default
    const primaryColor = primaryColorProp || themeConfig?.colors?.primary || '#8B7355';
    const bgColor = backgroundColor || themeConfig?.colors?.background || '#0A0A0A';

    // Render hero content — either with free-form wrappers or normally
    const renderContent = (
        selectedElement: string | null,
        onSelect: (id: string) => void,
        _: any, // deprecated onUpdatePosition
        positions: Record<string, any>,
        isFreeFormActive: boolean,
        selectedElementIds: string[] = []
    ) => (
        <div className={styles.content}>
            <FreeFormElement
                elementId="hero-subtitle"
                label="Title"
                position={positions['hero-subtitle']}
                defaultSize={{ width: '400', height: '40' }}
                freeFormEnabled={isFreeFormActive}
                isSelected={selectedElement === 'hero-title' || selectedElementIds.includes('hero-title')}
                onSelect={onSelect}
            >
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={styles.subtitle}
                >
                    {title}
                </motion.h2>
            </FreeFormElement>

            <FreeFormElement
                elementId="hero-name"
                label="Name"
                position={positions['hero-name']}
                defaultSize={{ width: '600', height: '100' }}
                freeFormEnabled={isFreeFormActive}
                isSelected={selectedElement === 'hero-name' || selectedElementIds.includes('hero-name')}
                onSelect={onSelect}
            >
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={styles.title}
                >
                    {name}
                </motion.h1>
            </FreeFormElement>

            <FreeFormElement
                elementId="hero-tagline"
                label="Tagline"
                position={positions['hero-tagline']}
                defaultSize={{ width: '500', height: '40' }}
                freeFormEnabled={isFreeFormActive}
                isSelected={selectedElement === 'hero-tagline' || selectedElementIds.includes('hero-tagline')}
                onSelect={onSelect}
            >
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className={styles.description}
                >
                    {tagline}
                </motion.p>
            </FreeFormElement>

            <FreeFormElement
                elementId="hero-cta"
                label="CTA Button"
                position={positions['hero-cta']}
                defaultSize={{ width: '200', height: '50' }}
                freeFormEnabled={isFreeFormActive}
                isSelected={selectedElement === 'hero-cta' || selectedElementIds.includes('hero-cta')}
                onSelect={onSelect}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className={styles.actions}
                >
                    <a href="#portfolio" className={styles.cta}>
                        View Portfolio
                    </a>
                </motion.div>
            </FreeFormElement>
        </div>
    );

    return (
        <section className={styles.hero} style={getBackgroundStyle()}>
            {/* Render animated background effect if selected */}
            {isEffectType && (
                <BackgroundEffect
                    effect={backgroundType}
                    primaryColor={primaryColor}
                    backgroundColor={bgColor}
                />
            )}
            <div
                className={styles.overlay}
                style={{ opacity: overlayOpacity > 1 ? overlayOpacity / 100 : overlayOpacity }}
            ></div>
            <div className="container">
                {freeFormEnabled ? (
                    <FreeFormSection
                        blockId={blockId}
                        blockType="hero"
                        freeFormEnabled={freeFormEnabled}
                        positions={elementPositions}
                        sectionHeight={600}
                    >
                        {renderContent}
                    </FreeFormSection>
                ) : (
                    // Public View: Wrap in relative container to match Builder's FreeFormSection context
                    <div style={{ position: 'relative', height: '600px', width: '100%' }}>
                        {renderContent(null, () => { }, null, elementPositions, false, [])}
                    </div>
                )}
            </div>

            <motion.div
                className={styles.scrollIndicator}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <div className={styles.mouse}>
                    <div className={styles.wheel}></div>
                </div>
            </motion.div>
        </section >
    );
};

export default Hero;
