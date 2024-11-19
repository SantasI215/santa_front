import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import config from '@/pages/api/config';

const Dashboard = () => {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = Cookies.get('token'); 

            if (!token) {
                router.push('/auth/login'); 
                return;
            }

            try {
                const response = await axios.get(`${config.apiUrl}/admin/orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Ошибка при получении заказов:', error);
                router.push('/auth/login'); 
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <h1>Административная панель</h1>
            <h2>Список заказов</h2>
            <ul>
                {orders.map((item) => (
                    <li key={item.id}>
                        Заказ №
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
