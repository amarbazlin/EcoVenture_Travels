// src/pages/Activities.jsx
import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
      icon: "/icons/icon-192x192.png",
    });
  }
}

export default function Activities() {
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState("");
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories...");
        const res = await fetch("http://localhost:4000/api/categories");
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Categories response:", data);
        
        if (data.success && data.data) {
          setCategories(data.data);

          // Set initial active category from query string or default to first
          const qs = new URLSearchParams(location.search);
          const initialActivity = qs.get("activity");
          
          // Use categoryKey instead of name for matching
          const firstCategoryKey = data.data[0]?.categoryKey || "";
          const matchingCategory = data.data.find(c => 
            c.categoryKey === initialActivity || c.name.toLowerCase() === initialActivity?.toLowerCase()
          );
          
          setActive(matchingCategory ? matchingCategory.categoryKey : firstCategoryKey);
        } else {
          console.error("Invalid categories response:", data);
          setError("Failed to load categories");
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Failed to load categories: " + err.message);
      }
    };
    fetchCategories();
  }, [location.search]);

  // ✅ Update query string when active changes
  useEffect(() => {
    if (!active) return;
    const p = new URLSearchParams(location.search);
    p.set("activity", active);
    navigate({ search: p.toString() }, { replace: true });
  }, [active, location.search, navigate]);

  // ✅ Fetch tours when active category changes
  useEffect(() => {
    if (!active) return;
    
    const fetchTours = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching tours for category: ${active}`);
        const res = await fetch(`http://localhost:4000/api/tours/category/${active}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Tours response:", data);
        
        if (data.success) {
          setTours(data.data || []);
        } else {
          console.error("Tours API error:", data);
          setTours([]);
          setError(data.error || "Failed to load tours");
        }
      } catch (err) {
        console.error("Failed to load tours:", err);
        setTours([]);
        setError("Failed to load tours: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTours();
  }, [active]);

  // ✅ Notifications (only for new tours, not on every load)
  useEffect(() => {
    askNotificationPermission();
    // Only show notification if we have tours and it's not the initial load
    if (tours.length > 0 && !loading) {
      const latestTour = tours[0]; // Assuming tours are sorted by created_at DESC
      // You might want to add additional logic here to only show for truly new tours
      // showTourUpdateNotification(latestTour.name);
    }
  }, [tours, loading]);

  const activeCategory = useMemo(
    () => categories.find((c) => c.categoryKey === active),
    [categories, active]
  );

  // Show error state if there's an error
  if (error && categories.length === 0) {
    return (
      <section className="max-w-8xl mx-auto px-20 md:px-20 py-10 bg-white dark:bg-gray-900 transition-colors">
        <div className="text-center py-16">
          <p className="text-2xl font-semibold text-red-600">Error Loading Activities</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-eco text-white rounded-lg hover:bg-teal-600 transition"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-8xl mx-auto px-20 md:px-20 py-10 bg-white dark:bg-gray-900 transition-colors">
      {/* Pills */}
      <div className="rounded-2xl border bg-white dark:bg-gray-800 px-3 md:px-6 py-3 md:py-4 flex flex-wrap gap-3 justify-center">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.categoryKey)}
            className={[
              "px-4 py-2 rounded-lg text-sm font-semibold border transition",
              c.categoryKey === active
                ? "bg-eco text-white border-eco"
                : "bg-white dark:bg-gray-700 text-eco dark:text-eco border-eco hover:bg-teal-50 dark:hover:bg-gray-600",
            ].join(" ")}
          >
            {c.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Heading */}
      <h1 className="text-3xl md:text-5xl font-serif text-center mt-10 mb-8 text-gray-900 dark:text-gray-100">
        {activeCategory?.name || active} Activity Adventure Holidays
      </h1>

      {/* Error Message */}
      {error && tours.length === 0 && (
        <div className="text-center py-8">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* Cards */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-eco"></div>
          <p className="mt-4 text-gray-500">Loading tours...</p>
        </div>
      ) : tours.length === 0 ? (
        <EmptyState 
          name={activeCategory?.name || active} 
          description={activeCategory?.description} 
        />
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((t) => (
            <TourCard 
              key={t.id} 
              tour={t} 
              categoryName={activeCategory?.name || active} 
            />
          ))}
        </div>
      )}
    </section>
  );
}

function TourCard({ tour, categoryName }) {
  const hasOffer = typeof tour.oldPrice === "number" && tour.oldPrice > 0;

  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-slate-200/70 dark:ring-gray-700 overflow-hidden hover:shadow-md transition">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={tour.image || '/default-tour.jpg'}
          alt={tour.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/default-tour.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <h3 className="absolute left-4 bottom-6 right-4 text-white text-xl md:text-2xl font-semibold drop-shadow-lg">
          {tour.name}
        </h3>
        {/* Country Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
            {tour.country}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        {/* Price and Duration */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-gray-900 dark:text-gray-100">
            <span className="text-lg font-extrabold">{tour.days} Days</span>
          </div>
          <div className="text-right">
            {hasOffer && (
              <div className="text-gray-400 line-through text-sm">
                £{formatMoney(tour.oldPrice)}
              </div>
            )}
            <div className="text-green-700 dark:text-green-400 font-extrabold text-lg">
              £{formatMoney(tour.price)}
            </div>
          </div>
        </div>

        {/* Rating and Reviews */}
        {tour.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {"★".repeat(Math.floor(tour.rating))}
              {"☆".repeat(5 - Math.floor(tour.rating))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {tour.rating} ({tour.reviews} reviews)
            </span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {tour.description}
        </p>

        {/* Availability */}
        {tour.availability && (
          <div className="mt-3">
            <span className={[
              "inline-block px-2 py-1 rounded-full text-xs font-medium",
              tour.availability === 'available' 
                ? "bg-green-100 text-green-800" 
                : tour.availability === 'limited'
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            ].join(" ")}>
              {tour.availability.charAt(0).toUpperCase() + tour.availability.slice(1)}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

function EmptyState({ name, description }) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🏞️</div>
      <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
        No {name} tours available yet
      </p>
      {description && (
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {description}
        </p>
      )}
      <p className="mt-4 text-sm text-gray-500">
        Check back soon for exciting new adventures!
      </p>
    </div>
  );
}

function formatMoney(n) {
  try {
    return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(
      Number(n)
    );
  } catch {
    return String(n);
  }
}