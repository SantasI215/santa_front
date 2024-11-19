// pages/profile.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import config from '@/pages/api/config';
import Preloader from '@/components/Preloader';

const Profile = () => {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            router.push('/auth/login'); 
        } else {
            axios.get(`${config.apiUrl}/user`, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
                .then(response => {
                    setUserData(response.data);
                    setLoading(false);
                    
                    if (response.data.role === 'admin') {
                        router.push('/admin/dashboard'); 
                    }
                })
                .catch(err => {
                    setError('Ошибка при авторизации. Пожалуйста, войдите заново.');
                    setLoading(false);
                    localStorage.removeItem('token'); 
                    router.push('/auth/login');
                });
        }
    }, [token, router]);

    if (loading) {
        return <Preloader />;
    }

    if (error) {
        return <div>{error}</div>; 
    }

    return (
        <div>
            <h1>Профиль пользователя</h1>
            <p>Добро пожаловать, {userData.name}!</p>
            <p>Email: {userData.email}</p>
        </div>
    );
};

export default Profile;
