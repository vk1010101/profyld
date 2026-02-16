'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Lenis from 'lenis';
import VariantA from '@/components/landing/VariantA';
import VariantB from '@/components/landing/VariantB';
import VariantC from '@/components/landing/VariantC';
import VariantD from '@/components/landing/VariantD';

function LandingPageContent() {
  const searchParams = useSearchParams();
  const variant = searchParams.get('variant') || 'a';

  if (variant === 'b' || variant === 'holo') {
    return <VariantB />;
  }

  if (variant === 'c' || variant === 'gold') {
    return <VariantC />;
  }

  if (variant === 'd' || variant === 'cv') {
    return <VariantD />;
  }

  // Default to A (Creator)
  return <VariantA />;
}

export default function LandingPage() {
  // Initialize Smooth Scroll globally for the landing page
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureDirection: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Suspense fallback={<div style={{ height: '100vh', background: '#000' }}></div>}>
      <LandingPageContent />
    </Suspense>
  );
}
