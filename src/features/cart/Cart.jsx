import Image from "next/image"
import styles from "./Cart.module.css";
import Gift from "@/assets/img/Giftexample.png";
import Bascket from "@/assets/img/Bascket.svg";
export default function Cart() {
    return (
        <div className={styles.cart}>
            <div className="container">
                <h1>Ваша корзина</h1>
                <div className={styles.product}>
                    <Image src={Gift} alt='' />
                    <div className={styles.nameprice}>
                        <h2>Мегабокс</h2>
                        <h3>5990 P</h3>
                    </div>
                    <div className={styles.bascket}>
                        <Image src={Bascket} />
                    </div>
                </div>
            </div>
        </div>
    );
}