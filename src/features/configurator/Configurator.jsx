import { useState, useEffect } from "react";
import axios from "axios";
import config from "@/pages/api/config";
import styles from "./Configurator.module.css";
import Preloader from "@/components/Preloader";
import Cookies from "js-cookie";

export default function Configurator() {
    const [categories, setCategories] = useState([]);
    const [amount, setAmount] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = Cookies.get("token");

    // Загружаем категории с бэкенда
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/categories`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(response.data);
            } catch (err) {
                setError("Ошибка при загрузке категорий");
            }
        };

        fetchCategories();
    }, []);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `${config.apiUrl}/configurator/create-and-add`,
                {
                    amount,
                    categories: selectedCategories,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Бокс создан и добавлен в корзину!");
        } catch (err) {
            setError("Ошибка при создании и добавлении бокса в корзину");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="configurator">
            <div className="container">
                <h2>Конфигуратор подарка</h2>
                {loading && <Preloader />}
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleAddToCart} className={styles.configuratorForm}>
                    <div className={styles.configuratorItem}>
                        <label>Укажите сумму, на которую должно соответствовать содержимое подарка</label>
                        <input
                            type="number"
                            min={0}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className={styles.configuratorItem}>
                        <label>Выберите категории, которые должны быть в подарке</label>
                        {categories.map((category) => (
                            <div key={category.id} className={styles.configuratorCheckbox}>
                                <input
                                    type="checkbox"
                                    value={category.id}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        setSelectedCategories((prev) =>
                                            e.target.checked
                                                ? [...prev, value]
                                                : prev.filter((id) => id !== value)
                                        );
                                    }}
                                />
                                <label>{category.name}</label>
                            </div>
                        ))}
                    </div>
                    <button type="submit" className="btn">Добавить в корзину</button>
                </form>
            </div>
        </div>
    );
}
