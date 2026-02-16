'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Mail, ArrowRight, Download, Loader2, CheckCircle } from 'lucide-react';
import styles from './DownloadModal.module.css';

export default function DownloadModal({ isOpen, onClose, portfolioUserId, ownerName }) {
    const [step, setStep] = useState(1); // 1: email, 2: code, 3: success
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [fileName, setFileName] = useState('');

    const codeInputRefs = useRef([]);

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep(1);
                setEmail('');
                setCode(['', '', '', '', '', '']);
                setError('');
                setDownloadUrl('');
            }, 300);
        }
    }, [isOpen]);

    // Handle code input auto-focus
    const handleCodeChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newCode = [...code];
        newCode[index] = value.slice(-1); // Only take last digit
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            codeInputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits entered
        if (index === 5 && value) {
            const fullCode = newCode.join('');
            if (fullCode.length === 6) {
                handleVerifyCode(fullCode);
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            codeInputRefs.current[index - 1]?.focus();
        }
    };

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/resume/request-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, portfolioUserId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send code');
            }

            setStep(2);
            // Focus first code input
            setTimeout(() => codeInputRefs.current[0]?.focus(), 100);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (fullCode) => {
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/resume/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    code: fullCode || code.join(''),
                    portfolioUserId
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Invalid code');
            }

            setDownloadUrl(data.downloadUrl);
            setFileName(data.fileName);
            setStep(3);

            // Auto-trigger download
            setTimeout(() => {
                triggerDownload(data.downloadUrl, data.fileName);
            }, 500);
        } catch (err) {
            setError(err.message);
            setCode(['', '', '', '', '', '']);
            codeInputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const triggerDownload = (url, name) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>

                {step === 1 && (
                    <div className={styles.content}>
                        <div className={styles.iconWrapper}>
                            <Mail size={32} />
                        </div>
                        <h2>Download Resume</h2>
                        <p>Enter your email to receive a verification code</p>

                        <form onSubmit={handleRequestCode}>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.emailInput}
                                required
                                autoFocus
                            />
                            {error && <p className={styles.error}>{error}</p>}
                            <button type="submit" className={styles.submitBtn} disabled={loading}>
                                {loading ? <Loader2 size={18} className={styles.spinner} /> : <ArrowRight size={18} />}
                                {loading ? 'Sending...' : 'Send Code'}
                            </button>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.content}>
                        <div className={styles.iconWrapper}>
                            <Mail size={32} />
                        </div>
                        <h2>Enter Verification Code</h2>
                        <p>We sent a 6-digit code to <strong>{email}</strong></p>

                        <div className={styles.codeInputs}>
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (codeInputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={styles.codeInput}
                                />
                            ))}
                        </div>

                        {error && <p className={styles.error}>{error}</p>}

                        <button
                            onClick={() => handleVerifyCode()}
                            className={styles.submitBtn}
                            disabled={loading || code.join('').length !== 6}
                        >
                            {loading ? <Loader2 size={18} className={styles.spinner} /> : <Download size={18} />}
                            {loading ? 'Verifying...' : 'Verify & Download'}
                        </button>

                        <button className={styles.backBtn} onClick={() => setStep(1)}>
                            ← Use different email
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className={styles.content}>
                        <div className={`${styles.iconWrapper} ${styles.success}`}>
                            <CheckCircle size={32} />
                        </div>
                        <h2>Download Started!</h2>
                        <p>If the download doesn't start automatically:</p>

                        <button
                            onClick={() => triggerDownload(downloadUrl, fileName)}
                            className={styles.submitBtn}
                        >
                            <Download size={18} />
                            Download Again
                        </button>

                        <button className={styles.closeTextBtn} onClick={onClose}>
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
