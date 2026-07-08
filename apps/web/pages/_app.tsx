import type { AppProps } from "next/app";
import "../src/styles/landingAtmosphere.css";
import "../src/styles/landingTurquoiseCards.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
