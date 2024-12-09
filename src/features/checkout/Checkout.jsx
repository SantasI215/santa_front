import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Preloader from "@/components/Preloader";
import { useRouter } from "next/router";
import config from "@/pages/api/config";
import styles from "./Checkout.module.css";

export default function Checkout() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ address: "", payment_method: "card" });

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            alert("Вы не авторизованы. Пожалуйста, войдите в аккаунт.");
            router.push("/login");
        }
    }, []);

    useEffect(() => {
        const fetchCheckoutData = async () => {
            try {
                const token = Cookies.get("token");
                const { data } = await axios.get(`${config.apiUrl}/checkout`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCartItems(data.cart_items);
                setTotalPrice(data.total_price);
            } catch (error) {
                console.error("Ошибка загрузки данных оформления заказа:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCheckoutData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get("token");
            await axios.post(
                `${config.apiUrl}/place-order`,
                form,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Заказ успешно оформлен!");
            router.push("/profile");
        } catch (error) {
            console.error("Ошибка оформления заказа:", error);
            alert("Ошибка оформления заказа");
        }
    };

    if (loading) return <Preloader />;

    return (
        <div className="container">
            <div className={styles.checkout}>
                <h2>Оформление заказа</h2>
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>
                            {item.box.name} - {item.quantity} шт.
                        </li>
                    ))}
                </ul>
                <p>Итого: {totalPrice} ₽</p>
                <form onSubmit={handleSubmit}>
                    <label className={styles.adress}>
                        Адрес доставки:
                        <input
                            type="text"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            className={styles.input}
                            style={{ width: `${Math.max(20, form.address.length * 1.2)}ch` }}
                            required
                        />
                    </label><br />
                    <label>
                        Метод оплаты:
                        <select
                            value={form.payment_method}
                            onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                        >
                            <option value="card">Карта</option>
                            <option value="cash">Наличные</option>
                        </select>
                    </label><br />
                    <button type="submit">Оформить заказ</button>
                </form>
            </div>
        </div>
    );
}
