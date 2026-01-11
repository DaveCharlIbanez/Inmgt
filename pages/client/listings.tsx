import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Star, MapPin, Wifi, Wind, ChefHat, Armchair, Heart, CheckCircle2, AlertTriangle } from "lucide-react";

interface Listing {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  amenities: string[];
  rooms: number;
  beds: number;
}

export default function ListingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filterPrice, setFilterPrice] = useState(12000);
  const [loading, setLoading] = useState(true);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [reservationDate, setReservationDate] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadListings = async () => {
    const mockListings: Listing[] = [
      {
        id: 1,
        name: "UP Campus Dorm",
        location: "Diliman University District",
        price: 6500,
        rating: 4.8,
        image: "/images/listings/room1.jpg",
        description:
          "Cozy single with a bright study desk by the window, perfect for focused nights and quiet mornings.",
        amenities: ["WiFi", "Air Conditioning", "Kitchen"],
        rooms: 1,
        beds: 2,
      },
      {
        id: 2,
        name: "Katipunan Study Loft",
        location: "Katipunan, Quezon City",
        price: 8200,
        rating: 4.6,
        image: "/images/listings/room2.jpg",
        description:
          "Dual-desk setup with generous windows, great for roommates who balance study and downtime.",
        amenities: ["WiFi", "Air Conditioning", "Kitchen", "Parking"],
        rooms: 2,
        beds: 3,
      },
      {
        id: 3,
        name: "España Student Pads",
        location: "University Belt, Manila",
        price: 7200,
        rating: 4.9,
        image: "/images/listings/room3.jpg",
        description:
          "Spacious shared suite with ceiling fan, built-in storage, and warm lighting for late-night reviews.",
        amenities: ["WiFi", "Air Conditioning", "Kitchen", "Parking", "Gym"],
        rooms: 3,
        beds: 4,
      },
      {
        id: 4,
        name: "Taft Shared Suites",
        location: "Taft Avenue, Manila",
        price: 9000,
        rating: 4.7,
        image: "/images/listings/room4.jpg",
        description:
          "Modern studio vibe with clean lines, accent art, and layered lighting for a calm retreat.",
        amenities: ["WiFi", "Kitchen", "Air Conditioning", "Study Lounge"],
        rooms: 2,
        beds: 4,
      },
      {
        id: 5,
        name: "Baguio Cool Dorms",
        location: "Session Road, Baguio",
        price: 5800,
        rating: 4.5,
        image: "/images/listings/room5.jpg",
        description:
          "Airy twin setup with built-ins and mirrored closets, ready for cozy cool-season stays.",
        amenities: ["WiFi", "Kitchen", "Parking", "Garden"],
        rooms: 2,
        beds: 3,
      },
      {
        id: 6,
        name: "Cebu IT Park Boarding",
        location: "IT Park, Cebu City",
        price: 7800,
        rating: 4.7,
        image: "/images/listings/room6.jpg",
        description:
          "Sleek single with under-bed storage, workstation, and a warm palette that pairs with city nights.",
        amenities: ["WiFi", "Air Conditioning", "Kitchen", "Parking"],
        rooms: 3,
        beds: 5,
      },
    ];
    setListings(mockListings);
    setLoading(false);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "client") {
        router.push("/");
      }
      setUser(parsedUser);
      loadListings();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReserve = (listing: Listing) => {
    setSelectedListing(listing);
    setShowReserveModal(true);
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setReservationDate(tomorrow.toISOString().split('T')[0]);
  };

  const confirmReservation = async () => {
    if (!selectedListing || !reservationDate) {
      showNotification("error", "Please select a move-in date");
      return;
    }

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id || user.id,
          propertyName: selectedListing.name,
          roomNumber: "TBD",
          moveInDate: reservationDate,
        }),
      });

      if (response.ok) {
        showNotification("success", "Reservation successful! Admin will contact you soon.");
        setShowReserveModal(false);
        setSelectedListing(null);
      } else {
        const data = await response.json();
        showNotification("error", data.error || "Failed to create reservation");
      }
    } catch (error) {
      showNotification("error", "An error occurred. Please try again.");
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const amenityIcons: Record<string, React.ReactNode> = {
    WiFi: <Wifi size={16} />,
    "Air Conditioning": <Wind size={16} />,
    Kitchen: <ChefHat size={16} />,
    Parking: <Armchair size={16} />,
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value || 0);

  const filteredListings = listings.filter((l) => l.price <= filterPrice);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Filters</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Rate: {formatCurrency(filterPrice)}
              </label>
              <input
                type="range"
                min="4000"
                max="15000"
                step="250"
                value={filterPrice}
                onChange={(e) => setFilterPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Amenities</h4>
              <div className="space-y-2">
                {["WiFi", "Air Conditioning", "Kitchen", "Parking"].map(
                  (amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Rating</h4>
              <div className="space-y-2">
                {["4.5+", "4.0+", "3.5+"].map((rating) => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-sm text-gray-700">{rating}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all">
              Reset Filters
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="col-span-3">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              Showing {filteredListings.length} of {listings.length} listings
            </p>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>Sort by: Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating: Highest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={listing.image}
                    alt={listing.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                  <button
                    onClick={() => toggleFavorite(listing.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                  >
                    <Heart
                      size={20}
                      className={
                        favorites.includes(listing.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {listing.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold text-yellow-700">
                        {listing.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin size={16} />
                    <span className="text-sm">{listing.location}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 overflow-hidden text-ellipsis max-h-12 leading-6">
                    {listing.description}
                  </p>

                  <div className="flex gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">
                      {listing.rooms} Room{listing.rooms > 1 ? "s" : ""}
                    </span>
                    <span className="font-medium">
                      {listing.beds} Bed{listing.beds > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {listing.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded"
                      >
                        {amenityIcons[amenity] || null}
                        {amenity}
                      </span>
                    ))}
                      {listing.amenities.length > 3 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{listing.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(listing.price)}
                      </p>
                      <p className="text-xs text-gray-500">per month</p>
                    </div>
                    <button
                      onClick={() => handleReserve(listing)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {showReserveModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-slide-in">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Reserve This Room
            </h3>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Property:</span> {selectedListing.name}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Location:</span> {selectedListing.location}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Monthly Rate:</span> {formatCurrency(selectedListing.price)}
              </p>
              
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Move-in Date
              </label>
              <input
                type="date"
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-sm text-blue-800">
                Your reservation will be submitted to the admin for review. You will be contacted shortly to confirm availability and arrange viewing.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReserveModal(false);
                  setSelectedListing(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmReservation}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}
