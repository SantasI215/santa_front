import {useEffect, useState} from "react";
import axios from "axios";
import config from "@/pages/api/config";
import styles from './OurBoxes.module.css'
import Box from '@/assets/img/Box.png'
import Image from "next/image";

export default function OurBoxes() {
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Функция для загрузки боксов
    const fetchBoxes = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/boxes`);
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
        <div className="our-boxes">
            <div className="container">
                <h2>Наши боксы</h2>
                <ul className={styles.ourBoxesContent}>
                    {boxes.map(box => (
                        <li key={box.id} className={styles.ourBoxesItem}>
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