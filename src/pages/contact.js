import MainLayout from "@/layouts/main.layout"
import Head from 'next/head';
import Footer from '@/features/footer/Footer';

export default function Contact() {

    return (
        <>
            <Head>
                <title>Тайный санта | Контакты</title>
                <meta name="description" content="" />
            </Head>
            <MainLayout>
                <Footer />
            </MainLayout>
        </>
    )
}