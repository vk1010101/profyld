import Navbar from '@/components/landing/Navbar';

export default function PrivacyPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'var(--font-outfit)' }}>
            <Navbar />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 20px 60px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Privacy Policy</h1>
                <p style={{ marginBottom: '1rem', color: '#ccc' }}>Last updated: {new Date().toLocaleDateString()}</p>

                <p style={{ lineHeight: '1.6', color: '#aaa', marginBottom: '2rem' }}>
                    This Privacy Policy outlines how personal information is collected, used, and safeguarded when you interact with this website. By accessing or using the website, you agree to the practices described below.
                </p>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>1. Information We Collect</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        We may collect the following types of information:
                        <br />• <strong>Personal Information:</strong> Name, phone number, email address, billing/shipping address.
                        <br />• <strong>Payment Information:</strong> Used to process orders securely through third-party payment gateways.
                        <br />• <strong>Technical Information:</strong> IP address, browser type, device information, and usage data via cookies or similar technologies.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>2. How We Use Your Information</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        • To process and deliver orders.
                        <br />• To send transactional communications such as order updates or shipping alerts.
                        <br />• To respond to customer inquiries or service requests.
                        <br />• To improve website functionality, services, and user experience.
                        <br />• For marketing purposes (only with your explicit consent).
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>3. Data Sharing</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        We do not sell, rent, or trade your personal data.
                        <br />• We may share necessary information with third-party service providers such as payment gateways, delivery partners, or IT service providers only to fulfill your order or maintain the website.
                        <br />• Personal information may be disclosed if required by law or legal proceedings.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>4. Data Security</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        We implement reasonable security measures to protect your data from unauthorized access, alteration, or disclosure.
                        However, no online transmission is 100% secure. You acknowledge this risk when using the site.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>5. Cookies and Tracking Technologies</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        Cookies are used to personalize your experience, analyze site traffic, and provide relevant ads.
                        You can manage or disable cookies via your browser settings, although this may affect site functionality.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>6. Third-Party Links</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        This website may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>7. Your Rights</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        You may request access to or correction of your personal data.
                        You may opt out of marketing communications at any time.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>8. Changes to This Policy</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        This privacy policy may be updated periodically. Continued use of the website after changes indicates acceptance of the revised policy.
                    </p>
                </section>
            </div>
        </div>
    );
}
