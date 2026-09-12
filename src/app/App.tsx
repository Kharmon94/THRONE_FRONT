import { useState, useEffect } from "react";
import { MotionConfig } from "motion/react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProjectsProvider } from "./context/ProjectsContext";
import { PublicSite } from "./pages/PublicSite";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminShell } from "./components/admin/AdminShell";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminProjects } from "./components/admin/AdminProjects";
import { AdminAppointments } from "./components/admin/AdminAppointments";
import { RescheduleBooking } from "./components/RescheduleBooking";
import { canViewAdmin } from "../utils/permissions";

export type Page = "home" | "admin-login" | "admin" | "reschedule";
export type AdminSubPage = "dashboard" | "projects" | "appointments";

function parseHash(): { page: Page; rescheduleToken: string | null } {
  const h = window.location.hash?.replace(/^#/, "") || "";
  const rescheduleMatch = h.match(/^book\/reschedule\/([^/]+)$/);
  if (rescheduleMatch) {
    return { page: "reschedule", rescheduleToken: decodeURIComponent(rescheduleMatch[1]) };
  }
  if (h === "admin/login") return { page: "admin-login", rescheduleToken: null };
  if (h === "admin") return { page: "admin", rescheduleToken: null };
  return { page: "home", rescheduleToken: null };
}

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<Page>(() => parseHash().page);
  const [rescheduleToken, setRescheduleToken] = useState<string | null>(
    () => parseHash().rescheduleToken
  );
  const [adminSubPage, setAdminSubPage] = useState<AdminSubPage>("dashboard");

  useEffect(() => {
    const syncFromHash = () => {
      const parsed = parseHash();
      setPage(parsed.page);
      setRescheduleToken(parsed.rescheduleToken);
    };
    window.addEventListener("hashchange", syncFromHash);
    syncFromHash();
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const onNavigate = (p: Page, sub?: AdminSubPage) => {
    setPage(p);
    if (sub) setAdminSubPage(sub);
    if (p === "admin") window.location.hash = "#admin";
    else if (p === "admin-login") window.location.hash = "#admin/login";
    else window.location.hash = "";
  };

  const renderPage = () => {
    switch (page) {
      case "reschedule":
        return (
          <RescheduleBooking
            token={rescheduleToken || ""}
            onDone={() => onNavigate("home")}
          />
        );
      case "admin-login":
        return <AdminLogin onNavigate={onNavigate} />;
      case "admin":
        if (!canViewAdmin(user)) return <AdminLogin onNavigate={onNavigate} />;
        return (
          <AdminShell
            onNavigate={onNavigate}
            adminSubPage={adminSubPage}
            setAdminSubPage={setAdminSubPage}
            renderChild={() =>
              adminSubPage === "projects" ? (
                <AdminProjects />
              ) : adminSubPage === "appointments" ? (
                <AdminAppointments />
              ) : (
                <AdminDashboard
                  onNavigateToProjects={() => setAdminSubPage("projects")}
                  onNavigateToAppointments={() => setAdminSubPage("appointments")}
                />
              )
            }
          />
        );
      default:
        return <PublicSite />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#060504" }}>
        <div className="animate-spin h-8 w-8 border-2 border-amber-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{renderPage()}</>;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <ProjectsProvider>
          <AppContent />
        </ProjectsProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
