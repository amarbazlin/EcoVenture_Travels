import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// (you can remove categories.json import if you no longer need it here)

const MONTHS = [
  "All months","January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

// 🔹 UK places by activity
const DESTS_BY_ACTIVITY = {
  Cycling: [
    "Lake District", "Yorkshire Dales", "Isle of Wight", "Cornwall",
    "Cotswolds", "New Forest", "Peak District"
  ],
  Hiking: [
    "Lake District", "Snowdonia (Eryri)", "Scottish Highlands",
    "Peak District", "Brecon Beacons (Bannau Brycheiniog)",
    "Yorkshire Dales", "Dartmoor"
  ],
  "Mountain Climbing": [
    "Ben Nevis", "Snowdonia (Tryfan/Carneddau)", "Isle of Skye (Cuillin)",
    "Cairngorms"
  ],
  Rafting: [
    "River Tay (Perthshire)", "River Findhorn", "River Dee (Wales)",
    "River Tummel"
  ],
  "Wild Swimming": [
    "Buttermere (Lake District)", "Fairy Pools (Skye)", "River Wye",
    "Kielder Water", "Cornish Coves"
  ],
  "Wildlife Watching": [
    "Farne Islands", "Cairngorms National Park", "RSPB Minsmere",
    "Pembrokeshire Coast", "Lundy Island"
  ],
};

export default function SearchFiltersOverlay({ open, onClose }) {
  const navigate = useNavigate();

  // Activities list (matches your cards)
  const activities = useMemo(
    () => [
      "All activities",
      "Cycling",
      "Hiking",
      "Mountain Climbing",
      "Rafting",
      "Wild Swimming",
      "Wildlife Watching",
    ],
    []
  );

  // Destination options depend on selected activity
  const [activity, setActivity] = useState(activities[0]);

  const destinationOptions = useMemo(() => {
    if (activity === "All activities") {
      // union of all places
      const all = Object.values(DESTS_BY_ACTIVITY).flat();
      return ["All Destinations", ...Array.from(new Set(all))];
    }
    return ["All Destinations", ...(DESTS_BY_ACTIVITY[activity] ?? [])];
  }, [activity]);

  // Form state
  const [destination, setDestination] = useState("All Destinations");
  const [month, setMonth] = useState(MONTHS[0]);

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
  }, [open]);

  if (!open) return null;

  function onSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activity !== "All activities") params.set("activity", activity);
    if (destination !== "All Destinations") params.set("destination", destination);
    if (month !== "All months") params.set("month", month);
    navigate(`/activities${params.toString() ? `?${params.toString()}` : ""}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50">
      <button onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-label="Close search overlay" />
      <div className="absolute left-1/2 -translate-x-1/2 top-6 w-[94%] md:w-[90%] lg:w-[70rem]">
        <div className="rounded-2xl bg-zinc-900/90 text-white shadow-2xl ring-1 ring-white/10">
          <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-5">
            <p className="uppercase tracking-wide text-xs md:text-sm font-semibold text-white/85">
              Find your next adventure
            </p>
            <button onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm bg-white/10 hover:bg-white/15">Close</button>
          </div>

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
              {/* Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl px-6 py-3 shadow focus:outline-none focus:ring-2 focus:ring-teal-400"
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
          className="w-full appearance-none rounded-lg bg-white text-gray-800 px-3 py-2 md:py-3 shadow focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▼</span>
      </div>
    </label>
  );
}
