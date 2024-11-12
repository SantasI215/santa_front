import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import config from '@/pages/api/config';
import Image from 'next/image';
import Head from "next/head";
import MainLayout from "@/layouts/main.layout";
import LoadingAbsolute from "@/components/LoadingAbsolute";
import styles from "@/styles/[id].module.css";
import Profile from '@/assets/img/Profile.svg'
import More from '@/assets/img/More.svg';

const PortfolioDetail = () => {
    const router = useRouter();
    const { id } = router.query; // Получаем id из параметров маршрута
    const [portfolioItem, setPortfolioItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            const fetchPortfolioItem = async () => {
                try {
                    const response = await axios.get(`${config.apiUrl}/portfolio/${id}`);
                    setPortfolioItem(response.data);
                } catch (err) {
                    setError('Не удалось загрузить детали портфолио');
                } finally {
                    setLoading(false);
                }
            };

            fetchPortfolioItem();
        }
    }, [id]);

    if (loading) return <LoadingAbsolute />;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <>
            <Head>
                <title>{portfolioItem ? portfolioItem.title : 'Портфолио'}</title>
                <meta name="description" content={portfolioItem ? portfolioItem.description : ''} />
            </Head>
            <MainLayout>
                {portfolioItem ? (
                    <div className="portfolio container">
                        <div className={styles.portfolioUserContent}>
                            <div className={styles.portfolioUserImage}>
                                <a href={portfolioItem.website_url} target="_blank" rel="noopener noreferrer">
                                    <div className={styles.portfolioUserImageLogo}>
                                        <div>
                                            <Image src={More} alt="Перейти на сайт"/>
                                            <p>Перейти на сайт</p>
                                        </div>
                                    </div>
                                    <Image src={portfolioItem.image_url} alt={portfolioItem.title} width={1920} height={1080}/>
                                </a>
                            </div>
                            <div className={styles.portfolioUserBlock}>
                                <div className={styles.portfolioUserInfo}>
                                    <h1>{portfolioItem.title}</h1>
                                    <p className={styles.portfolioUserDesc}>{portfolioItem.description}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Портфолио не найдено.</p>
                )}
            </MainLayout>
        </>
    );
};

export default PortfolioDetail;
