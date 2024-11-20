import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import config from '@/pages/api/config';
import Preloader from '@/components/Preloader';
import Cookies from "js-cookie";
import styles from './Profile.module.css';

export default function Profile() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = Cookies.get('token');

            if (!token) {
                router.push('/auth/login');
                return;
            }

            try {
                const { data } = await axios.get(`${config.apiUrl}/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUserData(data);

                if (data.role === 'admin') {
                    router.push('/admin/dashboard');
                }
            } catch (err) {
                setError('Ошибка при авторизации. Пожалуйста, войдите заново.');
                Cookies.remove('token');
                router.push('/auth/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    if (loading) return <Preloader />;
    if (error) return <div>{error}</div>;
    if (!userData) return null;

    return (
        <div className="profile">
            <div className="container">
                <div className={styles.profileContent}>
                    <div className={styles.profileInfo}>
                        <h2>Профиль</h2>
                        <p>Ваше имя: {userData.name}</p>
                        <p>Ваша почта: {userData.email}</p>
                    </div>
                    <div className={styles.profileOrder}>
                        <h2>Заказы</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};