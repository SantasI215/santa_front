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

            
            if (response.data.user.role === 'admin') {
                router.push('/admin/dashboard');  
            } else {
                router.push('/profile');  
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
            <div className={styles.authContent}>
                <div className={styles.authForm}>
                    <form onSubmit={handleSubmit}>
                        <h2>Вход</h2>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            placeholder="Почта"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            placeholder="Пароль"
                            required
                        />
                        <button type="submit" className="btn">Вход</button>
                    </form>
                    <div className={styles.authButtonSwap}>
                        <button onClick={logIn} className="btn">Или регистрация</button>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </div>
        </div>
    );
}
