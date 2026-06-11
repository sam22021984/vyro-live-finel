// 3D Level Badge Component
// Flutter Migration: lib/shared/widgets/level_badge_3d.dart
import { getUserLevelFromCoins, getHostLevel, getGiftingLevel, getStreamingLevel } from "@/lib/constants";

const TYPE_LABELS = {
  user: "LV",
  host: "H",
  gifting: "G",
  streaming: "S",
};

export default function LevelBadge3D({ type = "user", value = 0, size = "md", showName = false }) {
  let levelData;
  if (type === "user") levelData = getUserLevelFromCoins(value);
  else if (type === "host") levelData = getHostLevel(value);
  else if (type === "gifting") levelData = getGiftingLevel(value);
  else if (type === "streaming") levelData = getStreamingLevel(value);
  else levelData = getUserLevelFromCoins(value);

  const { level, color, glow, gradient, icon, tier_name, name } = levelData;

  const sizeConfig = {
    xs: { outer: "w-8 h-8", inner: "w-6 h-6", text: "text-[9px]", badge: "text-[7px]" },
    sm: { outer: "w-10 h-10", inner: "w-8 h-8", text: "text-xs", badge: "text-[8px]" },
    md: { outer: "w-14 h-14", inner: "w-11 h-11", text: "text-sm", badge: "text-[9px]" },
    lg: { outer: "w-20 h-20", inner: "w-16 h-16", text: "text-base", badge: "text-xs" },
    xl: { outer: "w-28 h-28", inner: "w-22 h-22", text: "text-xl", badge: "text-sm" },
  };
  const sz = sizeConfig[size] || sizeConfig.md;
  const typeLabel = TYPE_LABELS[type] || "LV";

  return (
    <div className="flex flex-col items-center gap-1">
      {/* 3D Badge */}
      <div
        className={`${sz.outer} relative flex items-center justify-center rounded-full cursor-default select-none`}
        style={{
          background: `conic-gradient(from 0deg, ${gradient[0]}, ${gradient[1]}, ${gradient[0]})`,
          boxShadow: `0 0 12px ${glow}66, 0 4px 16px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.25)`,
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
        }}
      >
        {/* Shine overlay */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 60%)",
          }}
        />
        {/* Inner disc */}
        <div
          className={`${sz.inner} rounded-full flex flex-col items-center justify-center relative z-10`}
          style={{
            background: `radial-gradient(circle at 35% 35%, ${gradient[1]}cc, ${gradient[0]}ff)`,
            boxShadow: `inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.4)`,
          }}
        >
          <span className={`font-black leading-none ${sz.text}`} style={{ color: "#fff", textShadow: `0 1px 4px rgba(0,0,0,0.8)` }}>
            {level}
          </span>
          <span className={`font-bold leading-none ${sz.badge} opacity-80`} style={{ color: "#fff" }}>
            {typeLabel}
          </span>
        </div>
        {/* Bottom icon */}
        <span
          className="absolute -bottom-1 text-xs leading-none"
          style={{ filter: `drop-shadow(0 1px 3px rgba(0,0,0,0.6))` }}
        >
          {icon}
        </span>
      </div>
      {/* Name label */}
      {showName && (
        <div className="text-center">
          <div className="text-[10px] font-bold" style={{ color }}>{tier_name}</div>
          {name && <div className="text-[9px] text-slate-400">{name}</div>}
        </div>
      )}
    </div>
  );
}