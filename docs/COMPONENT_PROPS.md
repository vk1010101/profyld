# Portfolio Website - Component Props Reference

This document outlines the expected props for all portfolio display components. Use this as a reference when passing data from pages to components.

---

## Components Overview

| Component | File | Purpose |
|-----------|------|---------|
| `Navbar` | `src/components/Navbar.js` | Top navigation bar |
| `Hero` | `src/components/Hero.js` | Hero section with name/title/tagline |
| `About` | `src/components/About.js` | Tabbed about section (profile, experience, skills, education, interests) |
| `Contact` | `src/components/Contact.js` | Contact section with social links |
| `Portfolio` | `src/components/Portfolio.js` | Projects gallery |
| `Artwork` | `src/components/Artwork.js` | Artwork gallery |
| `Logos` | `src/components/Logos.js` | Logos gallery |

---

## Navbar

**File:** `src/components/Navbar.js`

```jsx
<Navbar 
  name="John Doe"           // string - Display name in nav (default: "Portfolio")
  showArtwork={true}        // boolean - Show artwork nav link (default: true)
  showLogos={true}          // boolean - Show logos nav link (default: true)
/>
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `name` | `string` | No | `"Portfolio"` | Name displayed in the navbar logo area |
| `showArtwork` | `boolean` | No | `true` | Whether to show "Artwork" in navigation |
| `showLogos` | `boolean` | No | `true` | Whether to show "Logos" in navigation |

---

## Hero

**File:** `src/components/Hero.js`

```jsx
<Hero 
  personal={{
    name: "John Doe",                    // string
    title: "Software Engineer",          // string
    tagline: "Building great products"   // string
  }}
/>
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `personal` | `object` | No | `{}` | Container object for hero data |
| `personal.name` | `string` | No | `"Your Name"` | Main display name |
| `personal.title` | `string` | No | `"Your Title"` | Professional title |
| `personal.tagline` | `string` | No | `"Your professional tagline"` | Short tagline/motto |

---

## About

**File:** `src/components/About.js`

```jsx
<About 
  profile={{
    name: "John Doe",
    title: "Software Engineer",
    bio: "A passionate developer...",
    languages: ["English (Fluent)", "Spanish (Basic)"],
    profileImage: "/path/to/image.jpg",
    cvUrl: "/path/to/cv.pdf"
  }}
  experience={[
    {
      id: "1",
      title: "Senior Developer",
      location: "Company, City",
      dateRange: "Jan 2020 - Present",
      description: "Led development of...",
      bulletPoints: ["Achievement 1", "Achievement 2"]  // optional
    }
  ]}
  skills={{
    software: [
      { name: "React", level: 90 },
      { name: "Node.js", level: 85 }
    ],
    technical: ["Pattern Making", "3D Modeling"],  // array of strings
    workshops: [
      { name: "Workshop Name", description: "Description" }
    ]
  }}
  education={{
    primary: {
      id: "1",
      degree: "Bachelor of Science",
      institution: "University Name",
      yearRange: "2016 - 2020",
      specialization: "Computer Science"
    },
    other: [
      {
        id: "2",
        degree: "High School",
        institution: "School Name",
        yearRange: "2014 - 2016"
      }
    ]
  }}
  interests={["Coding", "Design", "Music"]}  // array of strings
/>
```

### Props Detail

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `profile` | `object` | No | Empty defaults | User profile info |
| `profile.name` | `string` | No | `"Your Name"` | Full name |
| `profile.title` | `string` | No | `"Your Title"` | Job title |
| `profile.bio` | `string` | No | `"Add your bio..."` | Biography text |
| `profile.languages` | `string[]` | No | `[]` | List of languages with proficiency |
| `profile.profileImage` | `string` | No | placeholder path | URL to profile image |
| `profile.cvUrl` | `string` | No | `""` | URL to downloadable CV |
| `experience` | `array` | No | `[]` | Array of experience objects |
| `skills` | `object` | No | Empty skills | Skills by category |
| `skills.software` | `array` | No | `[]` | Software skills with levels (0-100) |
| `skills.technical` | `string[]` | No | `[]` | Technical skills as strings |
| `skills.workshops` | `array` | No | `[]` | Workshop objects with name/description |
| `education` | `object` | No | Empty | Education data |
| `education.primary` | `object` | No | `null` | Primary/main education |
| `education.other` | `array` | No | `[]` | Other education entries |
| `interests` | `string[]` | No | `[]` | Array of interest/hobby names |

### Experience Object Schema

```typescript
{
  id: string;
  title: string;
  location?: string;
  dateRange: string;
  description?: string;
  bulletPoints?: string[];
}
```

### Education Object Schema

```typescript
{
  id: string;
  degree: string;
  institution: string;
  yearRange: string;
  specialization?: string;
}
```

---

## Contact

**File:** `src/components/Contact.js`

```jsx
<Contact 
  name="John Doe"
  contactEmail="john@example.com"
  linkedinUrl="https://linkedin.com/in/johndoe"
  socialLinks={[
    { platform: "instagram", url: "https://instagram.com/johndoe" },
    { platform: "linkedin", url: "https://linkedin.com/in/johndoe" },
    { platform: "github", url: "https://github.com/johndoe" },
    { platform: "twitter", url: "https://twitter.com/johndoe" }
  ]}
/>
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `name` | `string` | No | `"User"` | Name for footer copyright |
| `contactEmail` | `string` | No | `""` | Email for mailto links |
| `linkedinUrl` | `string` | No | `""` | LinkedIn URL for collaboration button |
| `socialLinks` | `array` | No | `[]` | Array of social link objects |

### Social Link Object Schema

```typescript
{
  platform: "instagram" | "linkedin" | "twitter" | "github" | "youtube" | "website";
  url: string;
}
```

### Supported Platforms (with icons)

- `instagram` → Instagram icon
- `linkedin` → LinkedIn icon
- `twitter` → Twitter/X icon
- `github` → GitHub icon
- `youtube` → YouTube icon
- `website` → Globe icon
- Any other value → Globe icon (fallback)

---

## Portfolio

**File:** `src/components/Portfolio.js`

```jsx
<Portfolio 
  projects={[
    {
      title: "Project Name",
      slug: "project-name",
      images: ["/path/to/image1.jpg", "/path/to/image2.jpg"]
    }
  ]}
/>
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `projects` | `array` | No | `[]` | Array of project objects |

### Project Object Schema

```typescript
{
  title: string;
  slug: string;
  images: string[];
}
```

---

## Artwork

**File:** `src/components/Artwork.js`

```jsx
<Artwork 
  artworkImages={[
    "/path/to/artwork1.jpg",
    "/path/to/artwork2.jpg"
  ]}
/>
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `artworkImages` | `string[]` | No | `[]` | Array of artwork image URLs |

---

## Logos

**File:** `src/components/Logos.js`

```jsx
<Logos 
  logoImages={[
    "/path/to/logo1.png",
    "/path/to/logo2.png"
  ]}
/>
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `logoImages` | `string[]` | No | `[]` | Array of logo image URLs |

---

## Database Field to Prop Mapping

When fetching from Supabase, here's how database fields map to component props:

### profiles table → Components

| Database Field | Navbar | Hero | About | Contact |
|----------------|--------|------|-------|---------|
| `name` | `name` | `personal.name` | `profile.name` | `name` |
| `title` | - | `personal.title` | `profile.title` | - |
| `tagline` | - | `personal.tagline` | - | - |
| `bio` | - | - | `profile.bio` | - |
| `languages` | - | - | `profile.languages` | - |
| `profile_image` | - | - | `profile.profileImage` | - |
| `cv_url` | - | - | `profile.cvUrl` | - |
| `contact_email` | - | - | - | `contactEmail` |

### Related Tables

| Table | Component | Prop Name |
|-------|-----------|-----------|
| `experiences` | About | `experience` (array) |
| `skills` | About | `skills` (grouped by category) |
| `education` | About | `education` (object with primary/other) |
| `interests` | About | `interests` (array of names) |
| `social_links` | Contact | `socialLinks` (array) |
| `projects` | Portfolio | `projects` (formatted array) |
| `artwork` | Artwork | `artworkImages` (array of URLs) |
| `logos` | Logos | `logoImages` (array of URLs) |

---

## Example: Complete Page Usage

```jsx
// src/app/u/[username]/page.js

export default async function PublicPortfolioPage({ params }) {
  const { username } = await params;
  const supabase = await createClient();
  const data = await getProfileByUsername(supabase, username);

  if (!data) notFound();

  const { profile, experiences, skills, education, interests, socialLinks, projects, artwork, logos } = data;

  // Format data for components
  const personal = {
    name: profile.name || 'Your Name',
    title: profile.title || 'Your Title',
    tagline: profile.tagline || 'Your tagline here',
  };

  const softwareSkills = skills.filter(s => s.category === 'software');
  const technicalSkills = skills.filter(s => s.category === 'technical');
  const workshopSkills = skills.filter(s => s.category === 'workshop');

  const primaryEducation = education.find(e => e.is_primary) || education[0];
  const otherEducation = education.filter(e => !e.is_primary);

  const formattedProjects = projects.map(p => ({
    title: p.title,
    slug: p.slug || p.title.toLowerCase().replace(/\s+/g, '-'),
    images: p.project_images?.map(img => img.image_url) || [],
  }));

  return (
    <>
      <Navbar name={personal.name} />
      
      <Hero personal={personal} />
      
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
      />
      
      {formattedProjects.length > 0 && (
        <Portfolio projects={formattedProjects} />
      )}
      
      {artwork.length > 0 && (
        <Artwork artworkImages={artwork.map(a => a.image_url)} />
      )}
      
      {logos.length > 0 && (
        <Logos logoImages={logos.map(l => l.image_url)} />
      )}
      
      <Contact
        name={profile.name}
        contactEmail={profile.contact_email}
        socialLinks={socialLinks}
      />
    </>
  );
}
```

---

## TypeScript Support (Future)

For better type safety, consider adding TypeScript interfaces:

```typescript
// types/portfolio.ts

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

export interface Experience {
  id: string;
  title: string;
  location?: string;
  dateRange: string;
  description?: string;
  bulletPoints?: string[];
}

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
  technical?: string[];
  workshops?: Workshop[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  yearRange: string;
  specialization?: string;
  isPrimary?: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Project {
  title: string;
  slug: string;
  images: string[];
}
```

---

## Changelog

| Date | Change |
|------|--------|
| 2026-02-03 | Removed hardcoded default data, standardized prop interfaces |
| 2026-02-03 | Created this documentation |

---

*Last updated: 2026-02-03*
