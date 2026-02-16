// ============================================
// Portfolio Website - Type Definitions
// ============================================
// This file contains all shared TypeScript interfaces
// for component props and data structures.
// ============================================

// ============================================
// PROFILE & USER TYPES
// ============================================

export interface PersonalInfo {
    name: string;
    title: string;
    tagline: string;
}

export interface ProfileInfo {
    name?: string;
    title?: string;
    bio?: string;
    languages?: string[];
    profileImage?: string;
    cvUrl?: string;
}

// ============================================
// EXPERIENCE TYPES
// ============================================

export interface Experience {
    id: string;
    title: string;
    location?: string;
    dateRange?: string;
    date_range?: string; // Database field name
    description?: string;
    bulletPoints?: string[];
    bullet_points?: string[]; // Database field name
}

// ============================================
// SKILLS TYPES
// ============================================

export interface SoftwareSkill {
    name: string;
    level: number;
}

export interface Workshop {
    name: string;
    description: string;
}

export interface Skills {
    software?: SoftwareSkill[];
    technical?: string[] | SoftwareSkill[];
    workshops?: Workshop[];
}

// ============================================
// EDUCATION TYPES
// ============================================

export interface Education {
    id: string;
    degree: string;
    institution: string;
    yearRange?: string;
    year_range?: string; // Database field name
    specialization?: string;
    isPrimary?: boolean;
    is_primary?: boolean; // Database field name
}

export interface EducationData {
    primary?: Education | null;
    other?: Education[];
}

// ============================================
// SOCIAL & CONTACT TYPES
// ============================================

export type SocialPlatform =
    | 'instagram'
    | 'linkedin'
    | 'twitter'
    | 'github'
    | 'youtube'
    | 'website'
    | 'mail';

export interface SocialLink {
    platform: SocialPlatform | string;
    url: string;
}

// ============================================
// PROJECT TYPES
// ============================================

export interface ProjectImage {
    id: string;
    image_url: string;
}

export interface Project {
    id?: string;
    title: string;
    slug: string;
    description?: string;
    images?: string[];
    project_images?: ProjectImage[];
}

// ============================================
// COMPONENT PROPS
// ============================================

// Navbar Props
export interface NavbarProps {
    name?: string;
    showArtwork?: boolean;
    showLogos?: boolean;
}

// Hero Props
export interface HeroProps {
    personal?: PersonalInfo;
}

// About Props
export interface AboutProps {
    profile?: ProfileInfo;
    experience?: Experience[];
    skills?: Skills;
    education?: EducationData | Education[];
    interests?: string[];
}

// Contact Props
export interface ContactProps {
    name?: string;
    contactEmail?: string;
    linkedinUrl?: string;
    socialLinks?: SocialLink[];
}

// Portfolio Props
export interface PortfolioProps {
    projects?: Project[];
}

// Artwork Props
export interface ArtworkProps {
    artworkImages?: string[];
}

// Logos Props
export interface LogosProps {
    logoImages?: string[];
}

// ============================================
// DATABASE TYPES (from Supabase)
// ============================================

export interface DBProfile {
    id: string;
    user_id: string;
    username: string;
    name: string | null;
    title: string | null;
    tagline: string | null;
    bio: string | null;
    languages: string[] | null;
    profile_image: string | null;
    cv_url: string | null;
    contact_email: string | null;
    theme: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
}

export interface DBExperience {
    id: string;
    user_id: string;
    title: string;
    location: string | null;
    date_range: string | null;
    description: string | null;
    bullet_points: string[] | null;
    display_order: number;
}

export interface DBSkill {
    id: string;
    user_id: string;
    name: string;
    category: 'software' | 'technical' | 'workshop';
    level: number | null;
    description: string | null;
    display_order: number;
}

export interface DBEducation {
    id: string;
    user_id: string;
    degree: string;
    institution: string;
    year_range: string | null;
    specialization: string | null;
    is_primary: boolean;
    display_order: number;
}

export interface DBSocialLink {
    id: string;
    user_id: string;
    platform: string;
    url: string;
    display_order: number;
}

export interface DBProject {
    id: string;
    user_id: string;
    title: string;
    slug: string;
    description: string | null;
    display_order: number;
    project_images?: DBProjectImage[];
}

export interface DBProjectImage {
    id: string;
    project_id: string;
    image_url: string;
    display_order: number;
}

export interface DBArtwork {
    id: string;
    user_id: string;
    image_url: string;
    title: string | null;
    display_order: number;
}

export interface DBLogo {
    id: string;
    user_id: string;
    image_url: string;
    title: string | null;
    display_order: number;
}

export interface DBInterest {
    id: string;
    user_id: string;
    name: string;
    display_order: number;
}

// ============================================
// FULL PROFILE DATA (from getProfileByUsername)
// ============================================

export interface FullProfileData {
    profile: DBProfile;
    experiences: DBExperience[];
    skills: DBSkill[];
    education: DBEducation[];
    interests: DBInterest[];
    socialLinks: DBSocialLink[];
    projects: DBProject[];
    artwork: DBArtwork[];
    logos: DBLogo[];
}
