import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { CreditCard, Receipt, CheckCircle2, Clock3 } from "lucide-react";

interface InvoiceItem {
  _id: string;
  invoiceNumber: string;
  amountDue: number;
  currency: string;
  status: string;
  dueDate: string;
  issuedAt: string;
  userId?: { firstName?: string; lastName?: string; email?: string };
}

export default function BillingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    loadInvoices();
  }, [router]);

  const loadInvoices = async () => {
    try {
      const response = await fetch("/api/admin/billing");
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (id: string) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/billing/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid", paidAt: new Date().toISOString() }),
      });
      if (response.ok) {
        await loadInvoices();
      }
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value: number, currency = "PHP") =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency }).format(value || 0);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
            <p className="text-sm text-gray-600">Total Invoices</p>
            <p className="text-3xl font-bold text-gray-800">{invoices.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-600">
            <p className="text-sm text-gray-600">Paid</p>
            <p className="text-3xl font-bold text-gray-800">
              {invoices.filter((i) => i.status === "paid").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
            <p className="text-sm text-gray-600">Overdue</p>
            <p className="text-3xl font-bold text-gray-800">
              {invoices.filter((i) => i.status === "overdue").length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">Billing & Invoices</h3>
            </div>
            {saving && <span className="text-sm text-gray-500">Saving...</span>}
          </div>

          <div className="space-y-3">
            {invoices.slice(0, 10).map((invoice) => (
              <div key={invoice._id} className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 rounded-lg px-4 py-3 gap-2">
                <div className="flex items-center gap-3">
                  <Receipt className="text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-800">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-500">
                      {invoice.userId?.firstName} {invoice.userId?.lastName}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-700">
                  Due {new Date(invoice.dueDate).toLocaleDateString("en-PH")}
                </div>

                <div className="text-sm font-semibold text-gray-800">
                  {formatCurrency(invoice.amountDue, invoice.currency)}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs capitalize ${
                      invoice.status === "paid"
                        ? "bg-green-50 text-green-700"
                        : invoice.status === "overdue"
                        ? "bg-red-50 text-red-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {invoice.status}
                  </span>
                  {invoice.status === "paid" ? (
                    <CheckCircle2 className="text-green-600" size={18} />
                  ) : (
                    <Clock3 className="text-orange-500" size={18} />
                  )}
                </div>

                {invoice.status !== "paid" && (
                  <button
                    onClick={() => markPaid(invoice._id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            ))}
            {!invoices.length && <p className="text-sm text-gray-500">No invoices found.</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
