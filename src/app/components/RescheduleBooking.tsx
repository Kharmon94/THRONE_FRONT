import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, AlertCircle, CalendarDays, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { api } from "../../services/api";
import { Background } from "./Background";
import { GlassCard } from "./GlassCard";
import { MonthCalendar } from "./MonthCalendar";
import { BookingStepIndicator } from "./BookingStepIndicator";
import { ThroneIcon } from "./ThroneIcon";
import { useReduceAnimations } from "../../hooks/useReduceAnimations";
import {
  addMonths,
  dateKeyInZone,
  formatAppointmentWhen,
  formatSlotTime,
  localDateKey,
  monthUtcRange,
  startOfMonth,
} from "../../utils/datetime";

const RESCHEDULE_STEPS = [
  { id: 1, label: "Date" },
  { id: 2, label: "Time" },
];

interface RescheduleBookingProps {
  token: string;
  onDone?: () => void;
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

export function RescheduleBooking({ token, onDone }: RescheduleBookingProps) {
  const reduce = useReduceAnimations();
  const [loading, setLoading] = useState(true);
  const [tokenError, setTokenError] = useState("");
  const [name, setName] = useState("");
  const [currentStartsAt, setCurrentStartsAt] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");

  const [step, setStep] = useState(1);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setTokenError("");
      try {
        const data = await api.getRescheduleAppointment(token);
        if (cancelled) return;
        setName(data.appointment.name);
        setCurrentStartsAt(data.appointment.starts_at);
        setTimezone(data.timezone);
        const start = new Date(data.appointment.starts_at);
        setMonth(startOfMonth(start));
      } catch (err) {
        if (!cancelled) {
          setTokenError(err instanceof Error ? err.message : "Invalid or expired reschedule link.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const loadSlots = useCallback(async (m: Date) => {
    setSlotsLoading(true);
    try {
      const { from, to } = monthUtcRange(m);
      const data = await api.getAppointmentSlots(from, to);
      setSlots(data.slots);
      setTimezone(data.timezone);
    } catch (err) {
      setSlots([]);
      setError(err instanceof Error ? err.message : "Failed to load slots.");
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!tokenError && !loading) loadSlots(month);
  }, [month, loadSlots, tokenError, loading]);

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
    const noon = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate(), 12);
    const key = dateKeyInZone(noon, timezone);
    return slotsByDay.get(key) ?? slotsByDay.get(localDateKey(selectedDay)) ?? [];
  }, [selectedDay, slotsByDay, timezone]);

  const goNext = () => {
    setError("");
    if (step === 1) {
      if (!selectedDay) {
        setError("Please select a day.");
        return;
      }
      setStep(2);
    }
  };

  const goBack = () => {
    setError("");
    if (step === 2) setStep(1);
  };

  const handleSubmit = async () => {
    if (!selectedSlot) {
      setError("Please select a new time.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await api.updateRescheduleAppointment(token, selectedSlot);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reschedule.");
    } finally {
      setSubmitting(false);
    }
  };

  const minMonth = startOfMonth(new Date());
  const maxMonth = addMonths(minMonth, 3);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <Background />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin h-8 w-8 border-2 border-amber-600 border-t-transparent rounded-full" />
            </div>
          ) : tokenError ? (
            <GlassCard className="p-8 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
              >
                <AlertCircle size={22} style={{ color: "#f87171" }} />
              </div>
              <h1 className="text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>
                Link unavailable
              </h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", marginBottom: "20px" }}>
                {tokenError}
              </p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = "";
                  onDone?.();
                }}
                className="inline-flex items-center gap-2 text-sm"
                style={{ color: "#D4AF37", textDecoration: "none" }}
              >
                <ArrowLeft size={14} /> Back to site
              </a>
            </GlassCard>
          ) : done ? (
            <GlassCard className="p-8 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
              >
                <CheckCircle size={22} style={{ color: "#10b981" }} />
              </div>
              <h1 className="text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>
                Reschedule requested
              </h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", marginBottom: "20px" }}>
                Your new time is pending confirmation. We'll be in touch soon.
              </p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = "";
                  onDone?.();
                }}
                className="inline-flex items-center gap-2 text-sm"
                style={{ color: "#D4AF37", textDecoration: "none" }}
              >
                <ArrowLeft size={14} /> Back to site
              </a>
            </GlassCard>
          ) : (
            <GlassCard className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <ThroneIcon size={28} />
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.95rem", background: "linear-gradient(135deg, #F0D060, #D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Reschedule appointment
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>
                    Hi {name} — currently {formatAppointmentWhen(currentStartsAt, timezone)}
                  </div>
                </div>
              </div>

              <BookingStepIndicator steps={RESCHEDULE_STEPS} current={step} />

              <div className="space-y-5">
                {step === 1 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CalendarDays size={15} style={{ color: "#D4AF37" }} />
                      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Pick a new day
                      </span>
                    </div>
                    <MonthCalendar
                      month={month}
                      onMonthChange={(m) => {
                        setMonth(m);
                        setSelectedDay(null);
                        setSelectedSlot(null);
                      }}
                      selected={selectedDay}
                      onSelect={(d) => {
                        setSelectedDay(d);
                        setSelectedSlot(null);
                        setError("");
                      }}
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
                      <p className="mt-2" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem" }}>
                        Loading availability…
                      </p>
                    )}
                  </div>
                )}

                {step === 2 && selectedDay && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={15} style={{ color: "#D4AF37" }} />
                      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Available times · {formatSelectedDay(selectedDay)}
                      </span>
                    </div>
                    {daySlots.length === 0 ? (
                      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>
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
                              className="px-3.5 py-2 rounded-lg text-sm transition-all"
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

                {error && (
                  <div className="text-red-400 text-sm">{error}</div>
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

                  {step === 1 ? (
                    <motion.button
                      type="button"
                      onClick={goNext}
                      disabled={!selectedDay}
                      className="w-full sm:w-auto sm:min-w-[140px]"
                      style={{
                        ...navBtnBase,
                        background: "linear-gradient(135deg, #F0D060, #D4AF37)",
                        color: "black",
                        boxShadow: "0 0 24px rgba(212,175,55,0.3)",
                        opacity: !selectedDay ? 0.55 : 1,
                        cursor: !selectedDay ? "not-allowed" : "pointer",
                      }}
                      whileHover={!reduce && selectedDay ? { scale: 1.01 } : undefined}
                      whileTap={!reduce && selectedDay ? { scale: 0.99 } : undefined}
                    >
                      Next <ArrowRight size={15} />
                    </motion.button>
                  ) : (
                    <motion.button
                      type="button"
                      disabled={!selectedSlot || submitting}
                      onClick={handleSubmit}
                      className="w-full sm:w-auto sm:min-w-[180px]"
                      style={{
                        ...navBtnBase,
                        background: "linear-gradient(135deg, #F0D060, #D4AF37)",
                        color: "black",
                        boxShadow: "0 0 24px rgba(212,175,55,0.3)",
                        cursor: !selectedSlot || submitting ? "not-allowed" : "pointer",
                        opacity: !selectedSlot ? 0.7 : 1,
                      }}
                      whileHover={!reduce && selectedSlot && !submitting ? { scale: 1.01 } : undefined}
                      whileTap={!reduce && selectedSlot && !submitting ? { scale: 0.99 } : undefined}
                    >
                      {submitting ? "Saving…" : "Confirm new time"}
                    </motion.button>
                  )}
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
