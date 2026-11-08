// Approved THRONE / TECH wordmark (outlined vector, transparent background).
// The source canvas is 2400x900 with the lockup centred at visible bounds
// x 585–1815, y 213–687; we crop that padding with CSS instead of editing the file.
const VIEW = { x: 585, y: 213, w: 1230, h: 474, canvasW: 2400 };

export function BrandWordmark({
  width = 140,
  variant = "offwhite",
  label = "Throne Tech",
  className = "",
}: {
  width?: number;
  variant?: "offwhite" | "navy";
  label?: string;
  className?: string;
}) {
  const scale = width / VIEW.w;
  return (
    <span
      role="img"
      aria-label={label}
      className={className}
      style={{
        display: "inline-block",
        position: "relative",
        overflow: "hidden",
        width,
        height: Math.round(VIEW.h * scale),
        flexShrink: 0,
      }}
    >
      <img
        src={`/brand/throne-tech-wordmark-${variant}-transparent.svg`}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{
          position: "absolute",
          maxWidth: "none",
          width: VIEW.canvasW * scale,
          left: -VIEW.x * scale,
          top: -VIEW.y * scale,
        }}
      />
    </span>
  );
}
