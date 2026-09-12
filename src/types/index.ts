export interface User {
  id: number;
  email: string;
  admin: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Project {
  id: number | string;
  title: string;
  description: string;
  image: string | null;
  tags: string[];
  category: string;
  featured: boolean;
  live: string;
  github: string;
  status: "published" | "draft";
  color: string;
  client: string;
  year: string;
  position?: number;
}

export type AppointmentStatus = "pending" | "confirmed" | "declined" | "cancelled";

export interface Appointment {
  id: number;
  name: string;
  email: string;
  company: string | null;
  notes: string | null;
  starts_at: string;
  duration_minutes: number;
  status: AppointmentStatus;
  reschedule_token_expires_at?: string | null;
  created_at: string;
  updated_at: string;
}

export type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface DayHours {
  enabled: boolean;
  start: string;
  end: string;
}

export type WeeklyHours = Record<WeekdayKey, DayHours>;

export interface AppointmentSettings {
  timezone: string;
  slot_duration_minutes: number;
  lead_time_hours: number;
  bookable_days_ahead: number;
  weekly_hours: WeeklyHours;
}

export interface ApiError {
  error?: string;
  errors?: string[];
  message?: string;
}
