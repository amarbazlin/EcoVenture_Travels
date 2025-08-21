import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const nav = [
  { to: "/destinations", label: "Destinations" },
  { to: "/activities",   label: "Activities" },
  { to: "/last-minute",  label: "Last Minute\nHolidays" },
  { to: "/offers",       label: "Offers" },
  { to: "/blog",         label: "Blog" },
];

export default function Navbar({ onToggleSearch = () => {} }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between my-2">
        {/* Left: Logo + mobile menu */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100"
            aria-label="Open menu"
            onClick={() => setOpen(v => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <Link to="/" className="flex items-end gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-gray-800">
              <span className="text-teal-600">Eco</span>Venture
            </span>
            <span className="text-[10px] tracking-[.25em] uppercase text-gray-500 mb-2 mx-2 hidden sm:block">
              Adventure Travels
            </span>
          </Link>
        </div>
        {/* Center nav (desktop) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-10">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "whitespace-pre text-[15px] text-gray-700 hover:text-teal-600 transition-colors pb-3 mt-3",
                  isActive ? "text-teal-600 border-b-2 border-teal-500" : "border-b-2 border-transparent"
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Search (calls parent to toggle panel) */}
          <button
            type="button"
            onClick={onToggleSearch}
            className="hidden md:inline-flex p-2 rounded-full bg-gray-800 text-white hover:brightness-110 ml-5"
            aria-label="Toggle search"
            title="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Phone number */}
          <a href="tel:+442039930013" className="hidden sm:flex items-center gap-2 text-teal-600 font-semibold">
            <span className="inline-flex">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M22 16.92v2a2 2 0 0 1-2.18 2c-9.1-1-16.36-8.26-17.36-17.36A2 2 0 0 1 4.46 1.4h2a2 2 0 0 1 2 1.72c.12.9.34 1.77.66 2.6a2 2 0 0 1-.45 2.11L8 9a16 16 0 0 0 7 7l1.17-1.17a2 2 0 0 1 2.11-.45c.83.32 1.7.54 2.6.66A2 2 0 0 1 22 16.92z"
                      stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>020 3939 0013</span>
          </a>

          {/* CTA */}
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center justify-center rounded-xl bg-teal-600 text-white px-2 py-2 font-semibold shadow hover:bg-teal-700"
          >
            ASK A QUESTION
          </Link>

          {/* Language flag */}
          <button className="hidden sm:inline-flex items-center gap-2 border rounded-lg px-2 py-1 hover:bg-gray-50" aria-label="Language">
            <span className="w-6 h-4 overflow-hidden rounded-[3px] shadow-inner">
              <svg viewBox="0 0 60 40" width="24" height="16" aria-hidden>
                <rect width="60" height="40" fill="#012169"/>
                <path d="M0,0 60,40 M60,0 0,40" stroke="#fff" strokeWidth="8"/>
                <path d="M0,0 60,40 M60,0 0,40" stroke="#C8102E" strokeWidth="4"/>
                <path d="M30,0 v40 M0,20 h60" stroke="#fff" strokeWidth="10"/>
                <path d="M30,0 v40 M0,20 h60" stroke="#C8102E" strokeWidth="6"/>
              </svg>
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-500" aria-hidden>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden border-t bg-white ${open ? "block" : "hidden"}`}>
        <nav className="px-4 py-3 grid gap-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                [
                  "py-2 text-gray-700 rounded hover:bg-gray-50",
                  isActive ? "text-teal-600 font-semibold" : ""
                ].join(" ")
              }
            >
              {item.label.replace("\n", " ")}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="mt-1 inline-flex items-center justify-center rounded-lg bg-teal-600 text-white px-4 py-2 font-semibold"
            onClick={() => setOpen(false)}
          >
            ASK A QUESTION
          </Link>
        </nav>
      </div>
    </header>
  );
}
