import styles from './legal.module.css';

export const metadata = {
    title: 'Terms of Service | Profyld',
    description: 'Terms of Service for Profyld portfolio platform',
};

export default function TermsOfService() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Terms of Service</h1>
            <p className={styles.lastUpdated}>Last updated: February 7, 2026</p>

            <section className={styles.section}>
                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing or using Profyld ("Service"), you agree to be bound by these Terms of Service.
                    If you do not agree to these terms, please do not use the Service.
                </p>
            </section>

            <section className={styles.section}>
                <h2>2. Description of Service</h2>
                <p>
                    Profyld is a portfolio building platform that allows users to create, customize, and share
                    professional portfolios online. We provide tools for profile management, CV creation,
                    project showcasing, and analytics.
                </p>
            </section>

            <section className={styles.section}>
                <h2>3. User Accounts</h2>
                <ul>
                    <li>You must provide accurate information when creating an account</li>
                    <li>You are responsible for maintaining the security of your account</li>
                    <li>You must be at least 13 years old to use this Service</li>
                    <li>One person may not maintain more than one free account</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>4. User Content</h2>
                <p>
                    You retain ownership of content you upload. By uploading content, you grant us a license
                    to display and distribute your content as part of the Service. You are responsible for
                    ensuring you have the rights to upload any content.
                </p>
            </section>

            <section className={styles.section}>
                <h2>5. Prohibited Uses</h2>
                <ul>
                    <li>Uploading illegal, harmful, or offensive content</li>
                    <li>Impersonating others or providing false information</li>
                    <li>Attempting to gain unauthorized access to the Service</li>
                    <li>Using the Service to send spam or unsolicited messages</li>
                    <li>Interfering with the proper functioning of the Service</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>6. Payment Terms</h2>
                <p>
                    Paid plans are billed in advance on a monthly or annual basis. Payments are processed
                    through Razorpay. Refunds are available within 7 days of purchase if you haven't used
                    premium features extensively.
                </p>
            </section>

            <section className={styles.section}>
                <h2>7. Termination</h2>
                <p>
                    We may terminate or suspend your account at any time for violations of these terms.
                    You may delete your account at any time through your account settings.
                </p>
            </section>

            <section className={styles.section}>
                <h2>8. Limitation of Liability</h2>
                <p>
                    Profyld is provided "as is" without warranties. We are not liable for any indirect,
                    incidental, or consequential damages arising from your use of the Service.
                </p>
            </section>

            <section className={styles.section}>
                <h2>9. Contact</h2>
                <p>
                    For questions about these Terms, please contact us at{' '}
                    <a href="mailto:legal@profyld.com">legal@profyld.com</a>
                </p>
            </section>
        </div>
    );
}
