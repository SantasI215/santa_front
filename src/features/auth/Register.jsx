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
            <div className={styles.authContent}>
                <div className={styles.authForm}>
                    <form onSubmit={handleSubmit}>
                        <h2>Регистрация</h2>
                        <input
                            type="text"
                            name="name"
                            onChange={handleChange}
                            placeholder="Имя"
                            required
                        />
                        {errors.name && <p style={{ color: 'red' }}>{errors.name[0]}</p>}
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            placeholder="Почта"
                            required
                        />
                        {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            placeholder="Пароль"
                            required
                        />
                        {errors.password && <p style={{ color: 'red' }}>{errors.password[0]}</p>}
                        <input
                            type="password"
                            name="password_confirmation"
                            onChange={handleChange}
                            placeholder="Подтвердите пароль"
                            required
                        />
                        {errors.password_confirmation && <p style={{ color: 'red' }}>{errors.password_confirmation[0]}</p>}
                        <button type="submit" className="btn">Регистрация</button>
                    </form>
                    <div className={styles.authButtonSwap}>
                        <button onClick={logIn} className="btn">Или вход</button>
                    </div>
                    {errors.general && (
                        <div style={{color: 'red', marginTop: '10px' }}>
                            <p>{errors.general}</p>
                        </div>
                    )}
                </div>
                <div className={styles.authImage}>
                    <Image src={Logo} alt="Logo" />
                </div>
            </div>
        </div>
    )
}