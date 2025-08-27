// src/pages/Activities.jsx
import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import data from "../data/categories.json";

export default function Activities() {
  const location = useLocation();
  const navigate = useNavigate();

  // All activity names from JSON
  const activities = useMemo(() => data.categories.map((c) => c.name), []);

  // Read ?activity=<Name> from URL
  const qs = new URLSearchParams(location.search);
  const initial = qs.get("activity");
  const [active, setActive] = useState(
    activities.includes(initial || "") ? initial : activities[0]
  );

  // Keep URL in sync with selected pill
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    p.set("activity", active);
    navigate({ search: p.toString() }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Find the selected category + its tours
  const category = useMemo(
    () => data.categories.find((c) => c.name === active),
    [active]
  );
  const tours = category?.tours ?? [];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      {/* Pills row */}
      <div className="rounded-2xl border border-teal-200/60 bg-white px-3 md:px-6 py-3 md:py-4 flex flex-wrap gap-3 justify-center">
        {activities.map((name) => (
          <button
            key={name}
            onClick={() => setActive(name)}
            className={[
              "px-4 py-2 rounded-lg text-sm font-semibold border transition",
              name === active
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white text-teal-700 border-teal-400 hover:bg-teal-50"
            ].join(" ")}
          >
            {name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Heading */}
      <h1 className="text-3xl md:text-5xl font-serif text-center mt-10 mb-8 text-slate-800">
        {active} Activity Adventure Holidays
      </h1>

      {/* Cards */}
      {tours.length === 0 ? (
        <EmptyState name={active} description={category?.description} />
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((t) => (
            <TourCard key={t.id} tour={t} categoryName={active} />
          ))}
        </div>
      )}
    </section>
  );
}

/* -------------------- Components -------------------- */

function TourCard({ tour, categoryName }) {
  const hasOffer = typeof tour.oldPrice === "number";

  return (
    <article className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 overflow-hidden hover:shadow-md transition">
      {/* Image + overlay text */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
        <div className="absolute left-4 bottom-20 text-[12px] tracking-widest font-semibold uppercase text-white/90">
          {tour.country || "UNITED KINGDOM"}
        </div>
        <h3 className="absolute left-4 bottom-6 right-16 text-white text-xl md:text-2xl font-semibold drop-shadow">
          {tour.name}
        </h3>
        {/* Save button */}
        <button
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow"
          aria-label="Save"
          title="Save"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21s-6.7-4.35-9.33-7.29C.42 11.28 2.06 7 6 7c2 0 3.2 1.14 4 2 0.8-.86 2-2 4-2 3.94 0 5.58 4.28 3.33 6.71C18.7 16.65 12 21 12 21z"
              stroke="#0f172a" strokeWidth="1.5" fill="none"
            />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Offer + price line */}
        <div className="flex items-start justify-between gap-3">
          <div>
            {hasOffer && (
              <span className="inline-block text-[11px] font-bold uppercase tracking-wide bg-rose-100 text-rose-700 px-2 py-1 rounded mb-2">
                Offer
              </span>
            )}

            <div className="text-slate-800">
              <span className="text-lg font-extrabold">{tour.days} Days</span>
              <span className="text-slate-500"> from </span>
              {hasOffer && (
                <span className="text-slate-400 line-through mr-1">
                  £ {formatMoney(tour.oldPrice)}
                </span>
              )}
              <span className="text-green-700 font-extrabold">
                £ {formatMoney(tour.price)}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1">Guided Group (Excl. Flights)</p>
          </div>

          {/* Category badge */}
          <div className="shrink-0">
            <div className="w-24 h-16 rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-slate-600">
                <path d="M4 20h16M6 20V8l6-4 6 4v12" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <span className="text-[11px] mt-1 text-slate-700">{categoryName}</span>
            </div>
          </div>
        </div>

        {/* Blurb */}
        <p className="mt-3 text-sm text-slate-600 line-clamp-3">{tour.description}</p>

        {/* CTA */}
        <div className="mt-5">
          <button className="inline-flex items-center justify-center w-full rounded-lg bg-teal-600 text-white px-4 py-2.5 font-semibold hover:bg-teal-700">
            VIEW DETAILS
          </button>
        </div>

        {/* Rating */}
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-700">
          <Stars rating={tour.rating ?? 4.6} />
          <span className="text-slate-600">{(tour.rating ?? 4.6).toFixed(1)}</span>
          <span className="text-slate-400">({tour.reviews ?? 100} reviews)</span>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ name, description }) {
  return (
    <div className="text-center py-16">
      <p className="text-2xl font-semibold text-slate-700">No tours for {name} yet.</p>
      {description && <p className="mt-2 text-slate-600">{description}</p>}
    </div>
  );
}

/* -------------------- Utilities -------------------- */

function Stars({ rating = 4.5 }) {
  const full = Math.floor(rating);
  const stars = new Array(5).fill(0).map((_, i) => i < full);
  return (
    <div className="flex">
      {stars.map((isFull, i) => (
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          className={isFull ? "fill-amber-400" : "fill-slate-300"}
        >
          <path d="M12 .587l3.668 7.431L24 9.748l-6 5.854L19.335 24 12 19.897 4.665 24 6 15.602 0 9.748l8.332-1.73z" />
        </svg>
      ))}
    </div>
  );
}

function formatMoney(n) {
  try {
    return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(n);
  } catch {
    return String(n);
  }
}
