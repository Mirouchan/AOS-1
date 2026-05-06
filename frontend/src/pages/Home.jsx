import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";

// ── Data ─────────────────────────────────────────────────────────────────────

const HERO_TEXTS = [
  "Discover outdoor adventures",
  "Gear up for your journey",
  "Connect with trusted agencies",
  "Share your wild stories",
];

const STATS = [
  { num: "5K+", label: "Active Adventurers" },
  { num: "98%",  label: "Satisfaction Rate" },
  { num: "200+", label: "Destinations" },
  { num: "50+",  label: "Trusted Agencies" },
];

const MARQUEE_ITEMS = [
  "Camping Gear","Hiking Equipment","Adventure Stories","Travel Agencies","Safety Tutorials",
  "Mountain Biking","Rock Climbing","Kayaking","Skiing","Backpacking","Wildlife Tours",
];

const WHY_CARDS = [
  {
    title: "All-in-One Platform",
    body: "Buy gear, book trips, share stories, and learn skills — everything an adventurer needs in one secure place.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-dark-primary fill-none stroke-[1.5]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline strokeLinecap="round" strokeLinejoin="round" points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    title: "Verified Agencies",
    body: "Cryptographically verified travel partners. Book with confidence knowing every agency is authenticated and trusted.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-dark-primary fill-none stroke-[1.5]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    title: "Community Driven",
    body: "Share journals, post stories, upload videos. Build connections with fellow adventurers around the world.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-dark-primary fill-none stroke-[1.5]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Camping Pro",
    category: "Equipment",
    badge: "Best Seller",
    badgeClass: "bg-dark-primary text-black",
    stars: 5,
    desc: "Professional camping gear including tents, sleeping bags, and portable stoves. Rated #1 by outdoor experts.",
    img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Hike Master",
    category: "Footwear",
    badge: "New",
    badgeClass: "bg-white/15 backdrop-blur text-white border border-white/25",
    stars: 4,
    desc: "Premium hiking boots with advanced grip technology. Perfect for mountain trails and rocky terrain.",
    img: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Climb X",
    category: "Climbing",
    badge: "Trending",
    badgeClass: "bg-red-600 text-white",
    stars: 5,
    desc: "Professional climbing equipment including ropes, harnesses, and carabiners. Safety certified.",
    img: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Kayak Explorer",
    category: "Water Sports",
    badge: "New",
    badgeClass: "bg-white/15 backdrop-blur text-white border border-white/25",
    stars: 4,
    desc: "Inflatable kayaks and paddling gear for lake and river adventures. Lightweight and portable.",
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600&auto=format&fit=crop",
  },
];

const ADVENTURE_CARDS = [
  {
    title: "Equipment Store",
    body: "Browse thousands of adventure products. Secure payments, real-time inventory, fast shipping worldwide.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-dark-primary fill-none stroke-[1.5]">
        <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18M9 21V9"/>
      </svg>
    ),
    link: "/products"
  },
  {
    title: "Book Adventures",
    body: "Connect with verified travel agencies. Reserve trips in real-time with atomic booking protection.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-dark-primary fill-none stroke-[1.5]">
        <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3"/>
      </svg>
    ),
    link: "/products"
  },
  {
    title: "Share Stories",
    body: "Write journals, upload videos, inspire others. Build your adventure legacy with instant publishing.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-dark-primary fill-none stroke-[1.5]">
        <polyline strokeLinecap="round" strokeLinejoin="round" points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    link: "/products"
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

const Home = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  /* rotating subtitle */
  useEffect(() => {
    const id = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setTextIndex((p) => (p + 1) % HERO_TEXTS.length);
        setAnimating(false);
      }, 350);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  /* sticky nav shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="min-h-screen flex flex-col dark:bg-dark-background dark:text-dark-text bg-light-background text-light-text font-outfit">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');
        
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-outfit { font-family: 'Outfit', sans-serif; }
        
        @keyframes heroZoom {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        
        @keyframes scrollBar {
          0% { opacity: 1; transform: scaleY(1) translateY(0); }
          100% { opacity: 0; transform: scaleY(0.4) translateY(100%); }
        }
        
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(26px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulseGold {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        
        .animate-hero-zoom { animation: heroZoom 20s ease-in-out infinite alternate; }
        .animate-scroll-bar { animation: scrollBar 2s ease-in-out infinite; }
        .animate-marquee { animation: marqueeScroll 32s linear infinite; }
        .animate-fade-up-1 { animation: fadeUp 0.8s 0.1s both; }
        .animate-fade-up-2 { animation: fadeUp 0.9s 0.28s both; }
        .animate-fade-up-3 { animation: fadeUp 0.9s 0.44s both; }
        .animate-fade-up-4 { animation: fadeUp 0.9s 0.6s both; }
        .animate-pulse-gold { animation: pulseGold 2s infinite; }
        
        .dest-card:hover .dest-img {
          transform: scale(1.07);
          filter: brightness(0.4) saturate(0.6);
        }
        .dest-card:hover .prod-desc {
          max-height: 80px;
          opacity: 1;
        }
        .dest-card:hover .prod-cta {
          opacity: 1;
          transform: translateY(0);
        }
        .prod-desc {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, opacity 0.4s ease;
          opacity: 0;
        }
        .prod-cta {
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.3s 0.1s, transform 0.3s 0.1s;
        }
        .dest-img {
          transition: transform 0.7s ease, filter 0.7s ease;
          filter: brightness(0.5) saturate(0.65);
        }
        .why-card:hover .why-icon {
          background: rgba(250, 204, 21, 0.15);
          border-color: rgba(250, 204, 21, 0.4);
        }
        .adv-card:hover .adv-icon {
          background: rgba(250, 204, 21, 0.12);
          border-color: rgba(250, 204, 21, 0.3);
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <Navbar scrolled={scrolled} />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center animate-hero-zoom"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1920&auto=format&fit=crop')",
          }}
        />
        
        {/* 5% dark overlay */}
        <div className="absolute inset-0 bg-black/5" />
        
        {/* Warm amber gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent" />

        <div className="relative z-10 max-w-4xl px-6">
          <div className="animate-fade-up-1 inline-flex items-center gap-2 mb-7 px-5 py-2.5 rounded-full text-white text-xs font-semibold tracking-[0.28em] uppercase border border-white/30 bg-black/20 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-dark-primary animate-pulse-gold" />
            TerraVentures — By Kavenal
          </div>

          <h1
            className="font-bebas animate-fade-up-2 text-white leading-[0.88] tracking-[0.04em] mb-6"
            style={{ fontSize: "clamp(4rem, 12vw, 10rem)", textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            Find Your<br />
            <span className="text-dark-primary drop-shadow-lg">Wild</span> Side
          </h1>

          <div className="h-8 overflow-hidden mb-10 animate-fade-up-3">
            <p
              className="text-base md:text-lg font-light leading-8 transition-all duration-350 text-white/90"
              style={{
                opacity: animating ? 0 : 1,
                transform: animating ? "translateY(8px)" : "translateY(0)",
                textShadow: "0 1px 10px rgba(0,0,0,0.2)"
              }}
            >
              {HERO_TEXTS[textIndex]}
            </p>
          </div>

          <div className="animate-fade-up-4 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate("/products")}
              className="group flex items-center gap-2 px-8 py-4 rounded-full text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-dark-primary bg-light-primary text-black"
            >
              Explore Now
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
            <button
              onClick={() => navigate("/about")}
              className="px-7 py-4 rounded-full text-xs font-medium tracking-[0.14em] uppercase transition-all duration-200 text-white hover:text-white hover:border-white/70 border border-white/40 bg-black/20 backdrop-blur-md"
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/50">
          <div className="w-px h-12 animate-scroll-bar bg-gradient-to-b from-dark-primary to-transparent" />
          <span className="text-[0.6rem] tracking-[0.2em] uppercase">Scroll</span>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="flex flex-wrap border-y border-white/10 dark:bg-dark-background/95 bg-white/80 backdrop-blur-sm">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="flex-1 py-8 text-center hover:bg-white/5 transition-colors"
          >
            <div className="font-bebas text-4xl md:text-5xl tracking-[0.05em] text-dark-primary">
              {s.num}
            </div>
            <div className="text-[0.7rem] font-medium tracking-[0.12em] uppercase mt-1 text-dark-text/70">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── MARQUEE ── */}
      <div className="overflow-hidden py-4 border-b border-white/10 bg-black/5">
        <div className="flex gap-16 whitespace-nowrap animate-marquee" style={{ width: "max-content" }}>
          {doubled.map((item, i) => (
            <span key={i} className="font-bebas text-base tracking-[0.2em] text-dark-text/40 inline-flex items-center gap-4">
              {item}
              <span className="text-dark-primary text-sm">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── WHY TERRAVENTURES ── */}
      <section className="py-24 px-6 dark:bg-dark-background bg-light-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[0.7rem] font-semibold tracking-[0.3em] uppercase mb-3 text-dark-primary">
              Why TerraVentures?
            </p>
            <h2 className="font-bebas text-[clamp(2.5rem,5vw,4rem)] tracking-[0.06em] dark:text-dark-text text-light-text leading-none mb-4">
              Your Gateway to <span className="text-dark-primary">Adventure</span>
            </h2>
            <p className="text-sm font-light leading-relaxed max-w-lg mx-auto dark:text-dark-text/60 text-light-text/60">
              A centralized platform where adventurers find gear, book trips, share stories, and connect with verified agencies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {WHY_CARDS.map((c) => (
              <div
                key={c.title}
                className="why-card p-8 rounded-2xl dark:bg-dark-background/40 bg-white/50 backdrop-blur-sm border border-white/20 text-center transition-all duration-300 hover:-translate-y-1 hover:border-dark-primary/30 hover:shadow-lg"
              >
                <div className="why-icon w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 bg-dark-primary/10 border border-dark-primary/20">
                  {c.icon}
                </div>
                <div className="font-bebas text-2xl tracking-[0.06em] dark:text-dark-text text-light-text mb-3">
                  {c.title}
                </div>
                <p className="text-sm font-light leading-relaxed dark:text-dark-text/60 text-light-text/60">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-24 px-6 dark:bg-dark-background/80 bg-light-background/80">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.3em] uppercase mb-2 text-dark-primary">
                Adventure Gear
              </p>
              <h2 className="font-bebas text-[clamp(2rem,4vw,3.5rem)] tracking-[0.06em] dark:text-dark-text text-light-text leading-none">
                Best &amp; <span className="text-dark-primary">New</span> Equipment
              </h2>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="group text-sm font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:gap-3 text-dark-primary flex items-center gap-2"
            >
              Shop All 
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((p) => (
              <div
                key={p.name}
                onClick={() => navigate(`/product/${p.id}`)}
                className="dest-card group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
              >
                <img
                  src={p.img}
                  alt={p.name}
                  className="dest-img w-full object-cover aspect-[3/4]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <span className={`absolute top-4 right-4 text-[0.65rem] font-semibold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full z-10 ${p.badgeClass}`}>
                  {p.badge}
                </span>
                
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <span key={si} className="text-xs" style={{ color: si < p.stars ? "#FACC15" : "rgba(255,255,255,0.2)" }}>★</span>
                    ))}
                  </div>
                  <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-white/50 mb-1">
                    {p.category}
                  </div>
                  <div className="font-bebas text-2xl tracking-[0.06em] text-white leading-none mb-2">
                    {p.name}
                  </div>
                  <p className="prod-desc text-xs font-light leading-relaxed text-white/60 mb-3">
                    {p.desc}
                  </p>
                  <span className="prod-cta inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-dark-primary">
                    Shop Now
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6 dark:bg-dark-background bg-light-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[0.7rem] font-semibold tracking-[0.3em] uppercase mb-3 text-dark-primary">
              How It Works
            </p>
            <h2 className="font-bebas text-[clamp(2.5rem,5vw,4rem)] tracking-[0.06em] dark:text-dark-text text-light-text leading-none mb-4">
              Everything You <span className="text-dark-primary">Need</span>
            </h2>
            <p className="text-sm font-light leading-relaxed max-w-md mx-auto dark:text-dark-text/60 text-light-text/60">
              Equipment, bookings, community — all in one secure platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {ADVENTURE_CARDS.map((c) => (
              <div
                key={c.title}
                onClick={() => navigate(c.link)}
                className="adv-card p-8 rounded-2xl dark:bg-dark-background/40 bg-white/50 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:-translate-y-1 hover:border-dark-primary/30 hover:shadow-lg cursor-pointer"
              >
                <div className="adv-icon w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 bg-dark-primary/10 border border-dark-primary/20">
                  {c.icon}
                </div>
                <div className="font-bebas text-2xl tracking-[0.06em] dark:text-dark-text text-light-text mb-3">
                  {c.title}
                </div>
                <p className="text-sm font-light leading-relaxed dark:text-dark-text/60 text-light-text/60 mb-6">
                  {c.body}
                </p>
                <div className="group inline-flex items-center gap-2 text-sm font-semibold tracking-[0.12em] uppercase transition-all duration-200 text-dark-primary">
                  Learn More 
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="relative py-28 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1920&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2
            className="font-bebas text-white leading-[0.95] tracking-[0.06em] mb-6"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            Ready for Your <br />
            <span className="text-dark-primary drop-shadow-lg">Next Adventure?</span>
          </h2>
          <p className="text-base font-light leading-relaxed text-white/80 mb-10 max-w-md mx-auto">
            Join thousands of adventurers who trust TerraVentures for gear, bookings, and community. Start your journey today — no credit card required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate("/products")}
              className="group flex items-center gap-2 px-9 py-4 rounded-full text-sm font-semibold tracking-[0.14em] uppercase transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-dark-primary bg-light-primary text-black"
            >
              Start Exploring
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button
              onClick={() => navigate("/support")}
              className="px-8 py-4 rounded-full text-sm font-medium tracking-[0.14em] uppercase transition-all duration-200 text-white hover:text-white hover:border-white/70 border border-white/40 bg-black/20 backdrop-blur-md"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
};

export default Home;