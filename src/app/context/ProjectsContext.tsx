import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { api } from "../../services/api";
import { useAuth } from "./AuthContext";
import type { Project } from "../../types";

interface ProjectsContextType {
  projects: Project[];
  loading: boolean;
  addProject: (p: Omit<Project, "id"> & { image?: string | null; imageFile?: File | null }) => void | Promise<void>;
  updateProject: (id: string | number, p: Partial<Project> & { imageFile?: File | null }) => void | Promise<void>;
  deleteProject: (id: string | number) => void | Promise<void>;
  reorderProjects: (projects: Project[]) => void | Promise<void>;
  refresh: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = user ? await api.getAdminProjects() : await api.getProjects();
      setProjects(data);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addProject = async (p: Omit<Project, "id"> & { image?: string | null; imageFile?: File | null }) => {
    if (p.imageFile) {
      const formData = new FormData();
      formData.append("project[title]", p.title);
      formData.append("project[description]", p.description);
      formData.append("project[category]", p.category || "");
      formData.append("project[featured]", String(p.featured ?? false));
      formData.append("project[live_url]", p.live || "");
      formData.append("project[github_url]", p.github || "");
      formData.append("project[status]", p.status || "draft");
      formData.append("project[color]", p.color || "");
      formData.append("project[client]", p.client || "");
      formData.append("project[year]", p.year || "");
      (p.tags || []).forEach((t) => formData.append("project[tags][]", t));
      formData.append("project[image]", p.imageFile);
      await api.createProject(formData);
    } else {
      const payload: Record<string, unknown> = {
        title: p.title,
        description: p.description,
        tags: p.tags || [],
        category: p.category || "",
        featured: p.featured ?? false,
        live_url: p.live || "",
        github_url: p.github || "",
        status: p.status || "draft",
        color: p.color || "",
        client: p.client || "",
        year: p.year || "",
      };
      if (p.image) payload.image_url = p.image;
      await api.createProject(payload);
    }
    await refresh();
  };

  const updateProject = async (id: string | number, updates: Partial<Project> & { imageFile?: File | null }) => {
    const { imageFile, image: imageUrl, ...rest } = updates;
    if (imageFile) {
      const formData = new FormData();
      Object.entries(rest).forEach(([k, v]) => {
        if (v === undefined) return;
        const key = `project[${k === "live" ? "live_url" : k === "github" ? "github_url" : k}]`;
        if (Array.isArray(v)) v.forEach((item) => formData.append(`${key}[]`, item));
        else formData.append(key, String(v));
      });
      formData.append("project[image]", imageFile);
      await api.updateProject(id, formData);
    } else {
      const payload: Record<string, unknown> = {};
      if (rest.title !== undefined) payload.title = rest.title;
      if (rest.description !== undefined) payload.description = rest.description;
      if (rest.tags !== undefined) payload.tags = rest.tags;
      if (rest.category !== undefined) payload.category = rest.category;
      if (rest.featured !== undefined) payload.featured = rest.featured;
      if (rest.live !== undefined) payload.live_url = rest.live;
      if (rest.github !== undefined) payload.github_url = rest.github;
      if (rest.status !== undefined) payload.status = rest.status;
      if (rest.color !== undefined) payload.color = rest.color;
      if (rest.client !== undefined) payload.client = rest.client;
      if (rest.year !== undefined) payload.year = rest.year;
      if (imageUrl !== undefined) payload.image_url = imageUrl;
      await api.updateProject(id, Object.keys(payload).length > 0 ? payload : {});
    }
    await refresh();
  };

  const deleteProject = async (id: string | number) => {
    await api.deleteProject(id);
    await refresh();
  };

  const reorderProjects = async (newOrder: Project[]) => {
    for (let i = 0; i < newOrder.length; i++) {
      await api.updateProject(newOrder[i].id, { position: i });
    }
    await refresh();
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        loading,
        addProject,
        updateProject,
        deleteProject,
        reorderProjects,
        refresh,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used inside ProjectsProvider");
  return ctx;
}

export type { Project };
