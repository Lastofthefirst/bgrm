import CaseComponent from './components/case/CaseComponent';
import React from 'react';
import './App.css';

function App() {

  let meta = {
    url: "https://lastofthefirst.github.io/bgrm/",
    metaImg: 'https://ridvan.org/meta.jpg',
    description: "Free in browser background removal for your images.",
    title: "Background removal - Ridván - Software Consultancy",
  }

    return (
    <div className="App">
      <head>
        <title>Background removal - Ridván - Software Consultancy</title>
      <link
          rel="alternate"
          type="application/rss+xml"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/rss/feed.xml`}
        />
        <meta name="description" content={meta.description}></meta>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={meta.url} />
        {/* <link rel="apple-touch-icon" href="/rose.svg"></link> */}
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <html dir="ltr" lang="en"></html>
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meta.url} />
        <meta property="og:title" content={"Background removal - Ridván - Software Consultancy"} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:site_name" content={"Background removal - Ridván - Software Consultancy"} />
        <meta property="og:locale" content="en_US" />
        <meta itemProp="image" content={meta.metaImg} />
        <meta name="twitter:image" content={meta.metaImg} />
        <meta name="image" property="og:image" content={meta.metaImg} />
        
        {/* <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630"></meta> */}

        <meta name="twitter:card" content={meta.description} />
        {/* <meta name="twitter:site" content="@site_account" />
      <meta name="twitter:creator" content="@individual_account" /> */}
        <meta name="twitter:url" content={meta.url} />
        <meta name="twitter:title" content={"Background removal - Ridván - Software Consultancy"} />
        <meta name="twitter:description" content={meta.description} />
        <script
          async
          defer
          data-domain={'https://lastofthefirst.github.io/bgrm/'}
          src="https://stats.ridvan.org/js/plausible.js"
        ></script>
      </head>
      <CaseComponent />
    </div>
  );
}

export default App;
