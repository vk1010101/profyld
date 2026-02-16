import React, { memo, useState, useEffect } from 'react';
import { getBlockDefinition } from './registry';
import { useBuilderContext } from './BuilderContext';

/**
 * Hook to detect media query match
 */
const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);
    return matches;
};

/**
 * BlockRenderer — renders a block component with injected data and config.
 * 
 * When isPublic=false (builder mode):
 *  - freeFormEnabled: true → elements get drag/resize handles
 * 
 * When isPublic=true (public page):
 *  - freeFormEnabled: false → no editing controls
 *  - elementPositions still passed → sections apply as static CSS positions
 */
const BlockRenderer = memo(({ block, isPublic = false }) => {
    const { type, config } = block;
    const definition = getBlockDefinition(type);
    const data = useBuilderContext();

    // Simple breakpoint for mobile
    const isMobile = useMediaQuery('(max-width: 768px)');

    if (!definition) {
        console.error('Unknown block type:', type, block);
        return <div className="p-4 border border-red-500 bg-red-50 text-red-500">Unknown block type: {type}</div>;
    }

    const Component = definition.component;

    // Extract free-form positioning data from config (don't spread these as props)
    const { _positions, _hasCustomLayout, ...cleanConfig } = config || {};

    // Determine positions based on public/builder state AND viewport
    const getPositions = () => {
        if (!isPublic) {
            // Builder Mode: handled by FreeFormSection via store usually, 
            // but we pass desktop as default to be safe or empty.
            return _positions?.desktop || {};
        }
        // Public Mode: Responsive
        return isMobile
            ? (_positions?.mobile || _positions?.desktop || {}) // Fallback to desktop if mobile missing?
            : (_positions?.desktop || {});
    };

    const activePositions = getPositions();

    // Check Block Visibility
    // config.visibility = { desktop: true, mobile: false }
    const visibility = config?.visibility || { desktop: true, mobile: true };
    const currentViewMode = isPublic ? (isMobile ? 'mobile' : 'desktop') : data.viewMode || 'desktop'; // Builder context has viewMode

    if (isPublic) {
        // In public mode, if hidden, don't render at all
        if (visibility[currentViewMode] === false) return null;
    } else {
        // In builder mode, we might want to show it dimmed?
        // Or just let it be hidden to simulate real view? 
        // User probably expects "Hide on Mobile" to actually hide it in Mobile View.
        if (visibility[currentViewMode] === false) {
            // Optional: Return a "Hidden in this view" placeholder?
            // For now, let's just opacity it to 0.1 so they can still select it to unhide?
            // Or actually hidden is cleaner.
            // BUT if hidden, how do they select it to unhide?
            // They select it from the Layers List (if we had one) or they switch views.
            // Best to show a "Hidden Block" placeholder.
            return (
                <div className="p-4 border border-dashed border-gray-700 opacity-50 relative group">
                    <div className="text-gray-500 text-xs text-center">Block Hidden in {currentViewMode} View</div>
                    <Component {...cleanConfig} id={block.id} style={{ opacity: 0.2, pointerEvents: 'none', height: 100, overflow: 'hidden' }} />
                    {/* Overlay to allow selecting */}
                    <div className="absolute inset-0 z-50 cursor-pointer" title="Click to Select Hidden Block" />
                </div>
            );
        }
    }

    const freeFormProps = isPublic
        ? {
            freeFormEnabled: false,
            blockId: block.id,
            elementPositions: activePositions,
        }
        : {
            freeFormEnabled: true,
            blockId: block.id,
            elementPositions: _positions?.desktop || {},
        };

    // Inject data props based on block type
    let dataProps = {};

    switch (type) {
        case 'hero':
            dataProps = {
                personal: data.personal,
                backgroundType: cleanConfig.backgroundType || data.theme?.backgroundType,
                heroImage: cleanConfig.heroImage || data.theme?.heroImage,
                backgroundColor: cleanConfig.backgroundColor || data.theme?.backgroundColor,
                gradientColor1: cleanConfig.gradientColor1 || data.theme?.gradientColor1,
                gradientColor2: cleanConfig.gradientColor2 || data.theme?.gradientColor2,
                gradientDirection: cleanConfig.gradientDirection || data.theme?.gradientDirection,
                overlayOpacity: cleanConfig.overlayOpacity || data.theme?.overlayOpacity,
            };
            break;
        case 'about':
            dataProps = {
                profile: {
                    bio: data.profile?.bio,
                    languages: data.profile?.languages,
                    cvUrl: data.profile?.cv_url,
                    profileImage: data.profile?.profile_image_url,
                    name: data.personal?.name,
                    title: data.personal?.title,
                },
                experience: data.experiences,
                skills: data.skills,
                education: data.education,
                interests: data.interests,
                portfolioUserId: data.profile?.user_id
            };
            break;
        case 'portfolio':
            dataProps = {
                projects: data.projects?.map(p => ({
                    title: p.title,
                    slug: p.slug,
                    images: p.project_images?.map(img => img.image_url) || [],
                })) || []
            };
            break;
        case 'artwork':
            dataProps = {
                artworkImages: data.artwork?.map(a => a.image_url) || []
            };
            break;
        case 'logos':
            dataProps = {
                logoImages: data.logos?.map(l => l.image_url) || []
            };
            break;
        case 'contact':
            dataProps = {
                name: data.personal?.name,
                contactEmail: data.profile?.contact_email,
                socialLinks: data.socialLinks
            };
            break;
        case 'creative_canvas':
            return <Component config={config} id={block.id} />;
        default:
            return <Component {...cleanConfig} id={block.id} />;
    }

    // Build background style from config (for non-hero blocks)
    const backgroundStyle = {};
    if (type !== 'hero') {
        if (cleanConfig.backgroundColor) {
            backgroundStyle.backgroundColor = cleanConfig.backgroundColor;
        }
        if (cleanConfig.backgroundImage) {
            backgroundStyle.backgroundImage = `url(${cleanConfig.backgroundImage})`;
            backgroundStyle.backgroundSize = 'cover';
            backgroundStyle.backgroundPosition = 'center';
        }
    }

    // Legacy sections get free-form props + their data + background style
    const mergedStyle = Object.keys(backgroundStyle).length > 0
        ? { ...backgroundStyle, ...(cleanConfig.style || {}) }
        : cleanConfig.style;

    return <Component {...dataProps} {...cleanConfig} {...freeFormProps} id={block.id} style={mergedStyle} />;
});

export default BlockRenderer;
