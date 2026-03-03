// Throne Technology crown logo mark
export function ThroneIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 24 L4 12 L9 17 L16 8 L23 17 L28 12 L28 24 Z"
        fill="url(#crownGrad)"
        stroke="rgba(212,175,55,0.6)"
        strokeWidth="0.5"
      />
      <rect x="4" y="25" width="24" height="3" rx="1.5" fill="url(#crownGrad)" />
      <circle cx="4" cy="12" r="2" fill="#D4AF37" />
      <circle cx="16" cy="8" r="2" fill="#F0D060" />
      <circle cx="28" cy="12" r="2" fill="#D4AF37" />
      <defs>
        <linearGradient id="crownGrad" x1="4" y1="8" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F0D060" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#9A7B0A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
