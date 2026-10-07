import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../../layouts/Sidebar";
import { Header } from "../../layouts/Header";
import { Footer } from "../../layouts/Footer";
import { ROLES } from "../../constants/roles";
import { getAuthToken } from "../../utils/auth";
import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";
import { useTheme } from "../../contexts/theme/ThemeProvider";
import { Moon, Sun } from "lucide-react";

interface UserInfo {
  fullName: string;
  role: string;
  avatar?: string;
  lastLogin?: string;
}

function getPageName(pathname: string, basePath: string): string {
  const path = pathname.replace(basePath, "");
  if (path === "/dashboard" || path === "") return "Dashboard";
  if (path.startsWith("/leads")) {
    const leadType = path.split("/").pop();
    if (leadType) {
      // Handle kebab-case to Title Case
      const formatted = leadType
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      if (leadType === "all") return "All Leads";
      if (leadType === "prime-prospects") return "Prime Leads";
      if (leadType === "partner") return "Partner Leads";
      if (leadType === "awarded") return "Awarded Leads";
      if (leadType === "delayed") return "Delayed Leads";
      if (leadType === "warm") return "Warm Leads";
      if (leadType === "cold") return "Cold Leads";
      if (leadType === "hot") return "Hot Leads";
      return `${formatted} Leads`;
    }
    return "Leads";
  }
  if (path === "/hr") return "HR Management";
  if (path === "/users") return "All Users";
  if (path === "/departments") return "Departments";
  return "Dashboard";
}

export function DashboardLayout({ role, basePath }: { role: typeof ROLES.ADMIN | typeof ROLES.SUPERADMIN | typeof ROLES.ASSIGNEE; basePath: string }) {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: "Loading...",
    role: role
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const checkSidebarState = () => {
      const saved = localStorage.getItem(`sidebar_collapsed_${role}`);
      setSidebarCollapsed(saved === "true");
    };
    checkSidebarState();
    const interval = setInterval(checkSidebarState, 200);
    return () => clearInterval(interval);
  }, [role]);

  useEffect(() => {
    // Decode JWT to get user info (simplified - in production use proper JWT decode)
    const token = getAuthToken(role);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const rawLastLogin = payload.last_login || payload.lastLogin;
        let formattedLastLogin = "";
        if (rawLastLogin) {
          const d = new Date(rawLastLogin);
          formattedLastLogin = isNaN(d.getTime()) ? String(rawLastLogin) : d.toLocaleString();
        }
        setUserInfo({
          fullName: payload.first_name && payload.last_name 
            ? `${payload.first_name} ${payload.last_name}`
            : payload.email || "User",
          role: payload.role || role,
          avatar: payload.avatar,
          lastLogin: formattedLastLogin
        });
      } catch (e) {
        // Fallback
        setUserInfo({
          fullName: "User",
          role: role
        });
      }
    }
  }, [role]);

  const pageName = getPageName(location.pathname, basePath);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar role={role} basePath={basePath} />
      <div className={cn("flex-1 flex flex-col transition-all duration-300 min-w-0 overflow-hidden", sidebarCollapsed ? "ml-16" : "ml-64")}>
        <Header
          pageName={pageName}
          user={userInfo}
          onNotificationClick={() => console.log("Notifications clicked")}
          onProfileClick={() => console.log("Profile clicked")}
        />
        <main className="flex-1 overflow-hidden px-6 pt-6 min-w-0">
          <div className="h-full overflow-y-auto overflow-x-hidden w-full max-w-full scrollbar-hide">
            <Outlet />
          </div>
        </main>
        <Footer />

        {/* Floating theme toggle button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="fixed bottom-32 right-12 z-40 w-11 h-11 rounded-full shadow-md hover:shadow-lg bg-white/95 dark:bg-[#14151a]/95 backdrop-blur-sm border border-orange-200/70 hover:border-orange-300 dark:border-[#23252e] dark:hover:border-slate-600/70 flex items-center justify-center hover:bg-orange-50/60 dark:hover:bg-[#1c1e26] hover:scale-105 active:scale-95 transition-all duration-200 group"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-orange-600 group-hover:rotate-12 transition-transform duration-200" strokeWidth={2.2} />
          ) : (
            <Sun className="w-5 h-5 text-slate-300 group-hover:text-white group-hover:rotate-45 transition-transform duration-200" strokeWidth={2.2} />
          )}
        </button>
      </div>
    </div>
  );
}
