import {useEffect, useState} from "react";
import axios from "axios";
import config from "@/pages/api/config";
import styles from './OurBoxesNew.module.css'
import Box from '@/assets/img/Box.png'
import Image from "next/image";

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

    if (loading) {
        return <div>Загрузка...</div>;
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
                        <li key={box.id} className={styles.ourBoxesNewItem}>
                            <Image src={Box} alt={box.name} />
                            <p>{box.name}</p>
                            <h3>{box.price} ₽</h3>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}