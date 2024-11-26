import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '@/pages/api/config';
import Preloader from '@/components/Preloader';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = Cookies.get('token');
                const { data } = await axios.get(`${config.apiUrl}/orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(data.orders);
            } catch (error) {
                console.error('Ошибка загрузки заказов:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <Preloader />;

    return (
        <div className="orders">
            {orders.map(order => (
                <div key={order.id} className="order">
                    <h3>Заказ #{order.id}</h3>
                    <p>Статус: {order.status}</p>
                    <p>Сумма: {order.total_price} ₽</p>
                    <p>Адрес: {order.address}</p>
                    <p>Метод оплаты: {order.payment_method === 'card' ? 'Карта' : 'Наличные'}</p>
                    <h4>Товары:</h4>
                    <ul>
                        {order.items.map(item => (
                            <li key={item.id}>
                                <p>{item.box.name}</p>
                                <p>Количество: {item.quantity}</p>
                                <p>Цена за штуку: {item.box.price} ₽</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
