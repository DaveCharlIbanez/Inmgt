import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Menu, X, Home, Users, Settings, LogOut, Building2, ClipboardList, CreditCard } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  user?: any;
  onLogout: () => void;
}

export default function Layout({ children, user, onLogout }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const isAdmin = user?.role === "admin" || user?.role === "owner";
  const isClient = user?.role === "client";

  const adminNavLinks = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/oversight", label: "Tenant Oversight", icon: ClipboardList },
    { href: "/billing", label: "Billing & Invoices", icon: CreditCard },
    { href: "/users", label: "Users", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const clientNavLinks = [
    { href: "/client", label: "Dashboard", icon: Home },
    { href: "/client/listings", label: "Listings", icon: Building2 },
    { href: "/client/profile", label: "Profile", icon: Users },
    { href: "/client/settings", label: "Settings", icon: Settings },
  ];

  const navLinks = isAdmin ? adminNavLinks : clientNavLinks;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-blue-500 to-blue-700 text-white transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-blue-400">
          {sidebarOpen && (
            <Link href="/" className="font-bold text-xl hover:text-blue-100">
              Tuluyan
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-blue-500 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                router.pathname === href
                  ? "bg-blue-400 shadow-md"
                  : "hover:bg-blue-400 hover:bg-opacity-50"
              }`}
            >
              <Icon size={20} />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="px-3 py-4 border-t border-blue-400 space-y-3">
          {sidebarOpen && (
            <div className="px-4 py-3 bg-blue-400 rounded-lg">
              <p className="text-sm text-blue-100">Logged in as</p>
              <p className="font-semibold text-white truncate">
                {user?.firstName || user?.email}
              </p>
              <p className="text-xs text-blue-100 capitalize">{user?.role}</p>
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all text-white font-medium"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">
            {router.pathname === "/" && "Admin Dashboard"}
            {router.pathname === "/oversight" && "Tenant Oversight"}
            {router.pathname === "/billing" && "Billing & Invoices"}
            {router.pathname === "/users" && "Users Management"}
            {router.pathname === "/settings" && "Settings"}
            {router.pathname === "/client" && "Your Dashboard"}
            {router.pathname === "/client/listings" && "Available Listings"}
            {router.pathname === "/client/profile" && "My Profile"}
            {router.pathname === "/client/settings" && "My Settings"}
          </h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
