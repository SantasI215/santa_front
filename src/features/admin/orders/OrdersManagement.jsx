import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '@/pages/api/config';
import styles from './../Admin.module.css';
import { useRouter } from 'next/router';

const OrdersManagement = () => {
    const router = useRouter();
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderItems();
    }, []);

    const fetchOrderItems = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/collector/order-items`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setOrderItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching order items:', error);
            setLoading(false);
        }
    };

    const handleGoToAssembly = async (itemId) => {
        try {
            await axios.patch(
                `${config.apiUrl}/collector/order-items/${itemId}/assign-collector`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                }
            );
            router.push(`/admin/box-assembly/${itemId}`);
        } catch (error) {
            if (error.response?.status === 403) {
                alert(error.response.data.error || 'Этот бокс уже собирается другим пользователем.');
            } else {
                console.error('Ошибка при назначении сборщика:', error);
            }
        }
    };


    const getCollectorName = (name) => {
        return name === null ? "Никто еще не собирает этот бокс" : "Вы уже собрали этот бокс";
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className={styles.content}>
            <h2>Список доступных к сборке боксов</h2>
            <div className={styles.orderItemsContent}>
                {orderItems.length > 0 ? (
                    orderItems.map((item) => (
                        <div key={item.id} className={styles.orderItem}>
                            <div className={styles.orderItemInfo}>
                                <p><span>Статус: </span>{item.status}</p>
                                <p><span>Название: </span> {item.box?.name}</p>
                                <p><span>Цена: </span> {item.price}₽</p>
                                <p><span>{getCollectorName(item.collector_name)}</span></p>
                            </div>
                            <button
                                className="btn"
                                onClick={() => handleGoToAssembly(item.id)}
                            >
                            {item.status === 'Собран' ? 'Просмотр содержимого' : 'Перейти к сборке'}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Нет товаров в сборке.</p>
                )}
            </div>
        </div>
    );
};

export default OrdersManagement;
