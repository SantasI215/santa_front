import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '@/pages/api/config';
import styles from './../Admin.module.css';

const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/admin/orders`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className={styles.content}>
            <h2>Список заказов</h2>
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
                            <div>
                                <p>Детали заказа:</p>
                                <div className={styles.orderItems}>
                                    {order.order_items && order.order_items.length > 0 ? (
                                        order.order_items.map((item) => (
                                            <div key={item.id} className={styles.orderCard}>
                                                <p><strong>Бокс: </strong> {item.box_id}</p>
                                                <p><strong>Количество: </strong> {item.quantity}</p>
                                                <p><strong>Цена: </strong> {item.price}₽</p>
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

export default OrdersManagement;
