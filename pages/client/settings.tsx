import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Bell, Moon, Globe, Lock } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState({
    theme: "light",
    language: "en",
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    timezone: "UTC",
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

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
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `/api/settings/home/${user._id || user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            theme: settings.theme,
            language: settings.language,
            notifications: {
              email: settings.emailNotifications,
              push: settings.pushNotifications,
              sms: settings.smsNotifications,
            },
          }),
        }
      );

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      alert("Failed to save settings");
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
        <div className="col-span-2 space-y-6">
          {/* Success Message */}
          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg flex items-center gap-2">
              <span>✓</span>
              <span>Settings saved successfully!</span>
            </div>
          )}

          {/* Display & Theme */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <Moon className="text-purple-600" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Display & Theme</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) =>
                    setSettings({ ...settings, theme: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({ ...settings, language: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="tl">Tagalog</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) =>
                    setSettings({ ...settings, timezone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="CST">CST</option>
                  <option value="MST">MST</option>
                  <option value="PST">PST</option>
                  <option value="GMT">GMT</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="text-blue-600" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Notifications</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      emailNotifications: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-gray-300"
                />
                <div>
                  <p className="font-semibold text-gray-800">Email Notifications</p>
                  <p className="text-sm text-gray-600">
                    Receive important updates via email
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pushNotifications: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-gray-300"
                />
                <div>
                  <p className="font-semibold text-gray-800">Push Notifications</p>
                  <p className="text-sm text-gray-600">
                    Get real-time updates on your device
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smsNotifications: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-gray-300"
                />
                <div>
                  <p className="font-semibold text-gray-800">SMS Notifications</p>
                  <p className="text-sm text-gray-600">
                    Receive important alerts via SMS
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="text-red-600" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Privacy & Security</h3>
            </div>

            <div className="space-y-4">
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all text-left">
                Change Password
              </button>
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all text-left">
                Two-Factor Authentication
              </button>
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all text-left">
                Active Sessions
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all"
            >
              Save All Changes
            </button>
            <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all">
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-6">
          {/* Settings Info */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Settings</h3>
            <p className="text-sm text-gray-700">
              Customize your experience and control how you interact with the
              platform.
            </p>
          </div>

          {/* Quick Settings */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Settings</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2">
                <span className="text-gray-700">Dark Mode</span>
                <button className="w-10 h-6 bg-gray-300 rounded-full relative transition-all">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                </button>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-gray-700">Notifications</span>
                <button className="w-10 h-6 bg-blue-600 rounded-full relative transition-all">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Help & Support</h3>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all text-sm">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
