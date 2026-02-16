import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { generateThemeCSS, getGoogleFontsUrl, defaultTheme } from '@/lib/utils/theme';
import { getProfileByUsername } from '@/lib/data/profile';

// Components
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Artwork from '@/components/Artwork';
import Logos from '@/components/Logos';
import Contact from '@/components/Contact';

/**
 * Custom Domain Handler
 * Handles requests like: customdomain.com → lookup user → render portfolio
 */

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const domain = slug?.[0];

    if (!domain) {
        return { title: 'Portfolio Not Found' };
    }

    const supabase = await createClient();

    // Look up the custom domain in profiles
    const { data: profile } = await supabase
        .from('profiles')
        .select('name, tagline, custom_domain')
        .eq('custom_domain', domain)
        .eq('custom_domain_verified', true)
        .single();

    if (!profile) {
        return { title: 'Portfolio Not Found' };
    }

    return {
        title: `${profile.name || domain} - Portfolio`,
        description: profile.tagline || `${profile.name}'s professional portfolio`,
    };
}

// Default background settings
const defaultBackgroundSettings = {
    backgroundType: 'gradient',
    heroImage: '',
    backgroundColor: '#1a1a1a',
    gradientColor1: '#1a1a1a',
    gradientColor2: '#0a0a0a',
    gradientDirection: 'to bottom right',
    overlayOpacity: 0.7,
};

// Default section visibility
const defaultSectionVisibility = {
    about: true,
    portfolio: true,
    artwork: true,
    logos: true,
    contact: true,
};

export default async function CustomDomainPage({ params }) {
    const { slug } = await params;
    const domain = slug?.[0];

    if (!domain) {
        notFound();
    }

    const supabase = await createClient();

    // Look up the custom domain
    const { data: profileData } = await supabase
        .from('profiles')
        .select('username, custom_domain, custom_domain_verified')
        .eq('custom_domain', domain)
        .eq('custom_domain_verified', true)
        .single();

    if (!profileData) {
        notFound();
    }

    // Use the existing profile fetch by username
    const data = await getProfileByUsername(supabase, profileData.username);

    if (!data) {
        notFound();
    }

    const { profile, experiences, skills, education, interests, socialLinks, projects, artwork, logos } = data;
    const theme = { ...defaultTheme, ...defaultBackgroundSettings, ...profile.theme };

    // Get section visibility from theme
    const sectionVisibility = { ...defaultSectionVisibility, ...theme.sectionVisibility };

    // Get custom section labels
    const defaultLabels = {
        about: 'About',
        portfolio: 'Portfolio',
        artwork: 'Artwork',
        logos: 'Logos',
        contact: 'Contact',
    };
    const sectionLabels = { ...defaultLabels, ...theme.sectionLabels };

    // Format data
    const personal = {
        name: profile.name || 'Your Name',
        title: profile.title || 'Your Title',
        tagline: profile.tagline || 'Your tagline here',
    };

    // Group skills by category
    const softwareSkills = skills.filter(s => s.category === 'software');
    const technicalSkills = skills.filter(s => s.category === 'technical');
    const workshopSkills = skills.filter(s => s.category === 'workshop');

    // Format education
    const primaryEducation = education.find(e => e.is_primary) || education[0];
    const otherEducation = education.filter(e => !e.is_primary || e.id !== primaryEducation?.id);

    // Format projects
    const formattedProjects = projects.map(project => ({
        title: project.title,
        slug: project.slug || project.title.toLowerCase().replace(/\s+/g, '-'),
        images: project.project_images?.map(img => img.image_url) || [],
    }));

    // Check visibility
    const showPortfolio = sectionVisibility.portfolio && formattedProjects.length > 0;
    const showArtwork = sectionVisibility.artwork && artwork.length > 0;
    const showLogos = sectionVisibility.logos && logos.length > 0;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(theme) }} />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href={getGoogleFontsUrl(theme)} rel="stylesheet" />

            <Navbar
                name={personal.name}
                sectionVisibility={sectionVisibility}
                sectionLabels={sectionLabels}
            />

            <Hero
                personal={personal}
                backgroundType={theme.backgroundType}
                heroImage={theme.heroImage}
                backgroundColor={theme.backgroundColor}
                gradientColor1={theme.gradientColor1}
                gradientColor2={theme.gradientColor2}
                gradientDirection={theme.gradientDirection}
                overlayOpacity={theme.overlayOpacity}
            />

            {sectionVisibility.about && (
                <About
                    profile={{
                        bio: profile.bio,
                        languages: profile.languages,
                        cvUrl: profile.cv_url,
                    }}
                    experience={experiences}
                    skills={{
                        software: softwareSkills,
                        technical: technicalSkills,
                        workshops: workshopSkills,
                    }}
                    education={{
                        primary: primaryEducation,
                        other: otherEducation,
                    }}
                    interests={interests.map(i => i.name)}
                    sectionTitle={sectionLabels.about}
                />
            )}

            {showPortfolio && (
                <Portfolio projects={formattedProjects} sectionTitle={sectionLabels.portfolio} />
            )}

            {showArtwork && (
                <Artwork artworkImages={artwork.map(a => a.image_url)} sectionTitle={sectionLabels.artwork} />
            )}

            {showLogos && (
                <Logos logoImages={logos.map(l => l.image_url)} sectionTitle={sectionLabels.logos} />
            )}

            {sectionVisibility.contact && (
                <Contact
                    name={profile.name}
                    contactEmail={profile.contact_email}
                    socialLinks={socialLinks}
                    sectionTitle={sectionLabels.contact}
                />
            )}
        </>
    );
}
