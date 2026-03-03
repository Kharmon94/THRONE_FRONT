import type { User, AuthResponse, Project, ContactEntry } from "../types";

const TOKEN_KEY = "throne_token";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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

  async createContactEntry(data: {
    name: string;
    email: string;
    company?: string;
    budget?: string;
    message: string;
  }): Promise<ContactEntry> {
    const parsed = await request<{ contact_entry: ContactEntry }>("/contact", {
      method: "POST",
      body: JSON.stringify({ contact_entry: data }),
    });
    return parsed.contact_entry;
  },

  async getContactEntries(): Promise<ContactEntry[]> {
    const data = await request<{ contact_entries: ContactEntry[] }>("/admin/contact_entries");
    return data.contact_entries;
  },

  async deleteContactEntry(id: number): Promise<void> {
    await request(`/admin/contact_entries/${id}`, { method: "DELETE" });
  },
};
