import React from 'react';

export const TextBlock = ({ content, align = 'left', style = 'normal' }) => {
    const styles = {
        textAlign: align,
        padding: '1rem 0',
    };

    const Tag = style === 'lead' ? 'p' : style === 'small' ? 'small' : 'div';
    const className = style === 'lead' ? 'text-xl text-gray-300' : style === 'small' ? 'text-sm text-gray-500' : 'text-base';

    return (
        <div style={styles} className={className}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

export const DividerBlock = ({ style = 'solid', thickness = 1, color = '#333', margin = 24 }) => (
    <hr
        style={{
            borderTop: `${thickness}px ${style} ${color}`,
            margin: `${margin}px 0`,
            borderBottom: 'none',
            borderLeft: 'none',
            borderRight: 'none'
        }}
    />
);

export const SpacerBlock = ({ height = 48 }) => (
    <div style={{ height: `${height}px`, width: '100%' }} />
);

export const HtmlBlock = ({ html }) => (
    <div dangerouslySetInnerHTML={{ __html: html }} />
);
