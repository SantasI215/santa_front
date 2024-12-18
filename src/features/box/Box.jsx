// BoxList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import config from "@/pages/api/config";
import styles from './Box.module.css';
import Filters from './../filters/Filters';
import BoxImage from '@/assets/img/Box.png';
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import PreloaderRelative from "@/components/PreloaderRelative";
import api from "js-cookie";

const BoxList = ({ apiEndpoint, title }) => {
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inCart, setInCart] = useState([]); // Список ID добавленных боксов
    const [filteredBoxes, setFilteredBoxes] = useState([]); // Отфильтрованные боксы

    useEffect(() => {
        const fetchBoxes = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/${apiEndpoint}`);
                setBoxes(response.data);
                setFilteredBoxes(response.data); // Изначально все боксы отображаются
            } catch (err) {
                setError('Ошибка при загрузке боксов');
            } finally {
                setLoading(false);
            }
        };

        fetchBoxes();
    }, [apiEndpoint]);

    const addToCart = async (id) => {
        try {
            const token = Cookies.get('token');

            const response = await axios.post(
                `${config.apiUrl}/cart/add/${id}`,
                { box_id: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Успешно!");
            if (response.status === 200 && response.data.cartItemId) {
                setInCart([...inCart, response.data.cartItemId]);
            }
        } catch (err) {
            console.error('Ошибка при добавлении товара в корзину:', err);
            setError('Не удалось добавить товар в корзину');
        }
    };

    useEffect(() => {
        console.log(boxes); // Проверяем, что данные содержат поле categories
    }, [boxes]);

    const handleFilterChange = async (selectedCategories) => {
        try {
            const params = selectedCategories.length > 0
                ? { categories: selectedCategories.join(",") }
                : {};

            const response = await axios.get(`${config.apiUrl}/${apiEndpoint}`, { params });

            setFilteredBoxes(response.data);
        } catch (error) {
            console.error("Ошибка при фильтрации боксов:", error);
        }
    };


    if (loading) return <PreloaderRelative />;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            <h2>{title}</h2>
            <div className={apiEndpoint === "new-boxes" ? styles.box : styles.boxWrapper}>
                {apiEndpoint !== "new-boxes" && (
                    <div className={styles.filtersBlock}>
                        <Filters
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                )}
                <ul className={styles.boxContent}>
                    {filteredBoxes.map(box => (
                        <li key={box.id} className={styles.boxItem}>
                            <Link href={`/boxes/${box.id}`}>
                                <div className={styles.boxInfo}>
                                    <Image
                                        src={box.image ? `${config.url}/storage/${box.image}` : BoxImage}
                                        alt={box.name}
                                        width={200}
                                        height={200}
                                    />
                                    <p>{box.name}</p>
                                </div>
                            </Link>
                            <div className={styles.boxPrice}>
                                <h3>{box.price} ₽</h3>
                                <button
                                    className="btn"
                                    onClick={() => addToCart(box.id)}
                                >
                                    Купить
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default BoxList;

export function OurBoxes() {
    return (
        <div className="box">
            <BoxList apiEndpoint="index-all" title="Наши боксы"/>
        </div>
    );
}

export function OurBoxesNew() {
    return <BoxList apiEndpoint="new-boxes" title="Новые боксы"/>;
}