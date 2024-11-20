import MainLayout from "@/layouts/main.layout"
import Head from 'next/head';
import Profile from "@/features/profile/Profile";

export default function HomePage() {

    return (
        <>
            <Head>
                <title>Тайный санта | Профиль</title>
                <meta name="description" content="" />
            </Head>
            <MainLayout>
                <Profile />
            </MainLayout>
        </>
    )
}
