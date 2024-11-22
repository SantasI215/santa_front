import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import config from '@/pages/api/config';
import Preloader from '@/components/Preloader';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        Cookies.remove('token');
        router.push('/auth/login');
    };

    const deleteUser = async (id) => {
        try {
            const response = await axios.delete(`${config.apiUrl}/admin/users/${id}/delete`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });

            console.log('User deleted:', response.data);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error.response || error.message);
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`${config.apiUrl}items/${id}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });

            console.log(`Товар с ID ${id} удален`);
            setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        } catch (error) {
            console.error(`Ошибка при удалении товара с ID ${id}:`, error.response || error.message);
        }
    };

    const editItem = (id) => {
        console.log(`Редактировать товар с ID ${id}`);
        // Реализуйте переход на страницу редактирования или модальное окно
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get('token');

            if (!token) {
                router.push('/auth/login');
                return;
            }

            try {
                const userResponse = await axios.get(`${config.apiUrl}/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserData(userResponse.data);

                const usersResponse = await axios.get(`${config.apiUrl}/admin/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(usersResponse.data);

                const itemsResponse = await axios.get(`${config.apiUrl}/items`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setItems(itemsResponse.data);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
                router.push('/auth/login');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) return <Preloader />;

    return (
        <div className={styles.dashboard}>
            <h2>Профиль администратора</h2>
            <div className={styles.profileInfo}>
                {userData && (
                    <>
                        <p>Ваше имя: {userData.name}</p>
                        <p>Ваша почта: {userData.email}</p>
                        <p>Ваш ID: {userData.id}</p>
                        <p>Ваш статус: {userData.role}</p>
                        <button onClick={handleLogout} className="btn">
                            Выйти
                        </button>
                    </>
                )}
            </div>

            <h2>Список пользователей</h2>
            <div className={styles.usersList}>
                <table className={styles.usersTable}>
                    <thead>
                        <tr>
                            <th>Имя</th>
                            <th>Почта</th>
                            <th>Действия</th>
                            <th>Роль</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {!user.isAdmin && (
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="btn"
                                            disabled={user.role === 'admin'}
                                        >
                                            Удалить
                                        </button>
                                    )}
                                </td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h2>Список товаров</h2>
            <div className={styles.usersList}>
                <table className={styles.usersTable}>
                    <thead>
                        <tr>
                            <th>Название товара</th>
                            <th>Описание</th>
                            <th>Цена</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{item.price}</td>
                                <td>
                                    <button onClick={() => editItem(item.id)} className="btn">
                                        Редактировать
                                    </button>
                                    <button onClick={() => deleteItem(item.id)} className="btn">
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;