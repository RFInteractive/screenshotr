import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";

import websites from "../lib/websites";

export default function Home() {
  const [status, setStatus] = useState("start");

  const fetchScreenshots = async () => {
    setStatus("loading");
    try {
      await fetch("/api/hello");
      setStatus("complete");
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <section className={styles.topBar}>
          <h1>Screenshotr</h1>
        </section>
        <section className={styles.container}>
          {status === "loading" && showLoading()}
          {status === "start" && showButton(fetchScreenshots)}
          {status === "complete" && showImages(fetchScreenshots)}
          {status === "error" && showError(status)}
        </section>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://rankfuse.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <Image
            src="/rank-fuse-logo.png"
            alt="Vercel Logo"
            width={150}
            height={52}
          />
        </a>
      </footer>
    </div>
  );
}

const showLoading = () => {
  return <h2>Sending request...</h2>;
};

const showError = (status) => {
  return (
    <>
      <h2>Something appears to have gone wrong</h2>
      <p>{status}</p>
    </>
  );
};

const showButton = (fetchScreenshots) => {
  return (
    <button className={styles.screenshotBtn} onClick={fetchScreenshots}>
      Screenshot Our Sites
    </button>
  );
};

const showImages = (fetchScreenshots) => {
  return (
    <div className={styles.imagesContainer}>
      {websites.map((website) => {
        return (
          <div key={website.domain}>
            <div className={styles.websiteImages}>
                  <div key={website.name}>
                  <h2>{website.domain}</h2>
                    <a href={website.url} target="_blank">
                      <img
                        src={`/static/screenshots/${website.directoryName}/${website.name}.png`}
                      />
                    </a>
                    <h3>{website.name}</h3>
                    <h4>
                      <a href={website.url} target="_blank">
                        {website.url}{" "}
                      </a>
                    </h4>
                  </div>
            </div>
          </div>
        );
      })}
      <button
        className={`${styles.screenshotBtn} ${styles.screenshotBtnFixed}`}
        onClick={fetchScreenshots}
      >
        Re-run Screenshots
      </button>
    </div>
  );
};
