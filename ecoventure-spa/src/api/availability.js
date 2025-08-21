export async function fetchAvailability(tourId) {
  const url = `${import.meta.env.VITE_API_URL}/availability/${tourId}`;
  try {
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json(); // { availableSlots: number }
  } catch (e) {
    console.error("Availability fetch failed:", e);
    return { availableSlots: null };
  }
}
