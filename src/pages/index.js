import MainLayout from "@/layouts/main.layout"
import Head from 'next/head';

export default function HomePage() {

  return (
      <>
        <Head>
          <title>Тайный санта | Главная страница</title>
          <meta name="description" content="" />
        </Head>
        <MainLayout>
            <p>Hello World</p>
        </MainLayout>
      </>
  )
}
