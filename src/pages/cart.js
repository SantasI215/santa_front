import MainLayout from "@/layouts/main.layout"
import Head from 'next/head';
import Cart from '@/features/cart/Cart';

export default function HomePage() {

    return (
        <>
            <Head>
                <title>Тайный санта | Корзина</title>
                <meta name="description" content="" />
            </Head>
            <MainLayout>
                <Cart />
            </MainLayout>
        </>
    )
}