import MainLayout from "@/layouts/main.layout"
import Head from 'next/head';
import BoxDetail from "@/features/boxDetail/BoxDetail";

export default function HomePage() {

    return (
        <>
            <Head>
                <title>Тайный санта | Подробнее</title>
                <meta name="description" content="" />
            </Head>
            <MainLayout>
                <BoxDetail />
            </MainLayout>
        </>
    )
}
