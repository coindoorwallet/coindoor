
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const COIN_IDS = ["bitcoin", "ethereum", "solana", "ripple"]; // XRP is 'ripple'

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
  const [fetchError, setFetchError] = useState(null);

  async function fetchPrices() {
    setLoading(true);
    setFetchError(null);
    try {
      const ids = COIN_IDS.join(",");
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=zar&ids=${ids}&sparkline=true&price_change_percentage=24h`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch prices");
      const json = await res.json();
      setCoins(json);
    } catch (e) {
      console.error(e);
      setFetchError("Unable to load prices. Try again in a moment.");
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
    <main className="relative min-h-screen text-white overflow-hidden font-sans bg-hero">
      {/* full-page subtle neon gradient animated background */}
      <div aria-hidden className="absolute inset-0 -z-10 neon-overlay" />

      {/* navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 bg-black/20 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center gap-3">
          <img src="/coindoor-6.png" alt="CoinDoor logo" className="h-10 w-auto" />
          <span className="sr-only">CoinDoor</span>
        </div>

        <div className="hidden md:flex gap-6 text-sm uppercase tracking-wider">
          <a href="#home" className="hover:text-green-300">Home</a>
          <a href="#markets" className="hover:text-green-300">Markets</a>
          <a href="#learn" className="hover:text-green-300">Learn</a>
          <a href="#news" className="hover:text-green-300">News</a>
          <a href="#podcast" className="hover:text-green-300">Podcast</a>
          <a href="#subscribe" className="hover:text-green-300">Subscribe</a>
        </div>

        <div className="flex items-center gap-3">
          <a href="#subscribe" className="px-3 py-2 rounded-full bg-green-500 text-black font-semibold text-sm">Subscribe</a>
        </div>
      </nav>

      {/* hero */}
      <header id="home" className="relative z-10 text-center py-24 px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-white">
          Enter The Market.
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Digital Assets. Explained Simply.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a href="#learn" className="px-6 py-3 rounded-full bg-transparent border border-white/10 text-white">Learn the basics</a>
          <a href="#markets" className="px-6 py-3 rounded-full bg-green-500 text-black font-semibold">See Live Prices</a>
        </div>
      </header>

      {/* live markets strip */}
      <section id="markets" className="relative z-10 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Live Market Prices (ZAR)</h2>
            <div className="text-sm text-gray-400">Updated every 30s · Source: CoinGecko</div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 rounded-2xl bg-black/40 animate-pulse h-44" />
              ))}
            </div>
          ) : fetchError ? (
            <div className="p-4 text-red-400">{fetchError}</div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6">
              {coins.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-black/50 border border-white/6 hover:shadow-lg hover:shadow-green-400/10 transition"
                >
                  <div className="flex items-center gap-3">
                    <img src={c.image} alt={c.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="text-sm text-gray-300 font-semibold">{c.symbol.toUpperCase()}</div>
                      <div className="text-xs text-gray-400">{c.name}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white">{formatZAR(c.current_price)}</div>
                      <div className={`text-sm mt-1 ${c.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {c.price_change_percentage_24h?.toFixed(2)}%
                      </div>
                    </div>
                    <div style={{ width: 160, height: 60 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={(c.sparkline_in_7d?.price || []).slice(-20).map((p, idx) => ({ x: idx, pv: p }))}
                        >
                          <Line type="monotone" dataKey="pv" stroke="#22c55e" strokeWidth={2} dot={false} />
                          <XAxis hide />
                          <YAxis hide />
                          <Tooltip />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* news teaser */}
      <section id="news" className="relative z-10 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">News</h3>
          <p className="text-gray-300 mb-6">Personalised, curated headlines for the coins you follow. (Feed integration coming next.)</p>
          <div className="grid md:grid-cols-3 gap-6">
            <article className="p-4 bg-black/40 rounded-2xl">Sample news item — headline + short summary + source</article>
            <article className="p-4 bg-black/40 rounded-2xl">Sample news item — headline + short summary + source</article>
            <article className="p-4 bg-black/40 rounded-2xl">Sample news item — headline + short summary + source</article>
          </div>
        </div>
      </section>

      {/* podcast section */}
      <section id="podcast" className="relative z-10 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">Podcast</h3>
          <p className="text-gray-300 mb-6">Short-form interviews and explainers — watch directly on the site.</p>

          <div className="aspect-w-16 aspect-h-9 bg-black/40 rounded-2xl overflow-hidden">
            <iframe
              title="CoinDoor Podcast"
              src="https://www.youtube.com/embed/videoseries?list=PL_REPLACE_WITH_YOUR_PLAYLIST_ID"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* subscribe / footer */}
      <section id="subscribe" className="relative z-10 px-6 py-12 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h4 className="text-xl font-semibold mb-2">Subscribe — R59 / month</h4>
          <p className="text-gray-300 mb-4">Get personalised news, deeper guides, and member-only content.</p>
          <div>
            <a href="#subscribe" className="px-6 py-3 rounded-full bg-green-500 text-black font-semibold">Subscribe Now</a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-8 text-center text-gray-400">
        <div>© {new Date().getFullYear()} CoinDoor — Digital Assets. Explained Simply.</div>
      </footer>

      {/* animation keyframes */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .neon-overlay {
          background: linear-gradient(120deg, rgba(0,255,153,0.06), rgba(0,191,255,0.04), rgba(0,255,153,0.03));
          background-size: 400% 400%;
          animation: gradientShift 22s ease infinite;
          filter: blur(36px);
          transform: translateZ(0);
        }
        .aspect-w-16.aspect-h-9 { position: relative; padding-bottom: 56.25%; height: 0; }
        .aspect-w-16.aspect-h-9 > iframe, .aspect-w-16.aspect-h-9 > .embed { position:absolute; top:0; left:0; width:100%; height:100%; }
      `}</style>
    </main>
  );
}
