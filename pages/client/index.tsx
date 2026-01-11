import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Mail, Phone, MapPin, Bookmark, Heart } from "lucide-react";

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async (userId: string) => {
    try {
      const response = await fetch(`/api/settings/home/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
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
      fetchSettings(parsedUser._id || parsedUser.id);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value || 0);

  const featuredListings = [
    {
      id: 1,
      name: "UP Campus Dorm",
      location: "Diliman University District",
      price: 6500,
      image: "/images/listings/room1.jpg",
      description:
        "Cozy single with a bright study desk by the window, perfect for focused nights and quiet mornings.",
    },
    {
      id: 2,
      name: "Katipunan Study Loft",
      location: "Katipunan, Quezon City",
      price: 8200,
      image: "/images/listings/room2.jpg",
      description:
        "Dual-desk setup with generous windows, great for roommates who balance study and downtime.",
    },
    {
      id: 3,
      name: "Taft Shared Suites",
      location: "Taft Avenue, Manila",
      price: 9000,
      image: "/images/listings/room4.jpg",
      description:
        "Modern studio vibe with clean lines, accent art, and layered lighting for a calm retreat.",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName || "User"}!
            </h2>
            <p className="text-blue-100">
              Find your perfect boarding house and explore amazing properties.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-pink-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Saved Properties</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
                </div>
                <Heart className="text-pink-600" size={40} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Applications</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
                </div>
                <Bookmark className="text-blue-600" size={40} />
              </div>
            </div>
          </div>

          {/* Featured Listings */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Trending Properties
            </h3>
            <div className="space-y-4">
              {featuredListings.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all cursor-pointer"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.location}</p>
                    <p className="text-sm text-gray-600 mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.description}
                    </p>
                    <p className="text-lg font-bold text-blue-600 mt-1">
                      {formatCurrency(item.price)}/month
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-all">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">My Profile</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Full Name
                </p>
                <p className="text-gray-800 font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-1">
                  <Mail size={14} /> Email
                </p>
                <p className="text-gray-800 font-medium text-sm">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-1">
                  <Phone size={14} /> Contact
                </p>
                <p className="text-gray-800 font-medium">
                  {user?.contactNumber || "Not provided"}
                </p>
              </div>
              <button className="w-full mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-all">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Settings Preview */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Preferences</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Theme</p>
                <p className="text-gray-800 font-semibold capitalize">
                  {settings?.theme || "Light"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Language</p>
                <p className="text-gray-800 font-semibold">
                  {settings?.language || "English"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Notifications</p>
                <p className="text-gray-800 font-semibold">
                  {settings?.notifications?.email ? "Enabled" : "Disabled"}
                </p>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all">
                View All Settings
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Need Help?</h3>
            <p className="text-sm text-gray-700 mb-4">
              Check our FAQ or contact support for assistance.
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all text-sm">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}