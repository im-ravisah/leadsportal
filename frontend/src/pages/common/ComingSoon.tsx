import { Construction } from "lucide-react";

interface ComingSoonProps {
  title?: string;
  description?: string;
}

export function ComingSoon({ title = "Coming Soon", description = "This page is under development. Please check back later." }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-6 p-6 bg-slate-100 dark:bg-slate-800 rounded-full">
        <Construction className="w-16 h-16 text-slate-400 dark:text-slate-500" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{title}</h2>
      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">{description}</p>
    </div>
  );
}
