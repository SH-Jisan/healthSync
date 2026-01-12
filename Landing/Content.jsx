import React from 'react';
import styles from './Content.module.css';
import { motion } from 'framer-motion';

const Content = ({ show }) => {
    return (
        <motion.div
            className={styles.gradient_box}
            initial={{ opacity: 0 }}
            animate={show ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
            {show && (
                <>
                <div className={styles.content_container}>
                    <section className={styles.hero}>
                        <motion.h1
                            initial={{ opacity: 0, y: -500 }}
                            animate={{ opacity: 1, y: -50 }}
                            transition={{ duration: 1 }}
                        >
                            <div className={styles.stockx}>StockX</div>
                            A Safe & Trusted Gas Appliances Marketplace
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1 , y: -50}}
                            transition={{ delay: 0.8 }}
                        >
                            Buy and sell gas cylinders, stoves & accessories — fast, safe, and hassle-free.
                        </motion.p>

                        <motion.div
                            className={styles.ctaButtons}
                            initial={{ opacity: 0, y:-50 }}
                            animate={{ opacity: 1, y: -50 }}
                            transition={{ delay: 1.2 }}
                        >
                            <button className={styles.primaryBtn}>Shop Now</button>
                            <button className={styles.secondaryBtn}>Become a Seller</button>
                        </motion.div>

                    </section>
                </div>
        </>
            )}
        </motion.div>
    );
};

export default Content;