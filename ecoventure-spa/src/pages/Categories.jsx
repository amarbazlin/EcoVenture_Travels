import data from "../data/categories.json";
import CategoryCard from "../components/CategoryCard";

export default function Categories() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Tour Categories</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {data.categories.map((c) => <CategoryCard key={c.id} category={c} />)}
      </div>
    </section>
  );
}
