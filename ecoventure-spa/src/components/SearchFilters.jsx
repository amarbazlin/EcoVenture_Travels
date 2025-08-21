import { useEffect, useMemo, useState } from "react";
import categories from "../data/categories.json";

const MONTHS = [
  "All months","January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function SearchFiltersOverlay({ open, onClose }) {
  // Build options once
  const destinations = useMemo(
    () => ["All Destinations", ...new Set(categories.categories.map(c => c.name))],
    []
  );
  const activities = useMemo(
    () => ["All activities", "Hiking", "Cycling", "Nature Walks"],
    []
  );

  // Form state
  const [destination, setDestination] = useState(destinations[0]);
  const [activity, setActivity] = useState(activities[0]);
  const [month, setMonth] = useState(MONTHS[0]);

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (open) document.documentElement.classList.add("overflow-hidden");
    else document.documentElement.classList.remove("overflow-hidden");
  }, [open]);

  if (!open) return null;

  function onSearch(e) {
    e.preventDefault();
    // TODO: navigate/filter your tours page here
    console.log({ destination, activity, month });
    alert(`Search:\nDestination: ${destination}\nActivity: ${activity}\nMonth: ${month}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        onClick={onClose}
        aria-label="Close search overlay"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Panel (centered at top) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-6 w-[94%] md:w-[90%] lg:w-[70rem]">
        <div className="rounded-2xl bg-zinc-900/90 text-white shadow-2xl ring-1 ring-white/10">
          <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-5">
            <p className="uppercase tracking-wide text-xs md:text-sm font-semibold text-white/85">
              Find your next adventure
            </p>
            <button
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-sm bg-white/10 hover:bg-white/15"
            >
              Close
            </button>
          </div>

          <form onSubmit={onSearch} className="px-4 md:px-6 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <LabeledSelect
                label="Destination"
                value={destination}
                onChange={setDestination}
                options={destinations}
              />
              <LabeledSelect
                label="Activity"
                value={activity}
                onChange={setActivity}
                options={activities}
              />
              <LabeledSelect
                label="Departure Month"
                value={month}
                onChange={setMonth}
                options={MONTHS}
              />
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold
                             rounded-xl px-6 py-3 shadow focus:outline-none focus:ring-2 focus:ring-teal-400"
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
      <span className="text-xs md:text-sm uppercase text-white/85">{label}</span>
      <div className="mt-1 relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg bg-white text-gray-800 px-3 py-2 md:py-3
                     shadow focus:outline-none focus:ring-2 focus:ring-teal-500"
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
