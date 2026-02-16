import React, { useState } from 'react';
import { Search, Plus, Sparkles } from 'lucide-react';
import { BlockRegistry } from './registry';
import { useBuilderStore } from './useBuilderStore';
import styles from './builder.module.css';

const BlockLibrary = () => {
    const { addBlock, setAIGeneratorOpen } = useBuilderStore();
    const [searchTerm, setSearchTerm] = useState('');

    // Group blocks by category
    const categories = Object.values(BlockRegistry).reduce((acc, block) => {
        const cat = block.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(block);
        return acc;
    }, {});

    const handleAdd = (block) => {
        addBlock(block.id, null, block.defaultConfig);
    };

    // Filter logic
    const filteredCategories = Object.entries(categories).reduce((acc, [cat, blocks]) => {
        const filtered = blocks.filter(b =>
            b.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) acc[cat] = filtered;
        return acc;
    }, {});

    return (
        <div className={styles.librarySidebar}>
            <div className={styles.libraryHeader}>
                <h3>Blocks</h3>

                {/* AI Generator Button */}
                {/* AI Generator - Temporarily Hidden for V1 Deployment
                <button
                    onClick={() => setAIGeneratorOpen(true)}
                    className={styles.aiGenBtn}
                >
                    <Sparkles size={14} />
                    <span>AI Generate</span>
                </button>
                */}

                <div className={styles.searchBox}>
                    <Search size={14} />
                    <input
                        type="text"
                        placeholder="Search blocks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.libraryContent}>
                {Object.entries(filteredCategories).map(([category, blocks]) => (
                    <div key={category} className={styles.categorySection}>
                        <h4 className={styles.categoryTitle}>{category}</h4>
                        <div className={styles.blocksGrid}>
                            {blocks.map(block => {
                                const Icon = block.icon;
                                return (
                                    <button
                                        key={block.id}
                                        className={styles.libraryBlockBtn}
                                        onClick={() => handleAdd(block)}
                                    >
                                        <div className={styles.blockIcon}>
                                            <Icon size={20} />
                                        </div>
                                        <span className={styles.blockName}>{block.label}</span>
                                        <div className={styles.addIcon}>
                                            <Plus size={12} />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlockLibrary;
