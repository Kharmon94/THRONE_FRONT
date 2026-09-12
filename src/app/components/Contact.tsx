import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Send, CheckCircle, CalendarDays, Clock, ArrowLeft, ArrowRight, User } from "lucide-react";
import { api } from "../../services/api";
import { GlassCard } from "./GlassCard";
import { MonthCalendar } from "./MonthCalendar";
import { BookingStepIndicator } from "./BookingStepIndicator";
import { useReduceAnimations } from "../../hooks/useReduceAnimations";
import {
  addMonths,
  dateKeyInZone,
  formatSlotTime,
  localDateKey,
  monthUtcRange,
  startOfMonth,
} from "../../utils/datetime";

const BOOKING_STEPS = [
  { id: 1, label: "Date" },
  { id: 2, label: "Time" },
  { id: 3, label: "Details" },
];

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

function formatSelectedDay(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const navBtnBase: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 600,
  fontSize: "0.85rem",
  borderRadius: "12px",
  padding: "12px 18px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s",
};

export function Contact() {
  const reduce = useReduceAnimations();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [step, setStep] = useState(1);
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
    setError("");
  };

  const handleMonthChange = (m: Date) => {
    setMonth(m);
    setSelectedDay(null);
    setSelectedSlot(null);
  };

  const goNext = () => {
    setError("");
    if (step === 1) {
      if (!selectedDay) {
        setError("Please select a day.");
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!selectedSlot) {
        setError("Please select a time slot.");
        return;
      }
      setStep(3);
    }
  };

  const goBack = () => {
    setError("");
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError("Please select a time slot.");
      return;
    }
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
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
      setStep(1);
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
      <div className="max-w-6xl mx-auto">
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
          <GlassCard className="p-6 sm:p-8">
            {sent ? (
              <div className="text-center py-10 sm:py-14">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
                >
                  <CheckCircle size={22} style={{ color: "#10b981" }} />
                </div>
                <h3
                  className="text-white mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.25rem" }}
                >
                  Booked — we'll confirm soon
                </h3>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                  Check your inbox for details. Looking forward to speaking with you.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full space-y-6">
                <BookingStepIndicator steps={BOOKING_STEPS} current={step} />

                {step === 1 && (
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
                )}

                {step === 2 && selectedDay && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={15} style={{ color: "#D4AF37" }} />
                      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Available times · {formatSelectedDay(selectedDay)}
                      </span>
                    </div>
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
                              onClick={() => {
                                setSelectedSlot(slot);
                                setError("");
                              }}
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

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <User size={15} style={{ color: "#D4AF37" }} />
                      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Your details
                      </span>
                    </div>
                    {selectedDay && selectedSlot && (
                      <p
                        className="mb-2"
                        style={{
                          color: "rgba(212,175,55,0.75)",
                          fontSize: "0.85rem",
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        {formatSelectedDay(selectedDay)} · {formatSlotTime(selectedSlot, timezone)}
                      </p>
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
                  </div>
                )}

                {error && (
                  <div className="text-red-400 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{error}</div>
                )}

                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between pt-1">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      style={{
                        ...navBtnBase,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.7)",
                        width: "100%",
                      }}
                      className="sm:w-auto sm:min-w-[120px]"
                    >
                      <ArrowLeft size={15} /> Back
                    </button>
                  ) : (
                    <div className="hidden sm:block" />
                  )}

                  {step < 3 ? (
                    <motion.button
                      type="button"
                      onClick={goNext}
                      disabled={(step === 1 && !selectedDay) || (step === 2 && !selectedSlot)}
                      className="w-full sm:w-auto sm:min-w-[140px]"
                      style={{
                        ...navBtnBase,
                        background: "linear-gradient(135deg, #F0D060, #D4AF37)",
                        color: "black",
                        boxShadow: "0 0 24px rgba(212,175,55,0.3)",
                        opacity: (step === 1 && !selectedDay) || (step === 2 && !selectedSlot) ? 0.55 : 1,
                        cursor: (step === 1 && !selectedDay) || (step === 2 && !selectedSlot) ? "not-allowed" : "pointer",
                      }}
                      whileHover={
                        !reduce &&
                        !((step === 1 && !selectedDay) || (step === 2 && !selectedSlot))
                          ? { scale: 1.01 }
                          : undefined
                      }
                      whileTap={
                        !reduce &&
                        !((step === 1 && !selectedDay) || (step === 2 && !selectedSlot))
                          ? { scale: 0.99 }
                          : undefined
                      }
                    >
                      Next <ArrowRight size={15} />
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={sending || !selectedSlot}
                      className="w-full sm:w-auto sm:min-w-[180px]"
                      style={{
                        ...navBtnBase,
                        background: "linear-gradient(135deg, #F0D060, #D4AF37)",
                        color: "black",
                        boxShadow: "0 0 30px rgba(212,175,55,0.35)",
                        cursor: sending || !selectedSlot ? "not-allowed" : "pointer",
                        opacity: !selectedSlot ? 0.7 : 1,
                        letterSpacing: "0.02em",
                      }}
                      whileHover={!reduce && !sending && selectedSlot ? { scale: 1.01 } : undefined}
                      whileTap={!reduce && !sending && selectedSlot ? { scale: 0.99 } : undefined}
                    >
                      {sending ? (
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
                  )}
                </div>
              </form>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
