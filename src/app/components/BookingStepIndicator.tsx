interface BookingStep {
  id: number;
  label: string;
}

interface BookingStepIndicatorProps {
  steps: BookingStep[];
  current: number;
}

export function BookingStepIndicator({ steps, current }: BookingStepIndicatorProps) {
  return (
    <nav
      aria-label="Booking steps"
      className="w-full mb-5 md:mb-6"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
        gap: "8px",
      }}
    >
      {steps.map((step, index) => {
        const active = step.id === current;
        const done = step.id < current;
        const showConnector = index < steps.length - 1;

        return (
          <div key={step.id} className="relative flex flex-col items-center text-center min-w-0">
            <div className="flex items-center w-full justify-center mb-2 relative">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-[1]"
                style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  background: active || done
                    ? "linear-gradient(135deg, rgba(240,208,96,0.25), rgba(212,175,55,0.18))"
                    : "rgba(255,255,255,0.03)",
                  border: active || done
                    ? "1px solid rgba(212,175,55,0.55)"
                    : "1px solid rgba(255,255,255,0.08)",
                  color: active || done ? "#F0D060" : "rgba(255,255,255,0.35)",
                  boxShadow: active ? "0 0 16px rgba(212,175,55,0.25)" : "none",
                }}
                aria-current={active ? "step" : undefined}
              >
                {step.id}
              </div>
              {showConnector && (
                <div
                  aria-hidden
                  className="absolute left-[calc(50%+18px)] right-[-50%] top-1/2 h-px -translate-y-1/2"
                  style={{
                    background: done
                      ? "linear-gradient(90deg, rgba(212,175,55,0.5), rgba(212,175,55,0.2))"
                      : "rgba(255,255,255,0.08)",
                  }}
                />
              )}
            </div>
            <span
              className="truncate w-full px-1"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: active ? "#D4AF37" : done ? "rgba(212,175,55,0.65)" : "rgba(255,255,255,0.35)",
                fontWeight: active ? 600 : 400,
              }}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
