import { useParams, Link } from "react-router-dom";


export default function TourDetails() {
  const { tourId } = useParams();
  const tour = data.categories.flatMap(c => c.tours || []).find(t => t.id === tourId);

  if (!tour) return <p>Tour not found. <Link to="/categories" className="text-eco underline">Back</Link></p>;

  return (
    <section className="grid md:grid-cols-2 gap-6">
      {tour.image && <img src={tour.image} alt={tour.name} className="rounded-2xl shadow object-cover w-full h-80" />}
      <div className="grid gap-3">
        <h1 className="text-3xl font-bold">{tour.name}</h1>
        <p className="text-gray-700">{tour.description}</p>
        <Link to="/categories" className="text-eco underline">Back to categories</Link>
      </div>
    </section>
  );
}
