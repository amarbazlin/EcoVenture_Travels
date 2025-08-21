// App.jsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import ToursByCategory from "./pages/ToursByCategory";
import TourDetails from "./pages/TourDetails";
import SearchFiltersOverlay from "./components/SearchFilters";

export default function App() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar onToggleSearch={() => setShowSearch(v => !v)} />

      {/* Fixed, site-wide search container */}
      <SearchFiltersOverlay
        open={showSearch}
        onClose={() => setShowSearch(false)}
      />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:categoryId" element={<ToursByCategory />} />
          <Route path="/tour/:tourId" element={<TourDetails />} />
        </Routes>
      </main>
    </div>
  );
}
