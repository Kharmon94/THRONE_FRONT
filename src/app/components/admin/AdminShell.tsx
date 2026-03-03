import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  LogOut,
  ExternalLink,
  Menu,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ThroneIcon } from "../ThroneIcon";
import type { Page, AdminSubPage } from "../../App";

const navItems: { key: AdminSubPage; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "contact-entries", label: "Contact Entries", icon: Mail },
];

interface AdminShellProps {
  onNavigate: (p: Page, sub?: AdminSubPage) => void;
  adminSubPage: AdminSubPage;
  setAdminSubPage: (s: AdminSubPage) => void;
  renderChild: () => React.ReactNode;
}

export function AdminShell({ onNavigate, adminSubPage, setAdminSubPage, renderChild }: AdminShellProps) {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate("admin-login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="px-5 py-6 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}
      >
        <ThroneIcon size={30} />
        <div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              background: "linear-gradient(135deg, #F0D060, #D4AF37)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.01em",
            }}
          >
            THRONE TECH
          </div>
          <div
            style={{
              color: "rgba(212,175,55,0.4)",
              fontSize: "0.58rem",
              fontFamily: "'Fira Code', monospace",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Admin Panel
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <div
          style={{
            color: "rgba(212,175,55,0.35)",
            fontSize: "0.62rem",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            padding: "0 10px",
            marginBottom: "8px",
          }}
        >
          Navigation
        </div>
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = adminSubPage === key;
          return (
            <button
              key={key}
              onClick={() => { setAdminSubPage(key); setSidebarOpen(false); }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 w-full text-left"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: isActive ? 600 : 400,
                background: isActive ? "rgba(212,175,55,0.12)" : "transparent",
                border: isActive ? "1px solid rgba(212,175,55,0.2)" : "1px solid transparent",
                color: isActive ? "#D4AF37" : "rgba(255,255,255,0.45)",
                cursor: "pointer",
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              {label}
              {isActive && (
                <ChevronRight size={13} className="ml-auto" style={{ color: "rgba(212,175,55,0.5)" }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-5 space-y-2" style={{ borderTop: "1px solid rgba(212,175,55,0.08)", paddingTop: "12px" }}>
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 w-full"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 400,
            color: "rgba(255,255,255,0.35)",
            background: "none",
            border: "1px solid transparent",
            cursor: "pointer",
            textAlign: "left",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <ExternalLink size={16} style={{ flexShrink: 0 }} />
          View Live Site
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 w-full"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 400,
            color: "rgba(239,68,68,0.5)",
            background: "transparent",
            border: "1px solid transparent",
            cursor: "pointer",
            textAlign: "left",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(239,68,68,0.5)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
          }}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "linear-gradient(135deg, #060504 0%, #0a0806 100%)",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0 sticky top-0 h-screen"
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(212,175,55,0.1)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-60 lg:hidden"
              style={{
                background: "#0a0806",
                borderRight: "1px solid rgba(212,175,55,0.15)",
              }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
          style={{
            background: "rgba(6,5,4,0.9)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(212,175,55,0.08)",
          }}
        >
          <button
            className="lg:hidden p-2 rounded-xl transition-colors duration-150"
            style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)" }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>

          <div className="hidden lg:block">
            <span
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.8rem",
                fontFamily: "'Fira Code', monospace",
              }}
            >
              throne.admin /
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl"
              style={{
                background: "rgba(212,175,55,0.08)",
                border: "1px solid rgba(212,175,55,0.15)",
              }}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #F0D060, #D4AF37)" }}
              >
                <span style={{ color: "#0a0800", fontSize: "0.65rem", fontWeight: 700 }}>A</span>
              </div>
              <span style={{ color: "rgba(212,175,55,0.8)", fontSize: "0.8rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}>
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderChild()}
        </main>
      </div>
    </div>
  );
}
