import React, {useEffect, useContext, useState} from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../theme';
import createEmotionCache from '../createEmotionCache';
import ResponsiveAppBar from "src/components/layout/ResponsiveAppBar";
import Footer from "src/components/layout/Footer";
import "../public/static/css/style.css";
import favicon from "../public/static/favicon.ico";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
// import { AppProvider} from '../state/app';
import Web3Context, { Web3Provider } from 'src/context/Web3Context';
import { pageview } from 'src/lib/gtag';
export default function MyApp(props) {
    const [isFirstLoading, setIsFirstLoading] = useState(true);
    const [windowObj, setWindowObj] = useState(null);
    useEffect(() => {
        if (isFirstLoading) {
            setIsFirstLoading(false);
            setWindowObj(window);
        }

    }, [isFirstLoading, windowObj])

    useEffect(() => {
        const handleRouteChange = url => {
            pageview(url, document.title);
        };
        props.router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            props.router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, []);

    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
    return (

            <CacheProvider value={emotionCache}>

                <Head>
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                    <link rel="shortcut icon" href={favicon.src} />
                    <meta name={"title"} title={"NFT Marketplace"}/>
                    <title>NFT Marketplace</title>
                </Head>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <main>
                        { windowObj && <Web3Provider>
                            <ResponsiveAppBar/>
                            <Component {...pageProps} />
                            <Footer />
                            </Web3Provider>
                        }
                    </main>
                </ThemeProvider>

            </CacheProvider>
    );
}