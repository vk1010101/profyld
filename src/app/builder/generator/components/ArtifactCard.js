/* src/app/builder/generator/components/ArtifactCard.js */
import React from 'react';

const ArtifactCard = ({ artifact, isFocused, onClick }) => {
    // Determine card state classes
    const classes = [
        'artifact-card',
        isFocused ? 'focused' : '',
        artifact.status === 'streaming' ? 'generating' : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} onClick={onClick}>
            <div className="artifact-header">
                <span className="artifact-style-tag">{artifact.styleName}</span>
            </div>
            <div className="artifact-card-inner">
                {artifact.html ? (
                    <iframe
                        className="artifact-iframe"
                        srcDoc={`
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <style>
                                    body { margin: 0; padding: 0; color: #fff; font-family: sans-serif; overflow: hidden; }
                                    ::-webkit-scrollbar { width: 0; }
                                </style>
                            </head>
                            <body>
                                ${artifact.html}
                            </body>
                            </html>
                        `}
                        title={artifact.id}
                        sandbox="allow-scripts allow-same-origin"
                    />
                ) : (
                    <div className="generating-overlay">
                        {artifact.status === 'streaming' && (
                            <div className="code-stream-preview">Generating UI...</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtifactCard;
