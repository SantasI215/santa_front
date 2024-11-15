import styles from './MainScreen.module.css';

export default function Home() {
    return (
        <div className={styles.container}>
            <div className={styles.homescreen}>
                <div className={styles.overlay}>
                    <h1 className={styles.subtitle}>МАГАЗИН СЮРПРИЗОВ</h1>
                    <h2 className={styles.title}>Подготовься к предстоящему празднику</h2>
                    <p className={styles.description}>Соберем для Вас готовые боксы, чтобы порадовать ваших родных и близких!</p>
                    <a href="" className={styles.buttonMain}>Заказать</a>
                </div>
            </div>
        </div>
    );
}
