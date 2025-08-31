import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import categoriesData from "/public/categories.json";

const MONTHS = [
  "All months","January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function SearchFiltersOverlay({ open, onClose }) {
  const navigate = useNavigate();

  // Activities list (matches your JSON categories)
  const activities = useMemo(
    () => [
      "All activities",
      ...categoriesData.categories.map(category => category.name)
    ],
    []
  );

  // Form state
  const [activity, setActivity] = useState(activities[0]);
  const [destination, setDestination] = useState("All Destinations");
  const [month, setMonth] = useState(MONTHS[0]);

  // Get destinations by activity from actual JSON data
  const destinationOptions = useMemo(() => {
    if (activity === "All activities") {
      // Get all unique countries from all tours
      const allCountries = categoriesData.categories
        .flatMap(category => category.tours.map(tour => tour.country));
      return ["All Destinations", ...Array.from(new Set(allCountries))];
    }
    
    // Get countries for specific activity
    const selectedCategory = categoriesData.categories.find(
      category => category.name === activity
    );
    
    if (selectedCategory) {
      const countries = selectedCategory.tours.map(tour => tour.country);
      return ["All Destinations", ...Array.from(new Set(countries))];
    }
    
    return ["All Destinations"];
  }, [activity]);

  // Keep destination valid when activity changes
  useEffect(() => {
    if (!destinationOptions.includes(destination)) {
      setDestination("All Destinations");
    }
  }, [activity, destinationOptions, destination]);

  // Reset when opened
  useEffect(() => {
    if (open) {
      setActivity(activities[0]);
      setDestination("All Destinations");
      setMonth(MONTHS[0]);
    }
  }, [open, activities]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Scroll lock
  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", open);
    return () => {
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [open]);

  if (!open) return null;

  function onSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    
    // Only add non-default parameters
    if (activity !== "All activities") {
      params.set("activity", activity);
    }
    if (destination !== "All Destinations") {
      params.set("destination", destination);
    }
    if (month !== "All months") {
      params.set("month", month);
    }
    
    // Navigate to activities page with search parameters
    const queryString = params.toString();
    navigate(`/activities${queryString ? `?${queryString}` : ""}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button 
        onClick={onClose} 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        aria-label="Close search overlay" 
      />
      
      {/* Modal Content */}
      <div className="absolute left-1/2 -translate-x-1/2 top-6 w-[94%] md:w-[90%] lg:w-[70rem]">
        <div className="rounded-2xl bg-zinc-900/90 text-white shadow-2xl ring-1 ring-white/10">
          {/* Header */}
          <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-5">
            <p className="uppercase tracking-wide text-xs md:text-sm font-semibold text-white/85">
              Find your next adventure
            </p>
            <button 
              onClick={onClose} 
              className="rounded-lg px-3 py-1.5 text-sm bg-white/10 hover:bg-white/15 transition-colors"
            >
              Close
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={onSearch} className="px-4 md:px-6 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Destination (driven by activity) */}
              <LabeledSelect
                label="Destination"
                value={destination}
                onChange={setDestination}
                options={destinationOptions}
              />
              {/* Activity */}
              <LabeledSelect
                label="Activity"
                value={activity}
                onChange={setActivity}
                options={activities}
              />
              {/* Month */}
              <LabeledSelect
                label="Departure Month"
                value={month}
                onChange={setMonth}
                options={MONTHS}
              />
              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl px-6 py-3 shadow focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors"
                >
                  SEARCH
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function LabeledSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-xs md:text-sm uppercase text-white/85 font-medium">
        {label}
      </span>
      <div className="mt-1 relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg bg-white text-gray-800 px-3 py-2 md:py-3 shadow focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          ▼
        </span>
      </div>
    </label>
  );
}