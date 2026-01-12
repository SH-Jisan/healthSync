import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { ShieldCheck, Heartbeat, Drop, Brain } from 'phosphor-react';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import React from "react";
import styles from './LandingPage.module.css';

export default function LandingPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            {/* Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <ShieldCheck size={32} weight="fill" />
                    {t('common.health_sync', 'HealthSync')}
                </div>

                <div className={styles.navActions}>
                    {/* Language Toggle */}
                    <LanguageSwitcher variant="text" />

                    {/* Login */}
                    <button
                        onClick={() => navigate('/login')}
                        className={styles.loginBtn}
                    >
                        {t('common.login', 'Login')}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className={styles.hero}>
                <h1 className={styles.heroTitle}>
                    <Trans i18nKey="landing.hero_title">
                        Your Personal <span className={styles.heroHighlight}>AI Health</span>{' '}
                        Assistant
                    </Trans>
                </h1>

                <p className={styles.heroDesc}>
                    {t(
                        'landing.hero_desc',
                        'Manage medical records, consult AI doctors, find blood donors, and book appointments - all in one place.'
                    )}
                </p>

                <button
                    onClick={() => navigate('/login')}
                    className={styles.ctaBtn}
                >
                    {t('landing.get_started', 'Get Started Now')}
                </button>
            </header>

            {/* Features Grid */}
            <section className={styles.featuresGrid}>
                <FeatureCard
                    icon={<Brain size={32} color="#7E22CE" />}
                    title={t('landing.feature_ai', 'AI Doctor')}
                    desc={t(
                        'landing.feature_ai_desc',
                        'Instant symptom analysis and triage using advanced Gemini AI.'
                    )}
                    bg="#F3E8FF"
                />

                <FeatureCard
                    icon={<Heartbeat size={32} color="#059669" />}
                    title={t('landing.feature_timeline', 'Medical Timeline')}
                    desc={t(
                        'landing.feature_timeline_desc',
                        'Keep track of your history. Upload reports and let AI organize them.'
                    )}
                    bg="#D1FAE5"
                />

                <FeatureCard
                    icon={<Drop size={32} color="#DC2626" />}
                    title={t('landing.feature_blood', 'Blood Bank')}
                    desc={t(
                        'landing.feature_blood_desc',
                        'Real-time blood requests and donor connecting system.'
                    )}
                    bg="#FEE2E2"
                />
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <p className={styles.copyright}>
                    {t(
                        'landing.footer',
                        '© 2024 HealthSync Inc. Better Healthcare for Everyone.'
                    )}
                </p>
            </footer>
        </div>
    );
}

// Feature Card Component
interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
    bg: string;
}

function FeatureCard({ icon, title, desc, bg }: FeatureCardProps) {
    return (
        <div className={styles.featureCard}>
            <div
                className={styles.featureIcon}
                style={{ background: bg }}
            >
                {icon}
            </div>
            <h3 className={styles.featureTitle}>{title}</h3>
            <p className={styles.featureDesc}>
                {desc}
            </p>
        </div>
    );
}
