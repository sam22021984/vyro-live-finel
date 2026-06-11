// ============================================================
// VYRO LIVE CONNECT EARNING - Global Constants
// Flutter Migration: lib/core/constants/app_constants.dart
// ============================================================

export const APP_NAME = "VYRO LIVE";
export const APP_TAGLINE = "Connect. Stream. Earn.";

// Diamond to USD conversion rate
export const DIAMOND_TO_USD_RATE = 0.001; // 1 diamond = $0.001
export const COIN_TO_DIAMOND_RATE = 0.1;  // 10 coins = 1 diamond
export const MIN_WITHDRAW_DIAMONDS = 10000;

// VIP Tiers
export const VIP_TIERS = {
  vip1: { label: "VIP 1", color: "#C0C0C0", coins: 500, benefits: ["Silver Frame", "VIP Badge", "Priority Entry"] },
  vip2: { label: "VIP 2", color: "#FFD700", coins: 2000, benefits: ["Gold Frame", "VIP 2 Badge", "Gift Discount 5%"] },
  vip3: { label: "VIP 3", color: "#FF69B4", coins: 5000, benefits: ["Pink Frame", "VIP 3 Badge", "Gift Discount 10%", "Special Entry Effect"] },
  vip4: { label: "VIP 4", color: "#9B59B6", coins: 12000, benefits: ["Purple Frame", "VIP 4 Badge", "Gift Discount 15%", "Flying Entry"] },
  vip5: { label: "VIP 5", color: "#E74C3C", coins: 30000, benefits: ["Diamond Frame", "VIP 5 Badge", "Gift Discount 20%", "Royal Entry", "Exclusive Gifts"] },
};

// User Levels (Listener)
export const LISTENER_LEVELS = [
  { level: 1, name: "Newcomer", xp: 0, color: "#95A5A6" },
  { level: 2, name: "Explorer", xp: 100, color: "#27AE60" },
  { level: 3, name: "Regular", xp: 500, color: "#2980B9" },
  { level: 4, name: "Fan", xp: 1500, color: "#8E44AD" },
  { level: 5, name: "Super Fan", xp: 4000, color: "#E67E22" },
  { level: 6, name: "Elite Fan", xp: 10000, color: "#E74C3C" },
  { level: 7, name: "Legend", xp: 25000, color: "#F39C12" },
  { level: 8, name: "Champion", xp: 60000, color: "#1ABC9C" },
  { level: 9, name: "Master", xp: 150000, color: "#D35400" },
  { level: 10, name: "Grand Master", xp: 400000, color: "#C0392B" },
];

// Host Levels
export const HOST_LEVELS = [
  { level: 1, name: "Rookie Host", diamonds: 0, color: "#95A5A6" },
  { level: 2, name: "Rising Star", diamonds: 1000, color: "#27AE60" },
  { level: 3, name: "Performer", diamonds: 5000, color: "#2980B9" },
  { level: 4, name: "Star Host", diamonds: 15000, color: "#8E44AD" },
  { level: 5, name: "Elite Host", diamonds: 50000, color: "#E67E22" },
  { level: 6, name: "Pro Host", diamonds: 150000, color: "#E74C3C" },
  { level: 7, name: "Top Host", diamonds: 500000, color: "#F39C12" },
  { level: 8, name: "Master Host", diamonds: 1500000, color: "#C0392B" },
];

// Room Categories
export const ROOM_CATEGORIES = [
  { value: "music", label: "Music", icon: "🎵" },
  { value: "talk", label: "Talk Show", icon: "🎙️" },
  { value: "karaoke", label: "Karaoke", icon: "🎤" },
  { value: "storytelling", label: "Storytelling", icon: "📖" },
  { value: "meditation", label: "Meditation", icon: "🧘" },
  { value: "language", label: "Language", icon: "🌐" },
  { value: "other", label: "Other", icon: "✨" },
];

// Agency Tiers
export const AGENCY_TIERS = {
  bronze: { label: "Bronze", min_hosts: 1, commission: 30, color: "#CD7F32" },
  silver: { label: "Silver", min_hosts: 5, commission: 35, color: "#C0C0C0" },
  gold: { label: "Gold", min_hosts: 15, commission: 40, color: "#FFD700" },
  platinum: { label: "Platinum", min_hosts: 30, commission: 45, color: "#E5E4E2" },
};

export const GIFT_CATEGORIES = ["basic", "premium", "luxury", "special", "seasonal"];

export const ROLES = {
  ADMIN: "admin",
  HOST: "host",
  LISTENER: "listener",
  AGENCY: "agency",
  VIP: "vip",
};