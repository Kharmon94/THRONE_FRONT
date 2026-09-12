import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  daysInMonth,
  formatMonthLabel,
  localDateKey,
  mondayFirstOffset,
  sameLocalDay,
  startOfMonth,
} from "../../utils/datetime";

export interface CalendarDayMeta {
  disabled?: boolean;
  /** Small status dots under the day number */
  dots?: string[];
}

interface MonthCalendarProps {
  month: Date;
  onMonthChange: (month: Date) => void;
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  getDayMeta?: (date: Date) => CalendarDayMeta | undefined;
  className?: string;
  /** Cap how far prev/next can go (optional) */
  minMonth?: Date;
  maxMonth?: Date;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthCalendar({
  month,
  onMonthChange,
  selected,
  onSelect,
  getDayMeta,
  className = "",
  minMonth,
  maxMonth,
}: MonthCalendarProps) {
  const base = startOfMonth(month);
  const totalDays = daysInMonth(base);
  const offset = mondayFirstOffset(base);
  const cells: Array<Date | null> = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) {
    cells.push(new Date(base.getFullYear(), base.getMonth(), d));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const canPrev =
    !minMonth ||
    base.getFullYear() > minMonth.getFullYear() ||
    (base.getFullYear() === minMonth.getFullYear() && base.getMonth() > minMonth.getMonth());
  const canNext =
    !maxMonth ||
    base.getFullYear() < maxMonth.getFullYear() ||
    (base.getFullYear() === maxMonth.getFullYear() && base.getMonth() < maxMonth.getMonth());

  const today = new Date();

  return (
    <div
      className={className}
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(212,175,55,0.12)",
        borderRadius: "16px",
        padding: "16px",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => canPrev && onMonthChange(addMonths(base, -1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background: "rgba(212,175,55,0.08)",
            border: "1px solid rgba(212,175,55,0.15)",
            color: canPrev ? "#D4AF37" : "rgba(212,175,55,0.25)",
            cursor: canPrev ? "pointer" : "default",
          }}
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <div
          style={{
            fontWeight: 600,
            fontSize: "0.95rem",
            background: "linear-gradient(135deg, #fff, #D4AF37)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {formatMonthLabel(base)}
        </div>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => canNext && onMonthChange(addMonths(base, 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background: "rgba(212,175,55,0.08)",
            border: "1px solid rgba(212,175,55,0.15)",
            color: canNext ? "#D4AF37" : "rgba(212,175,55,0.25)",
            cursor: canNext ? "pointer" : "default",
          }}
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center py-1"
            style={{
              color: "rgba(212,175,55,0.45)",
              fontSize: "0.65rem",
              fontFamily: "'Fira Code', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }
          const meta = getDayMeta?.(date);
          const disabled = Boolean(meta?.disabled);
          const isSelected = selected ? sameLocalDay(date, selected) : false;
          const isToday = sameLocalDay(date, today);
          const dots = meta?.dots ?? [];

          return (
            <button
              key={localDateKey(date)}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelect?.(date)}
              className="aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-150 relative"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.85rem",
                fontWeight: isSelected || isToday ? 600 : 400,
                background: isSelected
                  ? "rgba(212,175,55,0.22)"
                  : disabled
                    ? "transparent"
                    : "rgba(255,255,255,0.02)",
                border: isSelected
                  ? "1px solid rgba(212,175,55,0.55)"
                  : isToday
                    ? "1px solid rgba(212,175,55,0.25)"
                    : "1px solid transparent",
                color: disabled
                  ? "rgba(255,255,255,0.18)"
                  : isSelected
                    ? "#F0D060"
                    : "rgba(255,255,255,0.75)",
                cursor: disabled ? "default" : "pointer",
                opacity: disabled ? 0.55 : 1,
              }}
            >
              <span>{date.getDate()}</span>
              {dots.length > 0 && (
                <span className="flex gap-0.5 absolute bottom-1">
                  {dots.slice(0, 4).map((color, di) => (
                    <span
                      key={`${localDateKey(date)}-dot-${di}`}
                      className="w-1 h-1 rounded-full"
                      style={{ background: color, boxShadow: `0 0 4px ${color}80` }}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
