import { useEffect, useState } from "react";
import axios from "axios";
import config from "@/pages/api/config";
import styles from './OurBoxesNew.module.css'
import Box from '@/assets/img/Box.png'
import Image from "next/image";
import Link from "next/link";
import Preloader from "@/components/Preloader";

export default function OurBoxesNew() {
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Функция для загрузки боксов
    const fetchBoxes = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/boxes-new`);
            setBoxes(response.data);
        } catch (err) {
            setError('Ошибка при загрузке боксов');
        } finally {
            setLoading(false);
        }
    };

    // Загружаем данные при монтировании компонента
    useEffect(() => {
        fetchBoxes();
    }, []);

    const [inCart, setInCart] = useState({}); // Для отслеживания состояния корзины для каждого бокса

    const toggleCart = (id) => {
        setInCart(prevState => ({
            ...prevState,
            [id]: !prevState[id] // Меняем состояние (если было в корзине, убираем, если нет - добавляем)
        }));
    };

    if (loading) {
        return <Preloader />;
    }

    if (error) {
        return <div>{error}</div>
    }

    return (
        <div id="our-boxes">
            <div className="container">
                <h2>Новые боксы</h2>
                <ul className={styles.ourBoxesNewContent}>
                    {boxes.map(box => (
                        <li key={box.id}>
                            <div className={styles.ourBoxesNewItem}>
                                <Link href={`/boxes/${box.id}`}>
                                    <Image src={Box} alt={box.name} />
                                    <p>{box.name}</p>
                                    <h3>{box.price} ₽</h3>
                                </Link>

                                <button
                                    className="btn"
                                    onClick={() => toggleCart(box.id)} // Изменяем состояние корзины
                                    type="button"
                                >
                                    {inCart[box.id] ? "В корзине" : "Купить"} {/* Меняем текст в зависимости от состояния */}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
