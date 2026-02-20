import {
    LayoutTemplate, User, Briefcase, Image as ImageIcon, MessageSquare, Phone,
    Type, GalleryVertical, Quote, BarChart, Split, Space, Code
} from 'lucide-react';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Artwork from '@/components/Artwork';
import Logos from '@/components/Logos';
import Contact from '@/components/Contact';

import {
    TextBlock, DividerBlock, SpacerBlock, HtmlBlock
} from './blocks/BasicBlocks';
import {
    GalleryBlock, TestimonialsBlock, StatsBlock
} from './blocks/ContentBlocks';
import CreativeCanvas from './blocks/CreativeCanvas';

export const BlockRegistry = {
    // --- Legacy Sections ---
    hero: {
        id: 'hero',
        label: 'Hero Section',
        // content category allows sidebar editing
        category: 'Content',
        icon: LayoutTemplate,
        component: Hero,
        schema: [
            { name: 'title', type: 'text', label: 'Main Headline', placeholder: 'e.g. Alex Reed' },
            { name: 'subtitle', type: 'text', label: 'Subtitle / Role', placeholder: 'e.g. Creative Developer' },
            { name: 'tagline', type: 'text', label: 'Tagline', placeholder: 'e.g. Building digital experiences' },
            { name: 'backgroundType', type: 'select', label: 'Background', options: ['gradient', 'image', 'color', 'mesh', 'aurora', 'dots', 'waves', 'grain', 'orbs'] },
            { name: 'gradientDirection', type: 'select', label: 'Gradient Direction', options: ['to right', 'to bottom', 'to bottom right', 'to top right', 'to bottom left'] },
            { name: 'gradientColor1', type: 'color', label: 'Gradient Start Color' },
            { name: 'gradientColor2', type: 'color', label: 'Gradient End Color' },
            { name: 'backgroundColor', type: 'color', label: 'Solid Background Color' },
            { name: 'heroImage', type: 'text', label: 'Background Image URL', placeholder: 'https://...' },
            { name: 'overlayOpacity', type: 'range', label: 'Overlay Opacity', min: 0, max: 100 },
        ],
        defaultConfig: {
            title: '',
            subtitle: '',
            tagline: '',
            backgroundType: 'gradient',
            gradientDirection: 'to bottom right',
            gradientColor1: '#0a0a1a',
            gradientColor2: '#1a1a3e',
            backgroundColor: '#0a0a1a',
            heroImage: '',
            overlayOpacity: 70
        }
    },
    about: {
        id: 'about',
        label: 'About Me',
        category: 'Content',
        icon: User,
        component: About,
        schema: [
            { name: 'sectionTitle', type: 'text', label: 'Section Title' },
            { name: 'showBio', type: 'select', label: 'Show Bio', options: ['true', 'false'] },
            { name: 'showSkills', type: 'select', label: 'Show Skills', options: ['true', 'false'] },
            { name: 'showExperience', type: 'select', label: 'Show Experience', options: ['true', 'false'] },
            { name: 'showEducation', type: 'select', label: 'Show Education', options: ['true', 'false'] },
            { name: 'backgroundColor', type: 'color', label: 'Background Color' },
            { name: 'backgroundImage', type: 'text', label: 'Background Image URL', placeholder: 'https://...' },
        ],
        defaultConfig: {
            sectionTitle: 'About Me',
            showBio: true,
            showSkills: true,
            showExperience: true,
            showEducation: true,
            backgroundColor: '',
            backgroundImage: ''
        }
    },
    portfolio: {
        id: 'portfolio',
        label: 'Selected Works',
        category: 'Legacy',
        icon: Briefcase,
        component: Portfolio,
        schema: [
            { name: 'sectionTitle', type: 'text', label: 'Section Title' },
            { name: 'columns', type: 'select', label: 'Columns', options: ['1', '2', '3'] },
            { name: 'backgroundColor', type: 'color', label: 'Background Color' },
            { name: 'backgroundImage', type: 'text', label: 'Background Image URL', placeholder: 'https://...' },
        ],
        defaultConfig: {
            sectionTitle: 'Selected Works',
            columns: 2,
            backgroundColor: '',
            backgroundImage: ''
        }
    },
    artwork: {
        id: 'artwork',
        label: 'Artwork Gallery',
        category: 'Legacy',
        icon: ImageIcon,
        component: Artwork,
        schema: [
            { name: 'sectionTitle', type: 'text', label: 'Section Title' },
            { name: 'backgroundColor', type: 'color', label: 'Background Color' },
            { name: 'backgroundImage', type: 'text', label: 'Background Image URL', placeholder: 'https://...' },
        ],
        defaultConfig: {
            sectionTitle: 'Artwork Gallery',
            backgroundColor: '',
            backgroundImage: ''
        }
    },
    logos: {
        id: 'logos',
        label: 'Client Logos',
        category: 'Legacy',
        icon: MessageSquare,
        component: Logos,
        schema: [
            { name: 'sectionTitle', type: 'text', label: 'Section Title' },
            { name: 'backgroundColor', type: 'color', label: 'Background Color' },
            { name: 'backgroundImage', type: 'text', label: 'Background Image URL', placeholder: 'https://...' },
        ],
        defaultConfig: {
            sectionTitle: 'Trusted By',
            backgroundColor: '',
            backgroundImage: ''
        }
    },
    contact: {
        id: 'contact',
        label: 'Contact',
        category: 'Legacy',
        icon: Phone,
        component: Contact,
        schema: [
            { name: 'sectionTitle', type: 'text', label: 'Section Title' },
            { name: 'showSocialLinks', type: 'select', label: 'Show Social Links', options: ['true', 'false'] },
            { name: 'backgroundColor', type: 'color', label: 'Background Color' },
            { name: 'backgroundImage', type: 'text', label: 'Background Image URL', placeholder: 'https://...' },
        ],
        defaultConfig: {
            sectionTitle: 'Get in Touch',
            showSocialLinks: true,
            backgroundColor: '',
            backgroundImage: ''
        }
    },

    // --- New Content Blocks ---
    text: {
        id: 'text',
        label: 'Rich Text',
        category: 'Content',
        icon: Type,
        component: TextBlock,
        schema: [
            { name: 'content', type: 'richtext', label: 'Content' },
            { name: 'align', type: 'select', label: 'Alignment', options: ['left', 'center', 'right'] },
            { name: 'style', type: 'select', label: 'Style', options: ['normal', 'lead', 'small'] }
        ],
        defaultConfig: {
            content: '<h2>Hello World</h2><p>Start typing your content here...</p>',
            align: 'left',
            style: 'normal'
        }
    },
    gallery: {
        id: 'gallery',
        label: 'Image Gallery',
        category: 'Media',
        icon: GalleryVertical,
        component: GalleryBlock,
        schema: [
            { name: 'images', type: 'image_array', label: 'Images' },
            { name: 'columns', type: 'number', label: 'Columns', min: 1, max: 4 },
            { name: 'aspectRatio', type: 'select', label: 'Aspect Ratio', options: ['auto', '1/1', '4/3', '16/9'] }
        ],
        defaultConfig: {
            images: [],
            columns: 3,
            aspectRatio: '1/1'
        }
    },
    testimonials: {
        id: 'testimonials',
        label: 'Testimonials',
        category: 'Content',
        icon: Quote,
        component: TestimonialsBlock,
        schema: [
            {
                name: 'items', type: 'array', label: 'Testimonials', itemSchema: [
                    { name: 'quote', type: 'textarea' },
                    { name: 'author', type: 'text' },
                    { name: 'role', type: 'text' },
                    { name: 'image', type: 'image' }
                ]
            }
        ],
        defaultConfig: { items: [] }
    },
    stats: {
        id: 'stats',
        label: 'Statistics',
        category: 'Content',
        icon: BarChart,
        component: StatsBlock,
        schema: [
            {
                name: 'items', type: 'array', label: 'Stats', itemSchema: [
                    { name: 'value', type: 'text', placeholder: '100+' },
                    { name: 'label', type: 'text', placeholder: 'Projects' }
                ]
            },
            { name: 'style', type: 'select', options: ['cards', 'minimal'] }
        ],
        defaultConfig: { items: [], style: 'minimal' }
    },

    // --- Layout Blocks ---
    divider: {
        id: 'divider',
        label: 'Divider',
        category: 'Layout',
        icon: Split,
        component: DividerBlock,
        schema: [
            { name: 'style', type: 'select', options: ['solid', 'dashed', 'dotted'] },
            { name: 'color', type: 'color', label: 'Color' },
            { name: 'margin', type: 'range', min: 0, max: 100, label: 'Vertical Margin' }
        ],
        defaultConfig: { style: 'solid', color: '#333333', margin: 24 }
    },
    spacer: {
        id: 'spacer',
        label: 'Spacer',
        category: 'Layout',
        icon: Space,
        component: SpacerBlock,
        schema: [
            { name: 'height', type: 'range', min: 8, max: 200, label: 'Height (px)' }
        ],
        defaultConfig: { height: 48 }
    },
    html: {
        id: 'html',
        label: 'Custom HTML',
        category: 'Advanced',
        icon: Code,
        component: HtmlBlock,
        schema: [
            { name: 'html', type: 'code', label: 'HTML Code' }
        ],
        defaultConfig: { html: '<!-- Custom HTML -->' }
    },

    // --- Creative Canvas ---
    creative_canvas: {
        id: 'creative_canvas',
        label: 'Creative Canvas',
        category: 'Creative',
        icon: LayoutTemplate,
        component: CreativeCanvas,
        schema: [
            { name: 'canvasWidth', type: 'number', label: 'Canvas Width', min: 600, max: 1920 },
            { name: 'canvasHeight', type: 'number', label: 'Canvas Height', min: 300, max: 1200 },
            { name: 'backgroundColor', type: 'color', label: 'Background Color' }
        ],
        defaultConfig: {
            canvasWidth: 1200,
            canvasHeight: 600,
            backgroundColor: '#1a1a2e',
            elements: []
        }
    }
};

export const getBlockDefinition = (type) => BlockRegistry[type];
