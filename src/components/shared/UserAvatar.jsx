// Flutter Migration: lib/shared/widgets/user_avatar.dart
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getVIPColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function UserAvatar({ user, size = "md", showVIP = true, className }) {
  const sizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-14 h-14", xl: "w-20 h-20" };
  const vipColor = showVIP && user?.vip_tier !== "none" ? getVIPColor(user?.vip_tier) : null;

  return (
    <div className={cn("relative inline-block", className)}>
      <Avatar className={cn(sizes[size], vipColor && "ring-2")} style={vipColor ? { ringColor: vipColor } : {}}>
        <AvatarImage src={user?.avatar_url} />
        <AvatarFallback className="bg-purple-700 text-white text-xs font-bold">
          {user?.display_name?.charAt(0) || user?.full_name?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      {vipColor && (
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0D0D1A] flex items-center justify-center"
          style={{ backgroundColor: vipColor }}
        >
          <span className="text-white" style={{ fontSize: 6 }}>V</span>
        </div>
      )}
    </div>
  );
}