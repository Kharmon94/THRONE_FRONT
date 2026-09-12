import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Send, CheckCircle, CalendarDays } from "lucide-react";
import { api } from "../../services/api";
import { GlassCard } from "./GlassCard";
import { MonthCalendar } from "./MonthCalendar";
import { useReduceAnimations } from "../../hooks/useReduceAnimations";
import {
  addMonths,
  dateKeyInZone,
  formatSlotTime,
  localDateKey,
  monthUtcRange,
  startOfMonth,
} from "../../utils/datetime";

const inputBase = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(212,175,55,0.1)",
  borderRadius: "12px",
  color: "white",
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "0.875rem",
  padding: "11px 14px",
  outline: "none",
  width: "100%",
  transition: "all 0.2s",
} as React.CSSProperties;

function focusStyle(el: HTMLElement) {
  el.style.borderColor = "rgba(212,175,55,0.45)";
  el.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.08)";
}
function blurStyle(el: HTMLElement) {
  el.style.borderColor = "rgba(212,175,55,0.1)";
  el.style.boxShadow = "none";
}

export function Contact() {
  const reduce = useReduceAnimations();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [timezone, setTimezone] = useState("America/New_York");
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", notes: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const loadSlots = useCallback(async (m: Date) => {
    setSlotsLoading(true);
    setError("");
    try {
      const { from, to } = monthUtcRange(m);
      const data = await api.getAppointmentSlots(from, to);
      setSlots(data.slots);
      setTimezone(data.timezone);
    } catch (err) {
      setSlots([]);
      setError(err instanceof Error ? err.message : "Failed to load available times.");
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSlots(month);
  }, [month, loadSlots]);

  const slotsByDay = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const s of slots) {
      const key = dateKeyInZone(s, timezone);
      const list = map.get(key) ?? [];
      list.push(s);
      map.set(key, list);
    }
    return map;
  }, [slots, timezone]);

  const daySlots = useMemo(() => {
    if (!selectedDay) return [];
    // Match slot day keys (in biz timezone) to the calendar cell's local YYYY-MM-DD
    // by converting the selected local day noon through the same zone formatter.
    const noon = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate(), 12);
    const key = dateKeyInZone(noon, timezone);
    // Also try localDateKey if browser TZ matches booking TZ
    return slotsByDay.get(key) ?? slotsByDay.get(localDateKey(selectedDay)) ?? [];
  }, [selectedDay, slotsByDay, timezone]);

  const handleSelectDay = (date: Date) => {
    setSelectedDay(date);
    setSelectedSlot(null);
  };

  const handleMonthChange = (m: Date) => {
    setMonth(m);
    setSelectedDay(null);
    setSelectedSlot(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError("Please select a time slot.");
      return;
    }
    setError("");
    setSending(true);
    try {
      await api.createAppointment({
        name: form.name,
        email: form.email,
        company: form.company || undefined,
        notes: form.notes || undefined,
        starts_at: selectedSlot,
      });
      setSent(true);
      setForm({ name: "", email: "", company: "", notes: "" });
      setSelectedSlot(null);
      setSelectedDay(null);
      await loadSlots(month);
      setTimeout(() => setSent(false), 4500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const minMonth = startOfMonth(new Date());
  const maxMonth = addMonths(minMonth, 3);

  return (
    <section id="contact" className="py-28 px-4" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reduce ? 0.3 : 0.6 }}
          className="text-center mb-16"
        >
          <span style={{ color: "#D4AF37", fontFamily: "'Fira Code', monospace", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            // book a call
          </span>
          <h2
            className="mt-2"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              background: "linear-gradient(135deg, #fff 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}
          >
            Schedule a Conversation
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reduce ? 0.35 : 0.7, delay: reduce ? 0.1 : 0.35 }}
        >
          <GlassCard className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays size={15} style={{ color: "#D4AF37" }} />
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Choose a day
                  </span>
                </div>
                <MonthCalendar
                  month={month}
                  onMonthChange={handleMonthChange}
                  selected={selectedDay}
                  onSelect={handleSelectDay}
                  minMonth={minMonth}
                  maxMonth={maxMonth}
                  getDayMeta={(date) => {
                    const noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
                    const key = dateKeyInZone(noon, timezone);
                    const has = (slotsByDay.get(key) ?? slotsByDay.get(localDateKey(date)) ?? []).length > 0;
                    return { disabled: slotsLoading || !has };
                  }}
                />
                {slotsLoading && (
                  <p className="mt-2" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                    Loading availability…
                  </p>
                )}
              </div>

              {selectedDay && (
                <div>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
                    Available times
                  </label>
                  {daySlots.length === 0 ? (
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                      No open slots this day.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {daySlots.map((slot) => {
                        const active = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className="px-3.5 py-2 rounded-lg text-sm transition-all duration-150"
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              background: active ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.03)",
                              border: active ? "1px solid rgba(212,175,55,0.5)" : "1px solid rgba(255,255,255,0.07)",
                              color: active ? "#D4AF37" : "rgba(255,255,255,0.55)",
                              fontWeight: active ? 600 : 400,
                              cursor: "pointer",
                            }}
                          >
                            {formatSlotTime(slot, timezone)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Alex Johnson"
                    style={inputBase}
                    onFocus={(e) => focusStyle(e.target as HTMLElement)}
                    onBlur={(e) => blurStyle(e.target as HTMLElement)}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                    placeholder="alex@company.com"
                    style={inputBase}
                    onFocus={(e) => focusStyle(e.target as HTMLElement)}
                    onBlur={(e) => blurStyle(e.target as HTMLElement)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                  Company / Project Name
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))}
                  placeholder="Acme Corp"
                  style={inputBase}
                  onFocus={(e) => focusStyle(e.target as HTMLElement)}
                  onBlur={(e) => blurStyle(e.target as HTMLElement)}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
                  placeholder="Anything we should know before the call…"
                  style={{ ...inputBase, resize: "none" }}
                  onFocus={(e) => focusStyle(e.target as HTMLElement)}
                  onBlur={(e) => blurStyle(e.target as HTMLElement)}
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{error}</div>
              )}

              <motion.button
                type="submit"
                disabled={sending || sent || !selectedSlot}
                className="w-full py-4 rounded-xl text-black flex items-center justify-center gap-2 transition-all duration-300"
                style={{
                  background: sent ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #F0D060, #D4AF37)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: sent ? "white" : "black",
                  boxShadow: sent ? "0 0 30px rgba(16,185,129,0.4)" : "0 0 30px rgba(212,175,55,0.35)",
                  cursor: sending || !selectedSlot ? "not-allowed" : "pointer",
                  letterSpacing: "0.02em",
                  opacity: !selectedSlot && !sent ? 0.7 : 1,
                }}
                whileHover={!reduce && !sending && !sent && selectedSlot ? { scale: 1.01 } : undefined}
                whileTap={!reduce && !sending && !sent && selectedSlot ? { scale: 0.99 } : undefined}
              >
                {sent ? (
                  <><CheckCircle size={16} /> Booked — We'll confirm soon!</>
                ) : sending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Booking…
                  </span>
                ) : (
                  <><Send size={15} /> Confirm Booking</>
                )}
              </motion.button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
