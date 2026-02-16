"use client";

import { createContext, useContext, useState, useCallback } from 'react';

// Initial CV data structure
const initialCVData = {
    // Step 1: Personal Info
    personal: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedinUrl: '',
        portfolioUrl: '',
    },
    // Step 2: Professional Summary
    summary: {
        jobTitle: '',
        yearsExperience: '',
        industry: '',
        summaryText: '',
    },
    // Step 3: Work Experience (array)
    experiences: [],
    // Step 4: Education (array)
    education: [],
    // Step 5: Skills
    skills: {
        technical: [],
        soft: [],
        languages: [],
        tools: [],
    },
    // Step 6: Certifications & Extras
    certifications: [],
    awards: [],
    volunteer: [],
};

// Create context
const CVContext = createContext(null);

// Provider component
export function CVProvider({ children }) {
    const [cvData, setCVData] = useState(initialCVData);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState('modern');

    const totalSteps = 6;

    // Update personal info
    const updatePersonal = useCallback((field, value) => {
        setCVData(prev => ({
            ...prev,
            personal: { ...prev.personal, [field]: value }
        }));
    }, []);

    // Update summary
    const updateSummary = useCallback((field, value) => {
        setCVData(prev => ({
            ...prev,
            summary: { ...prev.summary, [field]: value }
        }));
    }, []);

    // Experience CRUD
    const addExperience = useCallback((experience) => {
        setCVData(prev => ({
            ...prev,
            experiences: [...prev.experiences, { ...experience, id: experience.id || Date.now() }]
        }));
    }, []);

    const updateExperience = useCallback((id, experience) => {
        setCVData(prev => ({
            ...prev,
            experiences: prev.experiences.map(exp =>
                exp.id === id ? { ...exp, ...experience } : exp
            )
        }));
    }, []);

    const removeExperience = useCallback((id) => {
        setCVData(prev => ({
            ...prev,
            experiences: prev.experiences.filter(exp => exp.id !== id)
        }));
    }, []);

    // Education CRUD
    const addEducation = useCallback((edu) => {
        setCVData(prev => ({
            ...prev,
            education: [...prev.education, { ...edu, id: edu.id || Date.now() }]
        }));
    }, []);

    const updateEducation = useCallback((id, edu) => {
        setCVData(prev => ({
            ...prev,
            education: prev.education.map(e =>
                e.id === id ? { ...e, ...edu } : e
            )
        }));
    }, []);

    const removeEducation = useCallback((id) => {
        setCVData(prev => ({
            ...prev,
            education: prev.education.filter(e => e.id !== id)
        }));
    }, []);

    // Skills update
    const updateSkills = useCallback((category, skills) => {
        setCVData(prev => ({
            ...prev,
            skills: { ...prev.skills, [category]: skills }
        }));
    }, []);

    // Certifications CRUD
    const addCertification = useCallback((cert) => {
        setCVData(prev => ({
            ...prev,
            certifications: [...prev.certifications, { ...cert, id: cert.id || Date.now() }]
        }));
    }, []);

    const removeCertification = useCallback((id) => {
        setCVData(prev => ({
            ...prev,
            certifications: prev.certifications.filter(c => c.id !== id)
        }));
    }, []);

    // Awards CRUD
    const addAward = useCallback((award) => {
        setCVData(prev => ({
            ...prev,
            awards: [...prev.awards, { ...award, id: award.id || Date.now() }]
        }));
    }, []);

    const removeAward = useCallback((id) => {
        setCVData(prev => ({
            ...prev,
            awards: prev.awards.filter(a => a.id !== id)
        }));
    }, []);

    // Navigation
    const nextStep = useCallback(() => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps + 1)); // +1 for preview
    }, [totalSteps]);

    const prevStep = useCallback(() => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    }, []);

    const goToStep = useCallback((step) => {
        setCurrentStep(step);
    }, []);

    // Reset
    const resetCV = useCallback(() => {
        setCVData(initialCVData);
        setCurrentStep(1);
    }, []);

    const value = {
        cvData,
        currentStep,
        totalSteps,
        selectedTemplate,
        setSelectedTemplate,
        updatePersonal,
        updateSummary,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        updateSkills,
        addCertification,
        removeCertification,
        addAward,
        removeAward,
        nextStep,
        prevStep,
        goToStep,
        resetCV,
    };

    return (
        <CVContext.Provider value={value}>
            {children}
        </CVContext.Provider>
    );
}

// Custom hook
export function useCV() {
    const context = useContext(CVContext);
    if (!context) {
        throw new Error('useCV must be used within a CVProvider');
    }
    return context;
}

export default CVContext;
