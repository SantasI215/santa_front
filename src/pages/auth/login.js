import MainLayout from "@/layouts/main.layout"
import Head from 'next/head';
import Login from "@/features/auth/Login";
export default function HomePage() {
    return (       
        <>
            <Head>                
                <title>Тайный Санта | Вход</title>
                <meta name="description" content="" />           
            </Head>
            <MainLayout>                
                <Login />
            </MainLayout>        
        </>
    )}