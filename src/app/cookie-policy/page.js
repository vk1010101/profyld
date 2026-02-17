import Navbar from '@/components/landing/Navbar';

export default function CookiePage() {
    return (
        <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'var(--font-outfit)' }}>
            <Navbar />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 20px 60px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Cookie Policy</h1>
                <p style={{ marginBottom: '1rem', color: '#ccc' }}>Last updated: {new Date().toLocaleDateString()}</p>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>1. What Are Cookies</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        Cookies are small text files that are stored on your device when you visit a website. They help us remember your preferences and improve your experience.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>2. How We Use Cookies</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        We use cookies to authenticate users, prevent fraud, and analyze site usage to improve our services.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>3. Managing Cookies</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        You can control or delete cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of Profyld.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>4. Contact Us</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        For questions about our use of cookies, please contact support@profyld.com
                    </p>
                </section>
            </div>
        </div>
    );
}
