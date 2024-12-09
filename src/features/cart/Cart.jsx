import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "./Cart.module.css";
import Preloader from "@/components/Preloader";
import config from "@/pages/api/config";
import Cookies from "js-cookie";
import BoxImage from "@/assets/img/Box.png";
import BasketIcon from "@/assets/img/Basket.svg";
import { useRouter } from "next/router";

export default function Cart() {
    const router = useRouter();
    const [cartData, setCartData] = useState(null); // Данные корзины
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // Загрузка данных корзины
    useEffect(() => {
        const fetchCartData = async () => {
            setLoading(true);
            setErrorMessage(""); // Сброс ошибки перед загрузкой

            try {
                const { data } = await axios.get(`${config.apiUrl}/cart`, {
                    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
                });
                setCartData(data); // Сохраняем весь ответ от API
            } catch (error) {
                console.error("Ошибка загрузки корзины:", error);
                setErrorMessage("Не удалось загрузить корзину. Попробуйте позже.");
            } finally {
                setLoading(false);
            }
        };

        fetchCartData();
    }, []);

    // Удаление элемента из корзины
    const removeItemFromCart = async (cartItemId) => {
        try {
            await axios.delete(`${config.apiUrl}/cart/remove/${cartItemId}`, {
                headers: { Authorization: `Bearer ${Cookies.get("token")}` },
            });
            // Перезагрузка корзины после удаления
            const { data } = await axios.get(`${config.apiUrl}/cart`, {
                headers: { Authorization: `Bearer ${Cookies.get("token")}` },
            });
            setCartData(data);
        } catch (error) {
            console.error("Ошибка при удалении товара:", error);
            setErrorMessage("Не удалось удалить товар. Попробуйте снова.");
        }
    };

    // Обработка перехода к оформлению заказа
    const handleCheckout = () => {
        if (!cartData?.cart_items?.length) {
            alert("Корзина пуста. Добавьте товары перед оформлением.");
            return;
        }
        router.push("/checkout");
    };

    // Отображение загрузки, ошибки или пустой корзины
    if (loading) return <Preloader />;
    if (errorMessage) return <div className="error">{errorMessage}</div>;
    if (!cartData?.cart_items?.length) return <div className="empty"><p>Корзина пуста</p></div>;

    const { cart_items: cartItems, total_price: totalPrice, /*total_quantity: totalQuantity*/ } = cartData;

    return (
        <div className="cart">
            <div className="container">
                <h2>Ваша корзина</h2>
                <div className={styles.cartContent}>
                    <div className={styles.cartProducts}>
                        {cartItems.map(({ box, id }) => (
                            <div key={id} className={styles.cartItem}>
                                <Image src={BoxImage} alt={box?.name || "Товар"} width={100} height={100} />
                                <div className={styles.cartInfo}>
                                    <h2>{box?.name || "Название недоступно"}</h2>
                                    <h3>{box?.price ? `${box.price} ₽` : "Цена недоступна"}</h3>
                                </div>
                                <button className={styles.cartButton} onClick={() => removeItemFromCart(id)}>
                                    <Image src={BasketIcon} alt="Удалить товар" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <form className={styles.cartOrder}>
                        <h2>Оформление заказа</h2>
                        <div className={styles.cartOrderInfo}>
                            <p>Общая стоимость: {totalPrice} ₽</p>
                        </div>
                        <button type="button" className="btn" onClick={handleCheckout}>Оформить заказ</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
