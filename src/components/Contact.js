"use client";

import styles from "./Contact.module.css";
import { Mail, Instagram, Linkedin } from "lucide-react";

const Contact = () => {
    return (
        <section id="contact" className={styles.contact}>
            <div className="container">
                <h2 className="section-title">Get In Touch</h2>
                <div className={styles.content}>
                    <div className={styles.card}>
                        <h3>Collaboration</h3>
                        <p>Like what I do? Let's discuss what I can do for your brand.</p>
                        <a href="https://www.linkedin.com/in/shirika-kohli-368b2a363?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" className={styles.btn}>
                            Start a Project
                        </a>
                    </div>

                    <div className={styles.card}>
                        <h3>Job Enquiries</h3>
                        <p>Available for interesting freelance projects and full-time roles.</p>
                        <a href="mailto:Shirikakohli73@gmail.com" className={styles.btn}>
                            Send Enquiry
                        </a>
                    </div>
                </div>

                <div className={styles.socials}>
                    <a href="https://www.instagram.com/notshirika?igsh=MWtqczUxcTE3NGw4aw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><Instagram size={24} /></a>
                    <a href="https://www.linkedin.com/in/shirika-kohli-368b2a363?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><Linkedin size={24} /></a>
                    <a href="mailto:Shirikakohli73@gmail.com" className={styles.socialLink}><Mail size={24} /></a>
                </div>

                <footer className={styles.footer}>
                    <p>&copy; {new Date().getFullYear()} Shirika. All rights reserved.</p>
                </footer>
            </div>
        </section>
    );
};

export default Contact;
