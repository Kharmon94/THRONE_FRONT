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

export interface ContactEntry {
  id: number;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  message: string;
  created_at: string;
}

export interface ApiError {
  error?: string;
  errors?: string[];
  message?: string;
}
