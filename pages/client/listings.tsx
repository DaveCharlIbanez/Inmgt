import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Star, MapPin, Wifi, Wind, ChefHat, Armchair, Heart } from "lucide-react";

interface Listing {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image?: string;
  amenities: string[];
  rooms: number;
  beds: number;
}

export default function ListingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filterPrice, setFilterPrice] = useState(5000);
  const [loading, setLoading] = useState(true);

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

  const loadListings = async () => {
    const mockListings: Listing[] = [
      {
        id: 1,
        name: "Cozy Downtown Suite",
        location: "Downtown District",
        price: 1200,
        rating: 4.8,
        amenities: ["WiFi", "Air Conditioning", "Kitchen"],
        rooms: 1,
        beds: 2,
      },
      {
        id: 2,
        name: "Modern Boarding House",
        location: "Business Center",
        price: 1500,
        rating: 4.6,
        amenities: ["WiFi", "Air Conditioning", "Kitchen", "Parking"],
        rooms: 2,
        beds: 3,
      },
      {
        id: 3,
        name: "Luxury Student Housing",
        location: "University Area",
        price: 2000,
        rating: 4.9,
        amenities: ["WiFi", "Air Conditioning", "Kitchen", "Parking", "Gym"],
        rooms: 3,
        beds: 4,
      },
      {
        id: 4,
        name: "Budget Friendly Haven",
        location: "Residential Zone",
        price: 900,
        rating: 4.4,
        amenities: ["WiFi", "Kitchen"],
        rooms: 1,
        beds: 2,
      },
      {
        id: 5,
        name: "Premium Penthouse",
        location: "City Center",
        price: 3000,
        rating: 4.9,
        amenities: [
          "WiFi",
          "Air Conditioning",
          "Kitchen",
          "Parking",
          "Gym",
          "Rooftop Lounge",
        ],
        rooms: 3,
        beds: 5,
      },
      {
        id: 6,
        name: "Peaceful Suburban Home",
        location: "Suburban District",
        price: 1100,
        rating: 4.7,
        amenities: ["WiFi", "Garden", "Kitchen"],
        rooms: 2,
        beds: 3,
      },
    ];
    setListings(mockListings);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
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
                Max Price: ${filterPrice}
              </label>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
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
                {/* Image Placeholder */}
                <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 h-48 flex items-center justify-center overflow-hidden">
                  <div className="text-white text-center opacity-75">
                    <p className="text-6xl">🏠</p>
                    <p className="text-sm mt-2">Image placeholder</p>
                  </div>
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
                        ${listing.price}
                      </p>
                      <p className="text-xs text-gray-500">per month</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
