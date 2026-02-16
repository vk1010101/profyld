import { createContext, useContext } from 'react';

const BuilderContext = createContext({
    personal: {},
    experiences: [],
    skills: {},
    education: [],
    projects: [],
    artwork: [],
    logos: [],
    socialLinks: [],
    theme: {}
});

export const useBuilderContext = () => useContext(BuilderContext);

export const BuilderProvider = ({ children, value }) => {
    return (
        <BuilderContext.Provider value={value}>
            {children}
        </BuilderContext.Provider>
    );
};
