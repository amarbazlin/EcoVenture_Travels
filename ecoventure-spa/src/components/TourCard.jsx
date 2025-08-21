import { Link } from "react-router-dom";

export default function TourCard({ tour }) {
  return (
    <article className="bg-white rounded-2xl shadow overflow-hidden">
      {tour.image && <img src={tour.image} alt={tour.name} className="h-48 w-full object-cover" />}
      <div className="p-4 grid gap-2">
        <h3 className="text-lg font-semibold">{tour.name}</h3>
        <p className="text-gray-600">{tour.description}</p>
        <p className="text-sm"><span className="font-semibold">Available slots:</span> {tour.baseSlots ?? "N/A"}</p>
        <Link
          to={`/tour/${tour.id}`}
          className="inline-block mt-1 bg-eco text-white px-4 py-2 rounded-xl text-sm font-semibold"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
