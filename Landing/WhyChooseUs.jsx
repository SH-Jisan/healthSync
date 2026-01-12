import React from 'react';
import styles from './WhyChooseUs.module.css';

const WhyChooseUs = () => {
    return(
        <>
            <div className={styles.line_container}>
                <div className={styles.line}></div>
            </div>


                <div className={styles.main_container}>
                    <strong>Why choose us?</strong>
                    <div className={styles.boxes_container}>

                        <div className={styles.box}>✅ Certified Safety</div>
                        <div className={styles.box}>🚚 Nationwide Delivery</div>
                        <div className={styles.box}>📦 Easy Returns</div>
                        <div className={styles.box}>💬 24/7 Support</div>
                    </div>
                </div>

        </>
    );
}

export default WhyChooseUs;