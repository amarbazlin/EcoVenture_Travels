import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTour, setNewTour] = useState({
    name: "",
    country: "",
    image: "",
    description: "",
    days: "",
    price: "",
    oldPrice: "",
    category: "cycling"
  });

  // Check authentication on component mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (isLoggedIn !== "true") {
      navigate("/admin/login");
      return;
    }
    
    // Load categories data
    loadCategories();
  }, [navigate]);

  const loadCategories = async () => {
    try {
      const response = await fetch("/categories.json");
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      alert("Failed to load tour categories. Please refresh the page.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_email");
    navigate("/admin/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTour(prev => ({
      ...prev,
      [name]: name === "days" || name === "price" || name === "oldPrice" 
        ? (value === "" ? "" : Number(value))
        : value
    }));
  };

  const generateTourId = (name, category) => {
    const prefix = category.toLowerCase().substring(0, 4);
    const suffix = name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 20);
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}-${suffix}-${timestamp}`;
  };

  const showNotification = (message) => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("EcoVenture Admin", {
          body: message,
          icon: "/icons/icon-192x192.png",
        });
      } else if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("EcoVenture Admin", {
              body: message,
              icon: "/icons/icon-192x192.png",
            });
          }
        });
      }
    }
  };

  const handleAddTour = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validation
    if (!newTour.name || !newTour.country || !newTour.description || !newTour.days || !newTour.price) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      // Generate unique ID
      const tourId = generateTourId(newTour.name, newTour.category);
      
      // Create new tour object
      const tour = {
        id: tourId,
        name: newTour.name,
        country: newTour.country.toUpperCase(),
        image: newTour.image || "/default-tour.jpg",
        description: newTour.description,
        days: Number(newTour.days),
        price: Number(newTour.price),
        ...(newTour.oldPrice && { oldPrice: Number(newTour.oldPrice) }),
        rating: 4.5,
        reviews: 0
      };

      // Update categories state
      const updatedCategories = categories.map(category => {
        if (category.name.toLowerCase() === newTour.category.toLowerCase()) {
          return {
            ...category,
            tours: [...category.tours, tour]
          };
        }
        return category;
      });

      setCategories(updatedCategories);

      // Show notification
      showNotification(`New tour "${newTour.name}" added successfully!`);

      // Reset form
      setNewTour({
        name: "",
        country: "",
        image: "",
        description: "",
        days: "",
        price: "",
        oldPrice: "",
        category: "cycling"
      });
      setShowAddForm(false);

      // Show success message
      alert(`Tour "${tour.name}" added successfully to ${newTour.category}!`);

    } catch (error) {
      console.error("Failed to add tour:", error);
      alert("Failed to add tour. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Don't render if not authenticated
  const isLoggedIn = localStorage.getItem("admin_logged_in");
  if (isLoggedIn !== "true") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const categoryOptions = categories.map(cat => cat.name.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-end gap-2">
             
              <span className="text-xs text-gray-500 mb-1">Admin Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {localStorage.getItem("admin_email")}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tour Management</h1>
            <p className="text-gray-600 mt-1">Manage your adventure tours and categories</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-eco text-white px-6 py-3 rounded-lg hover:bg-emerald-800 transition-colors font-medium"
          >
            {showAddForm ? "Cancel" : "Add New Tour"}
          </button>
        </div>

        {/* Add Tour Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Add New Tour</h2>
            <form onSubmit={handleAddTour} className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newTour.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco focus:border-transparent"
                  placeholder="e.g., Nepal Mountain Adventure"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={newTour.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco focus:border-transparent"
                  placeholder="e.g., NEPAL"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={newTour.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco focus:border-transparent"
                  required
                >
                  {categoryOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Days) *
                </label>
                <input
                  type="number"
                  name="days"
                  value={newTour.days}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco focus:border-transparent"
                  min="1"
                  placeholder="e.g., 7"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (£) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={newTour.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco focus:border-transparent"
                  min="0"
                  placeholder="e.g., 1295"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Old Price (£) <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="number"
                  name="oldPrice"
                  value={newTour.oldPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco focus:border-transparent"
                  min="0"
                  placeholder="e.g., 1495"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={newTour.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco focus:border-transparent"
                  placeholder="/tour-image.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={newTour.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco focus:border-transparent"
                  placeholder="Brief description of the tour..."
                  required
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-eco text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors font-medium"
                >
                  {loading ? "Adding Tour..." : "Add Tour"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tours Overview */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Current Tours</h2>
          
          {categories.length === 0 ? (
            <div className="bg-white rounded-xl border p-8 text-center">
              <p className="text-gray-500">Loading categories...</p>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold capitalize text-gray-900">
                    {category.name}
                  </h3>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {category.tours.length} tours
                  </span>
                </div>
                
                {category.tours.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No tours in this category yet.</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {category.tours.map((tour) => (
                      <div key={tour.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        {tour.image && (
                          <img 
                            src={tour.image} 
                            alt={tour.name}
                            className="w-full h-32 object-cover rounded-md mb-3"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <h4 className="font-semibold text-gray-900">{tour.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{tour.country}</p>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{tour.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-600">{tour.days} days</span>
                          <div className="text-right">
                            {tour.oldPrice && (
                              <span className="text-xs text-gray-400 line-through mr-1">
                                £{tour.oldPrice}
                              </span>
                            )}
                            <span className="font-semibold text-eco">£{tour.price}</span>
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          <div className="flex text-yellow-400">
                            {"★".repeat(Math.floor(tour.rating))}
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {tour.rating} ({tour.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}