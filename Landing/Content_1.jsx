import React from 'react';
import styles from './Content_1.module.css';

const Content_1 = () =>{
    return(
        <>
            <div className={styles.main_container}>
                <div className={styles.upperPart}>
                    <div className={styles.leftImg_box}>
                        <div className={styles.leftImg}/>
                        <div className={styles.leftDiamond}/>
                    </div>
                </div>
                <div className={styles.lowerPart}>
                    <div className={styles.rightImg_box}>
                        <div className={styles.rightImg}/>
                        <div className={styles.rightDiamond}/>
                    </div>
                </div>
            </div>
        </>
    );
}


export default Content_1;