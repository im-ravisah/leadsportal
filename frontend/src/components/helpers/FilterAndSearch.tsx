import { Search, Filter } from "lucide-react";
import { Button } from "../ui/button";

interface FilterAndSearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterClick?: () => void;
  placeholder?: string;
}

export function FilterAndSearch({
  searchValue,
  onSearchChange,
  onFilterClick,
  placeholder = "Search..."
}: FilterAndSearchProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4 w-full min-w-0">
      {/* Search */}
      <div className="flex-1 relative min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200/90 dark:border-[#22252e] bg-white dark:bg-[#111215] text-slate-900 dark:text-[#f1f5f9] placeholder-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-slate-400/20 focus:border-orange-500 dark:focus:border-slate-500 transition-colors shadow-xs"
        />
      </div>

      {/* Filter Button */}
      {onFilterClick && (
        <Button
          variant="outline"
          onClick={onFilterClick}
          className="flex items-center gap-2 flex-shrink-0 border border-slate-200/90 dark:border-[#22252e] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#181a22] shadow-sm font-medium"
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
      )}
    </div>
  );
}
