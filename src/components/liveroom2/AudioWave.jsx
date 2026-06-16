/**
 * AudioWave — animated bars for active speakers
 * Flutter: CustomPainter with AnimationController
 */
import { motion } from "framer-motion";

export default function AudioWave({ color = "#00C2B8", size = "sm" }) {
  const barCount = 5;
  const heights = [4, 8, 12, 8, 4];
  const barW = size === "sm" ? 2.5 : 3.5;
  const maxH = size === "sm" ? 12 : 18;

  return (
    <div style={{
      display: "flex", alignItems: "flex-end", gap: 2, height: maxH,
    }}>
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            width: barW, borderRadius: barW,
            background: color,
            boxShadow: `0 0 4px ${color}99`,
          }}
          animate={{
            height: [heights[i], maxH - heights[i] + 2, heights[i]],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.7 + i * 0.1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.12,
          }}
        />
      ))}
    </div>
  );
}