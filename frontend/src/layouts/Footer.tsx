export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3">
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <span>© {currentYear} LeadsPortal. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
            Terms of Service
          </a>
          <span>v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
