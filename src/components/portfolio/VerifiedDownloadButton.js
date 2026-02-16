'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import DownloadModal from './DownloadModal';
import styles from './VerifiedDownloadButton.module.css';

export default function VerifiedDownloadButton({
    portfolioUserId,
    ownerName,
    className
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={className || styles.downloadBtn}
            >
                <Download size={18} /> Download CV
            </button>

            <DownloadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                portfolioUserId={portfolioUserId}
                ownerName={ownerName}
            />
        </>
    );
}
