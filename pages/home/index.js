import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Playlist from "@/components/playlist";
import Image from "next/image";
import getAccessToken from "@/functions/getAccessToken";

async function loadPlaylists({ next, items }, temp) {
  temp = [...temp, ...items];

  if (next) {
    const response = await fetch(next, {
      headers: {
        Authorization: "Bearer " + localStorage.accessToken,
      },
    });
    const body = await response.json();
    return await loadPlaylists({ tracks: body }, temp);
  } else {
    return temp;
  }
}

export default function Home() {
  const [playlists, setPlaylists] = useState();
  const [vertical, setVertical] = useState();
  const [theme, setTheme] = useState();
  const [open, setOpen] = useState(false);
  const menu = useRef();

  const router = useRouter();

  useEffect(() => {
    if (!localStorage.accessToken) router.replace("/");
    else {
      setVertical(innerHeight > innerWidth);

      setTheme(localStorage.theme || "blue");

      onresize = (e) => {
        setVertical(innerHeight > innerWidth);
      };

      getAccessToken((accessToken) => {
        fetch("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        })
          .then((response) => response.json())
          .then((body) => {
            if (body.error) {
              console.error(body.error_description);
            } else {
              loadPlaylists(body, []).then(setPlaylists);
            }
          });
      });
    }
  }, [router]);

  useEffect(() => {
    if (open) menu.current.style.height = "60px";
    else menu.current.style.height = "0px";
  }, [open]);

  useEffect(() => {
    switch (theme) {
      case "blue":
        break;
    }
  }, [theme]);

  return (
    <>
      <Head>
        <title>Página Inicial - Spotify Helper 2.0</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <div className="header">
          <div className="left">
            <div
              className="button"
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("expiresAt");
                router.replace("/");
              }}
            >
              {vertical ? (
                <Image src="/logout.svg" alt="logout" width={25} height={25} />
              ) : (
                <Image src="/logout.svg" alt="logout" width={40} height={40} />
              )}
            </div>
          </div>
          <div className="center">
            <div className="title">Spotify Helper</div>
          </div>
          <div className="right">
            <div className="button" onClick={() => setOpen((prev) => !prev)}>
              {vertical ? (
                <Image
                  src="/ellipsis.svg"
                  alt="ellipsis"
                  width={25}
                  height={25}
                />
              ) : (
                <Image
                  src="/ellipsis.svg"
                  alt="ellipsis"
                  width={40}
                  height={40}
                />
              )}
            </div>
          </div>
          <div className="menu" ref={menu}></div>
        </div>
        <div className={styles.body}>
          {playlists?.map((playlist) => (
            <Playlist playlist={playlist} key={playlist.id} />
          ))}
        </div>
      </div>
    </>
  );
}
