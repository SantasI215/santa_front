import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '@/pages/api/config';
import styles from './../Admin.module.css';
import { useRouter } from 'next/router';

const HistoryOrdersManagement = () => {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/admin/orders`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
                params: { order_id: searchId },
            });
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchOrders(searchId);
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getCollectorName = (name) => {
        return name === null ? "Никто не собирает" : `Собрал: ${name}`;
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className={styles.content}>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Введите номер заказа"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className={styles.searchInput}
                />
                <button onClick={handleSearch} className={`btn ${styles.searchButton}`}>Найти</button>
            </div>
            <h2>История заказов</h2>
            <div className={styles.gridContainer}>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <p>Заказ #{order.id}</p>
                                <span className={styles.status}>{order.status}</span>
                            </div>
                            <div className={styles.orderUser}>
                                <p><span>От пользователя:</span> {order.user.name} ({order.user.email})</p>
                                <p><span>Куда:</span> {order.address}</p>
                            </div>
                            <div className={styles.orderInfo}>
                                <p><span>Дата:</span> {formatDate(order.created_at)}</p>
                                <p><span>Сумма заказа:</span> {order.total_price}₽</p>
                                <p><span>Способ оплаты:</span> {order.payment_method}</p>
                            </div>
                            <div className={styles.orderBoxesContent}>
                                <p>Детали заказа:</p>
                                <div className={styles.orderItems}>
                                    {order.order_items && order.order_items.length > 0 ? (
                                        order.order_items.map((item) => (
                                            <div key={item.id} className={styles.orderItem}>
                                                <p><span>Статус: </span>{item.status}</p>
                                                <p><span>{getCollectorName(item.collector_name)}</span></p>
                                                <p><span>Название: </span> {item.box.name}</p>
                                                <p><span>Цена: </span> {item.price}₽</p>
                                                {item.status === "Собран" && (
                                                    <div className={styles.boxButtons}>
                                                        <button
                                                            className="btn"
                                                            onClick={() => router.push(`/admin/box-assembly/${item.id}`)}
                                                        >
                                                            Просмотр
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p>Нет товаров в заказе.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Заказы отсутствуют.</p>
                )}
            </div>
        </div>
    );
};

export default HistoryOrdersManagement;
