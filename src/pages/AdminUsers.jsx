// ============================================================
// SCREEN: Admin — User Management
// Flutter Migration: lib/features/admin/screens/admin_users_screen.dart
// ============================================================
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Ban, CheckCircle, UserCog, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { formatNumber, getRoleColor, getVIPColor, timeAgo } from "@/lib/utils";

export default function AdminUsers() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users-list"],
    queryFn: () => base44.entities.User.list("-created_date", 200),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.User.update(id, data),
    onSuccess: () => { qc.invalidateQueries(["admin-users-list"]); toast.success("User updated"); },
  });

  const filtered = users.filter(u => {
    const matchSearch = !search || (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.username || "").toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="min-h-screen bg-[#0D0D1A] p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">User Management</h1>
          <p className="text-slate-400 text-sm">{users.length} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, username..."
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-600" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1A35] border-white/10 text-white">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="host">Host</SelectItem>
            <SelectItem value="listener">Listener</SelectItem>
            <SelectItem value="agency">Agency</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A35] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-slate-400 text-xs font-medium px-4 py-3 uppercase tracking-wider">User</th>
                <th className="text-left text-slate-400 text-xs font-medium px-4 py-3 uppercase tracking-wider">Role</th>
                <th className="text-left text-slate-400 text-xs font-medium px-4 py-3 uppercase tracking-wider hidden md:table-cell">Level</th>
                <th className="text-left text-slate-400 text-xs font-medium px-4 py-3 uppercase tracking-wider hidden lg:table-cell">Diamonds</th>
                <th className="text-left text-slate-400 text-xs font-medium px-4 py-3 uppercase tracking-wider hidden lg:table-cell">VIP</th>
                <th className="text-left text-slate-400 text-xs font-medium px-4 py-3 uppercase tracking-wider hidden md:table-cell">Joined</th>
                <th className="text-left text-slate-400 text-xs font-medium px-4 py-3 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array(8).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-8 bg-white/5 rounded animate-pulse" /></td></tr>
                ))
              ) : filtered.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={u.avatar_url} />
                        <AvatarFallback className="bg-purple-700 text-white text-xs">{(u.full_name || u.email || "U").charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-white text-sm font-medium">{u.full_name || u.username || "—"}</div>
                        <div className="text-slate-500 text-xs">{u.email}</div>
                      </div>
                      {u.is_verified && <span className="text-blue-400 text-xs">✓</span>}
                      {u.is_banned && <span className="text-red-400 text-xs">⛔</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                      style={{ backgroundColor: getRoleColor(u.role) + "20", color: getRoleColor(u.role) }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-slate-300 text-sm">Lv.{u.level || 1}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-yellow-400 text-sm">💎 {formatNumber(u.total_earned_diamonds || 0)}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {u.vip_tier && u.vip_tier !== "none" ? (
                      <span className="text-xs font-bold" style={{ color: getVIPColor(u.vip_tier) }}>{u.vip_tier?.toUpperCase()}</span>
                    ) : <span className="text-slate-600 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-slate-500 text-xs">{timeAgo(u.created_date)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost"
                        className={u.is_banned ? "text-green-400 hover:text-green-300" : "text-red-400 hover:text-red-300"}
                        onClick={() => updateMutation.mutate({ id: u.id, data: { is_banned: !u.is_banned } })}>
                        {u.is_banned ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </Button>
                      <Select onValueChange={val => updateMutation.mutate({ id: u.id, data: { role: val } })}>
                        <SelectTrigger className="w-8 h-8 p-0 border-0 bg-transparent text-slate-400 hover:text-white">
                          <UserCog className="w-4 h-4" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A35] border-white/10 text-white">
                          <SelectItem value="listener">Listener</SelectItem>
                          <SelectItem value="host">Host</SelectItem>
                          <SelectItem value="agency">Agency</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-10 text-slate-500 text-sm">No users found</div>
        )}
      </div>
    </div>
  );
}