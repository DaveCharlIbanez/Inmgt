import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Mail, Phone, MapPin, Edit2 } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
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
      setFormData(parsedUser);
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/users/${user._id || user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data.data));
        setUser(data.data);
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      alert("Failed to update profile");
    }
  };

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
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>

            {/* Profile Content */}
            <div className="px-8 pb-8">
              {/* Avatar and Basic Info */}
              <div className="flex items-end gap-6 -mt-16 mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg border-4 border-white shadow-lg flex items-center justify-center text-6xl">
                  👤
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-gray-600 capitalize">{user?.role}</p>
                </div>
              </div>

              {/* Edit Button */}
              <div className="mb-8">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                >
                  <Edit2 size={18} />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {user?.firstName || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {user?.lastName || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail size={16} /> Email
                  </label>
                  <p className="text-gray-800 font-medium">{user?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone size={16} /> Contact Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {user?.contactNumber || "Not provided"}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="pt-4 flex gap-4">
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setFormData(user);
                        setIsEditing(false);
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-6">
          {/* Account Status */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member Since</span>
                <span className="text-gray-800 font-medium">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Account Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-all">
                Change Password
              </button>
              <button className="w-full px-4 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 font-medium transition-all">
                Delete Account
              </button>
            </div>
          </div>

          {/* Help */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Questions?</h3>
            <p className="text-sm text-gray-700 mb-4">
              Need help with your profile? Check our help center.
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all text-sm">
              Get Help
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
