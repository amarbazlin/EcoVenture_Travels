// App.jsx
import { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import Wishlist from "./pages/Wishlist";
import ToursByCategory from "./pages/ToursByCategory";
import TourDetails from "./pages/TourDetails";
import SearchFiltersOverlay from "./components/SearchFilters";
import Footer from "./components/Footer";
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

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
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/categories/:categoryId" element={<ToursByCategory />} />
          <Route path="/tour/:tourId" element={<TourDetails />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}