import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [tours, setTours] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTour, setNewTour] = useState({
    name: "",
    country: "",
    image: "",
    description: "",
    days: "",
    price: "",
    oldPrice: "",
    category: "",
    baseSlots: "12"
  });

  // Check authentication on component mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (isLoggedIn !== "true") {
      navigate("/admin/login");
      return;
    }
    
    // Load initial data
    loadInitialData();
  }, [navigate]);

  const loadInitialData = async () => {
    setDataLoading(true);
    setError(null);
    
    try {
      await Promise.all([loadCategories(), loadTours()]);
    } catch (error) {
      console.error("Failed to load initial data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setDataLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      console.log("Loading categories from API...");
      const response = await fetch("http://localhost:4000/api/categories");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Categories API response:", data);
      
      if (data.success && data.data) {
        setCategories(data.data);
        // Set default category for new tour form
        if (data.data.length > 0 && !newTour.category) {
          setNewTour(prev => ({ ...prev, category: data.data[0].categoryKey }));
        }
      } else {
        throw new Error(data.error || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
      setError("Failed to load categories: " + error.message);
    }
  };

  const loadTours = async () => {
    try {
      console.log("Loading tours from API...");
      const response = await fetch("http://localhost:4000/api/tours");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Tours API response:", data);
      
      if (data.success && data.data) {
        setTours(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch tours");
      }
    } catch (error) {
      console.error("Failed to load tours:", error);
      setError("Failed to load tours: " + error.message);
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
      [name]: name === "days" || name === "price" || name === "oldPrice" || name === "baseSlots"
        ? (value === "" ? "" : Number(value))
        : value
    }));
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
    setError(null);
    
    // Validation
    if (!newTour.name || !newTour.country || !newTour.description || !newTour.days || !newTour.price || !newTour.category) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      console.log("Adding new tour:", newTour);
      
      const response = await fetch("http://localhost:4000/api/tours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTour.name,
          country: newTour.country,
          category: newTour.category,
          description: newTour.description,
          image: newTour.image || "/default-tour.jpg",
          days: Number(newTour.days),
          price: Number(newTour.price),
          oldPrice: newTour.oldPrice ? Number(newTour.oldPrice) : null,
          baseSlots: Number(newTour.baseSlots)
        }),
      });

      const data = await response.json();
      console.log("Add tour response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to add tour");
      }

      // Show success notification
      showNotification(`New tour "${newTour.name}" added successfully!`);
      alert(`Tour "${newTour.name}" added successfully!`);

      // Reset form
      setNewTour({
        name: "",
        country: "",
        image: "",
        description: "",
        days: "",
        price: "",
        oldPrice: "",
        category: categories[0]?.categoryKey || "",
        baseSlots: "12"
      });
      setShowAddForm(false);

      // Reload tours to show the new one
      await loadTours();

    } catch (error) {
      console.error("Failed to add tour:", error);
      setError("Failed to add tour: " + error.message);
      alert("Failed to add tour: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTour = async (tourId, tourName) => {
    if (!confirm(`Are you sure you want to delete "${tourName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/tours/${tourId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete tour");
      }

      showNotification(`Tour "${tourName}" deleted successfully!`);
      alert(`Tour "${tourName}" deleted successfully!`);

      // Reload tours
      await loadTours();

    } catch (error) {
      console.error("Failed to delete tour:", error);
      alert("Failed to delete tour: " + error.message);
    }
  };

  // Group tours by category for display
  const toursByCategory = useMemo(() => {
    const grouped = {};
    
    // Initialize with all categories
    categories.forEach(category => {
      grouped[category.categoryKey] = {
        ...category,
        tours: []
      };
    });
    
    // Add tours to their respective categories
    tours.forEach(tour => {
      if (grouped[tour.category]) {
        grouped[tour.category].tours.push(tour);
      }
    });
    
    return Object.values(grouped);
  }, [categories, tours]);

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

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-end gap-2">
              <h1 className="text-2xl font-bold text-eco">EcoVenture</h1>
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
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Tours</h3>
            <p className="text-2xl font-bold text-gray-900">{tours.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Categories</h3>
            <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Countries</h3>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(tours.map(t => t.country)).size}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-800">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

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
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.categoryKey}>
                      {category.name}
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
                  step="0.01"
                  placeholder="e.g., 1295.00"
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
                  step="0.01"
                  placeholder="e.g., 1495.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Slots
                </label>
                <input
                  type="number"
                  name="baseSlots"
                  value={newTour.baseSlots}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco focus:border-transparent"
                  min="1"
                  placeholder="e.g., 12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={newTour.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco focus:border-transparent"
                  placeholder="/tour-image.jpg or full URL"
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
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco focus:border-transparent"
                  placeholder="Brief description of the tour..."
                  required
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-eco text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? "Adding Tour..." : "Add Tour"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setError(null);
                  }}
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
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Current Tours</h2>
            <button
              onClick={loadTours}
              className="text-eco hover:text-emerald-700 font-medium"
            >
              Refresh
            </button>
          </div>
          
          {toursByCategory.length === 0 ? (
            <div className="bg-white rounded-xl border p-8 text-center">
              <p className="text-gray-500">No categories available.</p>
            </div>
          ) : (
            toursByCategory.map((categoryData) => (
              <div key={categoryData.id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold capitalize text-gray-900">
                      {categoryData.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{categoryData.description}</p>
                  </div>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {categoryData.tours.length} tours
                  </span>
                </div>
                
                {categoryData.tours.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No tours in this category yet.</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categoryData.tours.map((tour) => (
                      <div key={tour.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow relative group">
                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteTour(tour.id, tour.name)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1 shadow-sm"
                          title="Delete tour"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>

                        {tour.image && (
                          <img 
                            src={tour.image} 
                            alt={tour.name}
                            className="w-full h-32 object-cover rounded-md mb-3"
                            onError={(e) => {
                              e.target.src = '/default-tour.jpg';
                            }}
                          />
                        )}
                        <h4 className="font-semibold text-gray-900 pr-6">{tour.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{tour.country}</p>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{tour.description}</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-600">{tour.days} days</span>
                          <div className="text-right">
                            {tour.oldPrice && (
                              <span className="text-xs text-gray-400 line-through mr-1">
                                £{formatMoney(tour.oldPrice)}
                              </span>
                            )}
                            <span className="font-semibold text-eco">£{formatMoney(tour.price)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center">
                            <div className="flex text-yellow-400 text-sm">
                              {"★".repeat(Math.floor(tour.rating || 4.5))}
                            </div>
                            <span className="text-xs text-gray-500 ml-2">
                              {tour.rating || 4.5} ({tour.reviews || 0} reviews)
                            </span>
                          </div>
                          {tour.availability && (
                            <span className={[
                              "text-xs px-2 py-1 rounded-full",
                              tour.availability === 'available' 
                                ? "bg-green-100 text-green-800" 
                                : tour.availability === 'limited'
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            ].join(" ")}>
                              {tour.availability}
                            </span>
                          )}
                        </div>
                        
                        {/* Tour metadata */}
                        <div className="mt-3 pt-3 border-t text-xs text-gray-400">
                          <p>ID: {tour.tourKey || tour.id}</p>
                          <p>Slots: {tour.baseSlots || 12}</p>
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

function formatMoney(n) {
  try {
    return new Intl.NumberFormat("en-GB", { 
      maximumFractionDigits: 0 
    }).format(Number(n));
  } catch {
    return String(n);
  }
}