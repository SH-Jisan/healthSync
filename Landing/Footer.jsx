import React from "react";
import styles from "./Footer.module.css";
import { motion } from "framer-motion";

const Footer = () => {
    return (
        <motion.footer
            className={styles.footer}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
        >
            <div className={styles.container}>

                {/* Brand Section */}
                <motion.div
                    className={styles.brand}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className={styles.logo}>StockX Team</h2>
                    <p>Crafting code with creativity.</p>
                </motion.div>

                {/* Navigation Links */}
                {/*<motion.div*/}
                {/*    className={styles.links}*/}
                {/*    initial={{ opacity: 0 }}*/}
                {/*    whileInView={{ opacity: 1 }}*/}
                {/*    transition={{ delay: 0.3 }}*/}
                {/*>*/}
                {/*    <a href="/">Home</a>*/}
                {/*    <a href="/about">About</a>*/}
                {/*    <a href="/projects">Projects</a>*/}
                {/*    <a href="/contact">Contact</a>*/}
                {/*</motion.div>*/}

                {/* Contact Info */}
                {/*<motion.div*/}
                {/*    className={styles.contact}*/}
                {/*    initial={{ opacity: 0 }}*/}
                {/*    whileInView={{ opacity: 1 }}*/}
                {/*    transition={{ delay: 0.4 }}*/}
                {/*>*/}
                {/*    <p>📧 <a href="mailto:contact@yourmail.com">contact@yourmail.com</a></p>*/}
                {/*    <p>📍 Dhaka, Bangladesh</p>*/}
                {/*</motion.div>*/}

                {/* Social Media */}
                {/*<motion.div*/}
                {/*    className={styles.socials}*/}
                {/*    initial={{ opacity: 0 }}*/}
                {/*    whileInView={{ opacity: 1 }}*/}
                {/*    transition={{ delay: 0.5 }}*/}
                {/*>*/}
                {/*    <a href="https://github.com/yourusername" target="_blank" rel="noreferrer">GitHub</a>*/}
                {/*    <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer">LinkedIn</a>*/}
                {/*    <a href="https://twitter.com/yourusername" target="_blank" rel="noreferrer">Twitter</a>*/}
                {/*</motion.div>*/}
            </div>

            {/* Copyright */}
            <motion.div
                className={styles.copyright}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <p>© 2025 Jisan. All rights reserved.</p>
            </motion.div>
        </motion.footer>
    );
};

export default Footer;
