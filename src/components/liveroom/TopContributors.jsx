// Flutter Migration: lib/features/live_room/widgets/top_contributors.dart
import { Crown } from "lucide-react";

export default function TopContributors({ transactions }) {
  // Aggregate by sender
  const map = {};
  transactions.forEach(t => {
    map[t.sender_id] = (map[t.sender_id] || 0) + t.diamonds_earned;
  });
  const top3 = Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id, diamonds]) => ({ id, diamonds }));

  if (top3.length === 0) return null;

  const crownColors = ["text-yellow-400", "text-slate-300", "text-amber-600"];
  const positions = [1, 0, 2]; // center = first

  return (
    <div className="flex items-center justify-center gap-4 px-4 mb-4">
      {top3.map((contrib, i) => (
        <div key={contrib.id} className={`flex flex-col items-center gap-1 ${i === 0 ? "order-2" : i === 1 ? "order-1" : "order-3"}`}>
          <Crown className={`w-4 h-4 ${crownColors[i]}`} />
          <div className={`rounded-full bg-white/10 border-2 flex items-center justify-center text-white font-bold ${
            i === 0 ? "w-12 h-12 text-base border-yellow-400" : "w-9 h-9 text-sm border-slate-500"
          }`}>
            {contrib.id.charAt(0).toUpperCase()}
          </div>
          <span className="text-yellow-400 text-xs">💎 {contrib.diamonds}</span>
        </div>
      ))}
    </div>
  );
}