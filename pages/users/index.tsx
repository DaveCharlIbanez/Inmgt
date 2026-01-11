import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { Users, Shield, AtSign } from "lucide-react";

interface IUser {
  _id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
}

export default function UsersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<IUser[]>([]);
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
    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

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
          <Users className="text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-3xl font-bold text-gray-800">{users.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-purple-600" />
            <h3 className="text-lg font-bold text-gray-800">User Directory</h3>
          </div>
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u._id} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <AtSign className="text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-800">{u.email}</p>
                    <p className="text-sm text-gray-500">{u.firstName} {u.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs capitalize">{u.role}</span>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    u.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
            {!users.length && <p className="text-sm text-gray-500">No users found.</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
