/**
 * TaskCenter — Live daily/weekly/monthly tasks from Supabase daily_tasks + reward_claims
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const TASK_TABS = ["Daily", "Weekly", "Monthly"];

const STATUS_STYLES = {
  not_started: { bg: "#F3F4F6", color: "#9CA3AF", label: "Start"    },
  in_progress:  { bg: "#EFF6FF", color: "#1F6BFF", label: "Continue" },
  completed:    { bg: "#ECFDF5", color: "#10B981", label: "Claim"    },
  claimed:      { bg: "#F0FDF4", color: "#6EE7B7", label: "Claimed ✓"},
  expired:      { bg: "#FEF2F2", color: "#EF4444", label: "Expired"  },
};

function TaskCard({ task, onClaim }) {
  const [localStatus, setLocalStatus] = useState(task.status);
  const s   = STATUS_STYLES[localStatus] || STATUS_STYLES.not_started;
  const pct = task.total > 1 ? Math.min(100, Math.round((task.progress / task.total) * 100)) : (localStatus === "completed" || localStatus === "claimed" ? 100 : 0);

  const handleAction = async () => {
    if (localStatus === "completed") {
      setLocalStatus("claimed");
      toast.success(`🎉 ${task.reward} claimed!`);
      if (onClaim) onClaim(task.id);
    } else if (localStatus === "not_started") {
      setLocalStatus("in_progress");
    }
  };

  return (
    <motion.div whileTap={{ scale: 0.98 }} style={{
      background: "#fff", borderRadius: 16, padding: "14px",
      border: "1px solid #F0F0F8", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", marginBottom: 10,
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, fontSize: 22, background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {task.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{task.title}</span>
            <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: s.bg, color: s.color }}>
              {localStatus.replace("_"," ").toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{task.description}</div>
          {task.total > 1 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: "#6B7280" }}>{task.progress}/{task.total}</span>
                <span style={{ fontSize: 10, color: "#6B7280" }}>{pct}%</span>
              </div>
              <div style={{ height: 5, background: "#F0F0F8", borderRadius: 3, overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                  style={{ height: "100%", background: "linear-gradient(90deg,#1F6BFF,#60A5FA)", borderRadius: 3 }} />
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#FFC83D" }}>🏆 {task.reward}</span>
            {localStatus !== "claimed" && localStatus !== "expired" && (
              <motion.button whileTap={{ scale: 0.92 }} onClick={handleAction}
                style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, border: "none", cursor: "pointer",
                  background: localStatus === "completed" ? "linear-gradient(135deg,#10B981,#059669)"
                            : localStatus === "in_progress" ? "linear-gradient(135deg,#1F6BFF,#3B82F6)" : "#F3F4F6",
                  color: localStatus === "not_started" ? "#9CA3AF" : "#fff",
                }}>{s.label}</motion.button>
            )}
            {localStatus === "claimed" && <span style={{ fontSize: 11, color: "#10B981", fontWeight: 700 }}>✓ Claimed</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TaskCenter() {
  const { user: authUser } = useAuth();
  const [tab,     setTab]     = useState("Daily");
  const [tasks,   setTasks]   = useState({ Daily: [], Weekly: [], Monthly: [] });
  const [loading, setLoading] = useState(true);

  const TAB_TYPE = { Daily: "daily", Weekly: "weekly", Monthly: "monthly" };

  useEffect(() => {
    if (!authUser?.id) return;
    const load = async () => {
      try {
        const res = await base44.functions.invoke('supabaseQuery', {
          table: 'daily_tasks', method: 'GET', select: '*',
          filters: { is_active: 'eq.true' }, order: 'sort_order.asc', limit: 50,
        });
        const rows = res?.data?.data || [];

        // Fetch claim status for this user
        const claimsRes = await base44.functions.invoke('supabaseQuery', {
          table: 'reward_claims', method: 'GET', select: 'task_id,status',
          filters: { user_id: `eq.${authUser.id}` },
        });
        const claimedIds = new Set((claimsRes?.data?.data || [])
          .filter(c => c.status === 'claimed')
          .map(c => c.task_id));

        const grouped = { Daily: [], Weekly: [], Monthly: [] };
        rows.forEach(r => {
          const type  = (r.task_type || 'daily');
          const label = type === 'daily' ? 'Daily' : type === 'weekly' ? 'Weekly' : 'Monthly';
          if (!grouped[label]) return;
          grouped[label].push({
            id:          r.id,
            title:       r.title       || r.task_name  || "Task",
            description: r.description || r.task_desc  || "",
            icon:        r.icon        || "🎯",
            reward:      r.reward_label|| `${r.reward_coins || 0} Coins`,
            progress:    r.progress    || 0,
            total:       r.target      || 1,
            status:      claimedIds.has(r.id) ? "claimed" : r.status || "not_started",
          });
        });
        setTasks(grouped);
      } catch { /* ignore, use empty */ }
      setLoading(false);
    };
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [authUser?.id]);

  const handleClaim = async (taskId) => {
    if (!authUser?.id) return;
    try {
      await base44.functions.invoke('supabaseQuery', {
        table: 'reward_claims', method: 'POST',
        body: { user_id: authUser.id, task_id: taskId, status: 'claimed', claimed_at: new Date().toISOString() },
      });
    } catch { /* ignore */ }
  };

  const currentTasks = tasks[tab] || [];
  const completed    = currentTasks.filter(t => t.status === "completed" || t.status === "claimed").length;
  const inProgress   = currentTasks.filter(t => t.status === "in_progress").length;

  return (
    <div style={{ padding: "14px 14px 0" }}>
      {/* Summary */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[
          { label: "Completed",   val: completed,  color: "#10B981" },
          { label: "In Progress", val: inProgress, color: "#1F6BFF" },
          { label: "Total",       val: currentTasks.length, color: "#FFC83D" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: "#fff", borderRadius: 14, padding: "10px 8px", textAlign: "center", border: "1px solid #F0F0F8" }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{loading ? "—" : s.val}</div>
            <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {TASK_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "7px 18px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
            background: tab === t ? "#1F6BFF" : "#fff",
            color: tab === t ? "#fff" : "#9CA3AF",
            border: tab === t ? "none" : "1px solid #E5E7EB",
          }}>{t}</button>
        ))}
      </div>
      {loading ? (
        <div style={{ textAlign: "center", color: "#9CA3AF", padding: 24 }}>Loading tasks...</div>
      ) : currentTasks.length === 0 ? (
        <div style={{ textAlign: "center", color: "#9CA3AF", padding: 24, fontSize: 13 }}>No {tab.toLowerCase()} tasks available.</div>
      ) : (
        currentTasks.map(task => <TaskCard key={task.id} task={task} onClaim={handleClaim} />)
      )}
    </div>
  );
}