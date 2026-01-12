// src/components/FadeSection.jsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './FadeSection.module.css';

const FadeSection = ({ children }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        threshold: 1,
        triggerOnce: false,
    });

    return (
        <motion.div
            ref={ref}
            className={styles.fade_section}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
            {children}
        </motion.div>
    );
};

export default FadeSection;
