"use client";

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useCV } from '../CVContext';
import styles from '../CVBuilder.module.css';

const SKILL_SUGGESTIONS = {
    technical: [
        'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
        'TypeScript', 'Java', 'C++', 'Git', 'REST APIs', 'GraphQL', 'MongoDB',
        'PostgreSQL', 'Kubernetes', 'CI/CD', 'Linux', 'Machine Learning', 'Data Analysis'
    ],
    soft: [
        'Leadership', 'Communication', 'Problem Solving', 'Team Collaboration',
        'Critical Thinking', 'Adaptability', 'Time Management', 'Creativity',
        'Project Management', 'Conflict Resolution', 'Decision Making', 'Mentoring'
    ],
    tools: [
        'VS Code', 'Figma', 'Jira', 'Slack', 'Microsoft Office', 'Google Workspace',
        'Notion', 'Trello', 'Adobe Creative Suite', 'Salesforce', 'Tableau', 'Excel'
    ]
};

const LANGUAGE_PROFICIENCIES = [
    'Native',
    'Fluent',
    'Professional',
    'Conversational',
    'Basic'
];

export default function Skills() {
    const { cvData, updateSkills } = useCV();
    const { skills } = cvData;

    const [technicalInput, setTechnicalInput] = useState('');
    const [softInput, setSoftInput] = useState('');
    const [toolsInput, setToolsInput] = useState('');
    const [languageInput, setLanguageInput] = useState('');
    const [languageProficiency, setLanguageProficiency] = useState('Fluent');

    const addSkill = (category, value) => {
        if (!value.trim()) return;
        const currentSkills = skills[category] || [];
        if (!currentSkills.includes(value.trim())) {
            updateSkills(category, [...currentSkills, value.trim()]);
        }
    };

    const removeSkill = (category, skillToRemove) => {
        const currentSkills = skills[category] || [];
        updateSkills(category, currentSkills.filter(s => s !== skillToRemove));
    };

    const addLanguage = () => {
        if (!languageInput.trim()) return;
        const langEntry = `${languageInput.trim()} (${languageProficiency})`;
        const currentLanguages = skills.languages || [];
        if (!currentLanguages.includes(langEntry)) {
            updateSkills('languages', [...currentLanguages, langEntry]);
        }
        setLanguageInput('');
    };

    const handleKeyDown = (e, category, value, setter) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill(category, value);
            setter('');
        }
    };

    return (
        <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
                <span className={styles.stepEmoji}>⚡</span>
                <h2 className={styles.stepTitle}>What superpowers do you bring?</h2>
                <p className={styles.stepSubtitle}>
                    Add your skills - these are what recruiters search for!
                </p>
            </div>

            <div className={styles.skillsContainer}>
                {/* Technical Skills */}
                <div className={styles.skillCategory}>
                    <label className={styles.skillCategoryLabel}>Technical Skills</label>

                    <div className={styles.skillTags}>
                        {(skills.technical || []).map((skill, index) => (
                            <span key={index} className={styles.skillTag}>
                                {skill}
                                <button
                                    className={styles.skillTagRemove}
                                    onClick={() => removeSkill('technical', skill)}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>

                    <div className={styles.skillInputWrapper}>
                        <input
                            type="text"
                            className={styles.formInput}
                            placeholder="Add a technical skill..."
                            value={technicalInput}
                            onChange={(e) => setTechnicalInput(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 'technical', technicalInput, setTechnicalInput)}
                        />
                        <button
                            className={styles.addSkillBtn}
                            onClick={() => {
                                addSkill('technical', technicalInput);
                                setTechnicalInput('');
                            }}
                        >
                            Add
                        </button>
                    </div>

                    <div className={styles.actionVerbHint}>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                            Suggestions:
                        </span>
                        {SKILL_SUGGESTIONS.technical.slice(0, 8).map(skill => (
                            <button
                                key={skill}
                                type="button"
                                className={styles.verbChip}
                                onClick={() => addSkill('technical', skill)}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Soft Skills */}
                <div className={styles.skillCategory}>
                    <label className={styles.skillCategoryLabel}>Soft Skills</label>

                    <div className={styles.skillTags}>
                        {(skills.soft || []).map((skill, index) => (
                            <span key={index} className={styles.skillTag}>
                                {skill}
                                <button
                                    className={styles.skillTagRemove}
                                    onClick={() => removeSkill('soft', skill)}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>

                    <div className={styles.skillInputWrapper}>
                        <input
                            type="text"
                            className={styles.formInput}
                            placeholder="Add a soft skill..."
                            value={softInput}
                            onChange={(e) => setSoftInput(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 'soft', softInput, setSoftInput)}
                        />
                        <button
                            className={styles.addSkillBtn}
                            onClick={() => {
                                addSkill('soft', softInput);
                                setSoftInput('');
                            }}
                        >
                            Add
                        </button>
                    </div>

                    <div className={styles.actionVerbHint}>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                            Suggestions:
                        </span>
                        {SKILL_SUGGESTIONS.soft.slice(0, 6).map(skill => (
                            <button
                                key={skill}
                                type="button"
                                className={styles.verbChip}
                                onClick={() => addSkill('soft', skill)}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Languages */}
                <div className={styles.skillCategory}>
                    <label className={styles.skillCategoryLabel}>Languages</label>

                    <div className={styles.skillTags}>
                        {(skills.languages || []).map((lang, index) => (
                            <span key={index} className={styles.skillTag}>
                                {lang}
                                <button
                                    className={styles.skillTagRemove}
                                    onClick={() => removeSkill('languages', lang)}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>

                    <div className={styles.skillInputWrapper}>
                        <input
                            type="text"
                            className={styles.formInput}
                            placeholder="Language (e.g., Spanish)"
                            value={languageInput}
                            onChange={(e) => setLanguageInput(e.target.value)}
                            style={{ flex: 2 }}
                        />
                        <select
                            className={styles.formSelect}
                            value={languageProficiency}
                            onChange={(e) => setLanguageProficiency(e.target.value)}
                            style={{ flex: 1, minWidth: '120px' }}
                        >
                            {LANGUAGE_PROFICIENCIES.map(prof => (
                                <option key={prof} value={prof}>{prof}</option>
                            ))}
                        </select>
                        <button
                            className={styles.addSkillBtn}
                            onClick={addLanguage}
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Tools & Software */}
                <div className={styles.skillCategory}>
                    <label className={styles.skillCategoryLabel}>Tools & Software</label>

                    <div className={styles.skillTags}>
                        {(skills.tools || []).map((tool, index) => (
                            <span key={index} className={styles.skillTag}>
                                {tool}
                                <button
                                    className={styles.skillTagRemove}
                                    onClick={() => removeSkill('tools', tool)}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>

                    <div className={styles.skillInputWrapper}>
                        <input
                            type="text"
                            className={styles.formInput}
                            placeholder="Add a tool or software..."
                            value={toolsInput}
                            onChange={(e) => setToolsInput(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 'tools', toolsInput, setToolsInput)}
                        />
                        <button
                            className={styles.addSkillBtn}
                            onClick={() => {
                                addSkill('tools', toolsInput);
                                setToolsInput('');
                            }}
                        >
                            Add
                        </button>
                    </div>

                    <div className={styles.actionVerbHint}>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                            Suggestions:
                        </span>
                        {SKILL_SUGGESTIONS.tools.slice(0, 6).map(tool => (
                            <button
                                key={tool}
                                type="button"
                                className={styles.verbChip}
                                onClick={() => addSkill('tools', tool)}
                            >
                                {tool}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
