// ============================================================
// Global Constants — VYRO LIVE CONNECT
// Flutter Migration: lib/core/constants/app_constants.dart
// ============================================================

export const APP_NAME = "VYRO LIVE";
export const APP_TAGLINE = "Connect · Stream · Earn";

// Financial Exchange Rates
export const COIN_TO_USD = 0.01;       // 1 coin = $0.01
export const DIAMOND_TO_USD = 0.05;    // 1 diamond = $0.05
export const COIN_TO_DIAMOND = 0.5;    // 1 coin gifted = 0.5 diamond for host
export const MIN_WITHDRAW_DIAMONDS = 1000;

// VIP Tiers
export const VIP_TIERS = [
  { key: "vip1", name: "Bronze", icon: "🥉", color: "#CD7F32", price_coins: 500 },
  { key: "vip2", name: "Silver", icon: "🥈", color: "#C0C0C0", price_coins: 1500 },
  { key: "vip3", name: "Gold",   icon: "🥇", color: "#FFD700", price_coins: 3000 },
  { key: "vip4", name: "Platinum", icon: "💎", color: "#E5E4E2", price_coins: 6000 },
  { key: "vip5", name: "Diamond", icon: "👑", color: "#B9F2FF", price_coins: 12000 },
];

// Listener Levels (XP-based)
export const LISTENER_LEVELS = [
  { level: 1, xp_required: 0, color: "#9E9E9E" },
  { level: 2, xp_required: 100, color: "#4CAF50" },
  { level: 3, xp_required: 300, color: "#2196F3" },
  { level: 4, xp_required: 700, color: "#9C27B0" },
  { level: 5, xp_required: 1500, color: "#FF9800" },
  { level: 6, xp_required: 3000, color: "#F44336" },
  { level: 7, xp_required: 6000, color: "#E91E63" },
  { level: 8, xp_required: 12000, color: "#FFD700" },
  { level: 9, xp_required: 25000, color: "#00BCD4" },
  { level: 10, xp_required: 50000, color: "#FF5722" },
];

// Host Levels (Diamond-based)
export const HOST_LEVELS = [
  { level: 1, diamonds_required: 0, name: "Newcomer", color: "#9E9E9E" },
  { level: 2, diamonds_required: 500, name: "Rising Star", color: "#4CAF50" },
  { level: 3, diamonds_required: 2000, name: "Performer", color: "#2196F3" },
  { level: 4, diamonds_required: 8000, name: "Popular", color: "#9C27B0" },
  { level: 5, diamonds_required: 25000, name: "Star", color: "#FF9800" },
  { level: 6, diamonds_required: 80000, name: "Super Star", color: "#F44336" },
  { level: 7, diamonds_required: 200000, name: "Legend", color: "#FFD700" },
];

// Room Categories
export const ROOM_CATEGORIES = [
  { value: "music", label: "Music", icon: "🎵" },
  { value: "talk", label: "Talk Show", icon: "🎙️" },
  { value: "karaoke", label: "Karaoke", icon: "🎤" },
  { value: "storytelling", label: "Stories", icon: "📖" },
  { value: "meditation", label: "Meditation", icon: "🧘" },
  { value: "language", label: "Language", icon: "🌐" },
  { value: "other", label: "Other", icon: "✨" },
];

// Gift Categories
export const GIFT_CATEGORIES = ["basic", "premium", "luxury", "special", "seasonal"];

// Agency Tiers
export const AGENCY_TIERS = [
  { key: "bronze", name: "Bronze", min_hosts: 0, commission: 30 },
  { key: "silver", name: "Silver", min_hosts: 5, commission: 28 },
  { key: "gold", name: "Gold", min_hosts: 15, commission: 25 },
  { key: "platinum", name: "Platinum", min_hosts: 30, commission: 20 },
];

// User Roles
export const USER_ROLES = ["admin", "host", "agency", "listener", "vip"];