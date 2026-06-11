// ============================================================
// Utility Functions — VYRO LIVE CONNECT
// Flutter Migration: lib/core/utils/app_utils.dart
// ============================================================

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { COIN_TO_USD, DIAMOND_TO_USD, LISTENER_LEVELS, HOST_LEVELS } from "./constants";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Financial Converters
export const diamondsToUSD = (diamonds) => diamonds * DIAMOND_TO_USD;
export const coinsToUSD = (coins) => coins * COIN_TO_USD;
export const usdToCoins = (usd) => Math.floor(usd / COIN_TO_USD);

// Number Formatting
export const formatNumber = (n) => {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

// Duration
export const formatDuration = (minutes) => {
  if (!minutes) return "0m";
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

// Listener Level from XP
export const getListenerLevel = (xp) => {
  let current = LISTENER_LEVELS[0];
  for (let i = LISTENER_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LISTENER_LEVELS[i].xp_required) { current = LISTENER_LEVELS[i]; break; }
  }
  const nextIdx = LISTENER_LEVELS.findIndex(l => l.level === current.level) + 1;
  const next = LISTENER_LEVELS[nextIdx];
  const progress = next
    ? ((xp - current.xp_required) / (next.xp_required - current.xp_required)) * 100
    : 100;
  return { ...current, next, progress: Math.min(100, progress) };
};

// Host Level from diamonds
export const getHostLevel = (diamonds) => {
  let current = HOST_LEVELS[0];
  for (let i = HOST_LEVELS.length - 1; i >= 0; i--) {
    if (diamonds >= HOST_LEVELS[i].diamonds_required) { current = HOST_LEVELS[i]; break; }
  }
  return current;
};

// Relative time
export const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// VIP color
export const getVIPColor = (tier) => {
  const colors = { vip1: "#CD7F32", vip2: "#C0C0C0", vip3: "#FFD700", vip4: "#E5E4E2", vip5: "#B9F2FF" };
  return colors[tier] || null;
};

// Role color
export const getRoleColor = (role) => {
  const colors = { admin: "#EF4444", host: "#9333EA", agency: "#3B82F6", vip: "#F59E0B", listener: "#64748B" };
  return colors[role] || "#64748B";
};

// Truncate
export const truncate = (str, n = 40) => str && str.length > n ? str.slice(0, n) + "..." : str;