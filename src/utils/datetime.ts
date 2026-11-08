/** YYYY-MM-DD for a Date (or ISO string) in the given IANA timezone. */
export function dateKeyInZone(value: string | Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

/** Local calendar YYYY-MM-DD (browser timezone). */
export function localDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/** Monday-first weekday index 0–6 for the 1st of the month. */
export function mondayFirstOffset(date: Date): number {
  const dow = new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // 0 Sun
  return (dow + 6) % 7;
}

export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function formatSlotTime(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatAppointmentWhen(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

/**
 * Calendar cells are business-timezone dates: a cell's year/month/day IS the
 * booking-zone date, regardless of the visitor's browser timezone. Use this key
 * (never a browser-local noon converted through the zone) to look up slots.
 */
export function calendarDayKey(date: Date): string {
  return localDateKey(date);
}

/**
 * UTC ISO range that fully covers a calendar month in ANY business timezone:
 * padded by 2 days on each side (max UTC offset is ±14h). Results are grouped
 * by business-zone date key, so the padding never leaks into other cells.
 */
export function monthUtcRangeForZone(month: Date): { from: string; to: string } {
  const from = new Date(Date.UTC(month.getFullYear(), month.getMonth(), 1) - 2 * 86400000);
  const to = new Date(Date.UTC(month.getFullYear(), month.getMonth() + 1, 1) + 2 * 86400000);
  return { from: from.toISOString(), to: to.toISOString() };
}

/** Today's YYYY-MM-DD in the business timezone. */
export function todayKeyInZone(timeZone: string): string {
  return dateKeyInZone(new Date(), timeZone);
}

/** Short zone label for display, e.g. "EST" / "EDT" (falls back to the IANA id). */
export function zoneLabel(timeZone: string, at: Date = new Date()): string {
  try {
    const part = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" })
      .formatToParts(at)
      .find((p) => p.type === "timeZoneName");
    return part?.value || timeZone;
  } catch {
    return timeZone;
  }
}

/** Inclusive UTC ISO range covering a calendar month in local browser time. */
export function monthUtcRange(month: Date): { from: string; to: string } {
  const from = new Date(month.getFullYear(), month.getMonth(), 1, 0, 0, 0, 0);
  const to = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999);
  return { from: from.toISOString(), to: to.toISOString() };
}

export function sameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
