import Head from 'next/head';
import '../styles/globals.scss';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Downtube</title>
        <meta property="og:title" content="Downtube" key="title" />
        <meta property="og:description" content="Download Youtube videos in the highest quality without ads" key="description" />
        <meta property="og:image" content="./images/metaimage.png" key="image" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default App;
