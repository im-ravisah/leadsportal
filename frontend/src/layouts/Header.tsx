import { Bell, User } from "lucide-react";
import { type Role } from "../constants/roles";

interface HeaderProps {
  pageName: string;
  user: {
    fullName: string;
    role: string;
    avatar?: string;
    lastLogin?: string;
  };
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

export function Header({ pageName, user, onNotificationClick, onProfileClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
      {/* Page Name */}
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{pageName}</h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Last Login */}
        {user.lastLogin && (
          <div className="hidden sm:flex flex-col items-end mr-1">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Last login
            </span>
            <span className="text-xs text-slate-700 dark:text-slate-200">
              {user.lastLogin}
            </span>
          </div>
        )}

        {/* Notifications */}
        <button
          onClick={onNotificationClick}
          className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <button
          onClick={onProfileClick}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="text-left hidden md:block">
            <div className="text-sm font-medium text-slate-900 dark:text-white">{user.fullName}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</div>
          </div>
        </button>
      </div>
    </header>
  );
}
