import styles from './MainScreen.module.css';

export default function Home() {
    return (
        <div className={styles.homescreen}>
            <div className={styles.overlay}>
                <h1 className={styles.subtitle}>МАГАЗИН СЮРПРИЗОВ</h1>
                <h2 className={styles.title}>ТАЙНЫЙ САНТА</h2>
                <p className={styles.description}>Создайте подарок мечты</p>
            </div>
        </div>
    );
}
