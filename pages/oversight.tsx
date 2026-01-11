import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { Users, FileText, Building2, CheckCircle2, AlertTriangle } from "lucide-react";

interface TenantProfile {
  _id: string;
  userId: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    isActive?: boolean;
  };
  displayName?: string;
  preferences?: { currency?: string };
  updatedAt: string;
}

interface ContractItem {
  _id: string;
  propertyName: string;
  roomNumber?: string;
  status: string;
  rentAmount: number;
  currency: string;
  startDate: string;
  endDate?: string;
  userId?: { firstName?: string; lastName?: string };
}

interface OccupancyItem {
  _id: string;
  propertyName: string;
  roomNumber?: string;
  status: string;
  moveInDate: string;
  moveOutDate?: string;
  userId?: { firstName?: string; lastName?: string };
}

export default function TenantOversightPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<TenantProfile[]>([]);
  const [contracts, setContracts] = useState<ContractItem[]>([]);
  const [occupancy, setOccupancy] = useState<OccupancyItem[]>([]);
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
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [profilesRes, contractsRes, occupancyRes] = await Promise.all([
        fetch("/api/admin/tenants/profiles"),
        fetch("/api/admin/contracts"),
        fetch("/api/admin/occupancy"),
      ]);

      if (profilesRes.ok) {
        const data = await profilesRes.json();
        setProfiles(data.data?.profiles || []);
      }

      if (contractsRes.ok) {
        const data = await contractsRes.json();
        setContracts(data.data || []);
      }

      if (occupancyRes.ok) {
        const data = await occupancyRes.json();
        setOccupancy(data.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const formatCurrency = (value: number, currency = "PHP") =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency }).format(value || 0);

  const overview = {
    activeContracts: contracts.filter((c) => c.status === "active").length,
    currentOccupancy: occupancy.filter((o) => o.status === "checked-in").length,
    overdue: occupancy.filter((o) => o.status === "overdue").length,
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
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tenant Profiles</p>
                <p className="text-3xl font-bold text-gray-800">{profiles.length}</p>
              </div>
              <Users className="text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Contracts</p>
                <p className="text-3xl font-bold text-gray-800">{overview.activeContracts}</p>
              </div>
              <FileText className="text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Checked-in Occupants</p>
                <p className="text-3xl font-bold text-gray-800">{overview.currentOccupancy}</p>
              </div>
              <Building2 className="text-purple-600" />
            </div>
          </div>
        </div>

        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Profiles</h3>
            <span className="text-sm text-gray-500">Latest updates</span>
          </div>
          <div className="space-y-3">
            {profiles.slice(0, 5).map((profile) => (
              <div key={profile._id} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
                <div>
                  <p className="font-semibold text-gray-800">
                    {profile.userId?.firstName} {profile.userId?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{profile.userId?.email}</p>
                </div>
                <div className="text-sm text-gray-700">{profile.displayName || "Profile"}</div>
                <div className="text-xs text-gray-500">
                  {new Date(profile.updatedAt).toLocaleDateString("en-PH")}
                </div>
              </div>
            ))}
            {!profiles.length && <p className="text-sm text-gray-500">No tenant profiles yet.</p>}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Contracts</h3>
            <span className="text-sm text-gray-500">Monitoring tenant agreements</span>
          </div>
          <div className="space-y-3">
            {contracts.slice(0, 5).map((contract) => (
              <div key={contract._id} className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 rounded-lg px-4 py-3 gap-2">
                <div>
                  <p className="font-semibold text-gray-800">{contract.propertyName}</p>
                  <p className="text-sm text-gray-500">
                    {contract.userId?.firstName} {contract.userId?.lastName}
                  </p>
                </div>
                <div className="text-sm text-gray-700">
                  {formatCurrency(contract.rentAmount, contract.currency)} / mo
                </div>
                <div className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 capitalize">
                  {contract.status}
                </div>
              </div>
            ))}
            {!contracts.length && <p className="text-sm text-gray-500">No contracts recorded.</p>}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Occupancy</h3>
            <span className="text-sm text-gray-500">Boarding house occupancy health</span>
          </div>
          <div className="space-y-3">
            {occupancy.slice(0, 5).map((record) => (
              <div key={record._id} className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 rounded-lg px-4 py-3 gap-2">
                <div>
                  <p className="font-semibold text-gray-800">{record.propertyName}</p>
                  <p className="text-sm text-gray-500">
                    {record.userId?.firstName} {record.userId?.lastName}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  {record.status === "checked-in" ? (
                    <CheckCircle2 className="text-green-600" size={16} />
                  ) : (
                    <AlertTriangle className="text-orange-500" size={16} />
                  )}
                  <span className="capitalize">{record.status}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Move-in: {new Date(record.moveInDate).toLocaleDateString("en-PH")}
                </div>
              </div>
            ))}
            {!occupancy.length && <p className="text-sm text-gray-500">No occupancy records yet.</p>}
          </div>
        </section>
      </div>
    </Layout>
  );
}
