import Head from 'next/head';
import '../styles/globals.scss';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Downtube</title>
        <meta property="og:title" content="TFG" key="title" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default App;
