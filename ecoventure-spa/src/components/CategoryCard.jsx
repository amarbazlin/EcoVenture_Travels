import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link to={`/categories/${category.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-xl font-semibold group-hover:underline">{category.name}</h3>
        <p className="text-gray-600">{category.description}</p>
      </div>
    </Link>
  );
}
