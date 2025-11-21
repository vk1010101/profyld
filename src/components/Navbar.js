"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
            <div className="container">
                <div className={styles.navContent}>
                    <Link href="/" className={styles.logo}>
                        SHIRIKA KOHLI
                    </Link>

                    <div className={`${styles.navLinks} ${isOpen ? styles.open : ""}`}>
                        <Link href="#about" onClick={() => setIsOpen(false)}>About</Link>
                        <Link href="#portfolio" onClick={() => setIsOpen(false)}>Portfolio</Link>
                        <Link href="#artwork" onClick={() => setIsOpen(false)}>Artwork</Link>
                        <Link href="#contact" onClick={() => setIsOpen(false)}>Contact</Link>
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
