import Head from 'next/head';
import '../styles/globals.scss';

function App({ Component, pageProps }) {
  return (
    <div className="text-base text-gray-900">
      <Head>
        <title>Youtube Downloader</title>
        <meta property="og:title" content="TFG" key="title" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default App;
