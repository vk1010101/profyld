"use client";

import { useEffect, useRef } from 'react';

/**
 * BackgroundEffect — Pure CSS/SVG visual backgrounds for portfolio hero sections.
 * 
 * Renders visually stunning, animated backgrounds using only CSS (no images, no heavy libs).
 * Each effect uses the theme's primary color to stay cohesive.
 * 
 * Supported effects:
 * - mesh:    Organic multi-blob mesh gradient (Apple-style)
 * - aurora:  Animated aurora borealis glow strips
 * - dots:    Minimalist animated dot grid
 * - waves:   Flowing SVG wave layers
 * - grain:   Film grain texture overlay
 * - orbs:    Floating glassmorphism orbs
 */

// Helper: parse hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : { r: 139, g: 115, b: 85 }; // fallback gold
}

// Helper: shift hue for variety
function shiftColor(hex, amount) {
    const rgb = hexToRgb(hex);
    return `rgb(${Math.min(255, rgb.r + amount)}, ${Math.min(255, rgb.g + amount)}, ${Math.min(255, rgb.b + amount)})`;
}

export default function BackgroundEffect({ effect, primaryColor = '#8B7355', backgroundColor = '#0A0A0A' }) {
    const rgb = hexToRgb(primaryColor);
    const bgRgb = hexToRgb(backgroundColor);
    const isDark = (bgRgb.r + bgRgb.g + bgRgb.b) / 3 < 128;

    // Common container style
    const containerStyle = {
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
    };

    switch (effect) {
        case 'mesh':
            return <MeshGradient containerStyle={containerStyle} rgb={rgb} isDark={isDark} />;
        case 'aurora':
            return <AuroraBorealis containerStyle={containerStyle} rgb={rgb} isDark={isDark} />;
        case 'dots':
            return <DotGrid containerStyle={containerStyle} rgb={rgb} isDark={isDark} />;
        case 'waves':
            return <FlowingWaves containerStyle={containerStyle} rgb={rgb} isDark={isDark} primaryColor={primaryColor} />;
        case 'grain':
            return <FilmGrain containerStyle={containerStyle} isDark={isDark} />;
        case 'orbs':
            return <FloatingOrbs containerStyle={containerStyle} rgb={rgb} isDark={isDark} />;
        default:
            return null;
    }
}

/* ─────────────────────── MESH GRADIENT ─────────────────────── */
function MeshGradient({ containerStyle, rgb, isDark }) {
    const opacity = isDark ? 0.4 : 0.25;
    return (
        <div style={containerStyle}>
            <style>{`
        @keyframes meshMove1 { 
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          25% { transform: translate(10%, -15%) scale(1.1); }
          50% { transform: translate(-5%, 10%) scale(0.95); }
          75% { transform: translate(15%, 5%) scale(1.05); }
        }
        @keyframes meshMove2 { 
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          25% { transform: translate(-15%, 10%) scale(1.15); }
          50% { transform: translate(10%, -5%) scale(0.9); }
          75% { transform: translate(-10%, -10%) scale(1.1); }
        }
        @keyframes meshMove3 { 
          0%, 100% { transform: translate(0%, 0%) scale(1.05); }
          33% { transform: translate(8%, 12%) scale(0.95); }
          66% { transform: translate(-12%, -8%) scale(1.1); }
        }
      `}</style>
            {/* Blob 1 — Primary */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '15%',
                width: '55vw',
                height: '55vw',
                maxWidth: '700px',
                maxHeight: '700px',
                background: `radial-gradient(circle at 40% 40%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity}), transparent 70%)`,
                borderRadius: '50%',
                filter: 'blur(80px)',
                animation: 'meshMove1 20s ease-in-out infinite',
            }} />
            {/* Blob 2 — Shifted hue */}
            <div style={{
                position: 'absolute',
                top: '30%',
                right: '10%',
                width: '45vw',
                height: '45vw',
                maxWidth: '600px',
                maxHeight: '600px',
                background: `radial-gradient(circle at 60% 50%, rgba(${Math.min(255, rgb.r + 40)}, ${Math.max(0, rgb.g - 20)}, ${Math.min(255, rgb.b + 60)}, ${opacity * 0.8}), transparent 70%)`,
                borderRadius: '50%',
                filter: 'blur(90px)',
                animation: 'meshMove2 25s ease-in-out infinite',
            }} />
            {/* Blob 3 — Complementary */}
            <div style={{
                position: 'absolute',
                bottom: '5%',
                left: '30%',
                width: '50vw',
                height: '50vw',
                maxWidth: '650px',
                maxHeight: '650px',
                background: `radial-gradient(circle at 50% 60%, rgba(${Math.max(0, rgb.r - 30)}, ${Math.min(255, rgb.g + 30)}, ${Math.min(255, rgb.b + 40)}, ${opacity * 0.7}), transparent 70%)`,
                borderRadius: '50%',
                filter: 'blur(100px)',
                animation: 'meshMove3 22s ease-in-out infinite',
            }} />
        </div>
    );
}

/* ─────────────────────── AURORA BOREALIS ─────────────────────── */
function AuroraBorealis({ containerStyle, rgb, isDark }) {
    const opacity = isDark ? 0.3 : 0.15;
    return (
        <div style={containerStyle}>
            <style>{`
        @keyframes auroraShift1 {
          0%, 100% { transform: translateX(-10%) skewX(-5deg) scaleY(1); opacity: ${opacity}; }
          30% { transform: translateX(5%) skewX(2deg) scaleY(1.3); opacity: ${opacity * 1.5}; }
          60% { transform: translateX(15%) skewX(-3deg) scaleY(0.8); opacity: ${opacity * 0.8}; }
        }
        @keyframes auroraShift2 {
          0%, 100% { transform: translateX(10%) skewX(3deg) scaleY(1.1); opacity: ${opacity * 0.8}; }
          40% { transform: translateX(-10%) skewX(-5deg) scaleY(1.4); opacity: ${opacity * 1.3}; }
          70% { transform: translateX(5%) skewX(2deg) scaleY(0.9); opacity: ${opacity}; }
        }
        @keyframes auroraShift3 {
          0%, 100% { transform: translateX(0%) skewX(0deg) scaleY(1); opacity: ${opacity * 0.6}; }
          50% { transform: translateX(-15%) skewX(-4deg) scaleY(1.5); opacity: ${opacity * 1.2}; }
        }
      `}</style>
            {/* Aurora Strip 1 */}
            <div style={{
                position: 'absolute',
                top: '15%',
                left: '-10%',
                width: '120%',
                height: '30%',
                background: `linear-gradient(90deg, transparent, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity}), rgba(${Math.min(255, rgb.r + 50)}, ${rgb.g}, ${Math.min(255, rgb.b + 80)}, ${opacity * 0.6}), transparent)`,
                filter: 'blur(60px)',
                animation: 'auroraShift1 12s ease-in-out infinite',
            }} />
            {/* Aurora Strip 2 */}
            <div style={{
                position: 'absolute',
                top: '35%',
                left: '-5%',
                width: '110%',
                height: '25%',
                background: `linear-gradient(90deg, transparent, rgba(${Math.max(0, rgb.r - 30)}, ${Math.min(255, rgb.g + 40)}, ${Math.min(255, rgb.b + 60)}, ${opacity * 0.8}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.5}), transparent)`,
                filter: 'blur(70px)',
                animation: 'auroraShift2 15s ease-in-out infinite',
            }} />
            {/* Aurora Strip 3 — subtle */}
            <div style={{
                position: 'absolute',
                top: '55%',
                left: '0%',
                width: '100%',
                height: '20%',
                background: `linear-gradient(90deg, transparent, rgba(${rgb.r}, ${Math.min(255, rgb.g + 20)}, ${rgb.b}, ${opacity * 0.5}), transparent)`,
                filter: 'blur(80px)',
                animation: 'auroraShift3 18s ease-in-out infinite',
            }} />
        </div>
    );
}

/* ─────────────────────── DOT GRID ─────────────────────── */
function DotGrid({ containerStyle, rgb, isDark }) {
    const dotOpacity = isDark ? 0.15 : 0.1;
    const glowOpacity = isDark ? 0.08 : 0.05;
    return (
        <div style={containerStyle}>
            <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: ${dotOpacity}; }
          50% { opacity: ${dotOpacity * 1.8}; }
        }
      `}</style>
            {/* Dot pattern */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(circle, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${dotOpacity}) 1.5px, transparent 1.5px)`,
                backgroundSize: '40px 40px',
                animation: 'dotPulse 6s ease-in-out infinite',
            }} />
            {/* Central glow */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60vw',
                height: '60vw',
                maxWidth: '800px',
                maxHeight: '800px',
                background: `radial-gradient(circle, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${glowOpacity}) 0%, transparent 60%)`,
                borderRadius: '50%',
                filter: 'blur(40px)',
            }} />
        </div>
    );
}

/* ─────────────────────── FLOWING WAVES ─────────────────────── */
function FlowingWaves({ containerStyle, rgb, isDark, primaryColor }) {
    const opacity = isDark ? 0.15 : 0.08;
    return (
        <div style={containerStyle}>
            <style>{`
        @keyframes waveFloat1 {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-30px) translateY(10px); }
        }
        @keyframes waveFloat2 {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(20px) translateY(-15px); }
        }
      `}</style>
            {/* Wave 1 */}
            <svg style={{
                position: 'absolute',
                bottom: '10%',
                left: '-5%',
                width: '110%',
                height: '50%',
                opacity: opacity,
                animation: 'waveFloat1 10s ease-in-out infinite',
            }} viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path
                    fill={primaryColor}
                    d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
            </svg>
            {/* Wave 2 */}
            <svg style={{
                position: 'absolute',
                bottom: '5%',
                left: '-3%',
                width: '106%',
                height: '40%',
                opacity: opacity * 0.7,
                animation: 'waveFloat2 14s ease-in-out infinite',
            }} viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path
                    fill={primaryColor}
                    d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,234.7C672,245,768,235,864,208C960,181,1056,139,1152,128C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
            </svg>
            {/* Top accent glow */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '50vw',
                height: '30vw',
                maxWidth: '600px',
                maxHeight: '400px',
                background: `radial-gradient(ellipse, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.6}) 0%, transparent 70%)`,
                filter: 'blur(60px)',
            }} />
        </div>
    );
}

/* ─────────────────────── FILM GRAIN ─────────────────────── */
function FilmGrain({ containerStyle, isDark }) {
    const opacity = isDark ? 0.06 : 0.04;
    return (
        <div style={containerStyle}>
            <style>{`
        @keyframes grainShift {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -3%); }
          20% { transform: translate(3%, 1%); }
          30% { transform: translate(-1%, 3%); }
          40% { transform: translate(2%, -2%); }
          50% { transform: translate(-3%, 2%); }
          60% { transform: translate(1%, -1%); }
          70% { transform: translate(-2%, 3%); }
          80% { transform: translate(3%, -3%); }
          90% { transform: translate(-1%, 1%); }
        }
      `}</style>
            <div style={{
                position: 'absolute',
                inset: '-50%',
                width: '200%',
                height: '200%',
                background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                backgroundSize: '128px 128px',
                opacity: opacity,
                animation: 'grainShift 0.5s steps(4) infinite',
                mixBlendMode: isDark ? 'screen' : 'multiply',
            }} />
        </div>
    );
}

/* ─────────────────────── FLOATING ORBS ─────────────────────── */
function FloatingOrbs({ containerStyle, rgb, isDark }) {
    const opacity = isDark ? 0.12 : 0.08;
    return (
        <div style={containerStyle}>
            <style>{`
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(60px, -40px) rotate(90deg); }
          50% { transform: translate(-30px, 50px) rotate(180deg); }
          75% { transform: translate(40px, 20px) rotate(270deg); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-50px, -30px) rotate(120deg); }
          66% { transform: translate(30px, 60px) rotate(240deg); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-40px, -50px); }
        }
        @keyframes orbFloat4 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(30px, 40px); }
          75% { transform: translate(-20px, -30px); }
        }
      `}</style>
            {/* Orb 1 — Large primary */}
            <div style={{
                position: 'absolute',
                top: '15%',
                left: '20%',
                width: '200px',
                height: '200px',
                background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`,
                borderRadius: '50%',
                filter: 'blur(50px)',
                animation: 'orbFloat1 18s ease-in-out infinite',
            }} />
            {/* Orb 2 — Medium shifted */}
            <div style={{
                position: 'absolute',
                top: '50%',
                right: '15%',
                width: '160px',
                height: '160px',
                background: `rgba(${Math.min(255, rgb.r + 40)}, ${rgb.g}, ${Math.min(255, rgb.b + 50)}, ${opacity * 0.9})`,
                borderRadius: '50%',
                filter: 'blur(45px)',
                animation: 'orbFloat2 22s ease-in-out infinite',
            }} />
            {/* Orb 3 — Small accent */}
            <div style={{
                position: 'absolute',
                bottom: '20%',
                left: '40%',
                width: '120px',
                height: '120px',
                background: `rgba(${Math.max(0, rgb.r - 20)}, ${Math.min(255, rgb.g + 30)}, ${Math.min(255, rgb.b + 30)}, ${opacity * 0.7})`,
                borderRadius: '50%',
                filter: 'blur(40px)',
                animation: 'orbFloat3 15s ease-in-out infinite',
            }} />
            {/* Orb 4 — Tiny sparkle */}
            <div style={{
                position: 'absolute',
                top: '35%',
                left: '60%',
                width: '80px',
                height: '80px',
                background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 1.2})`,
                borderRadius: '50%',
                filter: 'blur(30px)',
                animation: 'orbFloat4 12s ease-in-out infinite',
            }} />
        </div>
    );
}
