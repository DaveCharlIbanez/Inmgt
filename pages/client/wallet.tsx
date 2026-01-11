import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import { Wallet, PlusCircle, SendHorizontal, Receipt, Clock3, CheckCircle2, AlertTriangle } from "lucide-react";

interface Txn {
  id: string;
  type: "Top-up" | "Payment";
  amount: number;
  reference: string;
  status: "Processing" | "Success" | "Failed";
  createdAt: string;
}

export default function WalletPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [txns, setTxns] = useState<Txn[]>([]);
  const [topup, setTopup] = useState(500);
  const [pay, setPay] = useState({ amount: 0, reference: "Rent" });
  const currency = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    // Guard against malformed or null stored user
    if (!parsedUser || (parsedUser.role && parsedUser.role !== "client")) {
      router.push("/");
      return;
    }
    setUser(parsedUser);
    const userId = parsedUser._id ?? parsedUser.id;
    if (!userId) {
      router.push("/login");
      return;
    }
    const balKey = `wallet:bal:${userId}`;
    const txnKey = `wallet:txns:${userId}`;
    const bal = localStorage.getItem(balKey);
    const t = localStorage.getItem(txnKey);
    setBalance(bal ? Number(bal) : 0);
    setTxns(t ? JSON.parse(t) : []);
    setLoading(false);
  }, [router]);

  const persist = (nextBal: number, nextTxns: Txn[]) => {
    const id = user?._id ?? user?.id;
    // Only persist if we have a valid user id; still update state locally
    if (id) {
      localStorage.setItem(`wallet:bal:${id}`, String(nextBal));
      localStorage.setItem(`wallet:txns:${id}`, JSON.stringify(nextTxns));
    }
    setBalance(nextBal);
    setTxns(nextTxns);
  };

  const createId = () => `TX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const simulateProcessing = (id: string) => {
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success
      const next = txns.map<Txn>((t) => {
        if (t.id === id) {
          const newStatus: Txn["status"] = success ? "Success" : "Failed";
          const updated: Txn = { ...t, status: newStatus };
          return updated;
        }
        return t;
      });
      const txn = next.find((t) => t.id === id);
      let nextBal = balance;
      if (txn) {
        if (txn.type === "Top-up" && success) nextBal += txn.amount;
        if (txn.type === "Payment" && success) nextBal -= txn.amount;
      }
      persist(nextBal, next);
    }, 1000 + Math.random() * 1000);
  };

  const doTopup = () => {
    if (topup <= 0) return alert("Enter a valid amount");
    const txn: Txn = {
      id: createId(),
      type: "Top-up",
      amount: Math.round(topup * 100) / 100,
      reference: "E-Wallet Top-up",
      status: "Processing",
      createdAt: new Date().toISOString(),
    };
    persist(balance, [txn, ...txns]);
    simulateProcessing(txn.id);
  };

  const doPay = () => {
    if (pay.amount <= 0) return alert("Enter a valid amount");
    if (pay.amount > balance) return alert("Insufficient balance. Top-up first.");
    const txn: Txn = {
      id: createId(),
      type: "Payment",
      amount: Math.round(pay.amount * 100) / 100,
      reference: pay.reference || "Payment",
      status: "Processing",
      createdAt: new Date().toISOString(),
    };
    persist(balance, [txn, ...txns]);
    simulateProcessing(txn.id);
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
        {/* Balance & Actions */}
        <div className="col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Wallet />
              <h3 className="text-lg font-bold">Wallet Balance</h3>
            </div>
            <p className="text-3xl font-extrabold">{currency.format(balance)}</p>
            <p className="text-blue-100 text-sm mt-1">Mock E-Wallet • No real charges</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><PlusCircle className="text-green-600" /> Top-up</h4>
            <div className="flex gap-2 mb-3">
              {[200, 500, 1000].map((amt) => (
                <button key={amt} onClick={() => setTopup(amt)} className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">{currency.format(amt)}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={topup}
                onChange={(e) => setTopup(Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button onClick={doTopup} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">Add</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><SendHorizontal className="text-blue-600" /> Pay</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={pay.amount}
                  onChange={(e) => setPay({ ...pay, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Reference</label>
                <input
                  value={pay.reference}
                  onChange={(e) => setPay({ ...pay, reference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button onClick={doPay} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Pay Now</button>
            </div>
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1"><AlertTriangle size={14} className="text-amber-600" /> Simulation only. Transactions may randomly fail.</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Receipt /> Transaction History</h3>
          {txns.length === 0 ? (
            <p className="text-gray-600">No transactions yet. Top-up or make a payment to see activity.</p>
          ) : (
            <div className="space-y-3">
              {txns.map((t) => (
                <div key={t.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${t.type === "Top-up" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>{t.type}</div>
                      <div className="text-lg font-bold">{currency.format(t.amount)}</div>
                      <div className="text-sm text-gray-500">{t.reference}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {t.status === "Processing" && <span className="flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-1 rounded text-xs"><Clock3 size={14} /> {t.status}</span>}
                      {t.status === "Success" && <span className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded text-xs"><CheckCircle2 size={14} /> {t.status}</span>}
                      {t.status === "Failed" && <span className="flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded text-xs">{t.status}</span>}
                      <span className="text-sm text-gray-500">{new Date(t.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
