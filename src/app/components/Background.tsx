import { motion } from "motion/react";

const orbs = [
  { x: "8%",  y: "18%", size: 600, color: "rgba(212, 175, 55, 0.10)", delay: 0 },
  { x: "72%", y: "8%",  size: 500, color: "rgba(240, 208, 96, 0.08)", delay: 2 },
  { x: "85%", y: "62%", size: 520, color: "rgba(180, 140, 20, 0.09)", delay: 4 },
  { x: "22%", y: "72%", size: 420, color: "rgba(212, 175, 55, 0.07)", delay: 1 },
  { x: "50%", y: "40%", size: 380, color: "rgba(154, 123, 10, 0.06)", delay: 3 },
];

export function Background() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        background: "linear-gradient(135deg, #060504 0%, #0d0b07 40%, #080806 70%, #050505 100%)",
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      {/* Animated gold orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            filter: "blur(50px)",
          }}
          animate={{
            scale: [1, 1.15, 0.92, 1.08, 1],
            x: [0, 25, -18, 12, 0],
            y: [0, -20, 18, -8, 0],
          }}
          transition={{
            duration: 14 + i * 2,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Top gold glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: "70%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), rgba(240, 208, 96, 0.5), transparent)",
          boxShadow: "0 0 60px 20px rgba(212, 175, 55, 0.08)",
        }}
      />
    </div>
  );
}
