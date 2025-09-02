// src/pages/Wishlist.jsx
import { useState, useEffect } from "react";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ecoventure-wishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    }
  }, []);

  // Remove from wishlist
  const removeFromWishlist = (tourId) => {
    const updated = wishlist.filter(item => item.id !== tourId);
    setWishlist(updated);
    localStorage.setItem("ecoventure-wishlist", JSON.stringify(updated));
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem("ecoventure-wishlist");
  };

  return (
    <section className="max-w-8xl mx-auto px-4 md:px-20 py-10 bg-white dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-serif text-gray-900 dark:text-gray-100 mb-4">
          My Wishlist
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Your saved adventure tours
        </p>
      </div>

      {/* Wishlist content */}
      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-6">
            <svg 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              className="mx-auto text-gray-300 dark:text-gray-600"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start exploring tours and add your favorites to your wishlist!
          </p>
          <a
            href="/activities"
            className="inline-flex items-center justify-center rounded-xl bg-eco text-white px-6 py-3 font-semibold shadow hover:bg-eco/90 transition-colors"
          >
            Browse Tours
          </a>
        </div>
      ) : (
        <>
          {/* Wishlist actions */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-700 dark:text-gray-300">
              {wishlist.length} tour{wishlist.length !== 1 ? 's' : ''} saved
            </p>
            <button
              onClick={clearWishlist}
              className="px-4 py-2 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Wishlist grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((tour) => (
              <WishlistTourCard 
                key={tour.id} 
                tour={tour} 
                onRemove={removeFromWishlist}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function WishlistTourCard({ tour, onRemove }) {
  const hasOffer = typeof tour.oldPrice === "number";

  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-slate-200/70 dark:ring-gray-700 overflow-hidden hover:shadow-md transition">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover"
        />
        
        {/* Remove from wishlist button */}
        <button
          onClick={() => onRemove(tour.id)}
          className="absolute top-4 right-4 p-2 rounded-full bg-red-500/80 backdrop-blur-sm hover:bg-red-500 transition-all"
          aria-label="Remove from wishlist"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Category badge */}
        {tour.category && (
          <div className="absolute top-4 left-4 px-2 py-1 bg-eco/80 backdrop-blur-sm text-white text-xs font-semibold rounded">
            {tour.category}
          </div>
        )}

        <h3 className="absolute left-4 bottom-6 right-16 text-white text-xl md:text-2xl font-semibold drop-shadow">
          {tour.name}
        </h3>
      </div>
      
      <div className="p-5">
        <div className="text-gray-900 dark:text-gray-100">
          <span className="text-lg font-extrabold">{tour.days} Days</span>
          <span className="text-gray-500 dark:text-gray-400"> from </span>
          {hasOffer && (
            <span className="text-gray-400 line-through mr-1">
              £ {formatMoney(tour.oldPrice)}
            </span>
          )}
          <span className="text-green-700 dark:text-green-400 font-extrabold">
            £ {formatMoney(tour.price)}
          </span>
        </div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {tour.description}
        </p>
        
        {/* Action buttons */}
        <div className="mt-4 flex gap-2">
          <button className="flex-1 bg-eco text-white px-4 py-2 rounded-lg hover:bg-eco/90 transition-colors text-sm font-semibold">
            View Details
          </button>
          <button 
            onClick={() => onRemove(tour.id)}
            className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}

function formatMoney(n) {
  try {
    return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(n);
  } catch {
    return String(n);
  }
}