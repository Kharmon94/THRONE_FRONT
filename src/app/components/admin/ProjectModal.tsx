import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Trash2, Upload, Link } from "lucide-react";
import { Project } from "../../context/ProjectsContext";

type ImageInputMode = "url" | "upload";

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Project, "id"> & { image?: string | null; imageFile?: File | null }) => void | Promise<void>;
  initial?: Project | null;
}

const CATEGORIES = ["Web App", "Mobile", "SaaS", "E-Commerce", "Website", "Branding"];
const COLORS     = [
  { label: "Gold",   value: "#D4AF37" },
  { label: "Silver", value: "#C0C0C0" },
  { label: "White",  value: "#FFFFFF" },
];

const empty: Omit<Project, "id"> & { image?: string | null } = {
  title: "", description: "", image: "", tags: [], category: "Web App",
  featured: false, live: "", github: "", status: "draft", color: "#D4AF37",
  client: "", year: new Date().getFullYear().toString(),
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "rgba(255,255,255,0.35)",
  fontSize: "0.68rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontFamily: "'Space Grotesk', sans-serif",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(212,175,55,0.12)",
  borderRadius: "10px",
  color: "white",
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "0.85rem",
  padding: "10px 13px",
  outline: "none",
  transition: "all 0.15s",
};

export function ProjectModal({ open, onClose, onSave, initial }: ProjectModalProps) {
  const [form, setForm] = useState<Omit<Project, "id">>(empty);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageMode, setImageMode] = useState<ImageInputMode>("url");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...initial } : { ...empty });
      setTagInput("");
      setImageFile(null);
      setImageMode("url");
    }
  }, [open, initial]);

  const set = (field: keyof Omit<Project, "id">, value: unknown) =>
    setForm((s) => ({ ...s, [field]: value }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      set("tags", [...form.tags, t]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => set("tags", form.tags.filter((t) => t !== tag));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageMode === "upload" && !imageFile) return;
    if (imageMode === "url" && !form.image?.trim()) return;
    setSaving(true);
    try {
      const data = imageMode === "upload" && imageFile
        ? { ...form, image: null, imageFile }
        : { ...form, image: form.image?.trim() || null, imageFile: null };
      await onSave(data);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const focusBorder = (el: HTMLElement) => {
    el.style.borderColor = "rgba(212,175,55,0.45)";
    el.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.08)";
  };
  const blurBorder = (el: HTMLElement) => {
    el.style.borderColor = "rgba(212,175,55,0.12)";
    el.style.boxShadow = "none";
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{
              background: "#0d0b08",
              border: "1px solid rgba(212,175,55,0.2)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 60px rgba(212,175,55,0.06)",
            }}
          >
            {/* Shimmer top */}
            <div
              className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
              style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)" }}
            />

            {/* Header */}
            <div
              className="sticky top-0 px-6 py-5 flex items-center justify-between z-10"
              style={{
                background: "#0d0b08",
                borderBottom: "1px solid rgba(212,175,55,0.1)",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    background: "linear-gradient(135deg, #fff, #D4AF37)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {initial ? "Edit Project" : "Add New Project"}
                </h2>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", fontFamily: "'Space Grotesk', sans-serif", marginTop: "2px" }}>
                  {initial ? `Editing: ${initial.title}` : "Fill in the project details below"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-150"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.12)"; (e.currentTarget as HTMLButtonElement).style.color = "#f87171"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)"; }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {/* Title + Client */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Project Title *</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="AurisFi Fintech Platform"
                    style={inputStyle}
                    onFocus={(e) => focusBorder(e.target as HTMLElement)}
                    onBlur={(e) => blurBorder(e.target as HTMLElement)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Client Name *</label>
                  <input
                    required
                    value={form.client}
                    onChange={(e) => set("client", e.target.value)}
                    placeholder="AurisFi Inc."
                    style={inputStyle}
                    onFocus={(e) => focusBorder(e.target as HTMLElement)}
                    onBlur={(e) => blurBorder(e.target as HTMLElement)}
                  />
                </div>
              </div>

              {/* Category + Year */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) => focusBorder(e.target as HTMLElement)}
                    onBlur={(e) => blurBorder(e.target as HTMLElement)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} style={{ background: "#0d0b08", color: "white" }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Year</label>
                  <input
                    value={form.year}
                    onChange={(e) => set("year", e.target.value)}
                    placeholder="2024"
                    style={inputStyle}
                    onFocus={(e) => focusBorder(e.target as HTMLElement)}
                    onBlur={(e) => blurBorder(e.target as HTMLElement)}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Brief description of the project and what was built..."
                  style={{ ...inputStyle, resize: "none" }}
                  onFocus={(e) => focusBorder(e.target as HTMLElement)}
                  onBlur={(e) => blurBorder(e.target as HTMLElement)}
                />
              </div>

              {/* Cover Image — URL or Upload */}
              <div>
                <label style={labelStyle}>Cover Image *</label>
                <div className="flex gap-2 mb-2">
                  {(["url", "upload"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => { setImageMode(mode); if (mode === "upload") set("image", ""); else setImageFile(null); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-150"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: imageMode === mode ? 600 : 400,
                        background: imageMode === mode ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.04)",
                        border: imageMode === mode ? "1px solid rgba(212,175,55,0.3)" : "1px solid rgba(255,255,255,0.08)",
                        color: imageMode === mode ? "#D4AF37" : "rgba(255,255,255,0.5)",
                        cursor: "pointer",
                      }}
                    >
                      {mode === "url" ? <Link size={14} /> : <Upload size={14} />}
                      {mode === "url" ? "Use URL" : "Upload file"}
                    </button>
                  ))}
                </div>
                {imageMode === "url" ? (
                  <>
                    <input
                      value={form.image}
                      onChange={(e) => set("image", e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      style={inputStyle}
                      onFocus={(e) => focusBorder(e.target as HTMLElement)}
                      onBlur={(e) => blurBorder(e.target as HTMLElement)}
                    />
                    {form.image && (
                      <div className="mt-2 rounded-xl overflow-hidden h-28">
                        <img src={form.image} alt="preview" className="w-full h-full object-cover opacity-60" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        setImageFile(f || null);
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 rounded-xl border-2 border-dashed transition-all duration-150 flex flex-col items-center justify-center gap-2"
                      style={{
                        borderColor: imageFile ? "rgba(212,175,55,0.4)" : "rgba(212,175,55,0.2)",
                        background: imageFile ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.02)",
                        color: "rgba(255,255,255,0.6)",
                        fontFamily: "'Space Grotesk', sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      <Upload size={24} style={{ color: "#D4AF37" }} />
                      {imageFile ? imageFile.name : "Click to select an image"}
                    </button>
                    {imageFile && (
                      <div className="mt-2 rounded-xl overflow-hidden h-28">
                        <img src={URL.createObjectURL(imageFile)} alt="preview" className="w-full h-full object-cover opacity-60" />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Tags */}
              <div>
                <label style={labelStyle}>Tech Tags</label>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="e.g. React"
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={(e) => focusBorder(e.target as HTMLElement)}
                    onBlur={(e) => blurBorder(e.target as HTMLElement)}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 rounded-xl flex items-center gap-1.5 text-sm transition-all duration-150"
                    style={{
                      background: "rgba(212,175,55,0.12)",
                      border: "1px solid rgba(212,175,55,0.25)",
                      color: "#D4AF37",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 500,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {form.tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                        style={{
                          background: "rgba(212,175,55,0.1)",
                          border: "1px solid rgba(212,175,55,0.2)",
                          color: "#D4AF37",
                          fontSize: "0.78rem",
                          fontFamily: "'Fira Code', monospace",
                        }}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          style={{ color: "rgba(212,175,55,0.5)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* URLs */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Live URL</label>
                  <input
                    value={form.live}
                    onChange={(e) => set("live", e.target.value)}
                    placeholder="https://project.com"
                    style={inputStyle}
                    onFocus={(e) => focusBorder(e.target as HTMLElement)}
                    onBlur={(e) => blurBorder(e.target as HTMLElement)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>GitHub URL</label>
                  <input
                    value={form.github}
                    onChange={(e) => set("github", e.target.value)}
                    placeholder="https://github.com/..."
                    style={inputStyle}
                    onFocus={(e) => focusBorder(e.target as HTMLElement)}
                    onBlur={(e) => blurBorder(e.target as HTMLElement)}
                  />
                </div>
              </div>

              {/* Color + Status + Featured */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label style={labelStyle}>Accent Color</label>
                  <div className="flex gap-2">
                    {COLORS.map(({ label, value }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => set("color", value)}
                        title={label}
                        className="w-8 h-8 rounded-lg transition-all duration-150"
                        style={{
                          background: value,
                          border: form.color === value ? "2px solid white" : "2px solid transparent",
                          boxShadow: form.color === value ? `0 0 12px ${value}80` : "none",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Status</label>
                  <div className="flex gap-2 mt-1">
                    {(["published", "draft"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => set("status", s)}
                        className="flex-1 py-2 rounded-lg text-xs transition-all duration-150"
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: form.status === s ? 600 : 400,
                          background:
                            form.status === s
                              ? s === "published"
                                ? "rgba(16,185,129,0.2)"
                                : "rgba(156,163,175,0.15)"
                              : "rgba(255,255,255,0.04)",
                          border:
                            form.status === s
                              ? s === "published"
                                ? "1px solid rgba(16,185,129,0.4)"
                                : "1px solid rgba(156,163,175,0.3)"
                              : "1px solid rgba(255,255,255,0.07)",
                          color:
                            form.status === s
                              ? s === "published"
                                ? "#10b981"
                                : "#9ca3af"
                              : "rgba(255,255,255,0.35)",
                          cursor: "pointer",
                          textTransform: "capitalize",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Featured</label>
                  <button
                    type="button"
                    onClick={() => set("featured", !form.featured)}
                    className="w-full py-2 mt-1 rounded-lg text-xs transition-all duration-150"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: form.featured ? 600 : 400,
                      background: form.featured ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.04)",
                      border: form.featured ? "1px solid rgba(212,175,55,0.35)" : "1px solid rgba(255,255,255,0.07)",
                      color: form.featured ? "#D4AF37" : "rgba(255,255,255,0.35)",
                      cursor: "pointer",
                    }}
                  >
                    {form.featured ? "★ Featured" : "☆ Not Featured"}
                  </button>
                </div>
              </div>

              {/* Footer actions */}
              <div
                className="flex gap-3 pt-2"
                style={{ borderTop: "1px solid rgba(212,175,55,0.1)", paddingTop: "16px" }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl text-sm transition-all duration-150"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #F0D060, #D4AF37)",
                    color: "#0a0800",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    cursor: saving ? "wait" : "pointer",
                    boxShadow: "0 0 20px rgba(212,175,55,0.3)",
                    letterSpacing: "0.02em",
                    border: "none",
                  }}
                  whileHover={!saving ? { scale: 1.01 } : {}}
                  whileTap={!saving ? { scale: 0.99 } : {}}
                >
                  {saving ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <>{initial ? "Save Changes" : "Add Project"}</>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
