import { useEffect, useState } from "react";
import axios from "axios";
import config from "@/pages/api/config";
import styles from './Box.module.css';
import BoxImage from '@/assets/img/Box.png';
import Image from "next/image";
import Link from "next/link";
import Preloader from "@/components/Preloader";
import Cookies from "js-cookie";

// Общий компонент для работы с боксовыми страницами
const BoxList = ({ apiEndpoint, title }) => {
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inCart, setInCart] = useState({});

    // Загружаем боксы
    useEffect(() => {
        const fetchBoxes = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/${apiEndpoint}`);
                setBoxes(response.data);
            } catch (err) {
                setError('Ошибка при загрузке боксов');
            } finally {
                setLoading(false);
            }
        };

        fetchBoxes();
    }, [apiEndpoint]);

    // Функция добавления товара в корзину
    const addToCart = async (id) => {
        try {
            const token = Cookies.get('token'); // Получаем токен из cookies или другого места хранения
            await axios.post(
                `${config.apiUrl}/cart/add/${id}`,
                { box_id: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedCart = { ...inCart, [id]: true };
            setInCart(updatedCart);
        } catch (err) {
            console.error('Ошибка при добавлении товара в корзину:', err);
        }
    };

    if (loading) return <Preloader />;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            <h2>{title}</h2>
            <ul className={styles.boxContent}>
                {boxes.map(box => (
                    <li key={box.id} className={styles.boxItem}>
                        <Link href={`/boxes/${box.id}`}>
                            <div className={styles.boxInfo}>
                                <Image src={BoxImage} alt={box.name} />
                                <p>{box.name}</p>
                                <h3>{box.price} ₽</h3>
                            </div>
                        </Link>
                        <button
                            className="btn"
                            onClick={() => addToCart(box.id)}
                        >
                            {inCart[box.id] ? "В корзине" : "Купить"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export function OurBoxes() {
    return (
        <div className="box">
            <BoxList apiEndpoint="boxes" title="Наши боксы" />
        </div>
    );
}

export function OurBoxesNew() {
    return <BoxList apiEndpoint="boxes-new" title="Новые боксы" />;
}
