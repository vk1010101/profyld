import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProfileByUsername } from '@/lib/data/profile';
import { generateThemeCSS, getGoogleFontsUrl, defaultTheme } from '@/lib/utils/theme';

// Components
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Artwork from '@/components/Artwork';
import Logos from '@/components/Logos';
import Contact from '@/components/Contact';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import PublicPageViewer from '@/components/builder/PublicPageViewer';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export async function generateMetadata({ params }) {
  const { username } = await params;
  const supabase = await createClient();
  const data = await getProfileByUsername(supabase, username);

  if (!data) {
    return { title: 'Portfolio Not Found' };
  }

  return {
    title: `${data.profile.name || username} - Portfolio`,
    description: data.profile.tagline || `${data.profile.name}'s professional portfolio`,
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

export default async function PublicPortfolioPage({ params }) {
  const { username } = await params;
  const supabase = await createClient();
  const data = await getProfileByUsername(supabase, username);

  if (!data) {
    notFound();
  }

  const { profile, experiences, skills, education, interests, socialLinks, projects, artwork, logos } = data;
  const theme = { ...defaultTheme, ...defaultBackgroundSettings, ...profile.theme };

  // Get section visibility from theme (merge with defaults)
  const sectionVisibility = { ...defaultSectionVisibility, ...theme.sectionVisibility };

  // Get custom section labels from theme (merge with defaults)
  const defaultLabels = {
    about: 'About',
    portfolio: 'Portfolio',
    artwork: 'Artwork',
    logos: 'Logos',
    contact: 'Contact',
  };
  const sectionLabels = { ...defaultLabels, ...theme.sectionLabels };

  // Fetch blocks if builder is enabled
  let blocks = [];
  if (profile.has_blocks) {
    const { data: blocksData } = await supabase
      .from('portfolio_blocks')
      .select('*')
      .eq('user_id', profile.user_id)
      .eq('is_visible', true)
      .order('display_order');
    blocks = blocksData || [];
  }

  // If using builder, render dynamic page
  if (profile.has_blocks && blocks.length > 0) {
    return (
      <PublicPageViewer
        blocks={blocks}
        profile={profile}
        experiences={experiences}
        skills={skills}
        education={education}
        interests={interests}
        projects={projects}
        artwork={artwork}
        logos={logos}
        socialLinks={socialLinks}
        theme={theme}
      />
    );
  }

  // Format data for components
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

  // Format projects for Portfolio component
  const formattedProjects = projects.map(project => ({
    title: project.title,
    slug: project.slug || project.title.toLowerCase().replace(/\s+/g, '-'),
    images: project.project_images?.map(img => img.image_url) || [],
  }));

  // Check if Portfolio and Artwork should be shown (visibility + has content)
  const showPortfolio = sectionVisibility.portfolio && formattedProjects.length > 0;
  const showArtwork = sectionVisibility.artwork && artwork.length > 0;
  const showLogos = sectionVisibility.logos && logos.length > 0;

  return (
    <>
      <PageViewTracker userId={profile.user_id} />
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
        primaryColor={theme.primary}
      />

      {sectionVisibility.about && (
        <About
          profile={{
            bio: profile.bio,
            languages: profile.languages,
            cvUrl: profile.cv_url,
            profileImage: profile.profile_image_url,
            name: profile.name,
            title: profile.title,
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
          portfolioUserId={profile.user_id}
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

