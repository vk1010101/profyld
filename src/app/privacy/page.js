import styles from './legal.module.css';

export const metadata = {
    title: 'Privacy Policy | Profyld',
    description: 'Privacy Policy for Profyld portfolio platform',
};

export default function PrivacyPolicy() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.lastUpdated}>Last updated: February 7, 2026</p>

            <section className={styles.section}>
                <h2>1. Information We Collect</h2>
                <h3>Account Information</h3>
                <p>
                    When you create an account, we collect your email address, username, and profile
                    information you choose to provide (name, title, bio, profile photo).
                </p>
                <h3>Content</h3>
                <p>
                    We store the content you upload including projects, work experience, skills,
                    and CV documents.
                </p>
                <h3>Analytics</h3>
                <p>
                    We collect anonymized visitor data for your portfolio including page views,
                    referral sources, and interaction metrics. Visitor IP addresses are hashed
                    and not stored in identifiable form.
                </p>
            </section>

            <section className={styles.section}>
                <h2>2. How We Use Your Information</h2>
                <ul>
                    <li>To provide and maintain the Service</li>
                    <li>To display your portfolio to visitors</li>
                    <li>To provide analytics about your portfolio performance</li>
                    <li>To process payments and manage subscriptions</li>
                    <li>To send important service updates</li>
                    <li>To respond to your support requests</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>3. Data Storage and Security</h2>
                <p>
                    Your data is stored securely using Supabase infrastructure with encryption at rest.
                    We use industry-standard security measures to protect your information.
                </p>
            </section>

            <section className={styles.section}>
                <h2>4. Data Sharing</h2>
                <p>We do not sell your personal information. We share data only with:</p>
                <ul>
                    <li><strong>Service Providers:</strong> Vercel (hosting), Supabase (database),
                        Razorpay (payments)</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect rights</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>5. Cookies</h2>
                <p>
                    We use essential cookies for authentication and session management. We do not use
                    tracking cookies for advertising purposes.
                </p>
            </section>

            <section className={styles.section}>
                <h2>6. Your Rights</h2>
                <ul>
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Delete your account and data</li>
                    <li>Export your data</li>
                    <li>Opt out of marketing communications</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>7. Data Retention</h2>
                <p>
                    We retain your data while your account is active. Upon deletion, your data is
                    removed within 30 days, except where retention is required by law.
                </p>
            </section>

            <section className={styles.section}>
                <h2>8. Children's Privacy</h2>
                <p>
                    Our Service is not intended for children under 13. We do not knowingly collect
                    information from children under 13.
                </p>
            </section>

            <section className={styles.section}>
                <h2>9. Changes to This Policy</h2>
                <p>
                    We may update this policy periodically. We will notify you of significant changes
                    via email or through the Service.
                </p>
            </section>

            <section className={styles.section}>
                <h2>10. Contact Us</h2>
                <p>
                    For privacy-related questions, please contact us at{' '}
                    <a href="mailto:privacy@profyld.com">privacy@profyld.com</a>
                </p>
            </section>
        </div>
    );
}
