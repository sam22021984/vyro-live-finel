// Flutter Migration: lib/features/live_room/widgets/chat_panel.dart
import { useEffect, useRef } from "react";
import { getVIPColor } from "@/lib/utils";

export default function ChatPanel({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const vipLabels = { vip1: "V1", vip2: "V2", vip3: "V3", vip4: "V4", vip5: "V5" };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
      <div className="text-slate-600 text-xs text-center mb-2">Live Chat</div>
      {messages.map(msg => (
        <div key={msg.id} className={`flex items-start gap-2 ${msg.isMe ? "flex-row-reverse" : ""}`}>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
            style={{ backgroundColor: "#9B59B6" }}
          >
            {msg.user?.charAt(0) || "U"}
          </div>
          <div className={`flex flex-col ${msg.isMe ? "items-end" : ""} max-w-[80%]`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              {msg.vip !== "none" && (
                <span
                  className="text-xs px-1 rounded font-bold"
                  style={{ backgroundColor: getVIPColor(msg.vip) + "30", color: getVIPColor(msg.vip) }}
                >
                  {vipLabels[msg.vip]}
                </span>
              )}
              {msg.level && (
                <span className="text-xs text-purple-400">Lv.{msg.level}</span>
              )}
              <span className="text-slate-400 text-xs">{msg.user}</span>
            </div>
            <div className={`rounded-2xl px-3 py-1.5 text-sm ${
              msg.isMe
                ? "bg-purple-600 text-white rounded-tr-none"
                : "bg-white/10 text-slate-200 rounded-tl-none"
            }`}>
              {msg.message}
            </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}