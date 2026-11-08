// Throne Tech avatar mark. Renders the approved brand file
// (public/brand/throne-tech-avatar.svg: gold outlined "T" on navy) unchanged.
export function ThroneIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src="/brand/throne-tech-avatar.svg"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      className={className}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.22), display: "block", flexShrink: 0 }}
    />
  );
}
