// Flutter Migration: lib/shared/widgets/level_badge.dart
import { getUserLevelFromCoins, getHostLevel } from "@/lib/constants";

export default function LevelBadge({ type = "user", coins = 0, diamonds = 0, level, size = "sm" }) {
  const lvl = type === "host" ? getHostLevel(diamonds) : getUserLevelFromCoins(coins);
  const displayLevel = level || lvl.level;
  const { color, glow } = lvl;

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold border ${sizes[size]}`}
      style={{
        background: `linear-gradient(135deg, ${color}33, ${color}11)`,
        color,
        borderColor: color + "66",
        boxShadow: `0 0 8px ${glow}44`,
        textShadow: `0 1px 4px rgba(0,0,0,0.5)`,
      }}
    >
      <span>{lvl.icon}</span>
      <span>Lv.{displayLevel}</span>
    </span>
  );
}