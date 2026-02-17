import Navbar from '@/components/landing/Navbar';

export default function RefundPolicyPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'var(--font-outfit)' }}>
            <Navbar />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 20px 60px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Cancellation and Refund Policy</h1>
                <p style={{ marginBottom: '1rem', color: '#ccc' }}>Last updated: {new Date().toLocaleDateString()}</p>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>1. Refund Eligibility</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        If a refund is approved for any of our services, you will be automatically refunded on your original payment method within 5-10 business days.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>2. Cancellation</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        You may cancel your subscription at any time. If you cancel, your subscription will remain active until the end of the current billing cycle.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>3. Contact Us</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        If you have any questions about our refund policy, please contact us at <a href="mailto:support@profyld.com" style={{ color: '#fff', textDecoration: 'underline' }}>support@profyld.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
