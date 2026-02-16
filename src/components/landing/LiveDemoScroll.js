'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/app/landing.module.css';
import { Code, Palette, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Mock Skills Data
const mockSkills = [
    { name: 'React / Next.js', level: 95 },
    { name: 'Node.js', level: 85 },
    { name: 'UI/UX Design', level: 90 },
    { name: 'GSAP Animation', level: 75 },
];

export default function LiveDemoScroll() {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax Cards
            gsap.utils.toArray(`.${styles.demoCard}`).forEach((card, i) => {
                gsap.from(card, {
                    y: 100,
                    opacity: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    }
                });
            });

            // Animate Skill Bars when visible
            gsap.utils.toArray(`.${styles.demoSkillBar}`).forEach((bar) => {
                const width = bar.dataset.width;
                gsap.to(bar, {
                    width: width + '%',
                    duration: 1.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: bar,
                        start: 'top 90%',
                    }
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className={styles.demoSection} ref={sectionRef}>
            <div className={styles.demoHeader}>
                <h2>More than just a template.</h2>
                <p>Real, interactive components that impress.</p>
            </div>

            <div className={styles.demoGrid}>
                {/* Card 1: Skills Snippet */}
                <div className={`${styles.demoCard} ${styles.cardSkills}`}>
                    <div className={styles.cardHeader}>
                        <Code size={20} className={styles.cardIcon} />
                        <h3>Professional Skills</h3>
                    </div>
                    <div className={styles.skillList}>
                        {mockSkills.map((skill) => (
                            <div key={skill.name} className={styles.demoSkillItem}>
                                <div className={styles.skillMeta}>
                                    <span>{skill.name}</span>
                                    <span>{skill.level}%</span>
                                </div>
                                <div className={styles.skillTrack}>
                                    <div
                                        className={styles.demoSkillBar}
                                        data-width={skill.level}
                                        style={{ width: '0%' }} /* Start at 0 for animation */
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card 2: Theme Customization */}
                <div className={`${styles.demoCard} ${styles.cardTheme}`}>
                    <div className={styles.cardHeader}>
                        <Palette size={20} className={styles.cardIcon} />
                        <h3>Live Theme Editor</h3>
                    </div>
                    <div className={styles.colorPalette}>
                        <div className={styles.colorCircle} style={{ background: '#8B7355' }}></div>
                        <div className={styles.colorCircle} style={{ background: '#2D1B69' }}></div>
                        <div className={styles.colorCircle} style={{ background: '#10B981' }}></div>
                        <div className={styles.colorCircle} style={{ background: '#F59E0B' }}></div>
                    </div>
                    <div className={styles.themeToggleDemo}>
                        <span>Dark Mode</span>
                        <div className={styles.fakeToggle} data-active="true">
                            <div className={styles.toggleKnob}></div>
                        </div>
                    </div>
                </div>

                {/* Card 3: Performance */}
                <div className={`${styles.demoCard} ${styles.cardPerf}`}>
                    <div className={styles.cardHeader}>
                        <Zap size={20} className={styles.cardIcon} />
                        <h3>High Performance</h3>
                    </div>
                    <div className={styles.perfMetric}>
                        <div className={styles.perfScore}>100</div>
                        <span>Performance Score</span>
                    </div>
                    <div className={styles.perfGraph}>
                        <div className={styles.bar} style={{ height: '100%' }}></div>
                        <div className={styles.bar} style={{ height: '80%' }}></div>
                        <div className={styles.bar} style={{ height: '60%' }}></div>
                        <div className={styles.bar} style={{ height: '90%' }}></div>
                        <div className={styles.bar} style={{ height: '75%' }}></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
