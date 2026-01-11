import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { Settings, Database } from "lucide-react";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(storedUser);
    if (parsed.role !== "admin" && parsed.role !== "owner") {
      router.push("/client");
      return;
    }

    setUser(parsed);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
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
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600 flex items-center gap-3">
          <Settings className="text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Platform Controls</p>
            <p className="text-2xl font-bold text-gray-800">Tuluyan Admin Settings</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="flex items-center gap-2">
            <Database className="text-purple-600" />
            <h3 className="text-lg font-bold text-gray-800">Data Modules</h3>
          </div>
          <p className="text-sm text-gray-700">
            Tenant profiles, contracts, occupancy, and billing now write to dedicated MongoDB collections.
            Configure retention, export, and access controls here.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="font-semibold">Collections</p>
              <p className="text-gray-600">Contract, OccupancyRecord, BillingInvoice, ProfileSettings</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="font-semibold">Currency</p>
              <p className="text-gray-600">Default currency set to PHP across billing and tenant profiles.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
