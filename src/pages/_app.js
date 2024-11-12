import '@/styles/globals.css';
import '@/styles/reset.css';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return (
      <>
        <Head>
          {/*<link rel="icon" href="/Logo.svg" />*/}
        </Head>
        <Component {...pageProps} />
      </>
  )
}