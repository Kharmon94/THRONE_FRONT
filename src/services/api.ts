import type {
  User,
  AuthResponse,
  Project,
  Appointment,
  AppointmentSettings,
  AppointmentDateOverride,
  AppointmentStatus,
} from "../types";

const TOKEN_KEY = "throne_token";
// Same-origin when served with API (empty); or VITE_API_URL for separate deployments; localhost in dev
const BASE_URL =
  (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()) ||
  (import.meta.env.DEV ? "http://localhost:3000" : "");

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    ...options,
    headers,
  });
  const text = await res.text();
  const data = (text ? JSON.parse(text) : {}) as T;
  if (!res.ok) {
    const err = data as { error?: string; errors?: string[] };
    throw new Error(err?.error || err?.errors?.[0] || "Request failed");
  }
  return data as T;
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function rangeQuery(from?: string, to?: string): string {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const q = params.toString();
  return q ? `?${q}` : "";
}

export const api = {
  getToken,
  setToken,
  clearToken,

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const data = await request<AuthResponse>("/auth/sign_in", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data.token) setToken(data.token);
    return data;
  },

  async signUp(email: string, password: string, password_confirmation: string): Promise<AuthResponse> {
    const data = await request<AuthResponse>("/auth/sign_up", {
      method: "POST",
      body: JSON.stringify({
        user: { email, password, password_confirmation },
      }),
    });
    if (data.token) setToken(data.token);
    return data;
  },

  async getCurrentUser(): Promise<User | null> {
    if (!getToken()) return null;
    try {
      const data = await request<{ user: User }>("/auth/me");
      return data.user;
    } catch {
      clearToken();
      return null;
    }
  },

  async getProjects(): Promise<Project[]> {
    const data = await request<{ projects: Project[] }>("/projects");
    return data.projects;
  },

  async getAdminProjects(): Promise<Project[]> {
    const data = await request<{ projects: Project[] }>("/admin/projects");
    return data.projects;
  },

  async getProject(id: string | number): Promise<Project> {
    const data = await request<{ project: Project }>(`/projects/${id}`);
    return data.project;
  },

  async createProject(body: FormData | Record<string, unknown>): Promise<Project> {
    const isForm = body instanceof FormData;
    const headers: Record<string, string> = {};
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (!isForm) headers["Content-Type"] = "application/json";
    const res = await fetch(`${BASE_URL}/api/v1/admin/projects`, {
      method: "POST",
      headers,
      body: isForm ? body : JSON.stringify({ project: body }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.errors?.[0] || "Request failed");
    return data.project;
  },

  async updateProject(id: string | number, body: FormData | Record<string, unknown>): Promise<Project> {
    const isForm = body instanceof FormData;
    const headers: Record<string, string> = {};
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (!isForm) headers["Content-Type"] = "application/json";
    const res = await fetch(`${BASE_URL}/api/v1/admin/projects/${id}`, {
      method: "PATCH",
      headers,
      body: isForm ? body : JSON.stringify({ project: body }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.errors?.[0] || "Request failed");
    return data.project;
  },

  async deleteProject(id: string | number): Promise<void> {
    await request(`/admin/projects/${id}`, { method: "DELETE" });
  },

  async reorderProjects(ids: Array<string | number>): Promise<Project[]> {
    const data = await request<{ projects: Project[] }>("/admin/projects/reorder", {
      method: "PATCH",
      body: JSON.stringify({ ids }),
    });
    return data.projects;
  },

  async getAppointmentSlots(from: string, to: string): Promise<{ slots: string[]; timezone: string }> {
    return request(`/appointments/slots${rangeQuery(from, to)}`);
  },

  async createAppointment(data: {
    name: string;
    email: string;
    company?: string;
    notes?: string;
    starts_at: string;
  }): Promise<Appointment> {
    const parsed = await request<{ appointment: Appointment }>("/appointments", {
      method: "POST",
      body: JSON.stringify({ appointment: data }),
    });
    return parsed.appointment;
  },

  async getRescheduleAppointment(token: string): Promise<{
    appointment: Pick<
      Appointment,
      "id" | "name" | "email" | "company" | "notes" | "starts_at" | "duration_minutes" | "status"
    >;
    timezone: string;
  }> {
    return request(`/appointments/reschedule/${encodeURIComponent(token)}`);
  },

  async updateRescheduleAppointment(token: string, starts_at: string): Promise<Appointment> {
    const parsed = await request<{ appointment: Appointment }>(
      `/appointments/reschedule/${encodeURIComponent(token)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ appointment: { starts_at } }),
      }
    );
    return parsed.appointment;
  },

  async getAdminAppointments(from?: string, to?: string): Promise<Appointment[]> {
    const data = await request<{ appointments: Appointment[] }>(
      `/admin/appointments${rangeQuery(from, to)}`
    );
    return data.appointments;
  },

  async updateAppointmentStatus(id: number, status: AppointmentStatus): Promise<Appointment> {
    const data = await request<{ appointment: Appointment }>(`/admin/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ appointment: { status } }),
    });
    return data.appointment;
  },

  async emailAppointmentReschedule(id: number): Promise<Appointment> {
    const data = await request<{ appointment: Appointment; message?: string }>(
      `/admin/appointments/${id}/reschedule`,
      { method: "POST" }
    );
    return data.appointment;
  },

  async deleteAppointment(id: number): Promise<void> {
    await request(`/admin/appointments/${id}`, { method: "DELETE" });
  },

  async getAppointmentSettings(): Promise<AppointmentSettings> {
    const data = await request<{ appointment_settings: AppointmentSettings }>(
      "/admin/appointment_settings"
    );
    return data.appointment_settings;
  },

  async updateAppointmentSettings(
    settings: Partial<AppointmentSettings>
  ): Promise<AppointmentSettings> {
    const data = await request<{ appointment_settings: AppointmentSettings }>(
      "/admin/appointment_settings",
      {
        method: "PATCH",
        body: JSON.stringify({ appointment_settings: settings }),
      }
    );
    return data.appointment_settings;
  },

  async getAppointmentDateOverrides(
    from?: string,
    to?: string
  ): Promise<AppointmentDateOverride[]> {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    const data = await request<{ appointment_date_overrides: AppointmentDateOverride[] }>(
      `/admin/appointment_date_overrides${qs ? `?${qs}` : ""}`
    );
    return data.appointment_date_overrides;
  },

  async createAppointmentDateOverride(
    override: Omit<AppointmentDateOverride, "id">
  ): Promise<AppointmentDateOverride> {
    const data = await request<{ appointment_date_override: AppointmentDateOverride }>(
      "/admin/appointment_date_overrides",
      {
        method: "POST",
        body: JSON.stringify({ appointment_date_override: override }),
      }
    );
    return data.appointment_date_override;
  },

  async updateAppointmentDateOverride(
    id: number,
    patch: Partial<Omit<AppointmentDateOverride, "id">>
  ): Promise<AppointmentDateOverride> {
    const data = await request<{ appointment_date_override: AppointmentDateOverride }>(
      `/admin/appointment_date_overrides/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ appointment_date_override: patch }),
      }
    );
    return data.appointment_date_override;
  },

  async deleteAppointmentDateOverride(id: number): Promise<void> {
    await request(`/admin/appointment_date_overrides/${id}`, { method: "DELETE" });
  },
};
