import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { cn } from "../../lib/cn";

export interface Lead {
  id: string;
  subject: string;
  name: string;
  company: string;
  assignee: string;
  date: string;
  lastCommented: string | null;
  commentCount: number;
  status: "prime" | "hot" | "warm" | "partner" | "awarded" | "cold";
  leadQuality?: string;
}

interface LeadCardProps {
  lead: Lead;
  isDragging?: boolean;
  canScrollDown?: boolean;
  canScrollUp?: boolean;
  onScrollDown?: () => void;
  onScrollUp?: () => void;
  onClick?: (lead: Lead) => void;
}

const statusConfig = {
  prime: {
    label: "Prime",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    accentPill: "bg-amber-400"
  },
  hot: {
    label: "Hot",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    accentPill: "bg-rose-500"
  },
  warm: {
    label: "Warm",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200/80 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
    accentPill: "bg-orange-500"
  },
  partner: {
    label: "Partner",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
    accentPill: "bg-purple-500"
  },
  awarded: {
    label: "Awarded",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    accentPill: "bg-emerald-500"
  },
  cold: {
    label: "Cold",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200/80 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20",
    accentPill: "bg-cyan-400"
  }
};

export function LeadCard({
  lead,
  isDragging,
  canScrollDown,
  canScrollUp,
  onScrollDown,
  onScrollUp,
  onClick
}: LeadCardProps) {
  const config = statusConfig[lead.status];

  const showDown = !!canScrollDown && !canScrollUp;
  const showUp = !!canScrollUp && !canScrollDown;

  return (
    <div
      className={cn(
        "relative group bg-white dark:bg-[#111215] rounded-xl border border-slate-200/80 dark:border-[#1e2026] p-4 mb-3 cursor-move transition-all duration-200 hover:shadow-md dark:hover:border-[#2c2f38] dark:hover:bg-[#141519]",
        isDragging && "opacity-50 rotate-2 shadow-2xl border-orange-500/50"
      )}
      onClick={() => onClick?.(lead)}
      role="button"
      tabIndex={0}
    >
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-md border",
            config.badgeColor
          )}
        >
          <span className={cn("w-1.5 h-1.5 rounded-full", config.accentPill)} />
          Status: {config.label}
        </span>
      </div>

      {/* Subject */}
      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-snug">
        {lead.subject}
      </h4>

      {/* Details */}
      <div className="space-y-1.5 text-xs mb-3">
        <div className="flex justify-between">
          <span className="font-normal text-slate-500 dark:text-[#9fa4b0]">Name:</span>
          <span className="font-medium text-slate-900 dark:text-[#f1f5f9]">{lead.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-normal text-slate-500 dark:text-[#9fa4b0]">Company:</span>
          <span className="font-medium text-slate-900 dark:text-[#f1f5f9]">{lead.company}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-normal text-slate-500 dark:text-[#9fa4b0]">Assignee:</span>
          <span className="font-medium text-slate-900 dark:text-[#f1f5f9]">{lead.assignee}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-normal text-slate-500 dark:text-[#9fa4b0]">Date:</span>
          <span className="font-medium text-slate-900 dark:text-[#f1f5f9]">{lead.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-normal text-slate-500 dark:text-[#9fa4b0]">Last Commented:</span>
          <span className="font-medium text-slate-900 dark:text-[#f1f5f9]">{lead.lastCommented || "N/A"}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-[#1c1d23]">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#9fa4b0]">
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="text-xs">{lead.commentCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 dark:text-[#828896]">
            #{lead.id}
          </span>
          {lead.leadQuality && (
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#1a1c22] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#22242c]">
              LQ
            </span>
          )}
        </div>
      </div>

      {/* Scroll icon at bottom of card */}
      {(showDown || showUp) && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (showDown) {
              onScrollDown?.();
            } else {
              onScrollUp?.();
            }
          }}
          className="absolute -bottom-2.5 right-3 transition-all duration-150 w-6 h-6 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-600 hover:text-orange-700 dark:bg-[#16171d] dark:hover:bg-[#1f2129] dark:text-slate-300 dark:hover:text-white border border-orange-200/80 hover:border-orange-300 dark:border-[#23252e] dark:hover:border-slate-600/60 shadow-sm flex items-center justify-center z-10"
          aria-label={showDown ? "Scroll down" : "Scroll up"}
        >
          {showDown ? (
            <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
        </button>
      )}
    </div>
  );
}
