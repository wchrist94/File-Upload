import "../../styles/globals.css";
import Navbar from "../../components/Navbar";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div style={{ backgroundImage: `url("/background.jpg")`, backgroundSize: 'cover', minHeight: '100vh' }}>  
        <Navbar />
        <Component {...pageProps} />
    </div>
  );
}