import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Camera, Repeat2, MessageCircle, Shield, TrendingUp, Sparkles, Zap, Users, DollarSign, Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const slides = [
  {
    id: "title",
    render: () => (
      <div className="flex flex-col items-center justify-center h-full text-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="relative z-10">
          <div className="w-28 h-28 gradient-warm rounded-3xl flex items-center justify-center shadow-float mx-auto mb-8 rotate-6">
            <Sparkles className="w-14 h-14 text-primary-foreground" />
          </div>
          <h1 className="text-8xl font-extrabold text-foreground tracking-tight">SnapSell</h1>
          <p className="text-3xl text-muted-foreground mt-6 font-medium max-w-2xl">
            The AI-Powered Marketplace That Sells Itself
          </p>
          <div className="flex items-center gap-6 mt-12 justify-center">
            <span className="px-6 py-3 rounded-full bg-primary/10 text-primary font-bold text-lg">AI Listings</span>
            <span className="px-6 py-3 rounded-full bg-secondary/10 text-secondary font-bold text-lg">Trade Matching</span>
            <span className="px-6 py-3 rounded-full bg-accent/20 text-accent-foreground font-bold text-lg">Live Auctions</span>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "problem",
    render: () => (
      <div className="flex flex-col justify-center h-full px-24">
        <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <p className="text-xl font-bold text-primary uppercase tracking-widest mb-4">The Problem</p>
          <h2 className="text-6xl font-extrabold text-foreground leading-tight">Selling stuff<br />shouldn't be <span className="text-destructive">hard</span></h2>
          <div className="grid grid-cols-3 gap-8 mt-16">
            {[
              { icon: "📸", title: "Tedious Listings", desc: "Writing titles, descriptions, pricing — users abandon halfway through." },
              { icon: "🔍", title: "No Discovery", desc: "Great items buried in feeds. Buyers can't find what they want." },
              { icon: "🤝", title: "No Trading", desc: "Want to swap? Too bad. Traditional marketplaces are cash-only." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.15 }}
                className="bg-card rounded-2xl p-8 shadow-card border border-border">
                <span className="text-5xl">{item.icon}</span>
                <h3 className="text-2xl font-bold text-foreground mt-4">{item.title}</h3>
                <p className="text-lg text-muted-foreground mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "solution",
    render: () => (
      <div className="flex flex-col justify-center h-full px-24">
        <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <p className="text-xl font-bold text-secondary uppercase tracking-widest mb-4">Our Solution</p>
          <h2 className="text-6xl font-extrabold text-foreground leading-tight">Snap. Swipe. Sell.</h2>
          <p className="text-2xl text-muted-foreground mt-4 max-w-3xl">
            SnapSell combines AI-powered listing creation with Tinder-style trade matching to create the fastest, most engaging marketplace experience.
          </p>
          <div className="grid grid-cols-2 gap-8 mt-14">
            {[
              { icon: Camera, color: "gradient-warm", title: "AI Listing Creator", desc: "Take a photo → AI identifies the item, writes a description, suggests a fair price. List in under 10 seconds." },
              { icon: Repeat2, color: "gradient-trade", title: "TradeMatch™", desc: "Swipe through items to express trade interest. When both parties swipe right, it's a match — start negotiating instantly." },
              { icon: TrendingUp, color: "gradient-bid", title: "Live Auctions", desc: "Enable bidding on any listing. Real-time bid updates keep buyers engaged and drive higher sale prices." },
              { icon: MessageCircle, color: "gradient-warm", title: "Instant Chat", desc: "Seamless in-app messaging between buyers and sellers. No phone numbers, no email — just tap and talk." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.12 }}
                className="bg-card rounded-2xl p-8 shadow-card border border-border flex gap-6">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="text-base text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "ai-demo",
    render: () => (
      <div className="flex flex-col justify-center h-full px-24">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <p className="text-xl font-bold text-primary uppercase tracking-widest mb-4">Core Feature</p>
          <h2 className="text-6xl font-extrabold text-foreground leading-tight">AI Does the Work</h2>
          <div className="flex items-center gap-12 mt-16">
            <div className="flex-1 flex items-center justify-center gap-6">
              {[
                { step: "1", label: "Snap a photo", icon: Camera, color: "bg-primary/10 text-primary" },
                { step: "2", label: "AI analyzes", icon: Sparkles, color: "bg-accent/20 text-accent-foreground" },
                { step: "3", label: "Review & publish", icon: Zap, color: "bg-secondary/10 text-secondary" },
              ].map((s, i) => (
                <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 + i * 0.2 }}
                  className="flex flex-col items-center gap-4">
                  <div className={`w-32 h-32 rounded-3xl ${s.color} flex items-center justify-center`}>
                    <s.icon className="w-16 h-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full gradient-warm flex items-center justify-center text-primary-foreground font-bold text-sm">{s.step}</span>
                    <span className="text-lg font-bold text-foreground">{s.label}</span>
                  </div>
                  {i < 2 && <div className="absolute" />}
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}
            className="mt-14 bg-card rounded-2xl p-8 shadow-card border border-border max-w-3xl">
            <p className="text-sm font-bold text-muted-foreground mb-3">AI OUTPUT EXAMPLE</p>
            <div className="space-y-2">
              <p className="text-foreground"><span className="font-bold">Title:</span> Vintage Leather Messenger Bag</p>
              <p className="text-foreground"><span className="font-bold">Description:</span> Genuine brown leather messenger bag with brass hardware, adjustable strap, and interior laptop sleeve. Minor patina adds character.</p>
              <p className="text-foreground"><span className="font-bold">Price:</span> $45 · <span className="font-bold">Condition:</span> Good · <span className="font-bold">Category:</span> Clothing</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "market",
    render: () => (
      <div className="flex flex-col justify-center h-full px-24">
        <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <p className="text-xl font-bold text-accent-foreground uppercase tracking-widest mb-4">Market Opportunity</p>
          <h2 className="text-6xl font-extrabold text-foreground leading-tight">$200B+ Market</h2>
          <p className="text-2xl text-muted-foreground mt-4">The global secondhand market is booming — and Gen Z is leading the charge.</p>
          <div className="grid grid-cols-3 gap-8 mt-14">
            {[
              { value: "$200B+", label: "Global resale market by 2026", icon: DollarSign },
              { value: "40%", label: "Of Gen Z prefer secondhand first", icon: Users },
              { value: "3x", label: "Faster growth than traditional retail", icon: TrendingUp },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.15 }}
                className="bg-card rounded-2xl p-8 shadow-card border border-border text-center">
                <div className="w-14 h-14 gradient-warm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <p className="text-5xl font-extrabold text-primary">{stat.value}</p>
                <p className="text-lg text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "competitive",
    render: () => (
      <div className="flex flex-col justify-center h-full px-24">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <p className="text-xl font-bold text-secondary uppercase tracking-widest mb-4">Competitive Edge</p>
          <h2 className="text-6xl font-extrabold text-foreground leading-tight mb-12">Why SnapSell Wins</h2>
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted">
                  <th className="p-5 text-lg font-bold text-foreground">Feature</th>
                  <th className="p-5 text-lg font-bold text-primary text-center">SnapSell</th>
                  <th className="p-5 text-lg font-bold text-muted-foreground text-center">Facebook MP</th>
                  <th className="p-5 text-lg font-bold text-muted-foreground text-center">Poshmark</th>
                  <th className="p-5 text-lg font-bold text-muted-foreground text-center">OfferUp</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["AI Auto-Listing", true, false, false, false],
                  ["Trade Matching", true, false, false, false],
                  ["Live Auctions", true, false, true, false],
                  ["In-App Chat", true, true, false, true],
                  ["One-Tap Listing", true, false, false, false],
                ].map((row, i) => (
                  <motion.tr key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }}
                    className="border-t border-border bg-card">
                    <td className="p-5 text-lg font-semibold text-foreground">{row[0]}</td>
                    {[1, 2, 3, 4].map(j => (
                      <td key={j} className="p-5 text-center text-2xl">{row[j] ? "✅" : "❌"}</td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "business",
    render: () => (
      <div className="flex flex-col justify-center h-full px-24">
        <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <p className="text-xl font-bold text-primary uppercase tracking-widest mb-4">Business Model</p>
          <h2 className="text-6xl font-extrabold text-foreground leading-tight">How We Make Money</h2>
          <div className="grid grid-cols-2 gap-8 mt-14">
            {[
              { title: "Transaction Fee", value: "5%", desc: "On every completed sale. Lower than industry avg (10-20%)." },
              { title: "Promoted Listings", value: "$2-10", desc: "Boost visibility with featured placement in the feed." },
              { title: "SnapSell Pro", value: "$9.99/mo", desc: "Unlimited AI analyses, analytics dashboard, priority support." },
              { title: "Auction Premium", value: "3%", desc: "Additional fee on auction sales for real-time bidding infrastructure." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.12 }}
                className="bg-card rounded-2xl p-8 shadow-card border border-border">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-primary">{item.value}</span>
                  <span className="text-xl font-bold text-foreground">{item.title}</span>
                </div>
                <p className="text-lg text-muted-foreground mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "traction",
    render: () => (
      <div className="flex flex-col justify-center h-full px-24">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <p className="text-xl font-bold text-secondary uppercase tracking-widest mb-4">Traction & Roadmap</p>
          <h2 className="text-6xl font-extrabold text-foreground leading-tight mb-14">Where We're Going</h2>
          <div className="flex gap-6">
            {[
              { phase: "Now", status: "gradient-warm", items: ["AI listing creator", "Trade matching (swipe)", "Live auctions & bidding", "Real-time chat", "Google OAuth"] },
              { phase: "Q2 2026", status: "gradient-trade", items: ["Push notifications", "Payment processing", "Seller ratings & reviews", "Multi-image listings", "Search & filters"] },
              { phase: "Q4 2026", status: "gradient-bid", items: ["Shipping integration", "Price trend analytics", "Social features", "Android & iOS apps", "International expansion"] },
            ].map((col, i) => (
              <motion.div key={i} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.15 }}
                className="flex-1 bg-card rounded-2xl p-8 shadow-card border border-border">
                <div className={`inline-block px-4 py-1.5 ${col.status} rounded-full text-primary-foreground font-bold text-sm mb-4`}>
                  {col.phase}
                </div>
                <ul className="space-y-3">
                  {col.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-lg text-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "cta",
    render: () => (
      <div className="flex flex-col items-center justify-center h-full text-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute top-32 right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="relative z-10">
          <div className="w-24 h-24 gradient-warm rounded-3xl flex items-center justify-center shadow-float mx-auto mb-8 -rotate-6">
            <Sparkles className="w-12 h-12 text-primary-foreground" />
          </div>
          <h2 className="text-7xl font-extrabold text-foreground">Let's Build the Future<br />of Commerce</h2>
          <p className="text-3xl text-muted-foreground mt-6 max-w-3xl mx-auto">
            SnapSell makes selling effortless, trading fun, and buying an adventure.
          </p>
          <div className="mt-14 flex items-center gap-6 justify-center">
            <div className="px-10 py-5 gradient-warm rounded-2xl shadow-float text-primary-foreground font-bold text-2xl">
              Get in Touch
            </div>
            <div className="px-10 py-5 bg-card border-2 border-border rounded-2xl font-bold text-2xl text-foreground">
              Try the Demo →
            </div>
          </div>
          <p className="text-lg text-muted-foreground mt-10">snapell.app · hello@snapsell.app</p>
        </motion.div>
      </div>
    ),
  },
];

const PitchDeck = () => {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const offscreenRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, slides.length - 1)), []);
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);

  const exportPDF = useCallback(async () => {
    setExporting(true);
    try {
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1920, 1080] });
      const container = offscreenRef.current;
      if (!container) return;

      for (let i = 0; i < slides.length; i++) {
        if (i > 0) pdf.addPage([1920, 1080], "landscape");

        // Render slide into offscreen container
        const slideEl = container.querySelector(`[data-slide="${i}"]`) as HTMLElement;
        if (!slideEl) continue;

        const canvas = await html2canvas(slideEl, {
          width: 1920,
          height: 1080,
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        pdf.addImage(imgData, "JPEG", 0, 0, 1920, 1080);
      }

      pdf.save("SnapSell-PitchDeck.pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setExporting(false);
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "f" || e.key === "F") setIsFullscreen(f => !f);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const containerClass = isFullscreen
    ? "fixed inset-0 z-50 bg-background"
    : "min-h-screen bg-background";

  return (
    <div className={containerClass}>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {slides[current].render()}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
          <button onClick={prev} disabled={current === 0}
            className="w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center disabled:opacity-30 hover:bg-card transition-colors shadow-card">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur border border-border shadow-card">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? "w-6 bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"}`} />
            ))}
          </div>

          <button onClick={next} disabled={current === slides.length - 1}
            className="w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center disabled:opacity-30 hover:bg-card transition-colors shadow-card">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Fullscreen toggle & PDF export */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button onClick={exportPDF} disabled={exporting}
            className="w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center hover:bg-card transition-colors shadow-card disabled:opacity-50">
            {exporting ? <Loader2 className="w-4 h-4 text-foreground animate-spin" /> : <Download className="w-4 h-4 text-foreground" />}
          </button>
          <button onClick={() => setIsFullscreen(f => !f)}
            className="w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center hover:bg-card transition-colors shadow-card">
            {isFullscreen ? <Minimize className="w-4 h-4 text-foreground" /> : <Maximize className="w-4 h-4 text-foreground" />}
          </button>
        </div>

        {/* Slide counter */}
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur border border-border text-sm font-semibold text-muted-foreground shadow-card">
          {current + 1} / {slides.length}
        </div>
      </div>

      {/* Offscreen slides for PDF export */}
      <div ref={offscreenRef} className="fixed left-[-9999px] top-0" style={{ width: 1920, height: 1080 * slides.length }}>
        {slides.map((slide, i) => (
          <div key={i} data-slide={i} style={{ width: 1920, height: 1080, position: "relative", background: "white" }}>
            {slide.render()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PitchDeck;
