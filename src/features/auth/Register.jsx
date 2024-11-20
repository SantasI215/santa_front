import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import styles from './Auth.module.css';
import Image from "next/image";
import Logo from '@/assets/img/Logo.svg';
import config from '@/pages/api/config';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const response = await axios.post(`${config.apiUrl}/register`, formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            alert('Успешная регистрация');
            router.push('/auth/login');
        }
        catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: 'Произошла непредвиденная ошибка' });
            }
        }
    }

    const logIn = () => {
        router.push("/auth/login");
    }

    return (
        <div className="register container">
            <form onSubmit={handleSubmit} className={styles.authForm}>
                <h2>Регистрация</h2>
                <div className={styles.authItem}>
                    <label>Имя</label>
                    <input
                        type="text"
                        name="name"
                        onChange={handleChange}
                        placeholder="Имя"
                        required
                    />
                    {errors.name && <p style={{color: 'red'}}>{errors.name[0]}</p>}
                </div>
                <div className={styles.authItem}>
                    <label>Почта</label>
                    <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        placeholder="Почта"
                        required
                    />
                    {errors.email && <p style={{color: 'red'}}>{errors.email[0]}</p>}
                </div>
                <div className={styles.authItem}>
                    <label>Пароль</label>
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        placeholder="Пароль"
                        required
                    />
                    {errors.password && <p style={{color: 'red'}}>{errors.password[0]}</p>}
                </div>
                <div className={styles.authItem}>
                    <label>Подтвердите пароль</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        onChange={handleChange}
                        placeholder="Подтвердите пароль"
                        required
                    />
                    {errors.password_confirmation && <p style={{color: 'red'}}>{errors.password_confirmation[0]}</p>}
                </div>
                <button type="submit" className="btn">Регистрация</button>
                <div className={styles.authButtonSwap}>
                    <button onClick={logIn}>Или вход</button>
                </div>
                {errors.general && (
                    <div style={{color: 'red', marginTop: '10px'}}>
                        <p>{errors.general}</p>
                    </div>
                )}
            </form>
        </div>
    )
}