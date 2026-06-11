// ============================================================
// VYRO LIVE CONNECT EARNING - Utility Functions
// Flutter Migration: lib/core/utils/app_utils.dart
// ============================================================

import { DIAMOND_TO_USD_RATE, COIN_TO_DIAMOND_RATE, LISTENER_LEVELS, HOST_LEVELS } from "./constants";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function diamondsToUSD(diamonds) {
  return (diamonds * DIAMOND_TO_USD_RATE).toFixed(2);
}

export function coinsToUSD(coins) {
  return (coins * COIN_TO_DIAMOND_RATE * DIAMOND_TO_USD_RATE).toFixed(4);
}

export function formatNumber(num) {
  if (!num) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

export function formatDuration(minutes) {
  if (!minutes) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function getListenerLevel(xp) {
  let current = LISTENER_LEVELS[0];
  for (const lvl of LISTENER_LEVELS) {
    if (xp >= lvl.xp) current = lvl;
    else break;
  }
  return current;
}

export function getHostLevel(diamonds) {
  let current = HOST_LEVELS[0];
  for (const lvl of HOST_LEVELS) {
    if (diamonds >= lvl.diamonds) current = lvl;
    else break;
  }
  return current;
}

export function getLevelProgress(xp) {
  const levels = LISTENER_LEVELS;
  for (let i = 0; i < levels.length - 1; i++) {
    if (xp >= levels[i].xp && xp < levels[i + 1].xp) {
      const progress = ((xp - levels[i].xp) / (levels[i + 1].xp - levels[i].xp)) * 100;
      return Math.round(progress);
    }
  }
  return 100;
}

export function timeAgo(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function getRoleColor(role) {
  const colors = {
    admin: "#E74C3C",
    host: "#9B59B6",
    listener: "#2980B9",
    agency: "#27AE60",
    vip: "#F39C12",
  };
  return colors[role] || "#95A5A6";
}

export function getVIPColor(tier) {
  const colors = {
    none: "#95A5A6",
    vip1: "#C0C0C0",
    vip2: "#FFD700",
    vip3: "#FF69B4",
    vip4: "#9B59B6",
    vip5: "#E74C3C",
  };
  return colors[tier] || "#95A5A6";
}

export function truncate(str, len = 30) {
  if (!str) return "";
  return str.length > len ? str.substring(0, len) + "..." : str;
}