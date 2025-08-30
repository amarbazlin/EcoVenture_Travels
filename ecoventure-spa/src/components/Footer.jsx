export default function Footer() {
  return (
    <footer className="bg-white">



      {/* ===== MOUNTAIN RIDGES + PURPOSE BAND (exact look) ===== */}
      <div className="relative">
        {/* upper torn ridge */}
        <Ridge className="text-gray-200" height="h-10" />

        {/* purpose band */}
        <div className="bg-gray-100">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-16 text-center">
            <p className="text-[11px] tracking-[.25em] font-semibold uppercase text-gray-500">
              Our Purpose
            </p>
            <h3 className="mt-3 text-3xl md:text-5xl font-medium leading-tight text-slate-700">
              To protect our world's wild places, one adventure at a time.
            </h3>
          </div>
        </div>

        {/* lower torn ridge */}
        <Ridge className="text-gray-300 -mt-[1px]" height="h-12" />
      </div>

      {/* ===== DARK FOOTER (keep or tweak) ===== */}
      <DarkFooter />
    </footer>
  );
}

/* ---------------- helpers ---------------- */

function Feature({ iconSrc, title, text }) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* ICON BOX (fixed size, prevents overlap) */}
      <div className="w-24 h-24 md:w-28 md:h-28 mb-3 flex items-center justify-center shrink-0">
        <img
          src={iconSrc}
          alt=""
          className="max-w-full max-h-full object-contain block select-none pointer-events-none"
        />
      </div>

      {/* HEADING */}
      <h3 className="text-[13px] md:text-sm font-extrabold uppercase tracking-widest text-slate-900 max-w-[28ch]">
        {title}
      </h3>

      {/* COPY */}
      <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-[42ch]">
        {text}
      </p>
    </div>
  );
}

/** Slightly more jagged “torn paper” ridge */
function Ridge({ className = "", height = "h-10" }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`w-full ${height} ${className}`}
      aria-hidden
    >
      <path
        d="M0,50 L60,46 L120,52 L180,44 L240,49 L300,42 L360,48 L420,38 L480,47 L540,40 L600,46 L660,39 L720,45 L780,37 L840,43 L900,36 L960,41 L1020,38 L1080,42 L1140,39 L1200,41 L1260,38 L1320,40 L1380,39 L1440,37 L1440,80 L0,80 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ------- Dark footer (same structure; tweak as needed) ------- */
function DarkFooter() {
  return (
    <div className="bg-[#111] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid gap-10 lg:gap-12 lg:grid-cols-12">
        {/* Left */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h3 className="text-sm font-extrabold tracking-widest uppercase">
              Book with confidence
            </h3>
            <p className="mt-1 text-sm text-white/70">
              Find out how your booking with EcoVenture is protected through our memberships.
            </p>
            <div className="mt-4 flex gap-4 items-center flex-wrap">
              <Badge>ABTOT</Badge>
              <Badge>ABTA</Badge>
              <Badge>ATOL</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-extrabold tracking-widest uppercase">
              Positive impact adventure travel
            </h3>
            <p className="mt-1 text-sm text-white/70">
              Responsible travel is at our core. Better for you, local communities, wildlife
              and the planet.
            </p>
            <a href="#" className="inline-block mt-3 text-eco hover:underline" >
              Go to top of page
            </a>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          <LinkCol title="About" links={["Our Story","Our Impact","Meet the Team","Careers","Happiness Guarantee"]}/>
          <LinkCol title="Customers" links={["Contact Us","Help & FAQs","Travel Advice","Cookies","Terms & Conditions"]}/>
          <LinkCol title="Travel Companies" links={["Host Knowledge Base","Apply to Host"]}/>
          <div>
            <h4 className="text-sm font-extrabold tracking-widest uppercase mb-4">Partners</h4>
            <a href="#" className="inline-flex items-center justify-center border border-white/20 rounded-lg px-4 py-2 text-sm hover:bg-white/10">GBP</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <p className="text-xs text-white/60">
              © {new Date().getFullYear()} EcoVenture Tours. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Social icon="facebook" />
            <Social icon="twitter" />
            <Social icon="instagram" />
            <Social icon="chat" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center justify-center rounded-md border border-white/25 bg-white/10 px-3 py-1.5 text-sm font-semibold">
      {children}
    </span>
  );
}
function LinkCol({ title, links = [] }) {
  return (
    <div>
      <h4 className="text-sm font-extrabold tracking-widest uppercase mb-4">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l}><a href="#" className="text-white/80 hover:text-white">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}
function Logo() {
  return (
    <div className="flex items-end gap-2">
      <span className="text-xl font-extrabold tracking-tight">
        <span className="text-eco">Eco</span>Venture
      </span>
      <span className="text-[10px] tracking-[.25em] uppercase text-white/60 mb-1 hidden sm:block">
        Adventure Travels
      </span>
    </div>
  );
}
function Social({ icon }) {
  const paths = {
    facebook: "M15 3h-3a4 4 0 00-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 011-1h3V3z",
    twitter: "M22 5.9a8.2 8.2 0 01-2.4.7 4.2 4.2 0 001.8-2.3 8.3 8.3 0 01-2.6 1A4.1 4.1 0 0012 8.7a11.6 11.6 0 01-8.4-4.3 4.1 4.1 0 001.3 5.5A4 4 0 012 9v.1a4.1 4.1 0 003.3 4 4.2 4.2 0 01-1.8.1 4.1 4.1 0 003.9 2.9A8.3 8.3 0 012 19.5 11.7 11.7 0 008.3 21c7 0 10.9-5.8 10.9-10.9v-.5A7.9 7.9 0 0022 5.9z",
    instagram: "M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm6-1a1 1 0 100 2 1 1 0 000-2z",
    chat: "M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4v8z",
  };
  return (
    <a href="#" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/15" aria-label={icon}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d={paths[icon]} />
      </svg>
    </a>
  );
}
