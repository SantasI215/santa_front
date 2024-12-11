// pages/auth/login.js
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from 'js-cookie';

import styles from './Auth.module.css';
import config from "@/pages/api/config";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        try {
            const response = await axios.post(`${config.apiUrl}/login`, formData, {
                headers: { 'Content-Type': 'application/json' },
            });
    
          
            Cookies.set('token', response.data.token, { expires: 7 });
            alert('Успешный вход!');

            
            if (response.data.user.role === 'admin' || response.data.user.role === 'collector') {
                router.push('/admin/dashboard');  
            } else {
                router.push('/');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Неправильный email или пароль');
            } else {
                setError('Произошла ошибка. Попробуйте позже.');
            }
        }
    };

    const logIn = () => {
        router.push("/auth/register");
    };

    return (
        <div className="register container">
            <form onSubmit={handleSubmit} className={styles.authForm}>
                <h2>Вход</h2>
                <div className={styles.authItem}>
                    <label>Почта</label>
                    <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        placeholder="Введите свою почту"
                        required
                    />
                </div>
                <div className={styles.authItem}>
                    <label>Пароль</label>
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        placeholder="Введите свой пароль"
                        required
                    />
                </div>
                <button type="submit" className="btn">Вход</button>
                <div className={styles.authButtonSwap}>
                    <button onClick={logIn}>Или регистрация</button>
                </div>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>
        </div>
    );
}
