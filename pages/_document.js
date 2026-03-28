import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0A0906" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="findafiend" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta property="og:site_name" content="findafiend.com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="findafiend — community rides" />
        <meta property="og:description" content="Real rides for the blocks Uber forgot. Cash only. No surge pricing." />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="findafiend.com" />
        <meta name="twitter:description" content="Real rides. Real cheap. No Uber bs." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}