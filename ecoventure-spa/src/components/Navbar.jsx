import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

const nav = [
  { to: "/destinations", label: "Destinations" },
  { to: "/activities",   label: "Activities" },
  { to: "/offers",       label: "Offers" },
  { to: "/blog",         label: "Blog" },
  { to: "/wishlist",     label: "Wishlist" }, 
];

export default function Navbar({ onToggleSearch = () => {} }) {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between my-0">
        {/* Left: Logo + mobile menu */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open menu"
            onClick={() => setOpen(v => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <Link to="/" className="flex items-end gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-gray-800 dark:text-white">
              <span className="text-eco">Eco</span>Venture
            </span>
            <span className="text-[10px] tracking-[.25em] uppercase text-gray-500 dark:text-gray-400 mb-2 mx-2 hidden sm:block">
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
                  "whitespace-pre text-[15px] text-gray-700 dark:text-gray-200 hover:text-eco transition-colors pb-3 mt-3 flex items-center gap-1",
                  isActive ? "text-eco border-b-2 border-eco" : "border-b-2 border-transparent"
                ].join(" ")
              }
            >
              {/* ✅ Add heart icon for Wishlist */}
              {item.to === "/wishlist" && (
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="mr-1"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              )}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Search */}
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
          <a href="tel:+442039930013" className="hidden sm:flex items-center gap-2 text-eco font-semibold">
            <span className="inline-flex">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M22 16.92v2a2 2 0 0 1-2.18 2c-9.1-1-16.36-8.26-17.36-17.36A2 2 0 0 1 4.46 1.4h2a2 2 0 0 1 2 1.72c.12.9.34 1.77.66 2.6a2 2 0 0 1-.45 2.11L8 9a16 16 0 0 0 7 7l1.17-1.17a2 2 0 0 1 2.11-.45c.83.32 1.7.54 2.6.66A2 2 0 0 1 22 16.92z"
                      stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>020 390 0013</span>
          </a>

          {/* CTA */}
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center justify-center rounded-xl bg-eco text-white px-2 py-2 font-semibold shadow hover:bg-eco/80 focus:outline-none focus:ring-2 focus:ring-white"
          >
            ASK A QUESTION
          </Link>

          {/* GBP button → Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="hidden sm:inline-flex items-center gap-2 border rounded-xl px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <span className="text-yellow-400 font-bold">Light</span>
            ) : (
              <span className="text-gray-800 dark:text-gray-200 font-bold">Dark</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden border-t bg-white dark:bg-gray-900 ${open ? "block" : "hidden"}`}>
        <nav className="px-4 py-3 grid gap-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                [
                  "py-2 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2",
                  isActive ? "text-teal-600 font-semibold" : ""
                ].join(" ")
              }
            >
              {/* ✅ Add heart icon for mobile Wishlist */}
              {item.to === "/wishlist" && (
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              )}
              {item.label.replace("\n", " ")}
            </NavLink>
          ))}
          <div className="flex items-center gap-2 mt-1">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-teal-600 text-white px-4 py-2 font-semibold flex-grow"
              onClick={() => setOpen(false)}
            >
              ASK A QUESTION
            </Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 font-semibold"
              aria-label="Toggle dark mode"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}