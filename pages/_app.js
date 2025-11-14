// pages/_app.js
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <div className="page-root">
      <Component {...pageProps} />
    </div>
  );
}
