// Flutter Migration: lib/shared/widgets/level_badge.dart
import { getListenerLevel, getHostLevel } from "@/lib/utils";

export default function LevelBadge({ level, type = "listener", xp, diamonds, size = "sm" }) {
  const lvl = type === "host" ? getHostLevel(diamonds || 0) : getListenerLevel(xp || 0);
  const displayLevel = level || lvl.level;
  const color = lvl.color || "#9B59B6";

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold border ${sizes[size]}`}
      style={{ backgroundColor: color + "20", color, borderColor: color + "40" }}
    >
      <span>Lv.{displayLevel}</span>
    </span>
  );
}