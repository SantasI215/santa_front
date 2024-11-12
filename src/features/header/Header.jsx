import React from 'react';

export default function Header() {
    return (
        <header style={headerStyle}>
            <nav style={navStyle}>
                <a href="/" style={linkStyle}>Главная</a>
                <a href="/gifts" style={linkStyle}>Подарки</a>
                <a href="/auth/register" style={linkStyle}>Регистрация</a>
                <a href="/auth/login" style={linkStyle}>Авторизация</a>
            </nav>
        </header>
    );
}

const headerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#1e3a8a', // темно-синий фон
};

const navStyle = {
    display: 'flex',
    gap: '20px',
};

const linkStyle = {
    color: '#fff', // белый текст
    textDecoration: 'none',
    fontSize: '1.2em',
    fontWeight: 'bold',
};

