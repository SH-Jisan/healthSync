import React from 'react';
import styles from './ToShopButtons.module.css';

const ToShopButtons = () => {
    return(
        <>
            <div className={styles.line_container}>
                <div className={styles.line}></div>
            </div>
            <div className={styles.main_container}>
                <strong>Browser out products by category!</strong>

                <div className={styles.button_container}>
                    <button>Gas Cylinders</button>
                    <button>Gas Stoves</button>
                    <button>Regulators</button>
                    <button>Accessories</button>
                </div>

            </div>
        </>
    );
}



export default ToShopButtons;