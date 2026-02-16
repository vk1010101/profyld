/* src/app/builder/generator/components/DottedGlowBackground.js */
import React from 'react';

const DottedGlowBackground = ({ gap = 24, radius = 1.5, color = "rgba(255, 255, 255, 0.02)", glowColor = "rgba(255, 255, 255, 0.15)" }) => {
    // Simple CSS-based background pattern for performance
    const style = {
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(${color} ${radius}px, transparent ${radius}px)`,
        backgroundSize: `${gap}px ${gap}px`,
        pointerEvents: 'none',
        zIndex: -1
    };

    return (
        <div style={style}>
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60vw', height: '60vw',
                background: `radial-gradient(circle, ${glowColor} 0%, transparent 60%)`,
                opacity: 0.4,
                filter: 'blur(100px)',
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default DottedGlowBackground;
