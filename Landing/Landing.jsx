/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Landing.module.css';
import Navbar from './Navbar.jsx';
import Content from './Content.jsx';
import logoImage from './Stock_x_logo_2.png';
import Footer from './Footer.jsx'
import { getLogoAnimation, initialLogoPosition } from './logoAnimation.js';
import Brands from './Brands.jsx'
import ToShopButton from './ToShopButtons.jsx';
import WhyChooseUs from "./WhyChooseUs.jsx";


const Landing = () => {
    const [animationComplete, setAnimationComplete] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 500);
        handleResize();
        window.addEventListener('resize', handleResize);

        const timer = setTimeout(() => setAnimationComplete(true), 200);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div className={styles.logo_container}>
                <motion.img
                    src={logoImage}
                    alt="Logo"
                    className={styles.logo}
                    initial={initialLogoPosition}
                    animate={getLogoAnimation(animationComplete, isMobile)}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
            </div>
            <div className={styles.content_container}>
                {animationComplete && <Navbar />}
                {animationComplete && <Content show={animationComplete} />}
                {animationComplete && <Brands show={animationComplete} />}
                {animationComplete && <WhyChooseUs show={animationComplete} />}
                {animationComplete && <ToShopButton show={animationComplete} />}
                {animationComplete && <Footer show={animationComplete} />}
            </div>
        </>
    );
};

export default Landing;