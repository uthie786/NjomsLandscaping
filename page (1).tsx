"use client";

import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Check,
  ChevronDown,
  Clock,
  Hammer,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Scissors,
  Sparkles,
  Sprout,
  Trees,
  X,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Business details — edit these before going live                    */
/* ------------------------------------------------------------------ */

// WhatsApp number in international format, digits only, no "+" or leading 0.
// Example: 082 123 4567  ->  27821234567
const WHATSAPP_NUMBER = "27000000000"; // TODO: replace with the real number
const PHONE_TEL = "+27000000000"; // TODO: replace (used for tap-to-call)
const PHONE_DISPLAY = "+27 00 000 0000"; // TODO: replace
const SERVICE_AREA = "KwaZulu-Natal"; // TODO: confirm the areas you cover
const INSTAGRAM_HANDLE = "@njomslandscapingservices";
const INSTAGRAM_URL = "https://www.instagram.com/njomslandscapingservices/";

const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/* ------------------------------------------------------------------ */
/*  Brand palette + styles                                             */
/*  Defined here (not in tailwind.config) so colours always render.    */
/* ------------------------------------------------------------------ */

const C = {
  forest950: "#0E2214",
  forest900: "#16331F",
  forest800: "#1E4428",
  forest700: "#285A35",
  forest600: "#327043",
  grass: "#3E8E4E",
  grassLight: "#5FAE6B",
  leaf: "#8CC084",
  sage300: "#B9CBA0",
  sage200: "#D2E0BD",
  sage100: "#E4ECD5",
  cream: "#F4F6EC",
  clay: "#A8603A",
  clayDark: "#8A4B2B",
  gold: "#E7B447",
  goldLight: "#F4D78E",
  soil: "#2E2117",
  soilLight: "#4A3627",
  whatsapp: "#25D366",
};

const BRAND_CSS = `
.nj-root{font-family:var(--font-sans),system-ui,sans-serif;color:${C.forest900};background:${C.sage100}}
.nj-display{font-family:var(--font-display),Georgia,serif;font-variation-settings:'SOFT' 100;letter-spacing:-0.02em}

.nj-bg-forest950{background:${C.forest950}}
.nj-bg-forest900{background:${C.forest900}}
.nj-bg-forest800{background:${C.forest800}}
.nj-bg-sage200{background:${C.sage200}}
.nj-bg-sage100{background:${C.sage100}}
.nj-bg-cream{background:${C.cream}}
.nj-bg-gold{background:${C.goldLight}}

.nj-on-dark{color:${C.cream}}
.nj-muted-dark{color:${C.sage200}}
.nj-faint-dark{color:${C.sage300}}
.nj-muted-light{color:${C.forest700}}
.nj-gold{color:${C.gold}}
.nj-clay{color:${C.clay}}
.nj-grass{color:${C.grass}}

.nj-nav{background:rgba(22,51,31,0.94);border-bottom:1px solid rgba(244,246,236,0.08)}
.nj-navlink{color:${C.sage200};transition:color .15s}
.nj-navlink:hover{color:${C.goldLight}}

.nj-btn-gold{background:${C.gold};color:${C.forest900};transition:background .15s,transform .15s}
.nj-btn-gold:hover{background:${C.goldLight}}
.nj-btn-ghost{border:1.5px solid rgba(244,246,236,0.4);color:${C.cream};transition:background .15s}
.nj-btn-ghost:hover{background:rgba(244,246,236,0.1)}
.nj-btn-dark{background:${C.forest900};color:${C.cream};transition:background .15s}
.nj-btn-dark:hover{background:${C.forest700}}
.nj-btn-wa{background:${C.whatsapp};color:#fff;transition:filter .15s,transform .15s}
.nj-btn-wa:hover{filter:brightness(0.94)}

.nj-chip{border:1px solid rgba(244,246,236,0.25);color:${C.sage200};transition:all .15s}
.nj-chip:hover{border-color:${C.goldLight};color:${C.goldLight}}

.nj-service{border-bottom:1px solid rgba(22,51,31,0.14)}
.nj-service-icon{background:${C.forest900};color:${C.goldLight};transition:all .2s}
.nj-service:hover .nj-service-icon{background:${C.clay};color:${C.cream};transform:rotate(-6deg)}
.nj-service-cta{color:${C.clay}}

.nj-opt{border:2px solid rgba(244,246,236,0.16);color:${C.cream};transition:all .15s}
.nj-opt:hover{border-color:rgba(244,246,236,0.42)}
.nj-opt[aria-pressed="true"]{border-color:${C.gold};background:${C.forest700}}
.nj-opt-icon{background:rgba(244,246,236,0.1);color:${C.sage200}}
.nj-opt[aria-pressed="true"] .nj-opt-icon{background:${C.gold};color:${C.forest900}}

.nj-seg-wrap{background:rgba(244,246,236,0.1)}
.nj-seg{color:${C.sage200}}
.nj-seg[aria-pressed="true"]{background:${C.gold};color:${C.forest900}}
.nj-fieldset:disabled{opacity:.4}

.nj-input{background:rgba(14,34,20,0.5);border:1px solid rgba(244,246,236,0.2);color:${C.cream}}
.nj-input::placeholder{color:rgba(185,203,160,0.6)}
.nj-input:focus{outline:none;border-color:${C.gold}}

.nj-result-rule{border-top:1px solid rgba(22,51,31,0.12)}
.nj-disabled{background:rgba(22,51,31,0.1);color:${C.forest700};pointer-events:none}

.nj-step-num{background:${C.clay};color:${C.cream}}
.nj-faq{border-top:1px solid rgba(22,51,31,0.14);border-bottom:1px solid rgba(22,51,31,0.14)}
.nj-faq > div + div{border-top:1px solid rgba(22,51,31,0.14)}

.nj-contact-card{background:${C.forest800};transition:background .15s}
.nj-contact-card:hover{background:${C.forest700}}
.nj-footer-rule{border-top:1px solid rgba(244,246,236,0.1)}

.nj-progress-track{background:rgba(22,51,31,0.14)}
.nj-progress-bar{background:${C.grass}}

.nj-hero-grid{display:grid;gap:3rem;align-items:center}
@media (min-width:768px){.nj-hero-grid{grid-template-columns:1.15fr 1fr}}
.nj-quote-grid{display:grid;gap:2rem}
@media (min-width:1024px){.nj-quote-grid{grid-template-columns:1.4fr 1fr}}

@keyframes nj-clip{0%{transform:translate(0,0) rotate(0);opacity:1}100%{transform:translate(var(--dx),var(--dy)) rotate(220deg);opacity:0}}
.nj-clipping{animation:nj-clip .9s ease-out infinite}
@keyframes nj-ping{0%{transform:scale(1);opacity:.5}80%,100%{transform:scale(1.6);opacity:0}}
.nj-ping{animation:nj-ping 2.4s cubic-bezier(0,0,.2,1) infinite}

.nj-root :focus-visible{outline:3px solid ${C.gold};outline-offset:3px;border-radius:6px}

@media (prefers-reduced-motion: reduce){
  html{scroll-behavior:auto}
  .nj-root *,.nj-root *::before,.nj-root *::after{animation-duration:.01ms!important;animation-iteration-count:1!important}
}
`;

/* Deterministic pseudo-random (integer maths → identical on server and client) */
const rand = (i: number) => ((((i * 9301 + 49297) % 233280) + 233280) % 233280) / 233280;

/* ------------------------------------------------------------------ */
/*  Grass section divider                                              */
/* ------------------------------------------------------------------ */

function bladePath(width: number, height: number, count: number, seed: number, minH: number, maxH: number) {
  const step = width / count;
  let d = `M0 ${height} `;
  for (let i = 0; i < count; i++) {
    const x0 = i * step;
    const tipX = x0 + step * (0.25 + rand(i + seed * 131) * 0.6);
    const tipY = height - height * (minH + rand(i * 7 + seed * 17) * (maxH - minH));
    d += `L${x0.toFixed(1)} ${height - 1} L${tipX.toFixed(1)} ${tipY.toFixed(1)} `;
  }
  d += `L${width} ${height - 1} L${width} ${height} Z`;
  return d;
}

/** Sits between two sections: `from` is the colour above, `to` is the colour below. */
function GrassDivider({ from, to, seed = 1 }: { from: string; to: string; seed?: number }) {
  const back = useMemo(() => bladePath(1200, 60, 110, seed, 0.45, 1), [seed]);
  const mid = useMemo(() => bladePath(1200, 60, 125, seed + 3, 0.3, 0.75), [seed]);
  const front = useMemo(() => bladePath(1200, 60, 140, seed + 5, 0.12, 0.45), [seed]);
  return (
    <div aria-hidden style={{ background: from, lineHeight: 0, marginTop: -1, marginBottom: -1 }}>
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="block h-10 w-full sm:h-16">
        <path d={back} fill={C.forest600} />
        <path d={mid} fill={C.grass} />
        <path d={front} fill={to} />
      </svg>
    </div>
  );
}

/* Gentle entrance for section content */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* A single leaf shape used for decoration */
function LeafShape({ fill, style }: { fill: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 160" aria-hidden className="pointer-events-none absolute" style={style}>
      <path d="M50 158 C8 120 0 60 50 2 C100 60 92 120 50 158Z" fill={fill} />
      <path d="M50 150 L50 12" stroke="rgba(0,0,0,0.18)" strokeWidth="3" fill="none" />
      {[40, 64, 88, 112].map((y) => (
        <g key={y} stroke="rgba(0,0,0,0.14)" strokeWidth="2.5" fill="none">
          <path d={`M50 ${y + 14} L24 ${y}`} />
          <path d={`M50 ${y + 14} L76 ${y}`} />
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

type Service = { title: string; blurb: string; icon: LucideIcon; message: string };

const SERVICES: Service[] = [
  {
    title: "Garden design & softscaping",
    blurb: "Beds, borders and plant schemes planned around your light, soil and how you use the space.",
    icon: Sprout,
    message: "Hi Njoms Landscaping! I'd like a quote for garden design & softscaping.",
  },
  {
    title: "Lawn installation, care & trimming",
    blurb: "New instant lawn laid properly, then regular mowing, edging and feeding to keep it thick.",
    icon: Leaf,
    message: "Hi Njoms Landscaping! I'd like a quote for lawn installation / lawn care.",
  },
  {
    title: "Tree pruning & hedge trimming",
    blurb: "Clean cuts that keep trees healthy and hedges crisp, with all the offcuts taken away.",
    icon: Scissors,
    message: "Hi Njoms Landscaping! I'd like a quote for tree pruning & hedge trimming.",
  },
  {
    title: "Hardscaping, paving & stone paths",
    blurb: "Driveways, patios and stepping-stone paths set on a solid base so they stay level.",
    icon: Hammer,
    message: "Hi Njoms Landscaping! I'd like a quote for paving / hardscaping.",
  },
  {
    title: "Seasonal cleanup & maintenance",
    blurb: "Leaves, weeds and overgrowth cleared, then a regular visit so it never gets that far again.",
    icon: Trees,
    message: "Hi Njoms Landscaping! I'd like a quote for a garden cleanup / maintenance plan.",
  },
];

const STEPS = [
  { title: "Send your details", text: "Use the estimator or tap WhatsApp and tell us what your garden needs." },
  { title: "We come and look", text: "We confirm the size of the job on site and give you a firm quote." },
  { title: "We get it done", text: "The team arrives on the booked day and leaves everything swept and tidy." },
];

const FAQS = [
  {
    q: "Is the online estimate the final price?",
    a: "No. It's a guide based on typical jobs. Every property is different, so we confirm a firm price after seeing the garden or photos.",
  },
  {
    q: "Can I send photos instead of booking a visit?",
    a: "Yes. Send photos or a short video on WhatsApp and we can often quote smaller jobs straight away.",
  },
  {
    q: "Do you take away garden refuse?",
    a: "Cuttings, leaves and offcuts from our work are removed as part of the job unless you'd like to keep them for compost.",
  },
  {
    q: "Do you work on commercial properties?",
    a: "Yes. Choose “Large Estate / Commercial” in the estimator and we'll arrange a site visit.",
  },
];

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

const NAV = [
  { href: "#services", label: "Services" },
  { href: "#mow", label: "How we mow" },
  { href: "#quote", label: "Get an estimate" },
  { href: "#contact", label: "Contact" },
];

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nj-nav fixed inset-x-0 top-0 z-40 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="nj-on-dark flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: C.gold, color: C.forest900 }}>
            <Leaf className="h-5 w-5" aria-hidden />
          </span>
          <span className="nj-display text-lg font-semibold leading-none">
            Njoms <span className="nj-muted-dark font-normal">Landscaping</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="nj-navlink text-sm">
              {n.label}
            </a>
          ))}
          <a
            href={waLink("Hi Njoms Landscaping! I'd like a quote.")}
            target="_blank"
            rel="noopener noreferrer"
            className="nj-btn-gold rounded-full px-4 py-2 text-sm font-semibold"
          >
            WhatsApp us
          </a>
        </nav>
        <button
          className="nj-on-dark grid h-10 w-10 place-items-center rounded-full md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col px-5 py-3">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="nj-on-dark py-3 text-base">
                  {n.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function HeroScene() {
  // Garden-arch shaped window onto a tidy lawn at golden hour
  const arch = "M0 400 V190 A190 190 0 0 1 380 190 V400 Z";
  return (
    <svg viewBox="0 0 380 400" className="h-auto w-full drop-shadow-2xl" role="img" aria-label="Illustration of a neatly mown garden at golden hour">
      <defs>
        <linearGradient id="nj-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.goldLight} />
          <stop offset="1" stopColor="#FBEFCF" />
        </linearGradient>
        <clipPath id="nj-arch">
          <path d={arch} />
        </clipPath>
      </defs>
      <g clipPath="url(#nj-arch)">
        <rect width="380" height="400" fill="url(#nj-sky)" />
        <circle cx="250" cy="150" r="52" fill={C.gold} />
        <path d="M0 225 C80 190 150 210 220 196 C290 182 340 200 380 190 V400 H0Z" fill={C.leaf} />
        <path d="M0 262 C90 238 180 252 250 244 C320 236 360 250 380 244 V400 H0Z" fill={C.grass} />
        {/* mown stripes */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path
            key={i}
            d={`M${-60 + i * 72} 400 L${30 + i * 62} 258 L${61 + i * 62} 256 L${12 + i * 72} 400Z`}
            fill={i % 2 ? C.forest600 : C.grassLight}
            opacity="0.5"
          />
        ))}
        {/* trees */}
        <rect x="64" y="160" width="11" height="80" fill={C.soilLight} />
        <circle cx="70" cy="146" r="40" fill={C.forest800} />
        <circle cx="46" cy="170" r="26" fill={C.forest700} />
        <circle cx="96" cy="166" r="28" fill={C.forest700} />
        <rect x="318" y="180" width="8" height="46" fill={C.soilLight} />
        <circle cx="322" cy="172" r="24" fill={C.forest700} />
        {/* clipped hedge + flowers */}
        <rect x="130" y="208" width="130" height="34" rx="16" fill={C.forest800} />
        {[146, 170, 196, 222, 246].map((x, i) => (
          <circle key={x} cx={x} cy={214 + (i % 2) * 6} r="4" fill={i % 2 ? C.gold : "#E88AA0"} />
        ))}
        {/* stepping-stone path */}
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={i} cx={270 - i * 30} cy={276 + i * 26} rx={15 + i * 4} ry={6 + i * 1.5} fill="#D8CFB9" />
        ))}
      </g>
      <path d={arch} fill="none" stroke={C.gold} strokeWidth="6" />
    </svg>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  return (
    <section
      id="top"
      className="relative overflow-hidden pb-10 pt-28 sm:pt-36"
      style={{
        background: `radial-gradient(circle at 85% 20%, rgba(231,180,71,0.22), transparent 45%), linear-gradient(180deg, ${C.forest900} 0%, ${C.forest800} 100%)`,
      }}
    >
      {/* decorative foliage */}
      <LeafShape fill={C.forest700} style={{ width: 150, left: -40, top: 90, transform: "rotate(-35deg)", opacity: 0.8 }} />
      <LeafShape fill={C.forest600} style={{ width: 110, left: 40, top: 60, transform: "rotate(-10deg)", opacity: 0.5 }} />
      <LeafShape fill={C.forest700} style={{ width: 170, right: -50, bottom: 110, transform: "rotate(40deg)", opacity: 0.7 }} />

      <div className="nj-hero-grid relative mx-auto max-w-6xl px-5">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="nj-on-dark"
        >
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="nj-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm">
            <Sprout className="h-4 w-4" aria-hidden />
            {INSTAGRAM_HANDLE}
          </a>
          <h1 className="nj-display mt-6 text-5xl font-semibold sm:text-6xl lg:text-7xl" style={{ lineHeight: 1.02 }}>
            Gardens that grow on&nbsp;you.
          </h1>
          <p className="nj-muted-dark mt-6 max-w-xl text-lg leading-relaxed">
            Njoms Landscaping keeps lawns neat, hedges sharp and outdoor spaces looking cared for. Garden design,
            planting, paving and regular maintenance for homes and businesses in {SERVICE_AREA}.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#quote" className="nj-btn-gold rounded-full px-6 py-3 font-semibold">
              Estimate my job
            </a>
            <a
              href={waLink("Hi Njoms Landscaping! I'd like a quote for my garden.")}
              target="_blank"
              rel="noopener noreferrer"
              className="nj-btn-ghost inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Chat on WhatsApp
            </a>
          </div>
          <ul className="nj-muted-dark mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {["Free quotes on WhatsApp", "Residential & commercial", "Refuse removed after every job"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="nj-gold h-4 w-4" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="mx-auto w-full max-w-sm"
        >
          <HeroScene />
        </motion.div>
      </div>

      {/* rolling lawn along the bottom of the hero */}
      <svg viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden className="relative mt-12 block h-16 w-full sm:h-24">
        <path d="M0 50 C200 10 380 60 600 36 C820 12 1000 58 1200 30 V90 H0Z" fill={C.forest700} />
        <path d="M0 72 C240 44 420 82 640 62 C860 42 1020 78 1200 58 V90 H0Z" fill={C.forest600} />
      </svg>
      <a href="#services" className="nj-faint-dark relative mx-auto -mt-2 flex w-fit flex-col items-center gap-1 text-sm">
        See what we do
        <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden />
      </a>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Services                                                           */
/* ------------------------------------------------------------------ */

function Services() {
  return (
    <section id="services" className="nj-bg-sage200 relative overflow-hidden py-20 sm:py-28">
      <LeafShape fill={C.sage300} style={{ width: 220, right: -60, top: 40, transform: "rotate(25deg)", opacity: 0.6 }} />
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <h2 className="nj-display text-4xl font-semibold sm:text-5xl">From first cut to finishing touches</h2>
          <p className="nj-muted-light mt-4 text-lg leading-relaxed">
            One team for the whole garden. Tap any service to send us a quote request on WhatsApp.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-10 gap-y-2 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <a href={waLink(s.message)} target="_blank" rel="noopener noreferrer" className="nj-service flex gap-5 py-7">
                <span className="nj-service-icon grid h-12 w-12 shrink-0 place-items-center rounded-2xl">
                  <s.icon className="h-6 w-6" aria-hidden />
                </span>
                <span>
                  <span className="nj-display block text-xl font-semibold">{s.title}</span>
                  <span className="nj-muted-light mt-1 block leading-relaxed">{s.blurb}</span>
                  <span className="nj-service-cta mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    Request a quote
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
          <Reveal delay={0.25}>
            <div className="nj-bg-forest900 nj-on-dark mt-6 rounded-3xl p-7 md:mt-7">
              <p className="nj-display text-xl font-semibold">Not sure what you need?</p>
              <p className="nj-muted-dark mt-1">Send us a photo of the garden and we&rsquo;ll suggest where to start.</p>
              <a
                href={waLink("Hi Njoms Landscaping! I'm not sure what my garden needs — can I send you some photos?")}
                target="_blank"
                rel="noopener noreferrer"
                className="nj-btn-gold mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Send photos on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll-linked lawnmower                                            */
/* ------------------------------------------------------------------ */

const BLADE_COUNT = 96;
const BLADE_COLORS = [C.grass, C.forest600, C.grassLight, "#4A9A5A", C.forest700];

function Blade({ cut, index }: { cut: MotionValue<number>; index: number }) {
  const pos = index / BLADE_COUNT;
  const tall = 0.62 + rand(index * 3 + 11) * 0.38;
  const lean = (rand(index * 5 + 2) - 0.5) * 8;
  const scaleY = useTransform(cut, [pos - 0.02, pos + 0.004], [1, 0.26]);
  return (
    <motion.div
      className="absolute bottom-0"
      style={{
        left: `${pos * 100 - 0.4}%`,
        width: `${100 / BLADE_COUNT + 1.2}%`,
        height: `${tall * 100}%`,
        scaleY,
        transformOrigin: "bottom",
      }}
    >
      <svg viewBox="0 0 20 100" preserveAspectRatio="none" className="h-full w-full">
        <path
          d={`M0 100 C5 62 ${8 + lean} 30 ${10 + lean} 0 C${12 + lean} 30 15 62 20 100Z`}
          fill={BLADE_COLORS[index % BLADE_COLORS.length]}
        />
      </svg>
    </motion.div>
  );
}

function MowerGraphic({ spin }: { spin: MotionValue<number> }) {
  const wheel = (cx: number, cy: number, r: number) => (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={C.soil} />
      <motion.g style={{ rotate: spin, originX: `${cx}px`, originY: `${cy}px` }}>
        <circle cx={cx} cy={cy} r={r * 0.55} fill="#6B5A4A" />
        <rect x={cx - 1.5} y={cy - r * 0.55} width="3" height={r * 1.1} fill={C.gold} />
        <rect x={cx - r * 0.55} y={cy - 1.5} width={r * 1.1} height="3" fill={C.gold} />
      </motion.g>
    </g>
  );
  return (
    <svg viewBox="0 0 170 115" className="h-full w-full overflow-visible" aria-hidden>
      <path d="M52 62 L14 10" stroke={C.soil} strokeWidth="6" strokeLinecap="round" />
      <path d="M6 8 L22 13" stroke={C.soil} strokeWidth="8" strokeLinecap="round" />
      <path d="M26 58 Q24 40 44 40 L56 44 L56 80 L34 80 Q26 78 26 58Z" fill={C.sage200} stroke={C.soil} strokeWidth="2" />
      <path d="M46 62 Q46 52 58 52 L140 52 Q156 52 158 70 L160 84 L46 84Z" fill={C.clay} />
      <rect x="46" y="78" width="114" height="8" rx="3" fill={C.clayDark} />
      <rect x="78" y="34" width="46" height="22" rx="7" fill={C.forest900} />
      <rect x="86" y="28" width="18" height="8" rx="3" fill={C.gold} />
      <text x="101" y="74" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.cream} fontFamily="sans-serif">
        NJOMS
      </text>
      {wheel(64, 92, 15)}
      {wheel(140, 94, 13)}
    </svg>
  );
}

const CLIPPINGS = [
  { dx: "-46px", dy: "-54px", delay: "0s", c: C.grassLight },
  { dx: "-70px", dy: "-30px", delay: "0.15s", c: C.grass },
  { dx: "-30px", dy: "-70px", delay: "0.3s", c: "#4A9A5A" },
  { dx: "-58px", dy: "-12px", delay: "0.45s", c: C.grassLight },
  { dx: "-84px", dy: "-48px", delay: "0.6s", c: C.forest600 },
  { dx: "-24px", dy: "-40px", delay: "0.75s", c: C.leaf },
];

function MowerSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const cut = useTransform(smooth, [0.08, 0.9], [-0.03, 1.08]);
  const left = useTransform(cut, (v) => `${v * 100}%`);
  const spin = useTransform(cut, [0, 1], [0, 2160]);
  const [pct, setPct] = useState(0);

  useMotionValueEvent(cut, "change", (v) => {
    setPct(Math.round(Math.min(Math.max(v, 0), 1) * 100));
  });

  const blades = useMemo(() => Array.from({ length: BLADE_COUNT }, (_, i) => i), []);

  return (
    <section id="mow" ref={ref} className="relative" style={{ height: "260vh", background: C.sage100 }}>
      <div
        className="sticky top-0 flex h-screen flex-col overflow-hidden"
        style={{ background: `linear-gradient(180deg, #FBEFCF 0%, ${C.goldLight} 38%, ${C.sage200} 100%)` }}
      >
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-20 sm:pt-24">
          <h2 className="nj-display max-w-xl text-4xl font-semibold sm:text-5xl">
            Keep scrolling. We&rsquo;ll take care of the lawn.
          </h2>
          <p className="nj-muted-light mt-4 max-w-lg text-lg leading-relaxed">
            Every visit ends with even stripes, clean edges and nothing left on the paving.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <div className="nj-progress-track h-2 w-48 overflow-hidden rounded-full">
              <div className="nj-progress-bar h-full rounded-full" style={{ width: `${pct}%`, transition: "width 150ms" }} />
            </div>
            <span className="nj-display text-lg font-semibold tabular-nums">
              {pct === 100 ? "All done. Looking sharp." : `${pct}% trimmed`}
            </span>
          </div>
        </div>

        {/* Scene fills all remaining space below the heading */}
        <div className="relative mt-6 w-full flex-1" style={{ minHeight: 280 }}>
          {/* rolling hills with trees, stretched to fill the gap above the lawn */}
          <div aria-hidden className="absolute inset-x-0 top-0 bottom-32 sm:bottom-44">
            <svg viewBox="0 0 1200 400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <path d="M0 70 C150 20 300 60 460 40 C620 20 780 70 940 45 C1060 28 1140 40 1200 30 V400 H0Z" fill={C.sage300} opacity="0.8" />
              <path d="M0 160 C180 100 360 150 560 120 C760 90 940 150 1200 110 V400 H0Z" fill={C.leaf} />
            </svg>
            {/* tree line — bases are hidden behind the nearer hills */}
            <svg viewBox="0 0 1200 160" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 top-0 w-full" style={{ height: "62%" }}>
              {[
                [90, 88, 26], [140, 96, 20], [380, 80, 30], [430, 92, 22], [700, 74, 28],
                [760, 86, 20], [980, 82, 26], [1030, 92, 18], [1140, 78, 24],
              ].map(([x, y, r], i) => (
                <g key={i}>
                  <rect x={x - 3} y={y} width="6" height={160 - y} fill={C.soilLight} />
                  <circle cx={x} cy={y} r={r} fill={i % 2 ? C.forest600 : C.forest700} />
                </g>
              ))}
            </svg>
            <svg viewBox="0 0 1200 400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <path d="M0 240 C220 200 420 235 640 215 C860 195 1020 235 1200 205 V400 H0Z" fill={C.grassLight} />
              <path d="M0 330 C240 300 460 330 700 315 C900 302 1060 325 1200 310 V400 H0Z" fill={C.grass} />
            </svg>
          </div>

        {/* Lawn strip */}
        <div className="absolute inset-x-0 bottom-0 h-48 w-full sm:h-64" style={{ background: `linear-gradient(180deg, transparent 0%, ${C.grass} 45%)` }}>
          <div className="absolute inset-x-0 bottom-0 h-6" style={{ background: C.soilLight }} />
          <motion.div
            className="absolute bottom-6 left-0 h-12 sm:h-16"
            style={{
              width: left,
              backgroundImage: `repeating-linear-gradient(90deg, #4A9A5A 0 56px, ${C.grass} 56px 112px)`,
            }}
          />
          <div className="absolute inset-x-0 bottom-6 top-0">
            {blades.map((i) => (
              <Blade key={i} cut={cut} index={i} />
            ))}
          </div>
          <motion.div className="absolute bottom-3 z-10 h-28 w-40 sm:h-36 sm:w-52" style={{ left, x: "-90%" }}>
            <motion.div
              className="h-full w-full"
              animate={reduce ? undefined : { y: [0, -2, 0] }}
              transition={{ duration: 0.35, repeat: Infinity }}
            >
              <MowerGraphic spin={spin} />
            </motion.div>
            {pct > 0 && pct < 100 && (
              <div className="absolute bottom-10" style={{ left: "18%" }}>
                {CLIPPINGS.map((c, i) => (
                  <span
                    key={i}
                    className="nj-clipping absolute block h-1.5 w-3 rounded-full"
                    style={{ background: c.c, animationDelay: c.delay, "--dx": c.dx, "--dy": c.dy } as CSSProperties}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Quote calculator                                                   */
/* ------------------------------------------------------------------ */

type SizeKey = "small" | "medium" | "large";
type ServiceKey = "lawn" | "hedge" | "hardscape" | "cleanup";
type Frequency = "once" | "monthly";

const SIZES: { key: SizeKey; label: string; sub: string; mult: number; timeMult: number }[] = [
  { key: "small", label: "Small Garden", sub: "Up to about 200 m²", mult: 1, timeMult: 1 },
  { key: "medium", label: "Medium Yard", sub: "About 200–800 m²", mult: 1.9, timeMult: 1.7 },
  { key: "large", label: "Large Estate / Commercial", sub: "800 m² and up", mult: 3.6, timeMult: 2.8 },
];

// Indicative ZAR ranges for a Small Garden. TODO: adjust to your real pricing.
const CALC_SERVICES: {
  key: ServiceKey;
  label: string;
  desc: string;
  icon: LucideIcon;
  min: number;
  max: number;
  hours: number;
  recurring: boolean;
}[] = [
  { key: "lawn", label: "Lawn Care", desc: "Mowing, edging & trimming", icon: Sprout, min: 350, max: 600, hours: 2, recurring: true },
  { key: "hedge", label: "Hedge Trimming", desc: "Hedges, shrubs & light pruning", icon: Scissors, min: 450, max: 900, hours: 3, recurring: true },
  { key: "hardscape", label: "Hardscaping", desc: "Paving & stone pathways", icon: Hammer, min: 6500, max: 14000, hours: 24, recurring: false },
  { key: "cleanup", label: "Cleanup", desc: "Leaves, weeds & refuse removal", icon: Leaf, min: 800, max: 1600, hours: 5, recurring: true },
];

const formatRand = (n: number) => "R" + String(Math.round(n / 50) * 50).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

function QuoteCalculator() {
  const [size, setSize] = useState<SizeKey>("medium");
  const [selected, setSelected] = useState<ServiceKey[]>(["lawn", "hedge"]);
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [name, setName] = useState("");
  const [suburb, setSuburb] = useState("");

  const toggle = (k: ServiceKey) =>
    setSelected((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));

  const sizeInfo = SIZES.find((s) => s.key === size)!;
  const chosen = CALC_SERVICES.filter((s) => selected.includes(s.key));
  const hasRecurring = chosen.some((s) => s.recurring);
  const monthly = frequency === "monthly" && hasRecurring;

  let estimate: { price: string; time: string } | null = null;
  if (chosen.length > 0) {
    let min = 0;
    let max = 0;
    let hours = 0;
    for (const s of chosen) {
      const discount = monthly && s.recurring ? 0.9 : 1;
      min += s.min * sizeInfo.mult * discount;
      max += s.max * sizeInfo.mult * discount;
      hours += s.hours * sizeInfo.timeMult;
    }
    const h = Math.max(1, Math.round(hours));
    const time =
      hours <= 8
        ? `About ${h} hour${h === 1 ? "" : "s"} on site`
        : `About ${Math.ceil(hours / 8)}–${Math.ceil((hours * 1.4) / 8)} working days`;
    estimate = { price: `${formatRand(min)} – ${formatRand(max)}`, time };
  }

  const lines = [
    "Hi Njoms Landscaping! 🌿 I'd like to book a quote.",
    "",
    `• Property: ${sizeInfo.label} (${sizeInfo.sub})`,
    `• Services: ${chosen.map((c) => c.label).join(", ") || "Not sure yet"}`,
  ];
  if (hasRecurring) lines.push(`• Frequency: ${monthly ? "Monthly maintenance" : "Once-off"}`);
  if (estimate) lines.push(`• Online estimate: ${estimate.price}${monthly ? " per visit" : ""} (${estimate.time.toLowerCase()})`);
  if (name.trim()) lines.push(`• Name: ${name.trim()}`);
  if (suburb.trim()) lines.push(`• Area: ${suburb.trim()}`);
  lines.push("", "When could you come and have a look?");
  const message = lines.join("\n");

  return (
    <section id="quote" className="nj-bg-forest800 nj-on-dark py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <h2 className="nj-display text-4xl font-semibold sm:text-5xl">Estimate your job in a minute</h2>
          <p className="nj-muted-dark mt-4 text-lg leading-relaxed">
            Pick your property size and what needs doing. We&rsquo;ll send your choices to WhatsApp so you don&rsquo;t
            have to type it all out.
          </p>
        </Reveal>

        <div className="nj-quote-grid mt-12">
          <div className="space-y-10">
            <fieldset>
              <legend className="nj-display text-xl font-semibold">1. How big is the property?</legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {SIZES.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setSize(s.key)}
                    aria-pressed={s.key === size}
                    className="nj-opt rounded-2xl p-4 text-left"
                  >
                    <span className="block font-semibold">{s.label}</span>
                    <span className="nj-faint-dark mt-1 block text-sm">{s.sub}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="nj-display text-xl font-semibold">2. What needs doing?</legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {CALC_SERVICES.map((s) => {
                  const active = selected.includes(s.key);
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => toggle(s.key)}
                      aria-pressed={active}
                      className="nj-opt flex items-start gap-3 rounded-2xl p-4 text-left"
                    >
                      <span className="nj-opt-icon grid h-10 w-10 shrink-0 place-items-center rounded-xl">
                        {active ? <Check className="h-5 w-5" aria-hidden /> : <s.icon className="h-5 w-5" aria-hidden />}
                      </span>
                      <span>
                        <span className="block font-semibold">{s.label}</span>
                        <span className="nj-faint-dark block text-sm">{s.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset disabled={!hasRecurring} className="nj-fieldset">
              <legend className="nj-display text-xl font-semibold">3. Once-off or regular?</legend>
              <div className="nj-seg-wrap mt-4 inline-flex rounded-full p-1">
                {(["once", "monthly"] as Frequency[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFrequency(f)}
                    aria-pressed={frequency === f}
                    className="nj-seg rounded-full px-5 py-2 text-sm font-semibold"
                  >
                    {f === "once" ? "Once-off" : "Monthly (save 10%)"}
                  </button>
                ))}
              </div>
              {!hasRecurring && chosen.length > 0 && (
                <p className="nj-faint-dark mt-2 text-sm">Hardscaping is quoted as a once-off project.</p>
              )}
            </fieldset>

            <fieldset>
              <legend className="nj-display text-xl font-semibold">4. Your details (optional)</legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="nj-faint-dark text-sm">Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="nj-input mt-1 w-full rounded-xl px-4 py-3"
                    placeholder="e.g. Thandi"
                    autoComplete="name"
                  />
                </label>
                <label className="block">
                  <span className="nj-faint-dark text-sm">Suburb</span>
                  <input
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    className="nj-input mt-1 w-full rounded-xl px-4 py-3"
                    placeholder="Where's the property?"
                  />
                </label>
              </div>
            </fieldset>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="nj-bg-cream rounded-3xl p-7 sm:p-8" style={{ color: C.forest900 }}>
              <p className="nj-clay flex items-center gap-2 font-semibold">
                <Sparkles className="h-5 w-5" aria-hidden />
                Your estimate
              </p>
              <AnimatePresence mode="wait">
                {estimate ? (
                  <motion.div
                    key={estimate.price + estimate.time}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="nj-display mt-3 text-4xl font-semibold">{estimate.price}</p>
                    {monthly && <p className="nj-muted-light text-sm">per visit on a monthly plan</p>}
                    <p className="mt-4 flex items-center gap-2">
                      <Clock className="nj-grass h-5 w-5" aria-hidden />
                      {estimate.time}
                    </p>
                  </motion.div>
                ) : (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="nj-muted-light mt-3 text-lg"
                  >
                    Choose at least one service to see a price range.
                  </motion.p>
                )}
              </AnimatePresence>

              <ul className="nj-result-rule mt-6 space-y-2 pt-5 text-sm">
                <li className="flex gap-2">
                  <MapPin className="nj-grass h-4 w-4 shrink-0" aria-hidden />
                  {sizeInfo.label}
                </li>
                {chosen.map((c) => (
                  <li key={c.key} className="flex gap-2">
                    <Check className="nj-grass h-4 w-4 shrink-0" aria-hidden />
                    {c.label}
                  </li>
                ))}
              </ul>

              <a
                href={chosen.length ? waLink(message) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={chosen.length === 0}
                className={`${chosen.length ? "nj-btn-wa" : "nj-disabled"} mt-7 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-semibold`}
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                Book via WhatsApp
              </a>
              <p className="nj-muted-light mt-3 text-center text-xs leading-relaxed">
                Estimates are a guide only. We confirm a firm price after seeing the property.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Process + FAQ                                                      */
/* ------------------------------------------------------------------ */

function Process() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="nj-bg-sage100 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-16 px-5 lg:grid-cols-2">
        <div>
          <Reveal>
            <h2 className="nj-display text-4xl font-semibold sm:text-5xl">How booking works</h2>
          </Reveal>
          <ol className="mt-10 space-y-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <li className="flex gap-5">
                  <span className="nj-step-num nj-display grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg font-semibold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="nj-display text-xl font-semibold">{s.title}</p>
                    <p className="nj-muted-light mt-1 leading-relaxed">{s.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <div>
          <Reveal>
            <h2 className="nj-display text-4xl font-semibold sm:text-5xl">Questions</h2>
          </Reveal>
          <div className="nj-faq mt-8">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold"
                  >
                    {f.q}
                    <ChevronDown
                      className="nj-clay h-5 w-5 shrink-0 transition-transform"
                      style={{ transform: isOpen ? "rotate(180deg)" : undefined }}
                      aria-hidden
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="nj-muted-light pb-5 leading-relaxed">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact / footer                                                   */
/* ------------------------------------------------------------------ */

function InstagramGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Contact() {
  const cards = [
    { href: waLink("Hi Njoms Landscaping! I'd like a quote."), icon: <MessageCircle className="nj-gold h-6 w-6" aria-hidden />, title: "WhatsApp", sub: "Quotes & bookings", external: true },
    { href: `tel:${PHONE_TEL}`, icon: <Phone className="nj-gold h-6 w-6" aria-hidden />, title: "Call us", sub: PHONE_DISPLAY, external: false },
    { href: INSTAGRAM_URL, icon: <InstagramGlyph className="nj-gold h-6 w-6" />, title: "Instagram", sub: INSTAGRAM_HANDLE, external: true },
  ];
  return (
    <footer id="contact" className="nj-bg-forest900 nj-on-dark pb-28 pt-20 sm:pt-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <h2 className="nj-display text-4xl font-semibold sm:text-5xl">Let&rsquo;s get your garden sorted</h2>
          <p className="nj-muted-dark mt-4 text-lg leading-relaxed">
            WhatsApp is the quickest way to reach us. Send a message, a photo, or both.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <a
              key={c.title}
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="nj-contact-card flex items-center gap-4 rounded-2xl p-5"
            >
              {c.icon}
              <span>
                <span className="block font-semibold">{c.title}</span>
                <span className="nj-faint-dark text-sm">{c.sub}</span>
              </span>
            </a>
          ))}
        </div>
        <div className="nj-footer-rule nj-faint-dark mt-16 flex flex-col gap-3 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" aria-hidden />
            Serving homes and businesses in {SERVICE_AREA}
          </p>
          <p>© {new Date().getFullYear()} Njoms Landscaping Services</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating WhatsApp + page progress                                  */
/* ------------------------------------------------------------------ */

function FloatingWhatsApp() {
  return (
    <a
      href={waLink("Hi Njoms Landscaping! I'd like a quote.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Njoms Landscaping on WhatsApp"
      className="nj-btn-wa fixed bottom-5 right-5 z-50 grid h-16 w-16 place-items-center rounded-full"
      style={{ boxShadow: "0 10px 30px rgba(14,34,20,0.35)" }}
    >
      <span className="nj-ping absolute inset-0 rounded-full" style={{ background: C.whatsapp }} aria-hidden />
      <MessageCircle className="relative h-8 w-8" />
    </a>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-1"
      style={{ scaleX, transformOrigin: "left", background: C.gold }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Page() {
  return (
    <main className="nj-root overflow-x-clip">
      <style dangerouslySetInnerHTML={{ __html: BRAND_CSS }} />
      <ScrollProgress />
      <Nav />
      <Hero />
      <GrassDivider from={C.forest800} to={C.sage200} seed={1} />
      <Services />
      <GrassDivider from={C.sage200} to="#FBEFCF" seed={2} />
      <MowerSection />
      <GrassDivider from={C.soilLight} to={C.forest800} seed={3} />
      <QuoteCalculator />
      <GrassDivider from={C.forest800} to={C.sage100} seed={4} />
      <Process />
      <GrassDivider from={C.sage100} to={C.forest900} seed={5} />
      <Contact />
      <FloatingWhatsApp />
    </main>
  );
}
