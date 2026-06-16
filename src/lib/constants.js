// ============================================================
// Global Constants — VYRO LIVE CONNECT
// Flutter Migration: lib/core/constants/app_constants.dart
// ============================================================

export const APP_NAME = "VYRO LIVE";
export const APP_TAGLINE = "Connect · Stream · Earn";

// Financial Exchange Rates
export const COIN_TO_USD = 0.01;
export const DIAMOND_TO_USD = 0.05;
export const COIN_TO_DIAMOND = 0.5;
export const MIN_WITHDRAW_DIAMONDS = 1000;

// ============================================================
// MAIN USER LEVEL SYSTEM — Level 1 to 300
// Total coins range: 0 → 9,000,000,000 (9 Billion)
// Formula: exponential curve spread across 300 levels
// ============================================================

// Generate 300 levels automatically
// Coins scale from 0 to 9,000,000,000
// Each level band gets a theme color from 10 tiers (30 levels each)
const LEVEL_TIER_THEMES = [
  // Tier 1: L1-30  — Iron
  { name: "Iron",       color: "#9E9E9E", glow: "#9E9E9E", gradient: ["#757575","#9E9E9E"], icon: "⚙️" },
  // Tier 2: L31-60  — Bronze
  { name: "Bronze",     color: "#CD7F32", glow: "#CD7F32", gradient: ["#A0522D","#CD7F32"], icon: "🥉" },
  // Tier 3: L61-90  — Silver
  { name: "Silver",     color: "#C0C0C0", glow: "#C0C0C0", gradient: ["#A8A8A8","#E8E8E8"], icon: "🥈" },
  // Tier 4: L91-120 — Gold
  { name: "Gold",       color: "#FFD700", glow: "#FFD700", gradient: ["#FFA500","#FFD700"], icon: "🥇" },
  // Tier 5: L121-150— Sapphire
  { name: "Sapphire",   color: "#4169E1", glow: "#6495ED", gradient: ["#1E3A8A","#60A5FA"], icon: "💙" },
  // Tier 6: L151-180— Emerald
  { name: "Emerald",    color: "#50C878", glow: "#00FF7F", gradient: ["#166534","#4ADE80"], icon: "💚" },
  // Tier 7: L181-210— Ruby
  { name: "Ruby",       color: "#E0115F", glow: "#FF1493", gradient: ["#9B1239","#F43F5E"], icon: "❤️" },
  // Tier 8: L211-240— Amethyst
  { name: "Amethyst",   color: "#9B59B6", glow: "#BF5FFF", gradient: ["#581C87","#A855F7"], icon: "💜" },
  // Tier 9: L241-270— Diamond
  { name: "Diamond",    color: "#B9F2FF", glow: "#00FFFF", gradient: ["#0E7490","#67E8F9"], icon: "💎" },
  // Tier 10: L271-300— Legend
  { name: "Legend",     color: "#FFD700", glow: "#FF8C00", gradient: ["#7C3AED","#F59E0B"], icon: "👑" },
];

const MAX_COINS = 50_000_000_000;

function generateLevels(count, maxCoins) {
  const levels = [];
  for (let i = 1; i <= count; i++) {
    // Exponential distribution: coins = maxCoins * ((i-1)/(count-1))^2.5
    const t = (i - 1) / (count - 1);
    const coins_required = i === 1 ? 0 : Math.round(maxCoins * Math.pow(t, 2.5));
    const tierIndex = Math.min(9, Math.floor((i - 1) / 30));
    const tier = LEVEL_TIER_THEMES[tierIndex];
    const posInTier = ((i - 1) % 30) + 1; // 1..30 within tier
    levels.push({
      level: i,
      coins_required,
      tier_name: tier.name,
      tier_index: tierIndex,
      color: tier.color,
      glow: tier.glow,
      gradient: tier.gradient,
      icon: tier.icon,
      level_name: posInTier === 30 ? `${tier.name} Master` : posInTier === 15 ? `${tier.name} II` : tier.name,
    });
  }
  return levels;
}

export const USER_LEVELS = generateLevels(300, MAX_COINS);
export const LEVEL_TIER_CONFIG = LEVEL_TIER_THEMES;

// Helper: get level info from coins
export const getUserLevelFromCoins = (coins = 0) => {
  let current = USER_LEVELS[0];
  for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
    if (coins >= USER_LEVELS[i].coins_required) { current = USER_LEVELS[i]; break; }
  }
  const nextLevel = USER_LEVELS.find(l => l.level === current.level + 1);
  const progress = nextLevel
    ? Math.min(100, ((coins - current.coins_required) / (nextLevel.coins_required - current.coins_required)) * 100)
    : 100;
  return { ...current, next: nextLevel, progress };
};

// ============================================================
// HOST LEVEL SYSTEM — Level 1 to 300 (Diamond-based)
// Diamonds range: 0 → 500,000,000
// ============================================================
const MAX_HOST_DIAMONDS = 500_000_000;

export const HOST_LEVELS = (() => {
  const levels = [];
  for (let i = 1; i <= 300; i++) {
    const t = (i - 1) / 299;
    const diamonds_required = i === 1 ? 0 : Math.round(MAX_HOST_DIAMONDS * Math.pow(t, 2.2));
    const tierIndex = Math.min(9, Math.floor((i - 1) / 30));
    const tier = LEVEL_TIER_THEMES[tierIndex];
    const hostNames = ["Newcomer","Rising","Performer","Popular","Star","Super Star","Elite","Master","Legend","GOAT"];
    levels.push({
      level: i,
      diamonds_required,
      name: hostNames[tierIndex] + (i % 30 === 0 ? " MAX" : ""),
      color: tier.color,
      glow: tier.glow,
      gradient: tier.gradient,
      icon: tier.icon,
      tier_name: tier.name,
    });
  }
  return levels;
})();

export const getHostLevel = (diamonds = 0) => {
  let current = HOST_LEVELS[0];
  for (let i = HOST_LEVELS.length - 1; i >= 0; i--) {
    if (diamonds >= HOST_LEVELS[i].diamonds_required) { current = HOST_LEVELS[i]; break; }
  }
  const next = HOST_LEVELS.find(l => l.level === current.level + 1);
  const progress = next
    ? Math.min(100, ((diamonds - current.diamonds_required) / (next.diamonds_required - current.diamonds_required)) * 100)
    : 100;
  return { ...current, next, progress };
};

// ============================================================
// GIFTING LEVEL SYSTEM — Level 1 to 300
// Based on total coins SPENT on gifts
// Range: 0 → 3,000,000,000
// ============================================================
const MAX_GIFT_COINS = 3_000_000_000;

export const GIFTING_LEVELS = (() => {
  const levels = [];
  const names = ["Gifter","Generous","Supporter","Champion","Legend","King","Emperor","God","Divine","Eternal"];
  for (let i = 1; i <= 300; i++) {
    const t = (i - 1) / 299;
    const coins_spent = i === 1 ? 0 : Math.round(MAX_GIFT_COINS * Math.pow(t, 2.3));
    const tierIndex = Math.min(9, Math.floor((i - 1) / 30));
    const tier = LEVEL_TIER_THEMES[tierIndex];
    levels.push({
      level: i,
      coins_spent,
      name: names[tierIndex] + (i % 30 === 0 ? " MAX" : ""),
      color: tier.color,
      glow: tier.glow,
      gradient: tier.gradient,
      icon: tier.icon,
      tier_name: tier.name,
    });
  }
  return levels;
})();

export const getGiftingLevel = (coinsSpent = 0) => {
  let current = GIFTING_LEVELS[0];
  for (let i = GIFTING_LEVELS.length - 1; i >= 0; i--) {
    if (coinsSpent >= GIFTING_LEVELS[i].coins_spent) { current = GIFTING_LEVELS[i]; break; }
  }
  const next = GIFTING_LEVELS.find(l => l.level === current.level + 1);
  const progress = next
    ? Math.min(100, ((coinsSpent - current.coins_spent) / (next.coins_spent - current.coins_spent)) * 100)
    : 100;
  return { ...current, next, progress };
};

// ============================================================
// STREAMING LEVEL SYSTEM — Level 1 to 300
// Based on total streaming minutes
// Range: 0 → 100,000 hours (6,000,000 minutes)
// ============================================================
const MAX_STREAM_MINUTES = 6_000_000;

export const STREAMING_LEVELS = (() => {
  const levels = [];
  const names = ["Rookie","Amateur","Regular","Veteran","Pro","Expert","Master","Elite","Legend","Icon"];
  for (let i = 1; i <= 300; i++) {
    const t = (i - 1) / 299;
    const minutes_required = i === 1 ? 0 : Math.round(MAX_STREAM_MINUTES * Math.pow(t, 2.0));
    const tierIndex = Math.min(9, Math.floor((i - 1) / 30));
    const tier = LEVEL_TIER_THEMES[tierIndex];
    levels.push({
      level: i,
      minutes_required,
      name: names[tierIndex] + (i % 30 === 0 ? " MAX" : ""),
      color: tier.color,
      glow: tier.glow,
      gradient: tier.gradient,
      icon: tier.icon,
      tier_name: tier.name,
    });
  }
  return levels;
})();

export const getStreamingLevel = (minutes = 0) => {
  let current = STREAMING_LEVELS[0];
  for (let i = STREAMING_LEVELS.length - 1; i >= 0; i--) {
    if (minutes >= STREAMING_LEVELS[i].minutes_required) { current = STREAMING_LEVELS[i]; break; }
  }
  const next = STREAMING_LEVELS.find(l => l.level === current.level + 1);
  const progress = next
    ? Math.min(100, ((minutes - current.minutes_required) / (next.minutes_required - current.minutes_required)) * 100)
    : 100;
  return { ...current, next, progress };
};

// ============================================================
// LEGACY / OTHER CONSTANTS
// ============================================================

// VIP Tiers
export const VIP_TIERS = [
  { key: "vip1", name: "Bronze", icon: "🥉", color: "#CD7F32", price_coins: 500 },
  { key: "vip2", name: "Silver", icon: "🥈", color: "#C0C0C0", price_coins: 1500 },
  { key: "vip3", name: "Gold",   icon: "🥇", color: "#FFD700", price_coins: 3000 },
  { key: "vip4", name: "Platinum", icon: "💎", color: "#E5E4E2", price_coins: 6000 },
  { key: "vip5", name: "Diamond", icon: "👑", color: "#B9F2FF", price_coins: 12000 },
];

// Listener Levels (kept for backward compat)
export const LISTENER_LEVELS = USER_LEVELS.slice(0, 100).map(l => ({ ...l, xp_required: l.coins_required }));

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