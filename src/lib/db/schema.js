import { pgTable, uuid, varchar, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

// PROFILES TABLE
export const profiles = pgTable('profiles', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().unique(),
    username: varchar('username', { length: 20 }).notNull().unique(),
    name: varchar('name', { length: 100 }).default(''),
    title: varchar('title', { length: 100 }).default(''),
    tagline: varchar('tagline', { length: 200 }).default(''),
    bio: text('bio').default(''),
    contactEmail: varchar('contact_email', { length: 100 }).default(''),
    profileImageUrl: text('profile_image_url').default(''),
    cvUrl: text('cv_url').default(''),
    languages: jsonb('languages').default([]),
    theme: jsonb('theme').default({
        primary: "#8B7355",
        background: "#0A0A0A",
        surface: "#1A1A1A",
        textPrimary: "#FFFFFF",
        textSecondary: "#A0A0A0",
        headingFont: "Cormorant Garamond",
        bodyFont: "Montserrat"
    }),
    customDomain: varchar('custom_domain', { length: 100 }).unique(),
    customDomainVerified: boolean('custom_domain_verified').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// SOCIAL LINKS TABLE
export const socialLinks = pgTable('social_links', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    platform: varchar('platform', { length: 20 }).notNull(),
    url: text('url').notNull(),
    displayOrder: integer('display_order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
});

// EXPERIENCES TABLE
export const experiences = pgTable('experiences', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    dateRange: varchar('date_range', { length: 50 }).default(''),
    title: varchar('title', { length: 100 }).default(''),
    location: varchar('location', { length: 100 }).default(''),
    description: text('description').default(''),
    bulletPoints: jsonb('bullet_points').default([]),
    displayOrder: integer('display_order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
});

// SKILLS TABLE
export const skills = pgTable('skills', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    category: varchar('category', { length: 20 }).notNull(),
    name: varchar('name', { length: 50 }).notNull(),
    level: integer('level').default(0),
    description: text('description').default(''),
    displayOrder: integer('display_order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
});

// EDUCATION TABLE
export const education = pgTable('education', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    yearRange: varchar('year_range', { length: 20 }).default(''),
    degree: varchar('degree', { length: 100 }).default(''),
    institution: varchar('institution', { length: 100 }).default(''),
    specialization: varchar('specialization', { length: 200 }).default(''),
    isPrimary: boolean('is_primary').default(false),
    displayOrder: integer('display_order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
});

// PROJECTS TABLE
export const projects = pgTable('projects', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    title: varchar('title', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).default(''),
    coverImageUrl: text('cover_image_url').default(''),
    displayOrder: integer('display_order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
});

// PROJECT IMAGES TABLE
export const projectImages = pgTable('project_images', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').notNull(),
    imageUrl: text('image_url').notNull(),
    displayOrder: integer('display_order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
});

// ARTWORK TABLE
export const artwork = pgTable('artwork', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    imageUrl: text('image_url').notNull(),
    title: varchar('title', { length: 100 }).default(''),
    displayOrder: integer('display_order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
});

// LOGOS TABLE
export const logos = pgTable('logos', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    imageUrl: text('image_url').notNull(),
    title: varchar('title', { length: 100 }).default(''),
    displayOrder: integer('display_order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
});

// PAGE VIEWS TABLE
export const pageViews = pgTable('page_views', {
    id: uuid('id').primaryKey().defaultRandom(),
    portfolioUserId: uuid('portfolio_user_id').references(() => profiles.userId, { onDelete: 'cascade' }),
    visitorHash: text('visitor_hash'),
    pagePath: text('page_path'),
    referrer: text('referrer'),
    referrerDomain: text('referrer_domain'),
    country: text('country'),
    createdAt: timestamp('created_at').defaultNow(),
});

// CTA EVENTS TABLE
export const ctaEvents = pgTable('cta_events', {
    id: uuid('id').primaryKey().defaultRandom(),
    portfolioUserId: uuid('portfolio_user_id').references(() => profiles.userId, { onDelete: 'cascade' }),
    eventType: text('event_type').notNull(),
    eventData: jsonb('event_data'),
    visitorHash: text('visitor_hash'),
    createdAt: timestamp('created_at').defaultNow(),
});

// DOWNLOAD CODES TABLE
export const downloadCodes = pgTable('download_codes', {
    id: uuid('id').primaryKey().defaultRandom(),
    portfolioUserId: uuid('portfolio_user_id').references(() => profiles.userId, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    code: text('code').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    verified: boolean('verified').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});
