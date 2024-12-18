import styles from "./BoxSkelet.module.css";

export function BoxSkelet() {
    return (
        <div>
            <li className={styles.boxItem}>
                <div className={styles.boxInfo}>
                    <div
                        className={`${styles.skeletonImage} ${styles.skeleton}`}
                    ></div>
                    <p
                        className={`${styles.skeletonName} ${styles.skeleton}`}
                    ></p>
                </div>
                <div className={styles.boxPrice}>
                    <h3
                        className={`${styles.skeletonPrice} ${styles.skeleton}`}
                    ></h3>
                    <button
                        className={`${styles.skeletonButton} ${styles.skeleton}`}
                    ></button>
                </div>
            </li>
        </div>
    );
}
