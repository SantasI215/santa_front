// components/Header.js
import NavButton from '@/components/NavButton';
import Logo from '@/assets/img/Logo.svg';
import Cart from '@/assets/img/Cart.svg';
import Profile from '@/assets/img/Profile.svg';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header>
            <div className="container">
                <div className="header">
                    <NavButton icon={Logo} path="/" type="image" />
                    <div className={styles.headerButtonContent}>
                        <NavButton label="Наши боксы" path="/our-boxes" />
                        <NavButton label="Конфигуратор" path="/configurator" />
                        <a className="btn-text" href="#contacts">Контакты</a>
                    </div>
                    <div className={styles.headerButtonContent}>
                        <NavButton icon={Cart} path="/cart" type="image" />
                        <NavButton icon={Profile} path="/profile" type="image" />
                    </div>
                </div>
            </div>
        </header>
    );
}
