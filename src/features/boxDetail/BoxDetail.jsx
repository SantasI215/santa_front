import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import config from "@/pages/api/config";
import styles from './BoxDetail.module.css';
import Image from "next/image";
import BoxImage from '@/assets/img/Box.png';
import Preloader from "@/components/Preloader";

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
        return <Preloader />;
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
                        <Image src={BoxImage} alt={box.name} />
                    </div>
                    <div className={styles.boxDetailText}>
                        <div className={styles.boxDetailTextContent}>
                            <p><strong>Описание:</strong></p>
                            <p>{box.description}</p>
                        </div>
                        <div className={styles.boxDetailTextContent}>
                            <p><strong>Цена:</strong></p>
                            <p>{box.price} ₽</p>
                        </div>
                        <div className={styles.boxDetailTextContent}>
                            <p><strong>Что внутри:</strong></p>
                            <ul>
                                {box.items.map(item => (
                                    <li key={item.id}>
                                        <p><strong>{item.name}</strong> - {item.pivot.quantity} шт.</p>
                                        {item.categories && item.categories.length > 0 && (
                                            <p>
                                                Категории: {item.categories.map(category => category.name).join(', ')}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
