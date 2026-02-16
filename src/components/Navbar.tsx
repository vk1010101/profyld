"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";
import type { NavbarProps } from "@/types";

interface SectionVisibility {
    about?: boolean;
    portfolio?: boolean;
    artwork?: boolean;
    logos?: boolean;
    contact?: boolean;
}

interface SectionLabels {
    about?: string;
    portfolio?: string;
    artwork?: string;
    logos?: string;
    contact?: string;
}

interface ExtendedNavbarProps extends NavbarProps {
    sectionVisibility?: SectionVisibility;
    sectionLabels?: SectionLabels;
    navItems?: { href: string; label: string }[];
}

const defaultVisibility: SectionVisibility = {
    about: true,
    portfolio: true,
    artwork: true,
    logos: true,
    contact: true,
};

const defaultLabels: SectionLabels = {
    about: "About",
    portfolio: "Portfolio",
    artwork: "Artwork",
    logos: "Logos",
    contact: "Contact",
};

const Navbar = ({
    name = "Portfolio",
    showArtwork = true,
    showLogos = true,
    sectionVisibility = defaultVisibility,
    sectionLabels = defaultLabels,
    navItems
}: ExtendedNavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Merge with defaults, and maintain backward compatibility
    const visibility = {
        ...defaultVisibility,
        ...sectionVisibility,
        // Backward compatibility with old props
        artwork: sectionVisibility?.artwork ?? showArtwork,
        logos: sectionVisibility?.logos ?? showLogos,
    };

    // Merge labels with defaults
    const labels = {
        ...defaultLabels,
        ...sectionLabels,
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    // Build nav links dynamically based on visibility and custom labels
    // OR use provided navItems if standard blocks aren't enough
    const generatedNavLinks = [
        visibility.about && { href: "#about", label: labels.about },
        visibility.portfolio && { href: "#portfolio", label: labels.portfolio },
        visibility.artwork && { href: "#artwork", label: labels.artwork },
        visibility.logos && { href: "#logos", label: labels.logos },
        visibility.contact && { href: "#contact", label: labels.contact },
    ].filter(Boolean) as { href: string; label: string }[];

    const finalNavLinks = navItems || generatedNavLinks;

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
            <div className="container">
                <div className={styles.navContent}>
                    <Link href="/" className={styles.logo}>
                        {name}
                    </Link>

                    <div className={`${styles.navLinks} ${isOpen ? styles.open : ""}`}>
                        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                            <X size={24} />
                        </button>
                        {finalNavLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <button className={styles.menuBtn} onClick={toggleMenu}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

