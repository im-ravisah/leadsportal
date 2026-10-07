import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, ChevronRight, ChevronLeft } from "lucide-react";
import { LeadCard, type Lead } from "./LeadCard";
import { cn } from "../../lib/cn";

interface KanbanBoardProps {
  leads: Record<string, Lead[]>;
  onLeadMove: (leadId: string, fromStatus: string, toStatus: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onLeadClick?: (lead: Lead) => void;
}

const columns = [
  // Order and titles aligned with LeadStatsWidget & sidebar: Prime Leads, Partner Leads, Awarded Leads, Hot Leads, Warm Leads, Cold Leads
  { id: "prime", label: "Prime Leads", dotColor: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.4)]" },
  { id: "partner", label: "Partner Leads", dotColor: "bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.4)]" },
  { id: "awarded", label: "Awarded Leads", dotColor: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" },
  { id: "hot", label: "Hot Leads", dotColor: "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.4)]" },
  { id: "warm", label: "Warm Leads", dotColor: "bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.4)]" },
  { id: "cold", label: "Cold Leads", dotColor: "bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.4)]" },
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function SortableLeadCard({
  lead,
  status,
  canScrollDown,
  canScrollUp,
  onScrollDown,
  onScrollUp,
  onLeadClick,
}: {
  lead: Lead;
  status: string;
  canScrollDown?: boolean;
  canScrollUp?: boolean;
  onScrollDown?: () => void;
  onScrollUp?: () => void;
  onLeadClick?: (lead: Lead) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: "lead",
      lead,
      status
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LeadCard
        lead={lead}
        isDragging={isDragging}
        canScrollDown={canScrollDown}
        canScrollUp={canScrollUp}
        onScrollDown={onScrollDown}
        onScrollUp={onScrollUp}
        onClick={onLeadClick}
      />
    </div>
  );
}

function DroppableColumn({
  id,
  label,
  dotColor,
  leads,
  onLeadClick,
}: {
  id: string;
  label: string;
  dotColor: string;
  leads: Lead[];
  onLeadClick?: (lead: Lead) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "column",
      status: id
    }
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showTopArrow, setShowTopArrow] = useState(false);
  const [showBottomArrow, setShowBottomArrow] = useState(false);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setShowTopArrow(scrollTop > 0);
      setShowBottomArrow(scrollTop < scrollHeight - clientHeight - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener("scroll", checkScrollPosition);
      // Also check when leads change
      setTimeout(checkScrollPosition, 100);

      return () => {
        container.removeEventListener("scroll", checkScrollPosition);
      };
    }
  }, [leads.length]);

  const scrollDown = () => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      // Scroll to very bottom of the column
      scrollContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  };

  const scrollUp = () => {
    if (scrollContainerRef.current) {
      // Scroll back to very top of the column
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-[300px] flex-shrink-0 bg-slate-50/70 dark:bg-[#0c0d10] rounded-2xl border border-slate-200/80 dark:border-[#1a1c22] p-3 transition-colors flex flex-col relative",
        isOver && "bg-slate-100 dark:bg-[#14151b] border-orange-500/40"
      )}
      style={{ maxHeight: "calc(100vh - 300px)" }}
    >
      <div className="flex items-center gap-2 mb-3 px-1 flex-shrink-0">
        <span className={cn("w-2 h-2 rounded-full flex-shrink-0", dotColor)} />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          {label}
        </h3>
        <span className="text-xs font-medium text-slate-500 dark:text-[#8e929d] ml-auto px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-[#1a1c22]">
          {leads.length}
        </span>
      </div>

      <div
        ref={scrollContainerRef}
        className="space-y-2 overflow-y-auto flex-1 min-h-[200px] px-1 scrollbar-hide"
        onScroll={checkScrollPosition}
      >
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <SortableLeadCard
              key={lead.id}
              lead={lead}
              status={id}
              canScrollDown={showBottomArrow}
              canScrollUp={showTopArrow}
              onScrollDown={scrollDown}
              onScrollUp={scrollUp}
              onLeadClick={onLeadClick}
            />
          ))}
        </SortableContext>
        {leads.length === 0 && (
          <div className="text-center text-sm text-slate-400 dark:text-slate-600 py-8">
            No leads
          </div>
        )}
      </div>

    </div>
  );
}

export function KanbanBoard({
  leads,
  onLeadMove,
  selectedMonth,
  onMonthChange,
  onLeadClick,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Cleanup: restore body scroll on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    // Prevent body scroll during drag
    document.body.style.overflow = "hidden";
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    // Restore body scroll
    document.body.style.overflow = "";

    if (!over) return;

    const leadId = active.id as string;
    const fromStatus = active.data.current?.status as string;

    // Get target status - could be from column data or lead data
    let toStatus: string;
    if (over.data.current?.type === "column") {
      toStatus = over.data.current.status;
    } else if (over.data.current?.type === "lead") {
      toStatus = over.data.current.status;
    } else {
      // Fallback: check if over.id matches a column
      toStatus = columns.find(col => col.id === over.id)?.id || fromStatus;
    }

    if (fromStatus && toStatus && fromStatus !== toStatus) {
      onLeadMove(leadId, fromStatus, toStatus);
    }
  };

  const activeLead = activeId
    ? Object.values(leads)
      .flat()
      .find((lead) => lead.id === activeId)
    : null;

  // Calculate progress based on selected month
  const getMonthProgress = () => {
    const monthIndex = months.indexOf(selectedMonth);
    if (monthIndex === -1) return 0;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // If selected month is current month, calculate progress
    if (monthIndex === currentMonth) {
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const currentDay = currentDate.getDate();
      return (currentDay / daysInMonth) * 100;
    }

    // If selected month is in the past, show 100%
    if (monthIndex < currentMonth) {
      return 100;
    }

    // If selected month is in the future, show 0%
    return 0;
  };

  const progress = getMonthProgress();
  const currentYear = new Date().getFullYear();

  // Check horizontal scroll position
  const checkHorizontalScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll functions for the arrow buttons
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Scroll by 300px
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Scroll by 300px
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Check scroll position on mount and when content changes
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkHorizontalScroll();
      container.addEventListener("scroll", checkHorizontalScroll);
      // Also check when window resizes
      window.addEventListener("resize", checkHorizontalScroll);

      return () => {
        container.removeEventListener("scroll", checkHorizontalScroll);
        window.removeEventListener("resize", checkHorizontalScroll);
      };
    }
  }, [leads]);

  return (
    <div className="mt-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 w-full">
        {/* Title + Progress bar on the left */}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white truncate">
            Leads for {selectedMonth} {currentYear}
          </h2>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Month progress
            </span>
            <div className="relative w-40 sm:w-56 h-2 bg-slate-200 dark:bg-[#1a1c24] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-slate-300 via-slate-100 to-white dark:from-slate-400 dark:to-white transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                title={`${Math.round(progress)}% of month completed`}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-white shadow-sm"
                style={{ left: `calc(${Math.min(Math.max(progress, 0), 100)}% - 0.375rem)` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-white whitespace-nowrap">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Month Selector + Scroll icons on the right */}
        <div className="flex items-center gap-3 flex-shrink-0">


          <div className="relative">
            <button
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-[#111215] border border-slate-200/80 dark:border-[#1e2026] rounded-xl text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-[#16171d] transition-colors whitespace-nowrap text-sm font-medium shadow-sm"
            >
              <span>{selectedMonth}</span>
              {isMonthDropdownOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {isMonthDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMonthDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111215] border border-slate-200/80 dark:border-[#1e2026] rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto p-1">
                  {months.map((month) => (
                    <button
                      key={month}
                      onClick={() => {
                        onMonthChange(month);
                        setIsMonthDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3.5 py-1.5 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-[#1a1c22] transition-colors",
                        selectedMonth === month && "bg-slate-100 dark:bg-[#1f222b] font-semibold text-orange-500 dark:text-orange-400",
                        "text-slate-900 dark:text-white"
                      )}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          {/* Scroll left */}
          <button
            onClick={handleScrollLeft}
            disabled={!showLeftArrow}
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border transition-all",
              showLeftArrow
                ? "border-orange-500 text-orange-500 bg-white hover:bg-orange-50 dark:border-[#3a3e4d] dark:text-slate-300 dark:bg-[#111215] dark:hover:border-slate-500 dark:hover:text-white dark:hover:bg-[#1c1e26]"
                : "border-slate-300 dark:border-[#1e2026] text-slate-400 dark:text-[#5a5e6b] bg-white dark:bg-[#111215] cursor-not-allowed opacity-60"
            )}
            title={showLeftArrow ? "Scroll left" : "Already at the start"}
            aria-label="Scroll leads board left"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          {/* Scroll right */}
          <button
            onClick={handleScrollRight}
            disabled={!showRightArrow}
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center border transition-all",
              showRightArrow
                ? "border-orange-500 text-orange-500 bg-white hover:bg-orange-50 dark:border-[#3a3e4d] dark:text-slate-300 dark:bg-[#111215] dark:hover:border-slate-500 dark:hover:text-white dark:hover:bg-[#1c1e26]"
                : "border-slate-300 dark:border-[#1e2026] text-slate-400 dark:text-[#5a5e6b] bg-white dark:bg-[#111215] cursor-not-allowed opacity-60"
            )}
            title={showRightArrow ? "Scroll to see more lead columns" : "Already at the end"}
            aria-label="Scroll leads board right"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Kanban Board - Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide"
        style={{ maxHeight: "calc(100vh - 300px)" }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 pb-4 min-w-max" style={{ paddingBottom: "1.5rem" }}>
            {columns.map((column) => (
              <DroppableColumn
                key={column.id}
                id={column.id}
                label={column.label}
                dotColor={column.dotColor}
                leads={leads[column.id] || []}
                onLeadClick={onLeadClick}
              />
            ))}
          </div>

          <DragOverlay>
            {activeLead ? <LeadCard lead={activeLead} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
