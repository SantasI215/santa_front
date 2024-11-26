import MainLayout from "@/layouts/main.layout"
import Head from 'next/head';
import Checkout from "@/features/checkout/Checkout";

export default function HomePage() {
    return (
        <>
            <Head>
                <title>Тайный санта | Оформление заказа</title>
                <meta name="description" content="" />
            </Head>
            <MainLayout>
                <Checkout />
            </MainLayout>
        </>
    )
}
