import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import config from '@/pages/api/config';
import Preloader from '@/components/Preloader';
import styles from './../Admin.module.css';
import UsersManagement from '@/features/admin/users/UsersManagement';
import ItemsManagement from '@/features/admin/items/ItemsManagement';
import CategoriesManagement from '@/features/admin/categories/CategoriesManagement';
import BoxesManagement from '@/features/admin/boxes/BoxesManagement';
import OrdersManagement from "@/features/admin/orders/OrdersManagement";
import HistoryOrdersManagement from "@/features/admin/historyOrders/HistoryOrdersManagement";
import HomePage from "@/pages/index.js";
import Link from "next/link";

const Dashboard = () => {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeComponent, setActiveComponent] = useState('profile');

    useEffect(() => {
        const checkUserRole = async () => {
            if (userData?.role === 'user') {
                await router.push("/");
            }
        };
        checkUserRole();
    }, [userData]);

    const handleLogout = async () => {
        try {
            await axios.post(`${config.apiUrl}/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            Cookies.remove('token');
            router.push('/auth/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/user`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                });
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'history-orders':
                return <HistoryOrdersManagement />;
            case 'users':
                return <UsersManagement />;
            case 'items':
                return <ItemsManagement />;
            case 'categories':
                return <CategoriesManagement />;
            case 'boxes':
                return <BoxesManagement />;
            case 'home-page':
                return <HomePage />;
            case 'orders':
                if (userData?.role === 'collector') {
                    return <OrdersManagement />;
                } else {
                    return <p>У вас нет доступа к заказам.</p>;
                }
            default:
                return (
                    <>
                        <h2>Профиль администратора</h2>
                        {userData && (
                            <div className={styles.userInfo}>
                                <p><strong>Имя:</strong> {userData.name}</p>
                                <p><strong>Email:</strong> {userData.email}</p>
                                <p><strong>Вы:</strong> {userData.role}</p>
                                <button className="btn" onClick={handleLogout}>Выйти</button>
                            </div>
                        )}
                    </>
                );
        }
    };

    if (loading) {
        return <Preloader />;
    }

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.sidebar}>
                <button
                    className={`${styles.navButton} ${activeComponent === 'profile' ? styles.active : ''}`}
                    onClick={() => setActiveComponent('profile')}
                >
                    Профиль
                </button>
                {userData?.role === 'admin' && (
                    <button
                        className={`${styles.navButton} ${activeComponent === 'users' ? styles.active : ''}`}
                        onClick={() => setActiveComponent('users')}
                    >
                        Пользователи
                    </button>
                )}
                {userData?.role === 'admin' && (
                    <button
                        className={`${styles.navButton} ${activeComponent === 'items' ? styles.active : ''}`}
                        onClick={() => setActiveComponent('items')}
                    >
                        Товары
                    </button>
                )}
                {userData?.role === 'admin' && (
                    <button
                        className={`${styles.navButton} ${activeComponent === 'categories' ? styles.active : ''}`}
                        onClick={() => setActiveComponent('categories')}
                    >
                        Категории
                    </button>
                )}
                {userData?.role === 'admin' && (
                    <button
                        className={`${styles.navButton} ${activeComponent === 'boxes' ? styles.active : ''}`}
                        onClick={() => setActiveComponent('boxes')}
                    >
                        Боксы
                    </button>
                )}
                {userData?.role === 'admin' && (
                    <button
                        className={`${styles.navButton} ${activeComponent === 'history-orders' ? styles.active : ''}`}
                        onClick={() => setActiveComponent('history-orders')}>
                        История заказов
                    </button>
                )}
                {userData?.role === 'admin' && (
                    <button className={`${styles.navButton} ${activeComponent === 'home-page' ? styles.active : ''}`}>
                        <Link href='/'>
                            Вернуться к сайту
                        </Link>
                    </button>
                )}
                {userData?.role === 'collector' && (
                    <button
                        className={`${styles.navButton} ${activeComponent === 'orders' ? styles.active : ''}`}
                        onClick={() => setActiveComponent('orders')}
                    >
                        Заказы
                    </button>
                )}
            </div>
            <div className={styles.infoContainer}>
                {renderComponent()}
            </div>
        </div>
    );
};

export default Dashboard;
