'use client';

import React from 'react';
import { BuilderProvider } from './BuilderContext';
import BlockRenderer from './BlockRenderer';
import { generateThemeCSS, getGoogleFontsUrl } from '@/lib/utils/theme';
import Navbar from '@/components/Navbar';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import { getBlockDefinition } from './registry';

const PublicPageViewer = ({
    blocks = [],
    profile,
    experiences,
    skills,
    education,
    interests,
    projects,
    artwork,
    logos,
    socialLinks,
    theme
}) => {
    // Generate context data structure matching BuilderContext expectations
    const contextValue = {
        profile,
        personal: {
            name: profile.name,
            title: profile.title,
            tagline: profile.tagline,
            // ... other personal fields if needed
        },
        experiences,
        skills,
        education,
        interests,
        projects,
        artwork,
        logos,
        socialLinks,
        theme
    };

    // Filter visible blocks, map DB fields, and sort by display_order
    const visibleBlocks = [...blocks]
        .filter(b => b.is_visible)
        .sort((a, b) => a.display_order - b.display_order)
        .map(b => ({
            ...b,
            type: b.block_type || b.type, // Handle DB field mapping
        }));

    // Generate Navigation Items
    const navItems = visibleBlocks
        .filter(b => {
            // Include legacy sections or any block with a custom sectionTitle
            const isLegacy = ['about', 'portfolio', 'artwork', 'logos', 'contact'].includes(b.type);
            return isLegacy || (b.config && b.config.sectionTitle);
        })
        .map(b => {
            const def = getBlockDefinition(b.type);
            const label = b.config?.sectionTitle || def?.label || b.type;
            return {
                href: `#${b.id}`,
                label: label
            };
        });

    return (
        <BuilderProvider value={contextValue}>
            <PageViewTracker userId={profile.user_id} />
            <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(theme) }} />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href={getGoogleFontsUrl(theme)} rel="stylesheet" />

            {/* Navbar is usually separate, but might need to be block-aware or standard */}
            <Navbar
                name={profile.name}
                navItems={navItems}
            />

            <main className="min-h-screen bg-background text-text-primary">
                {visibleBlocks.map(block => (
                    <BlockRenderer key={block.id} block={block} isPublic={true} />
                ))}

                {visibleBlocks.length === 0 && (
                    <div className="flex items-center justify-center min-h-screen text-gray-500">
                        <p>This portfolio is currently empty.</p>
                    </div>
                )}
            </main>
        </BuilderProvider>
    );
};

export default PublicPageViewer;
