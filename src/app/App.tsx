import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProjectsProvider } from "./context/ProjectsContext";
import { PublicSite } from "./pages/PublicSite";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminShell } from "./components/admin/AdminShell";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminProjects } from "./components/admin/AdminProjects";
import { AdminContactEntries } from "./components/admin/AdminContactEntries";

export type Page = "home" | "admin-login" | "admin";
export type AdminSubPage = "dashboard" | "projects" | "contact-entries";

function parseHashToPage(): Page {
  const h = window.location.hash?.replace(/^#/, "") || "";
  if (h === "admin/login") return "admin-login";
  if (h === "admin") return "admin";
  return "home";
}

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<Page>(() => parseHashToPage());
  const [adminSubPage, setAdminSubPage] = useState<AdminSubPage>("dashboard");

  useEffect(() => {
    const syncFromHash = () => {
      const p = parseHashToPage();
      setPage(p);
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
      case "admin-login":
        return <AdminLogin onNavigate={onNavigate} />;
      case "admin":
        if (!user) return <AdminLogin onNavigate={onNavigate} />;
        return (
          <AdminShell
            onNavigate={onNavigate}
            adminSubPage={adminSubPage}
            setAdminSubPage={setAdminSubPage}
            renderChild={() =>
              adminSubPage === "projects" ? (
                <AdminProjects />
              ) : adminSubPage === "contact-entries" ? (
                <AdminContactEntries />
              ) : (
                <AdminDashboard
                  onNavigateToProjects={() => setAdminSubPage("projects")}
                  onNavigateToContactEntries={() => setAdminSubPage("contact-entries")}
                />
              )
            }
          />
        );
      default:
        return <PublicSite onNavigate={onNavigate} />;
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
    <AuthProvider>
      <ProjectsProvider>
        <AppContent />
      </ProjectsProvider>
    </AuthProvider>
  );
}
