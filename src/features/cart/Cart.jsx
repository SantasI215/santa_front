import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "./Cart.module.css";
import Preloader from "@/components/Preloader";
import config from "@/pages/api/config";
import Cookies from "js-cookie";
import Box from "@/assets/img/Box.png";
import Basket from "@/assets/img/Basket.svg";

export default function Cart() {
    const [cartBoxes, setCartBoxes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCartBoxes = async () => {
            try {
                const token = Cookies.get("token");
                const { data } = await axios.get(`${config.apiUrl}/cart`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCartBoxes(data);
            } catch (error) {
                console.error("Ошибка загрузки корзины:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartBoxes();
    }, []);

    // Функция для удаления товара из корзины
    const removeItemFromCart = async (cartItemId) => {
        try {
            const token = Cookies.get("token");
            await axios.delete(`${config.apiUrl}/cart/${cartItemId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Обновляем корзину после удаления товара
            setCartBoxes(cartBoxes.filter(item => item.id !== cartItemId));
        } catch (error) {
            console.error("Ошибка при удалении товара из корзины:", error);
        }
    };

    // Рассчитываем общую стоимость и количество товаров
    const totalPrice = cartBoxes.reduce(
        (sum, cartItem) => sum + cartItem.box.price * cartItem.quantity,
        0
    );

    const totalQuantity = cartBoxes.reduce(
        (sum, cartItem) => sum + cartItem.quantity,
        0
    );

    if (loading) return <Preloader />;
    if (!cartBoxes.length) return (
        <div className="empty">
            <p>Корзина пуста</p>
        </div>
    )

    return (
        <div className="cart">
            <div className="container">
                <h2>Ваша корзина</h2>
                <div className={styles.cartContent}>
                    <div className={styles.cartProducts}>
                        {cartBoxes.map(({ box, id, quantity }) => (
                            <div key={id} className={styles.cartItem}>
                                <Image
                                    src={Box}
                                    alt={box.name}
                                    width={100}
                                    height={100}
                                />
                                <div className={styles.cartInfo}>
                                    <h2>{box.name}</h2>
                                    <h3>{box.price} ₽</h3>
                                    <p>Количество: {quantity}</p>
                                </div>
                                <button className={styles.cartButton} onClick={() => removeItemFromCart(id)}>
                                    <Image src={Basket} alt=""/>
                                </button>
                            </div>
                        ))}
                    </div>
                    <form className={styles.cartOrder}>
                        <h2>Оформление заказа</h2>
                        <div className={styles.cartOrderInfo}>
                            <p>Цена:</p>
                            <p>{totalPrice} ₽</p>
                        </div>
                        <div className={styles.cartOrderInfo}>
                            <p>Количество товаров:</p>
                            <p>{totalQuantity}</p>
                        </div>
                        <button
                            type="submit"
                            className="btn"
                            onClick={(e) => {
                                e.preventDefault();
                                alert("Заказ оформлен!");
                            }}
                        >
                            Оформить заказ
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
