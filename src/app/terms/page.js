import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer'; // Assuming we have a shared Footer or I should use VariantA's footer logic? 
// Wait, VariantA has its own footer. Navbar is shared. 
// I should probably create a simple layout or just use Navbar + content.
// For now, I'll use Navbar and a simple text container.

export default function TermsPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'var(--font-outfit)' }}>
            <Navbar />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 20px 60px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Terms and Conditions</h1>
                <p style={{ marginBottom: '1rem', color: '#ccc' }}>Last updated: {new Date().toLocaleDateString()}</p>

                <p style={{ lineHeight: '1.6', color: '#aaa', marginBottom: '2rem' }}>
                    These Terms and Conditions govern your use of this website and the purchase of products or services offered herein. By accessing or using this website, you agree to be bound by these terms. Please read them carefully.
                </p>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>1. General Use</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        By using this website, you confirm that you are at least 18 years old or are using the website under the supervision of a parent or legal guardian.
                        All content on this website is for informational purposes only and is subject to change without notice.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>2. User Responsibilities</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        Users agree not to misuse the website by knowingly introducing viruses, trojans, or other malicious material.
                        You must not attempt to gain unauthorized access to the server, database, or any part of the site.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>3. Product & Service Descriptions</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        All efforts are made to ensure accuracy in product descriptions, images, pricing, and availability.
                        However, we do not warrant that product descriptions or other content are complete, current, or error-free.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>4. Order Acceptance & Cancellation</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        Placing an order on this website does not constitute a confirmed order. We reserve the right to refuse or cancel any order for reasons including but not limited to product availability, pricing errors, or suspected fraud.
                        Once placed, orders may not be canceled or modified unless otherwise stated in the return policy.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>5. Pricing and Payment</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        All prices are displayed in INR or the local currency and are inclusive or exclusive of taxes as indicated.
                        Payments must be made through secure and approved payment gateways. The website is not liable for any payment gateway errors.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>6. Intellectual Property</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        All text, graphics, logos, images, and other materials on this website are the intellectual property of their respective owners and protected by copyright and trademark laws.
                        Unauthorized use or duplication of any materials is prohibited.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>7. Limitation of Liability</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        We are not responsible for any indirect or consequential damages that may arise from the use or inability to use the website or the products purchased through it.
                        Liability is limited to the value of the product purchased, if applicable.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>8. Modifications to Terms</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        These terms may be revised at any time without prior notice. Continued use of the site after changes implies acceptance of those changes.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>9. Governing Law</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        These terms shall be governed by and construed in accordance with the laws of India.
                    </p>
                </section>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>10. Cancellation and Refund Policy</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        If a refund is approved, you will be automatically refunded on your original payment method within 5-10 business days.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>11. Contact Information</h2>
                    <p style={{ lineHeight: '1.6', color: '#aaa' }}>
                        If you have any questions about these Terms, please contact us at <a href="mailto:support@profyld.com" style={{ color: '#fff', textDecoration: 'underline' }}>support@profyld.com</a>.
                    </p>
                    <div style={{ marginTop: '1rem', lineHeight: '1.6', color: '#aaa' }}>
                        <strong>Business Name:</strong> NFE<br />
                        <strong>Mobile:</strong> +91 9289034558<br />
                        <strong>Registered Address:</strong><br />
                        14 BLOCK B, FRIENDS TOWER APTTS,<br />
                        SECTOR 9 ROHINI, NEW DELHI,<br />
                        North West Delhi, Delhi, 110085
                    </div>
                </section>
            </div>
        </div>
    );
}
