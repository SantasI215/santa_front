import MainLayout from "@/layouts/main.layout"
import Head from 'next/head';
import OurBoxes from "@/features/ourBoxes/OurBoxes";

export default function HomePage() {

    return (
        <>
            <Head>
                <title>Тайный санта | Наши боксы</title>
                <meta name="description" content="" />
            </Head>
            <MainLayout>
                <OurBoxes />
            </MainLayout>
        </>
    )
}