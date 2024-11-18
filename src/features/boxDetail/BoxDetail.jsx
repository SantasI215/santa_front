import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import config from "@/pages/api/config";
import styles from './BoxDetail.module.css'
import Image from "next/image";
import Box from '@/assets/img/Box.png'

export default function BoxDetail() {
    const [box, setBox] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const {id} = router.query;

    const fetchBox = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/boxes/${id}`);
            setBox(response.data);
        } catch (err) {
            setError('Ошибка при загрузке данных бокса');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchBox();
        }
    }, [id]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!box) {
        return <div>Такого бокса не существует</div>;
    }

    return (
        <div className="box-detail">
            <div className="container">
                <h2>{box.name}</h2>
                <div className={styles.boxDetailContent}>
                    <div className={styles.boxDetailImage}>
                        <Image src={Box} alt="" />
                    </div>
                    <div className={styles.boxDetailText}>
                        <div className={styles.boxDetailTextContent}>
                            <p>Описание:</p>
                            <p>{box.description}</p>
                        </div>
                        <div className={styles.boxDetailTextContent}>
                            <p>Цена:</p>
                            <p>{box.price} ₽</p>
                        </div>
                        <div className={styles.boxDetailTextContent}>
                            <p>Что внутри?</p>
                            <ul>
                                {box.items && box.items.length > 0 ? (
                                    box.items.map((item) => (
                                        <li key={item.id}>
                                            {item.name} - {item.pivot.quantity}шт.
                                            <strong> Категория:</strong> {item.category ? item.category.name : 'Без категории'}
                                        </li>
                                    ))
                                ) : (
                                    <li>Нет товаров</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}