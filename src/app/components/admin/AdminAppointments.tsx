import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CalendarDays,
  Clock,
  Check,
  X,
  Ban,
  Mail,
  Trash2,
  Save,
  Plus,
} from "lucide-react";
import { api } from "../../../services/api";
import { MonthCalendar } from "../MonthCalendar";
import { useReduceAnimations } from "../../../hooks/useReduceAnimations";
import type {
  Appointment,
  AppointmentDateOverride,
  AppointmentSettings,
  AppointmentStatus,
  WeekdayKey,
  WeeklyHours,
} from "../../../types";
import {
  dateKeyInZone,
  formatAppointmentWhen,
  localDateKey,
  monthUtcRange,
  startOfMonth,
} from "../../../utils/datetime";

type Tab = "calendar" | "hours";

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: "#F0D060",
  confirmed: "#10b981",
  declined: "#f87171",
  cancelled: "#9ca3af",
};

const WEEKDAY_LABELS: { key: WeekdayKey; label: string }[] = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(212,175,55,0.12)",
  borderRadius: "10px",
  color: "white",
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "0.85rem",
  padding: "9px 12px",
  outline: "none",
};

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const color = STATUS_COLORS[status];
  return (
    <span
      className="px-2 py-0.5 rounded text-xs capitalize"
      style={{
        background: `${color}18`,
        border: `1px solid ${color}40`,
        color,
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 500,
      }}
    >
      {status}
    </span>
  );
}

export function AdminAppointments() {
  const reduce = useReduceAnimations();
  const [tab, setTab] = useState<Tab>("calendar");

  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(() => new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timezone, setTimezone] = useState("America/New_York");
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const [settingsDraft, setSettingsDraft] = useState<AppointmentSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  const [overrides, setOverrides] = useState<AppointmentDateOverride[]>([]);
  const [overridesLoading, setOverridesLoading] = useState(false);
  const [overridesError, setOverridesError] = useState("");
  const [overrideBusyId, setOverrideBusyId] = useState<number | "new" | null>(null);
  const [newOverride, setNewOverride] = useState({
    date: "",
    enabled: true,
    start: "10:00",
    end: "16:00",
  });

  const overrideRange = useMemo(() => {
    const from = new Date(month.getFullYear(), month.getMonth(), 1);
    const to = new Date(month.getFullYear(), month.getMonth() + 3, 0);
    return { from: localDateKey(from), to: localDateKey(to) };
  }, [month]);

  const loadAppointments = useCallback(async (m: Date) => {
    setLoading(true);
    setActionError("");
    try {
      const { from, to } = monthUtcRange(m);
      const [list, settingsData] = await Promise.all([
        api.getAdminAppointments(from, to),
        api.getAppointmentSettings().catch(() => null),
      ]);
      setAppointments(list);
      if (settingsData) {
        setTimezone(settingsData.timezone);
      }
    } catch (err) {
      setAppointments([]);
      setActionError(err instanceof Error ? err.message : "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments(month);
  }, [month, loadAppointments]);

  const loadSettings = useCallback(async () => {
    setSettingsLoading(true);
    setSettingsError("");
    try {
      const data = await api.getAppointmentSettings();
      setSettingsDraft(structuredClone(data));
      setTimezone(data.timezone);
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : "Failed to load settings.");
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  const loadOverrides = useCallback(async () => {
    setOverridesLoading(true);
    setOverridesError("");
    try {
      const list = await api.getAppointmentDateOverrides(overrideRange.from, overrideRange.to);
      setOverrides(list);
    } catch (err) {
      setOverrides([]);
      setOverridesError(err instanceof Error ? err.message : "Failed to load date overrides.");
    } finally {
      setOverridesLoading(false);
    }
  }, [overrideRange.from, overrideRange.to]);

  useEffect(() => {
    if (tab === "hours") {
      loadSettings();
      loadOverrides();
    }
  }, [tab, loadSettings, loadOverrides]);

  const byDay = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const a of appointments) {
      const key = dateKeyInZone(a.starts_at, timezone);
      const list = map.get(key) ?? [];
      list.push(a);
      map.set(key, list);
    }
    return map;
  }, [appointments, timezone]);

  const selectedKey = selectedDay
    ? dateKeyInZone(
        new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate(), 12),
        timezone
      )
    : null;

  const dayAppointments = useMemo(() => {
    if (!selectedDay || !selectedKey) return [];
    return (
      byDay.get(selectedKey) ??
      byDay.get(localDateKey(selectedDay)) ??
      []
    ).slice().sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  }, [byDay, selectedDay, selectedKey]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const patchStatus = async (id: number, status: AppointmentStatus) => {
    setBusyId(id);
    setActionError("");
    try {
      const updated = await api.updateAppointmentStatus(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast(`Marked ${status}`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  };

  const emailReschedule = async (id: number) => {
    setBusyId(id);
    setActionError("");
    try {
      const updated = await api.emailAppointmentReschedule(id);
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast("Reschedule email sent");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not send email.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: number) => {
    setBusyId(id);
    try {
      await api.deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      setConfirmDelete(null);
      showToast("Appointment deleted");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  const saveSettings = async () => {
    if (!settingsDraft) return;
    setSettingsSaving(true);
    setSettingsError("");
    try {
      const saved = await api.updateAppointmentSettings({
        timezone: settingsDraft.timezone,
        slot_duration_minutes: Number(settingsDraft.slot_duration_minutes),
        lead_time_hours: Number(settingsDraft.lead_time_hours),
        bookable_days_ahead: Number(settingsDraft.bookable_days_ahead),
        weekly_hours: settingsDraft.weekly_hours,
      });
      setSettingsDraft(structuredClone(saved));
      setTimezone(saved.timezone);
      showToast("Hours saved");
      await loadAppointments(month);
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSettingsSaving(false);
    }
  };

  const updateDayHours = (key: WeekdayKey, patch: Partial<WeeklyHours[WeekdayKey]>) => {
    setSettingsDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        weekly_hours: {
          ...prev.weekly_hours,
          [key]: { ...prev.weekly_hours[key], ...patch },
        },
      };
    });
  };

  const patchOverrideLocal = (id: number, patch: Partial<AppointmentDateOverride>) => {
    setOverrides((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };

  const addOverride = async () => {
    if (!newOverride.date) {
      setOverridesError("Pick a date for the override.");
      return;
    }
    setOverrideBusyId("new");
    setOverridesError("");
    try {
      const created = await api.createAppointmentDateOverride({
        date: newOverride.date,
        enabled: newOverride.enabled,
        start: newOverride.start,
        end: newOverride.end,
      });
      setOverrides((prev) =>
        [...prev.filter((o) => o.id !== created.id), created].sort((a, b) =>
          a.date.localeCompare(b.date)
        )
      );
      setNewOverride({ date: "", enabled: true, start: "10:00", end: "16:00" });
      showToast("Override added");
    } catch (err) {
      setOverridesError(err instanceof Error ? err.message : "Could not add override.");
    } finally {
      setOverrideBusyId(null);
    }
  };

  const saveOverride = async (override: AppointmentDateOverride) => {
    setOverrideBusyId(override.id);
    setOverridesError("");
    try {
      const saved = await api.updateAppointmentDateOverride(override.id, {
        date: override.date,
        enabled: override.enabled,
        start: override.start,
        end: override.end,
      });
      setOverrides((prev) =>
        prev
          .map((o) => (o.id === saved.id ? saved : o))
          .sort((a, b) => a.date.localeCompare(b.date))
      );
      showToast("Override saved");
    } catch (err) {
      setOverridesError(err instanceof Error ? err.message : "Could not save override.");
      await loadOverrides();
    } finally {
      setOverrideBusyId(null);
    }
  };

  const removeOverride = async (id: number) => {
    setOverrideBusyId(id);
    setOverridesError("");
    try {
      await api.deleteAppointmentDateOverride(id);
      setOverrides((prev) => prev.filter((o) => o.id !== id));
      showToast("Override removed");
    } catch (err) {
      setOverridesError(err instanceof Error ? err.message : "Could not delete override.");
    } finally {
      setOverrideBusyId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0.25 : 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "1.6rem",
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #fff, #D4AF37)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Appointments
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", fontFamily: "'Space Grotesk', sans-serif", marginTop: "2px" }}>
            {appointments.length} this month · {timezone.replace(/_/g, " ")}
          </p>
        </div>

        <div
          className="flex rounded-xl p-1"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.12)" }}
        >
          {(
            [
              { key: "calendar" as const, label: "Calendar", icon: CalendarDays },
              { key: "hours" as const, label: "Hours", icon: Clock },
            ] as const
          ).map(({ key, label, icon: Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: active ? 600 : 400,
                  background: active ? "rgba(212,175,55,0.15)" : "transparent",
                  color: active ? "#D4AF37" : "rgba(255,255,255,0.4)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-4 py-2.5 rounded-xl text-sm"
            style={{
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.3)",
              color: "#10b981",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {tab === "calendar" ? (
        <div className="grid lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            {loading ? (
              <div className="flex justify-center py-24">
                <div className="animate-spin h-8 w-8 border-2 border-amber-600 border-t-transparent rounded-full" />
              </div>
            ) : (
              <MonthCalendar
                month={month}
                onMonthChange={(m) => {
                  setMonth(m);
                  setSelectedDay(null);
                }}
                selected={selectedDay}
                onSelect={setSelectedDay}
                getDayMeta={(date) => {
                  const noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
                  const key = dateKeyInZone(noon, timezone);
                  const list = byDay.get(key) ?? byDay.get(localDateKey(date)) ?? [];
                  const dots = [...new Set(list.map((a) => STATUS_COLORS[a.status]))];
                  return { dots };
                }}
              />
            )}
            {actionError && (
              <p className="mt-3 text-red-400 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {actionError}
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-4">
              {(Object.keys(STATUS_COLORS) as AppointmentStatus[]).map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[s] }} />
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", fontFamily: "'Space Grotesk', sans-serif", textTransform: "capitalize" }}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : 0.08 }}
            className="lg:col-span-2"
          >
            <div
              className="rounded-2xl overflow-hidden h-full"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.1)" }}
            >
              <div
                className="px-5 py-4"
                style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}
              >
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
                  {selectedDay
                    ? selectedDay.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
                    : "Select a day"}
                </div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {dayAppointments.length} appointment{dayAppointments.length === 1 ? "" : "s"}
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-[560px] overflow-y-auto">
                {!selectedDay ? (
                  <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.85rem", fontFamily: "'Space Grotesk', sans-serif", textAlign: "center", padding: "32px 0" }}>
                    Click a day on the calendar
                  </p>
                ) : dayAppointments.length === 0 ? (
                  <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.85rem", fontFamily: "'Space Grotesk', sans-serif", textAlign: "center", padding: "32px 0" }}>
                    No appointments this day
                  </p>
                ) : (
                  dayAppointments.map((a) => {
                    const busy = busyId === a.id;
                    return (
                      <div
                        key={a.id}
                        className="p-4 rounded-xl space-y-3"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: `1px solid ${STATUS_COLORS[a.status]}25`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-white" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.9rem" }}>
                              {a.name}
                            </div>
                            <a href={`mailto:${a.email}`} style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", textDecoration: "none" }}>
                              {a.email}
                            </a>
                            {a.company && (
                              <div style={{ color: "rgba(212,175,55,0.7)", fontSize: "0.72rem", marginTop: "2px" }}>{a.company}</div>
                            )}
                          </div>
                          <StatusBadge status={a.status} />
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                          {formatAppointmentWhen(a.starts_at, timezone)} · {a.duration_minutes}m
                        </div>
                        {a.notes && (
                          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", lineHeight: 1.45, whiteSpace: "pre-wrap" }}>
                            {a.notes}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1.5">
                          {a.status === "pending" && (
                            <>
                              <ActionBtn label="Confirm" icon={Check} color="#10b981" disabled={busy} onClick={() => patchStatus(a.id, "confirmed")} />
                              <ActionBtn label="Decline" icon={X} color="#f87171" disabled={busy} onClick={() => patchStatus(a.id, "declined")} />
                            </>
                          )}
                          {(a.status === "pending" || a.status === "confirmed") && (
                            <ActionBtn label="Cancel" icon={Ban} color="#9ca3af" disabled={busy} onClick={() => patchStatus(a.id, "cancelled")} />
                          )}
                          <ActionBtn label="Email reschedule" icon={Mail} color="#60a5fa" disabled={busy} onClick={() => emailReschedule(a.id)} />
                          <ActionBtn label="Delete" icon={Trash2} color="#f87171" disabled={busy} onClick={() => setConfirmDelete(a.id)} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {settingsLoading || !settingsDraft ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin h-8 w-8 border-2 border-amber-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              <div
                className="rounded-2xl p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.1)" }}
              >
                <Field label="Timezone">
                  <input
                    style={inputStyle}
                    value={settingsDraft.timezone}
                    onChange={(e) => setSettingsDraft({ ...settingsDraft, timezone: e.target.value })}
                    placeholder="America/New_York"
                  />
                </Field>
                <Field label="Slot duration (min)">
                  <input
                    type="number"
                    min={5}
                    style={inputStyle}
                    value={settingsDraft.slot_duration_minutes}
                    onChange={(e) =>
                      setSettingsDraft({ ...settingsDraft, slot_duration_minutes: Number(e.target.value) })
                    }
                  />
                </Field>
                <Field label="Lead time (hours)">
                  <input
                    type="number"
                    min={0}
                    style={inputStyle}
                    value={settingsDraft.lead_time_hours}
                    onChange={(e) =>
                      setSettingsDraft({ ...settingsDraft, lead_time_hours: Number(e.target.value) })
                    }
                  />
                </Field>
                <Field label="Bookable days ahead">
                  <input
                    type="number"
                    min={1}
                    style={inputStyle}
                    value={settingsDraft.bookable_days_ahead}
                    onChange={(e) =>
                      setSettingsDraft({ ...settingsDraft, bookable_days_ahead: Number(e.target.value) })
                    }
                  />
                </Field>
              </div>

              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.1)" }}
              >
                <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
                    Weekly hours
                  </span>
                </div>
                <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                  {WEEKDAY_LABELS.map(({ key, label }) => {
                    const day = settingsDraft.weekly_hours[key];
                    return (
                      <div
                        key={key}
                        className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
                        style={{ borderColor: "rgba(255,255,255,0.04)" }}
                      >
                        <label className="flex items-center gap-3 sm:w-40 flex-shrink-0 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={day.enabled}
                            onChange={(e) => updateDayHours(key, { enabled: e.target.checked })}
                            style={{ accentColor: "#D4AF37" }}
                          />
                          <span style={{ color: day.enabled ? "white" : "rgba(255,255,255,0.35)", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.88rem", fontWeight: 500 }}>
                            {label}
                          </span>
                        </label>
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            disabled={!day.enabled}
                            value={day.start}
                            onChange={(e) => updateDayHours(key, { start: e.target.value })}
                            style={{ ...inputStyle, width: "auto", opacity: day.enabled ? 1 : 0.4 }}
                          />
                          <span style={{ color: "rgba(255,255,255,0.3)" }}>–</span>
                          <input
                            type="time"
                            disabled={!day.enabled}
                            value={day.end}
                            onChange={(e) => updateDayHours(key, { end: e.target.value })}
                            style={{ ...inputStyle, width: "auto", opacity: day.enabled ? 1 : 0.4 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.1)" }}
              >
                <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
                    Date overrides
                  </span>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", fontFamily: "'Space Grotesk', sans-serif", marginTop: "4px" }}>
                    Close a day or set custom hours for a specific date. Overrides replace weekly hours for that day only.
                  </p>
                </div>

                <div className="px-6 py-4 flex flex-col lg:flex-row lg:items-end gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <Field label="Date">
                    <input
                      type="date"
                      style={inputStyle}
                      value={newOverride.date}
                      onChange={(e) => setNewOverride({ ...newOverride, date: e.target.value })}
                    />
                  </Field>
                  <label className="flex items-center gap-2 cursor-pointer pb-2 lg:pb-2.5">
                    <input
                      type="checkbox"
                      checked={newOverride.enabled}
                      onChange={(e) => setNewOverride({ ...newOverride, enabled: e.target.checked })}
                      style={{ accentColor: "#D4AF37" }}
                    />
                    <span style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.82rem" }}>
                      Open
                    </span>
                  </label>
                  <Field label="Start">
                    <input
                      type="time"
                      disabled={!newOverride.enabled}
                      style={{ ...inputStyle, opacity: newOverride.enabled ? 1 : 0.4 }}
                      value={newOverride.start}
                      onChange={(e) => setNewOverride({ ...newOverride, start: e.target.value })}
                    />
                  </Field>
                  <Field label="End">
                    <input
                      type="time"
                      disabled={!newOverride.enabled}
                      style={{ ...inputStyle, opacity: newOverride.enabled ? 1 : 0.4 }}
                      value={newOverride.end}
                      onChange={(e) => setNewOverride({ ...newOverride, end: e.target.value })}
                    />
                  </Field>
                  <button
                    type="button"
                    disabled={overrideBusyId === "new"}
                    onClick={addOverride}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{
                      background: "rgba(212,175,55,0.12)",
                      border: "1px solid rgba(212,175,55,0.28)",
                      color: "#F0D060",
                      fontFamily: "'Space Grotesk', sans-serif",
                      cursor: overrideBusyId === "new" ? "wait" : "pointer",
                      opacity: overrideBusyId === "new" ? 0.6 : 1,
                    }}
                  >
                    <Plus size={14} />
                    Add
                  </button>
                </div>

                {overridesLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin h-6 w-6 border-2 border-amber-600 border-t-transparent rounded-full" />
                  </div>
                ) : overrides.length === 0 ? (
                  <p
                    className="px-6 py-8 text-center"
                    style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem" }}
                  >
                    No overrides in {overrideRange.from} – {overrideRange.to}
                  </p>
                ) : (
                  <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                    {overrides.map((override) => {
                      const busy = overrideBusyId === override.id;
                      return (
                        <div
                          key={override.id}
                          className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
                          style={{ borderColor: "rgba(255,255,255,0.04)" }}
                        >
                          <input
                            type="date"
                            value={override.date}
                            onChange={(e) => patchOverrideLocal(override.id, { date: e.target.value })}
                            style={{ ...inputStyle, width: "auto", minWidth: "9.5rem" }}
                          />
                          <label className="flex items-center gap-2 cursor-pointer sm:w-24 flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={override.enabled}
                              onChange={(e) => patchOverrideLocal(override.id, { enabled: e.target.checked })}
                              style={{ accentColor: "#D4AF37" }}
                            />
                            <span style={{ color: override.enabled ? "white" : "rgba(255,255,255,0.35)", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.82rem" }}>
                              {override.enabled ? "Open" : "Closed"}
                            </span>
                          </label>
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="time"
                              disabled={!override.enabled}
                              value={override.start}
                              onChange={(e) => patchOverrideLocal(override.id, { start: e.target.value })}
                              style={{ ...inputStyle, width: "auto", opacity: override.enabled ? 1 : 0.4 }}
                            />
                            <span style={{ color: "rgba(255,255,255,0.3)" }}>–</span>
                            <input
                              type="time"
                              disabled={!override.enabled}
                              value={override.end}
                              onChange={(e) => patchOverrideLocal(override.id, { end: e.target.value })}
                              style={{ ...inputStyle, width: "auto", opacity: override.enabled ? 1 : 0.4 }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <ActionBtn
                              label="Save"
                              icon={Save}
                              color="#D4AF37"
                              disabled={busy}
                              onClick={() => saveOverride(override)}
                            />
                            <ActionBtn
                              label="Delete"
                              icon={Trash2}
                              color="#f87171"
                              disabled={busy}
                              onClick={() => removeOverride(override.id)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {(settingsError || overridesError) && (
                <p className="text-red-400 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {settingsError || overridesError}
                </p>
              )}

              <button
                type="button"
                disabled={settingsSaving}
                onClick={saveSettings}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "linear-gradient(135deg, #F0D060, #D4AF37)",
                  color: "#0a0800",
                  fontFamily: "'Space Grotesk', sans-serif",
                  border: "none",
                  cursor: settingsSaving ? "wait" : "pointer",
                  boxShadow: "0 0 24px rgba(212,175,55,0.25)",
                }}
              >
                <Save size={15} />
                {settingsSaving ? "Saving…" : "Save hours"}
              </button>
            </>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {confirmDelete !== null && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
              onClick={() => setConfirmDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: reduce ? 0.12 : 0.18 }}
              className="relative rounded-2xl p-7 w-full max-w-sm text-center"
              style={{
                background: "#0d0b08",
                border: "1px solid rgba(239,68,68,0.3)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
              >
                <Trash2 size={22} style={{ color: "#f87171" }} />
              </div>
              <h3 className="text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem" }}>
                Delete appointment?
              </h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "20px" }}>
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontFamily: "'Space Grotesk', sans-serif", cursor: "pointer" }}
                >
                  Keep
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171", fontFamily: "'Space Grotesk', sans-serif", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          color: "rgba(255,255,255,0.35)",
          fontSize: "0.68rem",
          fontFamily: "'Space Grotesk', sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "8px",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function ActionBtn({
  label,
  icon: Icon,
  color,
  disabled,
  onClick,
}: {
  label: string;
  icon: typeof Check;
  color: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={label}
      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-opacity"
      style={{
        background: `${color}14`,
        border: `1px solid ${color}35`,
        color,
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 500,
        cursor: disabled ? "wait" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Icon size={12} />
      {label}
    </button>
  );
}
