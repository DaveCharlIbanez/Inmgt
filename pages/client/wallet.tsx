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
  const [topup, setTopup] = useState("");
  const [pay, setPay] = useState({ amount: "", reference: "Rent" });
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const currency = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

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
    
    // Fetch wallet data from database
    fetchWalletData(userId);
  }, [router]);

  const fetchWalletData = async (userId: string) => {
    try {
      const res = await fetch(`/api/wallet/balance?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched wallet data:', data);
        setBalance(data.balance);
        setTxns(data.transactions);
      } else {
        console.error('Failed to fetch wallet data:', res.status, res.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const persist = async (nextBal: number, nextTxns: Txn[]) => {
    const id = user?._id ?? user?.id;
    if (!id) return;
    
    setBalance(nextBal);
    setTxns(nextTxns);
  };

  const simulateProcessing = (id: string) => {
    setTimeout(async () => {
      const success = Math.random() > 0.1; // 90% success
      const userId = user?._id ?? user?.id;
      
      if (userId) {
        try {
          // Fetch current balance from database to avoid race conditions
          const getRes = await fetch(`/api/wallet/balance?userId=${userId}`);
          if (!getRes.ok) {
            console.error('Failed to fetch current balance');
            return;
          }
          const currentData = await getRes.json();
          const currentBalance = currentData.balance;
          
          // Find the transaction and calculate new balance
          const txn = currentData.transactions.find((t: Txn) => t.id === id);
          if (!txn) {
            console.error('Transaction not found');
            return;
          }
          
          let nextBal = currentBalance;
          if (success) {
            if (txn.type === "Top-up") nextBal += txn.amount;
            if (txn.type === "Payment") nextBal -= txn.amount;
          }
          
          console.log('Updating transaction:', { transactionId: id, status: success ? 'Success' : 'Failed', oldBalance: currentBalance, newBalance: nextBal });
          
          const res = await fetch(`/api/wallet/balance?userId=${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactionId: id, status: success ? 'Success' : 'Failed', balance: nextBal }),
          });
          
          if (res.ok) {
            const data = await res.json();
            console.log('Updated wallet data:', data);
            setBalance(data.balance);
            setTxns(data.transactions);
          } else {
            console.error('Failed to update transaction - status:', res.status);
          }
        } catch (error) {
          console.error("Failed to update transaction:", error);
        }
      }
    }, 1000 + Math.random() * 1000);
  };

  const createId = () => `TX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const doTopup = async () => {
    const amount = typeof topup === "string" ? parseFloat(topup) : topup;
    if (!amount || amount <= 0) return showNotification("error", "Enter a valid amount");
    const txn: Txn = {
      id: createId(),
      type: "Top-up",
      amount: Math.round(amount * 100) / 100,
      reference: "E-Wallet Top-up",
      status: "Processing",
      createdAt: new Date().toISOString(),
    };
    
    // Save to database
    const userId = user?._id ?? user?.id;
    if (userId) {
      try {
        await fetch(`/api/wallet/balance?userId=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction: txn }),
        });
      } catch (error) {
        console.error("Failed to save transaction:", error);
      }
    }
    
    await persist(balance, [txn, ...txns]);
    simulateProcessing(txn.id);
    setTopup("");
    showNotification("success", "Top-up processing...");
  };

  const doPay = async () => {
    const amount = typeof pay.amount === "string" ? parseFloat(pay.amount) : pay.amount;
    if (!amount || amount <= 0) return showNotification("error", "Enter a valid amount");
    if (amount > balance) return showNotification("error", "Insufficient balance. Top-up first.");
    const txn: Txn = {
      id: createId(),
      type: "Payment",
      amount: Math.round(amount * 100) / 100,
      reference: pay.reference || "Payment",
      status: "Processing",
      createdAt: new Date().toISOString(),
    };
    
    // Save to database
    const userId = user?._id ?? user?.id;
    if (userId) {
      try {
        await fetch(`/api/wallet/balance?userId=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction: txn }),
        });
      } catch (error) {
        console.error("Failed to save transaction:", error);
      }
    }
    
    await persist(balance, [txn, ...txns]);
    simulateProcessing(txn.id);
    setPay({ amount: "", reference: "Rent" });
    showNotification("success", "Payment processing...");
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
                <button key={amt} onClick={() => setTopup(amt)} className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm text-gray-900">{currency.format(amt)}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={topup}
                onChange={(e) => setTopup(e.target.value)}
                placeholder="0"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
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
                  onChange={(e) => setPay({ ...pay, amount: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Reference</label>
                <input
                  value={pay.reference}
                  onChange={(e) => setPay({ ...pay, reference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
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
                      <div className="text-lg font-bold text-gray-900">{currency.format(t.amount)}</div>
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

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertTriangle size={20} />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}
