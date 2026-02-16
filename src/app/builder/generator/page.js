
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Smartphone, Monitor, Code, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import styles from "./generator.module.css"; // Import CSS Module

export default function AIUIBuilder() {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [artifacts, setArtifacts] = useState([]);
    const [currentArtifactId, setCurrentArtifactId] = useState(null);
    const [viewMode, setViewMode] = useState("desktop");
    const [showCode, setShowCode] = useState(false);

    const chatEndRef = useRef(null);

    const currentArtifact = artifacts.find(a => a.id === currentArtifactId);

    // Scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [artifacts, loading]);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || loading) return;

        const userPrompt = prompt;
        setPrompt("");
        setLoading(true);

        try {
            const response = await fetch("/api/ai/generate-ui", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userPrompt }),
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            // Create new artifact
            const newArtifact = {
                id: Date.now().toString(),
                type: data.type || "html",
                title: userPrompt.slice(0, 40) + (userPrompt.length > 40 ? "..." : ""),
                content: data.type === 'html' ? data.config.html : JSON.stringify(data.config, null, 2),
                config: data.config, // Store full config for custom blocks
                previewHtml: data.previewHtml || null // Future proofing
            };

            setArtifacts(prev => [...prev, newArtifact]);
            setCurrentArtifactId(newArtifact.id);

        } catch (error) {
            console.error("Generation failed:", error);
            alert("Failed to generate UI. Please check API key/console.");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!currentArtifact) return;

        // Send to parent window (The Builder)
        window.parent.postMessage({
            type: 'FLASH_UI_EXPORT',
            payload: {
                type: currentArtifact.type,
                config: currentArtifact.config
            }
        }, '*');
    };

    return (
        <div className={styles.container}>

            {/* LEFT PANEL: Chat & History */}
            <div className={styles.sidebar}>
                <div className={styles.header}>
                    <div className={styles.iconBox}>
                        <Sparkles size={18} />
                    </div>
                    <h1 className={styles.title}>AI Section Generator</h1>
                </div>

                {/* Artifacts List (History) */}
                <div className={styles.historyList}>
                    {artifacts.length === 0 && !loading && (
                        <div className={styles.emptyState}>
                            <p>Enter a prompt to generate a UI section.</p>
                            <small>e.g. "Dark pricing table with neon accents"</small>
                        </div>
                    )}

                    {artifacts.map(art => (
                        <div
                            key={art.id}
                            onClick={() => setCurrentArtifactId(art.id)}
                            className={`${styles.artifactItem} ${currentArtifactId === art.id ? styles.active : ''}`}
                        >
                            <div className={styles.artifactHeader}>
                                <span className={styles.artifactTitle}>{art.title}</span>
                                <span className={styles.artifactBadge}>HTML</span>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className={styles.artifactItem} style={{ opacity: 0.7 }}>
                            <div className={styles.artifactHeader}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span className={styles.artifactTitle}>Generating...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef}></div>
                </div>

                {/* Input Area */}
                <div className={styles.inputArea}>
                    <form onSubmit={handleGenerate} className={styles.inputForm}>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleGenerate(e);
                                }
                            }}
                            placeholder="Describe the UI section you want..."
                            className={styles.textarea}
                        />
                        <button
                            type="submit"
                            disabled={!prompt.trim() || loading}
                            className={styles.sendBtn}
                            title="Generate"
                        >
                            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
                        </button>
                    </form>
                </div>
            </div>

            {/* RIGHT PANEL: Preview */}
            <div className={styles.mainContent}>
                {/* Toolbar */}
                <div className={styles.toolbar}>
                    <div className={styles.viewControls}>
                        <button
                            onClick={() => setViewMode('desktop')}
                            className={`${styles.viewBtn} ${viewMode === 'desktop' ? styles.active : ''}`}
                            title="Desktop View"
                        >
                            <Monitor size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('mobile')}
                            className={`${styles.viewBtn} ${viewMode === 'mobile' ? styles.active : ''}`}
                            title="Mobile View"
                        >
                            <Smartphone size={16} />
                        </button>
                    </div>

                    <div className={styles.actions}>
                        <button
                            onClick={() => setShowCode(!showCode)}
                            className={`${styles.codeToggle} ${showCode ? styles.active : ''}`}
                        >
                            <Code size={14} />
                            {showCode ? 'Hide Code' : 'View Code'}
                        </button>

                        <button
                            onClick={handleExport}
                            disabled={!currentArtifact}
                            className={styles.exportBtn}
                        >
                            Export to Builder
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>

                {/* Canvas */}
                <div className={styles.canvasArea}>
                    {currentArtifact ? (
                        showCode ? (
                            <div className={styles.codeView}>
                                <div className={styles.codeHeader}>
                                    <span>HTML Source</span>
                                    <span style={{ color: '#22c55e' }}>Tailwind CSS via CDN</span>
                                </div>
                                <pre className={styles.codePre}>
                                    {currentArtifact.content}
                                </pre>
                            </div>
                        ) : (
                            <div
                                className={styles.previewFrame}
                                style={{
                                    width: viewMode === 'mobile' ? '375px' : '100%',
                                    height: viewMode === 'mobile' ? '667px' : '100%',
                                    maxWidth: viewMode === 'desktop' ? '1200px' : undefined
                                }}
                            >
                                {/* Browser Top Bar Decoration */}
                                <div className={styles.previewTopBar}>
                                    <div className={styles.previewDots}>
                                        <div className={styles.dot} style={{ background: '#ff5f56' }} />
                                        <div className={styles.dot} style={{ background: '#ffbd2e' }} />
                                        <div className={styles.dot} style={{ background: '#27c93f' }} />
                                    </div>
                                </div>

                                <iframe
                                    srcDoc={currentArtifact.type === 'html' ? `
                                    <!DOCTYPE html>
                                    <html>
                                    <head>
                                        <meta charset="UTF-8">
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                        <script src="https://cdn.tailwindcss.com"></script>
                                        <style>
                                            body { background-color: transparent; color: white; margin: 0; }
                                            ::-webkit-scrollbar { width: 0px; background: transparent; }
                                        </style>
                                    </head>
                                    <body>
                                        ${currentArtifact.content}
                                    </body>
                                    </html>
                                ` : `
                                    <!DOCTYPE html>
                                    <html>
                                    <head>
                                        <meta charset="UTF-8">
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                        <style>
                                            body { background-color: #0f0f0f; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                                            .card { background: #1a1a1a; padding: 2rem; border-radius: 12px; border: 1px solid #333; text-align: center; max-width: 400px; }
                                            h2 { margin: 0 0 0.5rem 0; color: #fff; }
                                            p { color: #888; font-size: 0.9rem; }
                                            .badge { background: #6366f1; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 1rem; display: inline-block; }
                                            pre { background: #111; padding: 1rem; text-align: left; border-radius: 8px; overflow: auto; max-height: 200px; font-size: 12px; margin-top: 1rem; }
                                        </style>
                                    </head>
                                    <body>
                                        <div class="card">
                                            <span class="badge">${currentArtifact.type} Block</span>
                                            <h2>Ready to Import</h2>
                                            <p>This "Smart Block" is fully editable in the builder.</p>
                                            <p>Click <b>Export to Builder</b> to add it to your canvas.</p>
                                        </div>
                                    </body>
                                    </html>
                                `}
                                    className={styles.previewIframe}
                                    title="Preview"
                                    sandbox="allow-scripts"
                                />
                            </div>
                        )
                    ) : (
                        <div className={styles.emptyState} style={{ marginTop: 0 }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.05)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto'
                            }}>
                                <Sparkles size={32} style={{ opacity: 0.2 }} />
                            </div>
                            <p>Generated content will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
