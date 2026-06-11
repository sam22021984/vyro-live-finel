// Flutter Migration: lib/features/admin/screens/admin_users.dart
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, UserX, Shield, Star, ChevronDown, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { formatNumber } from "@/lib/utils";

export default function AdminUsers() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users-list"],
    queryFn: () => base44.entities.User.list("-created_date", 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.User.update(id, data),
    onSuccess: () => { toast.success("User updated"); qc.invalidateQueries(["admin-users-list"]); },
  });

  const filtered = users.filter(u => {
    const matchSearch = !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleColor = {
    admin: "bg-red-500/20 text-red-400",
    host: "bg-purple-500/20 text-purple-400",
    agency: "bg-blue-500/20 text-blue-400",
    listener: "bg-slate-500/20 text-slate-400",
    vip: "bg-yellow-500/20 text-yellow-400",
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] p-4 lg:p-6 space-y-6">
      <h1 className="text-white text-2xl font-bold">User Management</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-600"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a35] border-white/10">
            {["all", "admin", "host", "agency", "listener", "vip"].map(r => (
              <SelectItem key={r} value={r} className="text-white capitalize">{r === "all" ? "All Roles" : r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="bg-white/5 border border-white/10 rounded-lg px-3 flex items-center text-slate-400 text-sm">
          {filtered.length} users
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#12122A] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-slate-400 text-xs font-medium uppercase px-4 py-3">User</th>
                <th className="text-left text-slate-400 text-xs font-medium uppercase px-4 py-3">Role</th>
                <th className="text-left text-slate-400 text-xs font-medium uppercase px-4 py-3 hidden md:table-cell">Level</th>
                <th className="text-left text-slate-400 text-xs font-medium uppercase px-4 py-3 hidden lg:table-cell">Balance</th>
                <th className="text-left text-slate-400 text-xs font-medium uppercase px-4 py-3 hidden lg:table-cell">Joined</th>
                <th className="text-right text-slate-400 text-xs font-medium uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3" colSpan={6}>
                    <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
                  </td>
                </tr>
              ))}
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={u.avatar_url} />
                        <AvatarFallback className="bg-purple-700 text-white text-xs">{u.full_name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-white text-sm font-medium">{u.display_name || u.full_name}</div>
                        <div className="text-slate-500 text-xs">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={roleColor[u.role] || "bg-slate-700 text-slate-400"}>{u.role || "listener"}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-slate-300 text-sm">Lv.{u.level || 1}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-yellow-400 text-sm">🪙 {formatNumber(u.coin_balance || 0)}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-slate-500 text-xs">{new Date(u.created_date).toLocaleDateString()}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {u.role !== "host" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateMutation.mutate({ id: u.id, data: { role: "host" } })}
                          className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 text-xs h-7 px-2"
                        >
                          <Star className="w-3 h-3 mr-1" />Host
                        </Button>
                      )}
                      {u.role !== "admin" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateMutation.mutate({ id: u.id, data: { role: "admin" } })}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs h-7 px-2"
                        >
                          <Shield className="w-3 h-3 mr-1" />Admin
                        </Button>
                      )}
                      {u.is_banned ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateMutation.mutate({ id: u.id, data: { is_banned: false } })}
                          className="text-green-400 hover:bg-green-500/10 text-xs h-7 px-2"
                        >Unban</Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateMutation.mutate({ id: u.id, data: { is_banned: true } })}
                          className="text-red-400 hover:bg-red-500/10 text-xs h-7 px-2"
                        >
                          <UserX className="w-3 h-3 mr-1" />Ban
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12 text-slate-600">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
}