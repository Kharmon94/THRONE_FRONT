import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Search, Pencil, Trash2, Eye, EyeOff, Star, StarOff,
  ExternalLink, LayoutGrid, List, GripVertical,
} from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useProjects, type Project } from "../../context/ProjectsContext";
import { ProjectModal } from "./ProjectModal";
import { useReduceAnimations } from "../../../hooks/useReduceAnimations";

const PROJECT_ITEM_TYPE = "PROJECT_ITEM";

type View = "grid" | "list";

export function AdminProjects() {
  const reduce = useReduceAnimations();
  const { projects, addProject, updateProject, deleteProject, reorderProjects } = useProjects();
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<Project | null>(null);
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilter]   = useState<"all" | "published" | "draft">("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [view, setView]             = useState<View>("grid");

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const canReorder = filterStatus === "all" && search.trim() === "";

  const handleReorder = (dragIndex: number, dropIndex: number) => {
    if (dragIndex === dropIndex) return;
    const next = [...filtered];
    const [removed] = next.splice(dragIndex, 1);
    next.splice(dropIndex, 0, removed);
    reorderProjects(next);
  };

  const openAdd  = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p: Project) => { setEditing(p); setModalOpen(true); };

  const handleSave = async (data: Omit<Project, "id"> & { image?: string | null; imageFile?: File | null }) => {
    if (editing) {
      await updateProject(editing.id, data);
    } else {
      await addProject(data);
    }
  };

  const toggleStatus = (p: Project) =>
    updateProject(p.id, { status: p.status === "published" ? "draft" : "published" });

  const toggleFeatured = (p: Project) =>
    updateProject(p.id, { featured: !p.featured });

  const handleDelete = async (id: string | number) => {
    await deleteProject(id);
    setConfirmDelete(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
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
            Projects
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", fontFamily: "'Space Grotesk', sans-serif", marginTop: "2px" }}>
            {projects.length} total · {projects.filter((p) => p.status === "published").length} published
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-black text-sm transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #F0D060, #D4AF37)",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            boxShadow: "0 0 20px rgba(212,175,55,0.35)",
            cursor: "pointer",
            border: "none",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 35px rgba(212,175,55,0.55)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(212,175,55,0.35)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          <Plus size={16} /> Add Project
        </button>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0.25 : 0.4, delay: reduce ? 0.02 : 0.05 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "rgba(212,175,55,0.4)" }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, client, category..."
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(212,175,55,0.12)",
              borderRadius: "12px",
              color: "white",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.85rem",
              padding: "10px 14px 10px 40px",
              outline: "none",
              transition: "all 0.15s",
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = "rgba(212,175,55,0.4)";
              (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(212,175,55,0.07)";
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = "rgba(212,175,55,0.12)";
              (e.target as HTMLInputElement).style.boxShadow = "none";
            }}
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-1.5">
          {(["all", "published", "draft"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-4 py-2 rounded-xl text-sm transition-all duration-150 capitalize"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: filterStatus === s ? 600 : 400,
                background: filterStatus === s ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.03)",
                border: filterStatus === s ? "1px solid rgba(212,175,55,0.3)" : "1px solid rgba(255,255,255,0.07)",
                color: filterStatus === s ? "#D4AF37" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(212,175,55,0.12)" }}
        >
          {([["grid", LayoutGrid], ["list", List]] as [View, typeof LayoutGrid][]).map(([v, Icon]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="w-10 h-9 flex items-center justify-center transition-colors duration-150"
              style={{
                background: view === v ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.02)",
                color: view === v ? "#D4AF37" : "rgba(255,255,255,0.3)",
                cursor: "pointer",
                border: "none",
              }}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Projects grid/list */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
          style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {search || filterStatus !== "all" ? "No projects match your filters." : "No projects yet — add your first one!"}
        </motion.div>
      ) : view === "grid" ? (
        <DndProvider backend={HTML5Backend}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: reduce ? 0.2 : 0.3, delay: reduce ? Math.min(i * 0.02, 0.2) : i * 0.04 }}
                  layout
                >
                  {canReorder ? (
                    <DraggableProjectCard
                      project={p}
                      index={i}
                      onReorder={handleReorder}
                      onEdit={() => openEdit(p)}
                      onDelete={() => setConfirmDelete(p.id)}
                      onToggleStatus={() => toggleStatus(p)}
                      onToggleFeatured={() => toggleFeatured(p)}
                    />
                  ) : (
                    <ProjectCard
                      project={p}
                      onEdit={() => openEdit(p)}
                      onDelete={() => setConfirmDelete(p.id)}
                      onToggleStatus={() => toggleStatus(p)}
                      onToggleFeatured={() => toggleFeatured(p)}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </DndProvider>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.1)" }}
          >
            {/* Table header */}
            <div
              className="grid gap-4 px-5 py-3 text-xs uppercase tracking-wider"
              style={{
                gridTemplateColumns: canReorder ? "auto 1fr auto auto auto auto" : "1fr auto auto auto auto",
                color: "rgba(212,175,55,0.4)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                borderBottom: "1px solid rgba(212,175,55,0.08)",
              }}
            >
              {canReorder && <span className="w-8" />}
              <span>Project</span>
              <span className="hidden md:block">Category</span>
              <span className="hidden sm:block">Featured</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              <AnimatePresence>
                {filtered.map((p, i) =>
                  canReorder ? (
                    <DraggableProjectRow
                      key={p.id}
                      project={p}
                      index={i}
                      onReorder={handleReorder}
                      onEdit={() => openEdit(p)}
                      onDelete={() => setConfirmDelete(p.id)}
                      onToggleStatus={() => toggleStatus(p)}
                      onToggleFeatured={() => toggleFeatured(p)}
                    />
                  ) : (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: reduce ? 0.2 : 0.25, delay: reduce ? Math.min(i * 0.015, 0.2) : i * 0.03 }}
                      layout
                      className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3.5 items-center transition-colors duration-150"
                      style={{ borderColor: "rgba(255,255,255,0.04)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,175,55,0.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0" style={{ border: `1px solid ${p.color}25` }}>
                          <img src={p.image ?? "https://placehold.co/100/1a1a1a/666?text=+"} alt={p.title} className="w-full h-full object-cover opacity-60" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-white truncate" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.85rem" }}>{p.title}</div>
                          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", fontFamily: "'Space Grotesk', sans-serif" }}>{p.client}</div>
                        </div>
                      </div>
                      <span className="hidden md:block px-2.5 py-1 rounded-lg text-xs" style={{ background: `${p.color}15`, color: p.color, fontFamily: "'Fira Code', monospace", whiteSpace: "nowrap" }}>
                        {p.category}
                      </span>
                      <button
                        className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg transition-colors duration-150"
                        onClick={() => toggleFeatured(p)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: p.featured ? "#D4AF37" : "rgba(255,255,255,0.2)" }}
                      >
                        {p.featured ? <Star size={14} fill="#D4AF37" /> : <StarOff size={14} />}
                      </button>
                      <button
                        onClick={() => toggleStatus(p)}
                        className="px-2.5 py-1 rounded-full text-xs transition-all duration-150 flex items-center gap-1.5"
                        style={{
                          background: p.status === "published" ? "rgba(16,185,129,0.12)" : "rgba(156,163,175,0.1)",
                          border: p.status === "published" ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(156,163,175,0.18)",
                          color: p.status === "published" ? "#10b981" : "#9ca3af",
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 500,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.status === "published" ? <Eye size={10} /> : <EyeOff size={10} />}
                        {p.status}
                      </button>
                      <div className="flex gap-1.5">
                        <ActionBtn icon={Pencil} color="#D4AF37" title="Edit" onClick={() => openEdit(p)} />
                        <ActionBtn icon={Trash2} color="#f87171" title="Delete" onClick={() => setConfirmDelete(p.id)} />
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>
          </div>
        </DndProvider>
      )}

      {/* Project modal */}
      <ProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editing}
      />

      {/* Delete confirm dialog */}
      <AnimatePresence>
        {confirmDelete && (
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
              transition={{ duration: 0.18 }}
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
                Delete Project?
              </h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "20px" }}>
                This action cannot be undone. The project will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm transition-all duration-150"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontFamily: "'Space Grotesk', sans-serif", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                  style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171", fontFamily: "'Space Grotesk', sans-serif", cursor: "pointer", fontWeight: 600 }}
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

/* ── Sub-components ── */

interface DraggableItem {
  id: string | number;
  index: number;
}

function DraggableProjectCard({
  project,
  index,
  onReorder,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
}: {
  project: Project;
  index: number;
  onReorder: (dragIndex: number, dropIndex: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onToggleFeatured: () => void;
}) {
  const [{ isDragging }, drag, preview] = useDrag<DraggableItem>({
    type: PROJECT_ITEM_TYPE,
    item: { id: project.id, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop<DraggableItem>({
    accept: PROJECT_ITEM_TYPE,
    drop: (item) => {
      if (item.index !== index) onReorder(item.index, index);
    },
  });

  return (
    <div
      ref={(node) => preview(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="relative"
    >
      <div
        ref={drag}
        className="absolute top-2.5 left-2.5 z-10 w-7 h-7 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          background: "rgba(212,175,55,0.15)",
          border: "1px solid rgba(212,175,55,0.35)",
          color: "#D4AF37",
        }}
        title="Drag to reorder"
      >
        <GripVertical size={14} />
      </div>
      <div style={{ paddingLeft: "36px" }}>
        <ProjectCard
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onToggleFeatured={onToggleFeatured}
        />
      </div>
    </div>
  );
}

function DraggableProjectRow({
  project: p,
  index,
  onReorder,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
}: {
  project: Project;
  index: number;
  onReorder: (dragIndex: number, dropIndex: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onToggleFeatured: () => void;
}) {
  const [{ isDragging }, drag, preview] = useDrag<DraggableItem>({
    type: PROJECT_ITEM_TYPE,
    item: { id: p.id, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop<DraggableItem>({
    accept: PROJECT_ITEM_TYPE,
    drop: (item) => {
      if (item.index !== index) onReorder(item.index, index);
    },
  });

  return (
    <motion.div
      ref={(node) => preview(drop(node))}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      layout
      className="grid gap-4 px-5 py-3.5 items-center transition-colors duration-150"
      style={{
        gridTemplateColumns: "auto 1fr auto auto auto auto",
        borderColor: "rgba(255,255,255,0.04)",
        opacity: isDragging ? 0.5 : 1,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,175,55,0.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div
        ref={drag}
        className="w-8 h-8 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing flex-shrink-0"
        style={{
          background: "rgba(212,175,55,0.12)",
          border: "1px solid rgba(212,175,55,0.25)",
          color: "#D4AF37",
        }}
        title="Drag to reorder"
      >
        <GripVertical size={14} />
      </div>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0" style={{ border: `1px solid ${p.color}25` }}>
          <img src={p.image ?? "https://placehold.co/100/1a1a1a/666?text=+"} alt={p.title} className="w-full h-full object-cover opacity-60" />
        </div>
        <div className="min-w-0">
          <div className="text-white truncate" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.85rem" }}>{p.title}</div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", fontFamily: "'Space Grotesk', sans-serif" }}>{p.client}</div>
        </div>
      </div>
      <span className="hidden md:block px-2.5 py-1 rounded-lg text-xs" style={{ background: `${p.color}15`, color: p.color, fontFamily: "'Fira Code', monospace", whiteSpace: "nowrap" }}>
        {p.category}
      </span>
      <button
        className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg transition-colors duration-150"
        onClick={onToggleFeatured}
        style={{ background: "transparent", border: "none", cursor: "pointer", color: p.featured ? "#D4AF37" : "rgba(255,255,255,0.2)" }}
      >
        {p.featured ? <Star size={14} fill="#D4AF37" /> : <StarOff size={14} />}
      </button>
      <button
        onClick={onToggleStatus}
        className="px-2.5 py-1 rounded-full text-xs transition-all duration-150 flex items-center gap-1.5"
        style={{
          background: p.status === "published" ? "rgba(16,185,129,0.12)" : "rgba(156,163,175,0.1)",
          border: p.status === "published" ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(156,163,175,0.18)",
          color: p.status === "published" ? "#10b981" : "#9ca3af",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 500,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {p.status === "published" ? <Eye size={10} /> : <EyeOff size={10} />}
        {p.status}
      </button>
      <div className="flex gap-1.5">
        <ActionBtn icon={Pencil} color="#D4AF37" title="Edit" onClick={onEdit} />
        <ActionBtn icon={Trash2} color="#f87171" title="Delete" onClick={onDelete} />
      </div>
    </motion.div>
  );
}

function ProjectCard({
  project: p,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onToggleFeatured: () => void;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden group transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${p.color}18`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${p.color}35`;
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px rgba(0,0,0,0.4), 0 0 20px ${p.color}10`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${p.color}18`;
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
      }}
    >
      {/* Thumb */}
      <div className="relative h-36 overflow-hidden">
        <img src={p.image ?? "https://placehold.co/400x300/1a1a1a/666?text=No+Image"} alt={p.title} className="w-full h-full object-cover opacity-50 transition-transform duration-400 group-hover:scale-105" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(6,5,4,0.98))" }} />

        {/* Quick actions overlay */}
        <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
            style={{ background: "rgba(10,8,6,0.85)", border: "1px solid rgba(212,175,55,0.25)", color: "#D4AF37", cursor: "pointer" }}
            title="Edit"
          >
            <Pencil size={12} />
          </button>
          {p.live && p.live !== "#" && (
            <a href={p.live} target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
              style={{ background: "rgba(10,8,6,0.85)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
            >
              <ExternalLink size={12} />
            </a>
          )}
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", cursor: "pointer" }}
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>

        {/* Status badge */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className="px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
            style={{
              background: p.status === "published" ? "rgba(16,185,129,0.15)" : "rgba(156,163,175,0.12)",
              border: p.status === "published" ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(156,163,175,0.2)",
              color: p.status === "published" ? "#10b981" : "#9ca3af",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500,
              backdropFilter: "blur(8px)",
            }}
          >
            {p.status === "published" ? <Eye size={9} /> : <EyeOff size={9} />}
            {p.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-white leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>
            {p.title}
          </h3>
          <button
            onClick={onToggleFeatured}
            className="ml-2 flex-shrink-0 transition-colors duration-150"
            style={{ background: "none", border: "none", cursor: "pointer", color: p.featured ? "#D4AF37" : "rgba(255,255,255,0.2)", padding: 0 }}
            title={p.featured ? "Unfeature" : "Feature"}
          >
            {p.featured ? <Star size={14} fill="#D4AF37" /> : <StarOff size={14} />}
          </button>
        </div>

        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "10px" }}>
          {p.client} · {p.category} · {p.year}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {p.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded text-xs" style={{ background: `${p.color}12`, border: `1px solid ${p.color}22`, color: p.color, fontFamily: "'Fira Code', monospace" }}>
              {tag}
            </span>
          ))}
          {p.tags.length > 3 && (
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.72rem", fontFamily: "'Space Grotesk', sans-serif", alignSelf: "center" }}>
              +{p.tags.length - 3}
            </span>
          )}
        </div>

        {/* Actions row */}
        <div className="flex gap-2 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button
            onClick={onEdit}
            className="flex-1 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all duration-150"
            style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.18)", color: "#D4AF37", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,175,55,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(212,175,55,0.08)")}
          >
            <Pencil size={11} /> Edit
          </button>
          <button
            onClick={onToggleStatus}
            className="flex-1 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all duration-150"
            style={{
              background: p.status === "published" ? "rgba(156,163,175,0.08)" : "rgba(16,185,129,0.08)",
              border: p.status === "published" ? "1px solid rgba(156,163,175,0.18)" : "1px solid rgba(16,185,129,0.25)",
              color: p.status === "published" ? "#9ca3af" : "#10b981",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {p.status === "published" ? <><EyeOff size={11} /> Unpublish</> : <><Eye size={11} /> Publish</>}
          </button>
          <button
            onClick={onDelete}
            className="w-9 h-8 rounded-lg flex items-center justify-center transition-colors duration-150"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", color: "#f87171", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  color,
  title,
  onClick,
}: {
  icon: typeof Pencil;
  color: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150"
      style={{ background: `${color}10`, border: `1px solid ${color}20`, color, cursor: "pointer" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = `${color}22`)}
      onMouseLeave={(e) => (e.currentTarget.style.background = `${color}10`)}
    >
      <Icon size={13} />
    </button>
  );
}
