import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import { Wrench, Calendar, FileText, Clock, Hash, Plus, XCircle, CheckCircle2 } from "lucide-react";

interface ServiceRequest {
  id: string;
  userId: string;
  type: string;
  category: string;
  description: string;
  unit: string;
  preferredDate: string; // ISO date
  preferredTime: string; // HH:mm
  status: "New" | "In Progress" | "Completed" | "Cancelled";
  createdAt: string; // ISO
}

export default function ServiceRequestsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [form, setForm] = useState({
    type: "Repair",
    category: "Plumbing",
    description: "",
    unit: "",
    preferredDate: "",
    preferredTime: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "client") {
      router.push("/");
      return;
    }
    setUser(parsedUser);

    const key = `serviceRequests:${parsedUser._id || parsedUser.id}`;
    const stored = localStorage.getItem(key);
    if (stored) setRequests(JSON.parse(stored));
    setLoading(false);
  }, [router]);

  const persist = (next: ServiceRequest[]) => {
    const key = `serviceRequests:${user._id || user.id}`;
    localStorage.setItem(key, JSON.stringify(next));
    setRequests(next);
  };

  const createId = () =>
    `SR-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.unit || !form.preferredDate || !form.preferredTime) {
      alert("Please complete all required fields.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const newReq: ServiceRequest = {
        id: createId(),
        userId: user._id || user.id,
        type: form.type,
        category: form.category,
        description: form.description,
        unit: form.unit,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        status: "New",
        createdAt: new Date().toISOString(),
      };
      const next = [newReq, ...requests];
      persist(next);
      setForm({ type: "Repair", category: "Plumbing", description: "", unit: "", preferredDate: "", preferredTime: "" });
      setSaving(false);
    }, 800);
  };

  const cancelRequest = (id: string) => {
    const next = requests.map<ServiceRequest>((r) => {
      if (r.id === id && r.status === "New") {
        const updated: ServiceRequest = { ...r, status: "Cancelled" };
        return updated;
      }
      return r;
    });
    persist(next);
  };

  const statusBadge = (status: ServiceRequest["status"]) => {
    const color =
      status === "New" ? "bg-blue-100 text-blue-800" :
      status === "In Progress" ? "bg-amber-100 text-amber-800" :
      status === "Completed" ? "bg-green-100 text-green-800" :
      "bg-gray-100 text-gray-700";
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="grid grid-cols-3 gap-6">
        {/* Form */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">New Service Request</h3>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option>Repair</option>
                <option>Servicing</option>
                <option>Cleaning</option>
                <option>Inspection</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Appliance</option>
                <option>Pest Control</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Unit/Room</label>
              <input
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                placeholder="e.g. Room 3B"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the issue or service needed"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} /> Preferred Date
                </label>
                <input
                  type="date"
                  value={form.preferredDate}
                  onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Clock size={16} /> Preferred Time
                </label>
                <input
                  type="time"
                  value={form.preferredTime}
                  onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-60"
            >
              <Plus size={18} /> {saving ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>

        {/* Requests List */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">My Requests</h3>
            {requests.length === 0 ? (
              <p className="text-gray-600">No service requests yet. Submit one using the form.</p>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <div key={r.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Hash size={18} className="text-gray-500" />
                        <p className="font-semibold text-gray-800">{r.id}</p>
                        {statusBadge(r.status)}
                      </div>
                      <p className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Type</p>
                        <p className="font-medium">{r.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Category</p>
                        <p className="font-medium">{r.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Unit</p>
                        <p className="font-medium">{r.unit}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Preferred</p>
                        <p className="font-medium">{r.preferredDate} {r.preferredTime}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-gray-700"><span className="text-gray-500">Description: </span>{r.description}</p>
                      <div className="flex gap-2">
                        {r.status === "New" && (
                          <button onClick={() => cancelRequest(r.id)} className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 text-sm flex items-center gap-1">
                            <XCircle size={16} /> Cancel
                          </button>
                        )}
                        {r.status === "Completed" && (
                          <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm flex items-center gap-1">
                            <CheckCircle2 size={16} /> Done
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-md font-bold text-gray-800 mb-2">How it works</h3>
            <ol className="text-sm text-gray-700 list-decimal ml-5 space-y-1">
              <li>Submit a request with details and preferred schedule.</li>
              <li>Management reviews and assigns a technician.</li>
              <li>Track status here. You can cancel while it is New.</li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  );
}
