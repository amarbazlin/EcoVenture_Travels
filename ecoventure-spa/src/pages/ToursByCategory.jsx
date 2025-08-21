import { useParams, Link } from "react-router-dom";
import data from "../data/categories.json";
import TourCard from "../components/TourCard";
import SearchBar from "../components/SearchBar";
import { useMemo, useState } from "react";

export default function ToursByCategory() {
  const { categoryId } = useParams();
  const category = data.categories.find(c => c.id === categoryId);

  const [q, setQ] = useState("");
  const tours = category?.tours ?? [];

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return tours;
    return tours.filter(x =>
      x.name.toLowerCase().includes(t) ||
      (x.description || "").toLowerCase().includes(t)
    );
  }, [q, tours]);

  if (!category) return <p>Category not found. <Link to="/categories" className="text-eco underline">Back</Link></p>;

  return (
    <section className="grid gap-4">
      <h2 className="text-2xl font-bold">{category.name}</h2>
      <SearchBar value={q} onChange={setQ} placeholder="Search tours..." />
      {filtered.length === 0 ? (
        <p className="text-gray-600">No tours match your search.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((t) => <TourCard key={t.id} tour={t} />)}
        </div>
      )}
    </section>
  );
}
