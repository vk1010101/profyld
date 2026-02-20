'use client';

import { motion } from 'framer-motion';
import { X, Mail, Phone, MessageCircle } from 'lucide-react';
import styles from './ContactPopup.module.css';

export default function ContactPopup({ onClose }) {
    return (
        <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.popup}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <X size={20} />
                </button>

                <div className={styles.header}>
                    <div className={styles.iconCircle}>
                        <MessageCircle size={32} color="#c0a878" />
                    </div>
                    <h2 className={styles.title}>Get in Touch</h2>
                    <p className={styles.subtitle}>We'd love to hear from you.</p>
                </div>

                <div className={styles.details}>
                    <a href="mailto:support@profyld.com" className={styles.detailItem}>
                        <div className={styles.itemIcon}>
                            <Mail size={20} />
                        </div>
                        <div className={styles.itemContent}>
                            <span className={styles.label}>Email Support</span>
                            <span className={styles.value}>support@profyld.com</span>
                        </div>
                    </a>

                    <a href="tel:+919289034558" className={styles.detailItem}>
                        <div className={styles.itemIcon}>
                            <Phone size={20} />
                        </div>
                        <div className={styles.itemContent}>
                            <span className={styles.label}>Phone / WhatsApp</span>
                            <span className={styles.value}>+91 9289 034 558</span>
                        </div>
                    </a>
                </div>

                <div className={styles.footer}>
                    <p>Available Mon-Fri, 9am - 6pm IST</p>
                </div>
            </motion.div>
        </motion.div>
    );
}
