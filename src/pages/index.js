import MainLayout from "@/layouts/main.layout"
import Head from 'next/head';
import Banner from "@/features/banner/Banner";
import OurBoxesNew from "@/features/ourBoxesNew/OurBoxesNew";
import CreateBox from "@/features/createBox/CreateBox";

export default function HomePage() {

  return (
      <>
        <Head>
          <title>Тайный санта | Главная страница</title>
          <meta name="description" content="" />
        </Head>
        <MainLayout>
            <Banner />
            <OurBoxesNew />
            <CreateBox />
        </MainLayout>
      </>
  )
}
