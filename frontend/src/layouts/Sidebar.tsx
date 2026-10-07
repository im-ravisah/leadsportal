import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  ChevronLeft, 
  ChevronRight,
  Briefcase,
  UserCheck,
  LogOut,
  ChevronDown,
  Star,
  Handshake,
  Award,
  Clock,
  Flame,
  Snowflake,
  Zap
} from "lucide-react";
import { cn } from "../lib/cn";
import { ROLES, type Role } from "../constants/roles";
import { clearAuthToken } from "../utils/auth";

interface SidebarProps {
  role: Role;
  basePath: string;
}

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  children?: { label: string; path: string; icon: React.ComponentType<{ className?: string }> }[];
}

export function Sidebar({ role, basePath }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [leadsOpen, setLeadsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Store collapsed state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`sidebar_collapsed_${role}`);
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, [role]);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(`sidebar_collapsed_${role}`, String(newState));
  };

  const handleLogout = () => {
    clearAuthToken(role);
    navigate(`/auth/${role}/login`);
  };

  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: `${basePath}/dashboard`
    },
    {
      label: "Leads",
      icon: Briefcase,
      path: `${basePath}/leads`,
      children: [
        { label: "All Leads", path: `${basePath}/leads/all`, icon: Briefcase },
        { label: "Prime Leads", path: `${basePath}/leads/prime-prospects`, icon: Star },
        { label: "Partner Leads", path: `${basePath}/leads/partner`, icon: Handshake },
        { label: "Awarded Leads", path: `${basePath}/leads/awarded`, icon: Award },
        { label: "Delayed Leads", path: `${basePath}/leads/delayed`, icon: Clock },
        { label: "Hot Leads", path: `${basePath}/leads/hot`, icon: Zap },
        { label: "Warm Leads", path: `${basePath}/leads/warm`, icon: Flame },
        { label: "Cold Leads", path: `${basePath}/leads/cold`, icon: Snowflake }
      ]
    },
    {
      label: "Profile",
      icon: UserCircle,
      path: `${basePath}/profile`
    },
    {
      label: "HR",
      icon: UserCheck,
      path: `${basePath}/hr`
    },
    {
      label: "All Users",
      icon: Users,
      path: `${basePath}/users`
    },
    {
      label: "Departments",
      icon: Users,
      path: `${basePath}/departments`
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col shadow-lg",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "h-16 flex items-center px-4 border-b border-slate-800 relative",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-sm">
              LP
            </div>
            <span className="text-white font-semibold">LeadsPortal</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-sm">
            LP
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 shadow-md transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const isLeadsItem = item.label === "Leads";
          
          if (item.children) {
            return (
              <div key={item.path} className="space-y-1">
                <div
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                    isCollapsed ? "justify-center" : "gap-3",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                  onClick={isLeadsItem ? () => setLeadsOpen((prev) => !prev) : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between">
                      <span>{item.label}</span>
                      {isLeadsItem && (
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-slate-400 transition-transform",
                            leadsOpen ? "rotate-0" : "-rotate-90"
                          )}
                        />
                      )}
                    </div>
                  )}
                </div>
                {!isCollapsed && (!isLeadsItem || leadsOpen) && (
                  <div className="ml-8 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                            isActive(child.path)
                              ? "bg-primary/10 text-primary"
                              : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                          )}
                        >
                          <ChildIcon className="w-4 h-4 flex-shrink-0" />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isCollapsed ? "justify-center" : "gap-3",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section - Logout */}
      <div className="border-t border-slate-800 px-4 py-1">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            "text-red-400 hover:bg-red-500/10 hover:text-red-300"
          )}
          title="Logout"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
