import { Briefcase, Flame, Snowflake, Zap, Star, Handshake, Award, Clock } from "lucide-react";
import { cn } from "../../lib/cn";

interface LeadStat {
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

interface LeadStatsWidgetProps {
  stats: {
    all: number;
    primeProspects: number;
    partner: number;
    awarded: number;
    delayed: number;
    warm: number;
    cold: number;
    hot: number;
  };
}

export function LeadStatsWidget({ stats }: LeadStatsWidgetProps) {
  const leadStats: LeadStat[] = [
    {
      label: "All Leads",
      count: stats.all,
      icon: Briefcase,
      accentColor: "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.35)]"
    },
    {
      label: "Prime Leads",
      count: stats.primeProspects,
      icon: Star,
      accentColor: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.35)]"
    },
    {
      label: "Partner Leads",
      count: stats.partner,
      icon: Handshake,
      accentColor: "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.35)]"
    },
    {
      label: "Awarded Leads",
      count: stats.awarded,
      icon: Award,
      accentColor: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.35)]"
    },
    {
      label: "Delayed Leads",
      count: stats.delayed,
      icon: Clock,
      accentColor: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.35)]"
    },
    {
      label: "Hot Leads",
      count: stats.hot,
      icon: Zap,
      accentColor: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.35)]"
    },
    {
      label: "Warm Leads",
      count: stats.warm,
      icon: Flame,
      accentColor: "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.35)]"
    },
    {
      label: "Cold Leads",
      count: stats.cold,
      icon: Snowflake,
      accentColor: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.35)]"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3 w-full">
      {leadStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="group relative p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-[#1e2026] bg-white dark:bg-[#111215] shadow-sm hover:shadow-md dark:hover:border-[#2b2e38] transition-all min-w-0"
          >
            {/* Top row: Label + subtle outlined icon */}
            <div className="flex items-center justify-between gap-1 mb-3">
              <span className="text-xs font-normal text-slate-500 dark:text-[#8e929d] truncate">
                {stat.label}
              </span>
              <Icon className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 dark:text-[#5a5e6b] group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
            </div>

            {/* Bottom row: Colored vertical indicator bar + bold white value */}
            <div className="flex items-center gap-2">
              <span className={cn("w-1 h-5 rounded-full flex-shrink-0", stat.accentColor)} />
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {stat.count.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
