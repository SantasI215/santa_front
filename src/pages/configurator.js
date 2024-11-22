import MainLayout from "@/layouts/main.layout"
import Head from 'next/head';
import Configurator from "@/features/configurator/Configurator";

export default function Contact() {

    return (
        <>
            <Head>
                <title>Тайный санта | Конфигуратор</title>
                <meta name="description" content="" />
            </Head>
            <MainLayout>
                <Configurator />
            </MainLayout>
        </>
    )
}