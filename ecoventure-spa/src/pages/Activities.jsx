// src/pages/Activities.jsx
import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import data from "../data/categories.json";

// ✅ Ask user for notification permission
function askNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      console.log("Notification permission:", permission);
    });
  }
}

// ✅ Show a notification
function showTourUpdateNotification(tourName) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("EcoVenture Tours", {
      body: `New tour available: ${tourName}`,
      icon: "/icons/icon-192x192.png", // make sure you have this in /public/icons
    });
  }
}

export default function Activities() {
  const location = useLocation();
  const navigate = useNavigate();

  const activities = useMemo(() => data.categories.map((c) => c.name), []);
  const qs = new URLSearchParams(location.search);
  const initial = qs.get("activity");
  const [active, setActive] = useState(
    activities.includes(initial || "") ? initial : activities[0]
  );

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    p.set("activity", active);
    navigate({ search: p.toString() }, { replace: true });
  }, [active, location.search, navigate]);

  const category = useMemo(
    () => data.categories.find((c) => c.name === active),
    [active]
  );
  const tours = category?.tours ?? [];

  // ✅ Notification logic
  useEffect(() => {
    // Ask for permission when page loads
    askNotificationPermission();

    // Show a notification for the latest tour in the active category
    if (tours.length > 0) {
      const latestTour = tours[tours.length - 1]; // last item in array
      showTourUpdateNotification(latestTour.name);
    }
  }, [tours]);

  return (
    <section className="max-w-8xl mx-auto px-20 md:px-20 py-10 bg-white dark:bg-gray-900 transition-colors">
      {/* Pills */}
      <div className="rounded-2xl border bg-white dark:bg-gray-800 px-3 md:px-6 py-3 md:py-4 flex flex-wrap gap-3 justify-center">
        {activities.map((name) => (
          <button
            key={name}
            onClick={() => setActive(name)}
            className={[
              "px-4 py-2 rounded-lg text-sm font-semibold border transition",
              name === active
                ? "bg-eco text-white border-eco"
                : "bg-white dark:bg-gray-700 text-eco dark:text-eco border-eco hover:bg-teal-50 dark:hover:bg-gray-600",
            ].join(" ")}
          >
            {name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Heading */}
      <h1 className="text-3xl md:text-5xl font-serif text-center mt-10 mb-8 text-gray-900 dark:text-gray-100">
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

function TourCard({ tour, categoryName }) {
  const hasOffer = typeof tour.oldPrice === "number";

  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-slate-200/70 dark:ring-gray-700 overflow-hidden hover:shadow-md transition">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover"
        />
        <h3 className="absolute left-4 bottom-6 right-16 text-white text-xl md:text-2xl font-semibold drop-shadow">
          {tour.name}
        </h3>
      </div>
      <div className="p-5">
        <div className="text-gray-900 dark:text-gray-100">
          <span className="text-lg font-extrabold">{tour.days} Days</span>
          <span className="text-gray-500 dark:text-gray-400"> from </span>
          {hasOffer && (
            <span className="text-gray-400 line-through mr-1">
              £ {formatMoney(tour.oldPrice)}
            </span>
          )}
          <span className="text-green-700 dark:text-green-400 font-extrabold">
            £ {formatMoney(tour.price)}
          </span>
        </div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {tour.description}
        </p>
      </div>
    </article>
  );
}

function EmptyState({ name, description }) {
  return (
    <div className="text-center py-16">
      <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
        No tours for {name} yet.
      </p>
      {description && (
        <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
}

function formatMoney(n) {
  try {
    return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(
      n
    );
  } catch {
    return String(n);
  }
}
