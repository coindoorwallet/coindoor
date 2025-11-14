// pages/index.js
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

const COIN_IDS = ["bitcoin", "ethereum", "solana", "ripple"]; // XRP = ripple

function formatZAR(value) {
  try {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return "R " + Number(value).toFixed(2);
  }
}

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchPrices() {
    setLoading(true);
    setError(null);
    try {
      const ids = COIN_IDS.join(",");
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=zar&ids=${ids}&sparkline=true&price_change_percentage=24h`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("CoinGecko error");
      const json = await res.json();
      setCoins(json);
    } catch (e) {
      console.error(e);
      setError("Could not load live prices. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPrices();
    const t = setInterval(fetchPrices, 30000); // refresh every 30s
    return () => clearInterval(t);
  }, []);

  return (
    <main className="page-root">
      {/* NAV */}
      <nav className="site-nav">
        <div className="nav-left">
          <a href="#home" className="logo-wrap" aria-label="CoinDoor home">
            <img src="/coindoor-10.png" alt="CoinDoor" className="logo" />
          </a>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#markets">Markets</a>
          <a href="#learn">Learn</a>
          <a href="#news">News</a>
          <a href="#podcast">Podcast</a>
          <a href="#subscribe" className="subscribe-pill">Subscribe</a>
        </div>
      </nav>

      {/* HERO */}
      <header id="home" className="hero">
        <div className="hero-inner">
          <h1 className="hero-title gradient-text">Enter The Market.</h1>
          <p className="hero-sub">Digital Assets. Explained Simply.</p>

          <div className="hero-ctas">
            <a href="#learn" className="btn btn-ghost">Learn the basics</a>
            <a href="#markets" className="btn btn-primary">See Live Prices</a>
          </div>
        </div>
      </header>

      {/* MARKETS */}
      <section id="markets" className="section container">
        <div className="section-head">
          <h2>Live Market Prices (ZAR)</h2>
          <div className="muted">Updated every 30s · Source: CoinGecko</div>
        </div>

        {loading ? (
          <div className="grid-coins">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-skeleton" />
            ))}
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="grid-coins">
            {coins.map((c) => {
              // use last 20 points for sparkline (if available)
              const spark = (c.sparkline_in_7d?.price || []).slice(-20);
              const sparkData = spark.length
                ? spark.map((p, i) => ({ x: i, pv: p }))
                : [{ x: 0, pv: c.current_price }, { x: 1, pv: c.current_price }];

              return (
                <article key={c.id} className="coin-card">
                  <div className="coin-top">
                    <img src={c.image} alt={c.name} className="coin-img" />
                    <div className="coin-meta">
                      <div className="coin-symbol">{c.symbol.toUpperCase()}</div>
                      <div className="coin-name">{c.name}</div>
                    </div>
                  </div>

                  <div className="coin-bottom">
                    <div>
                      <div className="coin-price">{formatZAR(c.current_price)}</div>
                      <div className={`coin-change ${c.price_change_percentage_24h >= 0 ? "up" : "down"}`}>
                        {c.price_change_percentage_24h?.toFixed(2)}%
                      </div>
                    </div>

                    <div className="spark-wrap" aria-hidden>
                      <ResponsiveContainer width="100%" height={60}>
                        <LineChart data={sparkData}>
                          <Line type="monotone" dataKey="pv" stroke="#00FF99" strokeWidth={2} dot={false} />
                          <XAxis hide />
                          <YAxis hide />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* NEWS */}
      <section id="news" className="section container">
        <h3>News</h3>
        <p className="muted">Personalised, curated headlines for the coins you follow. (Feed integration coming next.)</p>
        <div className="grid-news">
          <article className="news-card">Sample news item — headline + short summary + source</article>
          <article className="news-card">Sample news item — headline + short summary + source</article>
          <article className="news-card">Sample news item — headline + short summary + source</article>
        </div>
      </section>

      {/* PODCAST */}
      <section id="podcast" className="section container">
        <h3>Podcast</h3>
        <p className="muted">Short interviews & explainers — watch directly on the site.</p>
        <div className="podcast-embed">
          <iframe
            title="CoinDoor Podcast"
            src="https://www.youtube.com/embed/videoseries?list=PL_REPLACE_WITH_YOUR_PLAYLIST_ID"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section id="subscribe" className="section subscribe container">
        <h4>Subscribe — R59 / month</h4>
        <p className="muted">Get personalised news, deeper guides, and member-only content.</p>
        <a className="btn btn-primary" href="#subscribe">Subscribe Now</a>
      </section>

      <footer className="site-footer">
        <div>© {new Date().getFullYear()} CoinDoor — Digital Assets. Explained Simply.</div>
      </footer>
    </main>
  );
}
