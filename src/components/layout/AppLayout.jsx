// ============================================================
// AppLayout — Shell with sidebar + topbar
// Flutter Migration: lib/shared/widgets/app_shell.dart
// ============================================================
import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  Radio, Home, Users, Gift, BarChart3, LogOut,
  Bell, Search, Wallet, Building2, Settings, Star,
  ChevronLeft, ChevronRight, Shield, TrendingUp, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

const navByRole = {
  admin: [
    { label: "Dashboard", icon: BarChart3, path: "/admin" },
    { label: "Users", icon: Users, path: "/admin/users" },
    { label: "Live Rooms", icon: Radio, path: "/admin/rooms" },
    { label: "Gifts", icon: Gift, path: "/admin/gifts" },
    { label: "Withdrawals", icon: Wallet, path: "/admin/withdrawals" },
    { label: "Agencies", icon: Building2, path: "/admin/agencies" },
    { label: "Reports", icon: Shield, path: "/admin/reports" },
    { label: "Levels", icon: TrendingUp, path: "/admin/levels" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ],
  host: [
    { label: "Dashboard", icon: BarChart3, path: "/host" },
    { label: "Go Live", icon: Radio, path: "/host/go-live" },
    { label: "Earnings", icon: Wallet, path: "/host/earnings" },
    { label: "Followers", icon: Users, path: "/host/followers" },
    { label: "Profile", icon: Star, path: "/host/profile" },
  ],
  agency: [
    { label: "Dashboard", icon: BarChart3, path: "/agency" },
    { label: "My Hosts", icon: Users, path: "/agency/hosts" },
    { label: "Earnings", icon: Wallet, path: "/agency/earnings" },
    { label: "Reports", icon: TrendingUp, path: "/agency/reports" },
    { label: "Profile", icon: Building2, path: "/agency/profile" },
  ],
  listener: [
    { label: "Discover", icon: Home, path: "/" },
    { label: "Live Rooms", icon: Radio, path: "/rooms" },
    { label: "My Wallet", icon: Wallet, path: "/wallet" },
    { label: "Profile", icon: Star, path: "/profile" },
  ],
  vip: [
    { label: "Discover", icon: Home, path: "/" },
    { label: "Live Rooms", icon: Radio, path: "/rooms" },
    { label: "My Wallet", icon: Wallet, path: "/wallet" },
    { label: "VIP Lounge", icon: Star, path: "/vip" },
    { label: "Profile", icon: Star, path: "/profile" },
  ],
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role || "listener";
  const navItems = navByRole[role] || navByRole.listener;

  const NavLink = ({ item }) => {
    const active = location.pathname === item.path ||
      (item.path !== "/" && location.pathname.startsWith(item.path));
    return (
      <Link
        to={item.path}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
          active
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
            : "text-slate-400 hover:text-white hover:bg-white/10"
        )}
      >
        <item.icon className={cn("w-5 h-5 flex-shrink-0", active ? "text-white" : "text-slate-400 group-hover:text-white")} />
        {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-white/10", collapsed && "justify-center")}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
          <Radio className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-bold text-sm tracking-wide">{APP_NAME}</div>
            <div className="text-purple-400 text-xs">Live Earning</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => <NavLink key={item.path} item={item} />)}
      </nav>

      {/* User */}
      <div className={cn("px-3 py-4 border-t border-white/10", collapsed ? "items-center flex flex-col gap-2" : "")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback className="bg-purple-700 text-white text-xs">
              {user?.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{user?.full_name || "User"}</div>
              <div className="text-purple-400 text-xs capitalize">{role}</div>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          className={cn("text-slate-400 hover:text-white hover:bg-white/10 mt-2", collapsed ? "w-9 h-9 p-0" : "w-full justify-start gap-2")}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0D0D1A] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col transition-all duration-300 bg-[#12122A] border-r border-white/10 relative",
        collapsed ? "w-16" : "w-60"
      )}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#12122A] border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white z-20"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-[#12122A] border-r border-white/10 flex flex-col">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-[#12122A] border-b border-white/10 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                placeholder="Search rooms, hosts..."
                className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
            </Button>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
              <span className="text-yellow-400 text-sm font-bold">💎</span>
              <span className="text-white text-sm font-semibold">{(user?.coin_balance || 0).toLocaleString()}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}