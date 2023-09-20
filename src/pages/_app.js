import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../styles/theme";
import { AppBar, Toolbar } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Link from "next/link";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Receipts Parser</title>
      </Head>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <AppBar position="relative">
          <Toolbar>
            <ReceiptIcon sx={{ mr: 2 }} />
            <Link
              href="/"
              style={{
                fontSize: "20px",
                textDecoration: "none",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Receipts Parser
            </Link>
          </Toolbar>
        </AppBar>
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: theme.spacing(2),
          }}
        >
          <Component {...pageProps} />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default MyApp;
