// Flutter Migration: lib/shared/widgets/stat_card.dart
export default function StatCard({ title, value, subtitle, icon: Icon, gradient, trend, trendUp }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 ${gradient || "bg-white/5 border border-white/10"}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${trendUp ? "text-green-400" : "text-red-400"}`}>
          <span>{trendUp ? "▲" : "▼"}</span>
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}