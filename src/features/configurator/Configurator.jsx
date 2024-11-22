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
    const [generatedBox, setGeneratedBox] = useState(null);
    const [error, setError] = useState(null);

    const token = Cookies.get("token");

    // Загружаем категории с бэкенда
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/categories`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    },
                );
                setCategories(response.data);
            } catch (err) {
                setError("Ошибка при загрузке категорий");
            }
        };

        fetchCategories();
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${config.apiUrl}/configurator/generate`, {
                    amount: amount,
                    categories: selectedCategories
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

            setGeneratedBox(response.data.box);
        } catch (err) {
            setError("Ошибка при генерации бокса");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (box) => {
        try {
            const token = Cookies.get('token');
            await axios.post(
                `${config.apiUrl}/cart/add`,
                {
                    box: {
                        id: box.id,
                        items: box.items.map(item => ({
                            id: item.id,
                            quantity: item.quantity
                        }))
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Бокс добавлен в корзину!");
        } catch (err) {
            setError("Ошибка при добавлении в корзину");
        }
    };

    return (
        <div className="configurator">
            <div className="container">
                <h2>Конфигуратор подарка</h2>
                {loading && <Preloader />}
                {error && <div className="error">{error}</div>}
                {!generatedBox ? (
                    <form onSubmit={handleGenerate} className={styles.configuratorForm}>
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
                        <button type="submit" className="btn">Сгенерировать</button>
                    </form>
                ) : (
                    <div className={styles.generatedBox}>
                        <h3>{generatedBox.name}</h3>
                        <p>Цена: {generatedBox.price} ₽</p>
                        <ul>
                            {generatedBox.items.map((item) => (
                                <li key={item.id}>{item.name} - {item.price} ₽</li>
                            ))}
                        </ul>
                        <button
                            className="btn"
                            onClick={() => handleAddToCart(generatedBox.id)}
                        >
                            Добавить в корзину
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
