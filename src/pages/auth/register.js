import MainLayout from "@/layouts/main.layout"
import Head from 'next/head';
import Register from "@/features/auth/Register";

export default function HomePage() {

    return (
        <>
            <Head>
                <title>Тайный Санта | Регистрация</title>
                <meta name="description" content="" />
            </Head>
            <MainLayout>
                <Register />
            </MainLayout>
        </>
    )
}
