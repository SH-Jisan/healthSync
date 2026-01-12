import React, { useState } from "react";
import styles from "./Brands.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import brand_logo from "../assets/react.svg";

function Brands() {
    const boxes = Array.from({ length: 24 }, (_, i) => i + 1);
    const visibleCount = 6;
    const scrollStep = 2;
    const boxWidth = 180 - 80; // 180px width + 10px gap
    const [startIndex, setStartIndex] = useState(0);

    const maxIndex = boxes.length - visibleCount;

    const handleRight = () => {
        if (startIndex + scrollStep > maxIndex) {
            setStartIndex(0);
        } else {
            setStartIndex(startIndex + scrollStep);
        }
    };

    const handleLeft = () => {
        if (startIndex - scrollStep < 0) {
            setStartIndex(maxIndex);
        } else {
            setStartIndex(startIndex - scrollStep);
        }
    };

    return (
        <div className={styles.main_container}>
            <h2 className={styles.h2}>We collab with the best LPG brands in Bangladesh</h2>

            <div className={styles.brandLogo_container}>
                <button className={styles.navButton} onClick={handleLeft}>
                    <FaChevronLeft />
                </button>

                <div className={styles.gridWrapper}>
                    <motion.div
                        className={styles.innerTrack}
                        animate={{ x: -startIndex * boxWidth }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        {boxes.map((num, index) => (
                            <div
                                key={num}
                                className={`${styles.box} ${index % 2 === 1 ? styles.secondRow : ''}`}
                            >
                                <img src = {brand_logo[num]} className={styles.images} alt={"Logo"} />
                            </div>
                        ))}
                    </motion.div>
                </div>

                <button className={styles.navButton} onClick={handleRight}>
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
}

export default Brands;
