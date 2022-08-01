//Libraries
import { useEffect } from 'react';
//Context
import AuthContext from '../context/AuthContext';
//Next components
import Head from 'next/head';
//Material UI
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
//Amplify
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';
import Header from '../components/Header';
Amplify.configure({ ...awsconfig, ssr: true });

export default function MyApp({ Component, pageProps }: any) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);
  return (
    <>
      <Head>
        <title>Reddit clone</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <AuthContext>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Header />
          <Component {...pageProps} />
        </ThemeProvider>
      </AuthContext>
    </>
  );
}
