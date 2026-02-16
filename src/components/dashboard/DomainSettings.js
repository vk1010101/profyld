'use client';

import { useState, useEffect, useRef } from 'react';
import { Globe, ExternalLink, CheckCircle, AlertCircle, Copy, RefreshCw, Trash2, Crown, ChevronDown, Loader2, HelpCircle } from 'lucide-react';
import { getClient } from '@/lib/supabase/client';
import { ROOT_DOMAIN, APP_NAME } from '@/lib/constants';
import Button from '@/components/ui/Button';
import styles from './DomainSettings.module.css';

// DNS Provider Instructions
const DNS_PROVIDERS = {
    godaddy: {
        name: 'GoDaddy',
        steps: [
            'Log in to your GoDaddy account',
            'Go to "My Products" → Select your domain',
            'Click "DNS" or "Manage DNS"',
            'Scroll to "Records" → Click "Add"',
            'Select Type: TXT',
            'Name/Host: _profyld',
            'Value: (paste the verification code)',
            'TTL: 1 Hour → Save'
        ]
    },
    namecheap: {
        name: 'Namecheap',
        steps: [
            'Log in to Namecheap → "Domain List"',
            'Click "Manage" next to your domain',
            'Go to "Advanced DNS" tab',
            'Click "Add New Record"',
            'Type: TXT Record',
            'Host: _profyld',
            'Value: (paste the verification code)',
            'TTL: Automatic → Save'
        ]
    },
    cloudflare: {
        name: 'Cloudflare',
        steps: [
            'Log in to Cloudflare dashboard',
            'Select your domain',
            'Go to "DNS" → "Records"',
            'Click "Add record"',
            'Type: TXT',
            'Name: _profyld',
            'Content: (paste the verification code)',
            'TTL: Auto → Save'
        ]
    },
    other: {
        name: 'Other Provider',
        steps: [
            'Log in to your DNS provider',
            'Find DNS settings/records for your domain',
            'Add a new TXT record',
            'Host/Name: _profyld',
            'Value/Content: (paste the verification code)',
            'Save and wait for propagation (up to 48h)'
        ]
    }
};

export default function DomainSettings() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [domainInput, setDomainInput] = useState('');
    const [verificationToken, setVerificationToken] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [polling, setPolling] = useState(false);
    const [pollProgress, setPollProgress] = useState(0);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState('godaddy');
    const [showProviderDropdown, setShowProviderDropdown] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const pollIntervalRef = useRef(null);
    const supabase = getClient();

    useEffect(() => {
        fetchProfile();
        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, []);

    const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('profiles')
            .select('username, custom_domain, custom_domain_verified, domain_verification_token, plan')
            .eq('user_id', user.id)
            .single();

        if (data) {
            setProfile(data);
            if (data.domain_verification_token) {
                setVerificationToken(data.domain_verification_token);
            }
        }
        setLoading(false);
    };

    const subdomainUrl = profile?.username ? `${profile.username}.${ROOT_DOMAIN}` : null;
    const isPremium = profile?.plan === 'pro' || profile?.plan === 'premium';

    const generateToken = async () => {
        setError(null);
        try {
            const res = await fetch('/api/domains/verify', { method: 'PUT' });
            const data = await res.json();
            if (data.success) {
                setVerificationToken(data.token);
                await fetchProfile();
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to generate token');
        }
    };

    const verifyDomain = async () => {
        if (!domainInput) return;
        setVerifying(true);
        setError(null);

        try {
            const res = await fetch('/api/domains/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain: domainInput.toLowerCase().trim() }),
            });
            const data = await res.json();

            if (data.success && data.verified) {
                await fetchProfile();
                setDomainInput('');
            } else {
                setError(data.error || 'TXT record not found. DNS can take up to 48 hours to propagate.');
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        }
        setVerifying(false);
    };

    const startPolling = async () => {
        if (!domainInput) {
            setError('Please enter your domain first');
            return;
        }

        setPolling(true);
        setError(null);
        setPollProgress(0);

        let attempts = 0;
        const maxAttempts = 12; // 60 seconds total

        pollIntervalRef.current = setInterval(async () => {
            attempts++;
            setPollProgress(Math.round((attempts / maxAttempts) * 100));

            try {
                const res = await fetch('/api/domains/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ domain: domainInput.toLowerCase().trim() }),
                });
                const data = await res.json();

                if (data.success && data.verified) {
                    clearInterval(pollIntervalRef.current);
                    setPolling(false);
                    await fetchProfile();
                    setDomainInput('');
                    return;
                }
            } catch (err) {
                // Continue polling
            }

            if (attempts >= maxAttempts) {
                clearInterval(pollIntervalRef.current);
                setPolling(false);
                setError('Could not verify automatically. DNS propagation may take up to 48 hours. Click "Verify Domain" to try again later.');
            }
        }, 5000);
    };

    const stopPolling = () => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
        }
        setPolling(false);
        setPollProgress(0);
    };

    const removeDomain = async () => {
        if (!confirm('Remove your custom domain? Your portfolio will no longer be accessible at this address.')) return;

        try {
            const res = await fetch('/api/domains/verify', { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                await fetchProfile();
            }
        } catch (err) {
            setError('Failed to remove domain');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return <div className={styles.loading}>Loading domain settings...</div>;
    }

    return (
        <div className={styles.container}>
            {/* Free Subdomain */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <Globe size={20} />
                    <h3>Your {APP_NAME} Subdomain</h3>
                    <span className={styles.freeBadge}>Free</span>
                </div>

                {subdomainUrl ? (
                    <div className={styles.domainDisplay}>
                        <code className={styles.domainUrl}>{subdomainUrl}</code>
                        <a
                            href={`https://${subdomainUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.visitBtn}
                        >
                            <ExternalLink size={16} />
                            Visit
                        </a>
                    </div>
                ) : (
                    <p className={styles.muted}>Set up your username to get your subdomain</p>
                )}

                <p className={styles.hint}>
                    This is your permanent portfolio URL. Share it anywhere!
                </p>
            </div>

            {/* Custom Domain */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <Crown size={20} className={styles.premiumIcon} />
                    <h3>Custom Domain</h3>
                    <span className={styles.proBadge}>Pro</span>
                </div>

                {!isPremium ? (
                    <div className={styles.upgradePrompt}>
                        <p>Connect your own domain (e.g., yourname.com) with a Pro plan.</p>
                        <Button variant="primary" size="small">
                            Upgrade to Pro
                        </Button>
                    </div>
                ) : profile?.custom_domain && profile?.custom_domain_verified ? (
                    // Domain is connected
                    <div className={styles.connectedDomain}>
                        <div className={styles.domainStatus}>
                            <CheckCircle size={18} className={styles.successIcon} />
                            <span>Connected & Verified</span>
                        </div>
                        <div className={styles.domainDisplay}>
                            <code className={styles.domainUrl}>{profile.custom_domain}</code>
                            <a
                                href={`https://${profile.custom_domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.visitBtn}
                            >
                                <ExternalLink size={16} />
                            </a>
                            <button onClick={removeDomain} className={styles.removeBtn} title="Remove domain">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <p className={styles.hint}>
                            Your portfolio is now live at this custom domain!
                        </p>
                    </div>
                ) : (
                    // Setup flow
                    <div className={styles.setupFlow}>
                        {/* Step 1: Generate Token */}
                        {!verificationToken ? (
                            <div className={styles.step}>
                                <span className={styles.stepNum}>1</span>
                                <div className={styles.stepContent}>
                                    <p>First, generate a verification token:</p>
                                    <Button onClick={generateToken} size="small" variant="secondary">
                                        Generate Verification Token
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Step 1: Add DNS Record */}
                                <div className={styles.step}>
                                    <span className={styles.stepNum}>1</span>
                                    <div className={styles.stepContent}>
                                        <p>Add this TXT record to your domain's DNS:</p>
                                        <div className={styles.dnsRecord}>
                                            <div className={styles.dnsRow}>
                                                <span className={styles.dnsLabel}>Type:</span>
                                                <code>TXT</code>
                                            </div>
                                            <div className={styles.dnsRow}>
                                                <span className={styles.dnsLabel}>Host:</span>
                                                <code>_profyld</code>
                                            </div>
                                            <div className={styles.dnsRow}>
                                                <span className={styles.dnsLabel}>Value:</span>
                                                <code className={styles.token}>profyld-verify={verificationToken}</code>
                                                <button
                                                    onClick={() => copyToClipboard(`profyld-verify=${verificationToken}`)}
                                                    className={styles.copyBtn}
                                                    title="Copy to clipboard"
                                                >
                                                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* DNS Provider Instructions */}
                                        <div className={styles.providerSection}>
                                            <button
                                                className={styles.providerToggle}
                                                onClick={() => setShowInstructions(!showInstructions)}
                                            >
                                                <HelpCircle size={14} />
                                                Need help? Step-by-step instructions
                                                <ChevronDown size={14} className={showInstructions ? styles.rotated : ''} />
                                            </button>

                                            {showInstructions && (
                                                <div className={styles.instructionsPanel}>
                                                    <div className={styles.providerSelect}>
                                                        <span>Select your DNS provider:</span>
                                                        <div className={styles.providerDropdown}>
                                                            <button
                                                                className={styles.dropdownTrigger}
                                                                onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                                                            >
                                                                {DNS_PROVIDERS[selectedProvider].name}
                                                                <ChevronDown size={14} />
                                                            </button>
                                                            {showProviderDropdown && (
                                                                <div className={styles.dropdownMenu}>
                                                                    {Object.entries(DNS_PROVIDERS).map(([key, provider]) => (
                                                                        <button
                                                                            key={key}
                                                                            className={styles.dropdownItem}
                                                                            onClick={() => {
                                                                                setSelectedProvider(key);
                                                                                setShowProviderDropdown(false);
                                                                            }}
                                                                        >
                                                                            {provider.name}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <ol className={styles.instructionsList}>
                                                        {DNS_PROVIDERS[selectedProvider].steps.map((step, i) => (
                                                            <li key={i}>{step}</li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Step 2: Verify */}
                                <div className={styles.step}>
                                    <span className={styles.stepNum}>2</span>
                                    <div className={styles.stepContent}>
                                        <p>Enter your domain and verify:</p>
                                        <div className={styles.verifyForm}>
                                            <input
                                                type="text"
                                                placeholder="yourdomain.com"
                                                value={domainInput}
                                                onChange={(e) => setDomainInput(e.target.value)}
                                                className={styles.domainInput}
                                                disabled={polling}
                                            />
                                            {polling ? (
                                                <Button onClick={stopPolling} size="small" variant="secondary">
                                                    Cancel
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={verifyDomain}
                                                    loading={verifying}
                                                    size="small"
                                                >
                                                    <RefreshCw size={14} />
                                                    Verify
                                                </Button>
                                            )}
                                        </div>

                                        {/* Auto-polling option */}
                                        {!polling && !verifying && (
                                            <button className={styles.autoPollingBtn} onClick={startPolling}>
                                                <Loader2 size={14} />
                                                Auto-check every 5 seconds (60s)
                                            </button>
                                        )}

                                        {/* Polling progress */}
                                        {polling && (
                                            <div className={styles.pollingStatus}>
                                                <Loader2 size={16} className={styles.spinning} />
                                                <span>Checking DNS... {pollProgress}%</span>
                                                <div className={styles.pollingBar}>
                                                    <div
                                                        className={styles.pollingFill}
                                                        style={{ width: `${pollProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {error && (
                            <div className={styles.error}>
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

