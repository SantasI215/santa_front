import NavButton from "@/components/NavButton";
import LogoFooter from "@/assets/img/LogoFooter.svg";
import Email from "@/assets/img/Email.svg";
import Tel from "@/assets/img/Tel.svg";
import Clock from "@/assets/img/Clock.svg";
import Image from 'next/image'
import styles from './Footer.module.css'
export default function Footer() {
    return (
        <footer>
            <div className="container" id="contact">
                <div className={styles.footerContent}>
                    <div className="logo">
                        <Image src={LogoFooter} alt="" />
                    </div>
                    <ul className={styles.contactsUl}>
                        <li>
                            <h4>Наши Контакты</h4>
                        </li>
                        <li>
                            <Image src={Email} alt="" />
                            <p>tayniysanta@gmail.com</p>
                        </li>
                        <li>
                            <Image src={Tel} alt="" />
                            <p>8(800)555-35-35</p>
                        </li>
                        <li>
                            <Image src={Clock} alt="" />
                            <p>Ежедневно <br />С 9:00 до 21:00</p>
                        </li>

                    </ul>
                    <ul className={styles.infoUl}>
                        <li>
                            <h4>Навигация По Сайту</h4>
                        </li>
                        <li>
                            <NavButton label="Регистрация" path="/auth/register" />
                        </li>
                        <li>
                            <NavButton label="Наши боксы" path="/our-boxes" />
                        </li>
                        <li>
                            <NavButton label="Конфигуратор" path="/configurator" />
                        </li>
                        <li>
                            <NavButton label="Корзина" path="/configurator" />
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles.copyright}>
                <p>Тайный Санта © 2024</p>
            </div>
        </footer>
    );
}