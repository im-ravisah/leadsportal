import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Plus, ArrowUpDown, Image as ImageIcon } from "lucide-react";
import { cn } from "../../lib/cn";

type Department = {
  id: number;
  name: string;
  image?: string;
};

const mockDepartments: Department[] = [
  { id: 1, name: "Sales", image: "" },
  { id: 2, name: "Delivery", image: "" },
  { id: 3, name: "Human Resources", image: "" },
];

export function Departments() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState(5);
  const [data, setData] = useState<Department[]>(mockDepartments);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | undefined>();

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((d) => d.name.toLowerCase().includes(term));
  }, [data, search]);

  const columns = useMemo<ColumnDef<Department>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-600 dark:text-slate-300">#{row.original.id}</span>
        ),
      },
      {
        accessorKey: "name",
        header: "Department Name",
      },
      {
        id: "image",
        header: "Department Image",
        cell: ({ row }) => {
          const img = row.original.image;
          return img ? (
            <img
              src={img}
              alt={row.original.name}
              className="w-8 h-8 rounded-md object-cover border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-md border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 text-[10px]">
              <ImageIcon className="w-3 h-3" />
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const dept = row.original;
          return (
            <div className="flex items-center justify-end">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 rounded-full px-3 text-[11px] border-slate-500/60 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => openDialog(dept)}
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  });

  if (table.getState().pagination.pageSize !== pageSize) {
    table.setPageSize(pageSize);
  }

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const totalRows = filteredData.length;
  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = totalRows === 0 ? 0 : Math.min(startRow + pageSize - 1, totalRows);

  function openDialog(dept: Department | null) {
    setEditingDept(dept);
    setNameInput(dept?.name ?? "");
    setImagePreview(dept?.image);
    setDialogOpen(true);
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!nameInput.trim()) return;
    if (editingDept) {
      // update existing
      setData((prev) =>
        prev.map((d) =>
          d.id === editingDept.id ? { ...d, name: nameInput.trim(), image: imagePreview } : d
        )
      );
    } else {
      // create new
      const nextId = (data[data.length - 1]?.id ?? 0) + 1;
      setData((prev) => [
        ...prev,
        { id: nextId, name: nameInput.trim(), image: imagePreview },
      ]);
    }
    setDialogOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Departments
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by department name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
          />
          <Button
            type="button"
            className="h-9 px-3 text-xs flex items-center gap-1"
            onClick={() => openDialog(null)}
          >
            <Plus className="w-3 h-3" />
            Create Department
          </Button>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-slate-50 dark:bg-slate-900">
              {table.getFlatHeaders().map((header) => {
                const canSort = header.column.getCanSort();
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "px-4 py-4 text-[11px] font-semibold tracking-wide text-slate-600 dark:text-slate-200",
                      canSort && "cursor-pointer select-none",
                      header.id === "actions" && "text-right"
                    )}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  >
                    <div className="flex items-center gap-1 justify-between sm:justify-start">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {canSort && (
                        <ArrowUpDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b border-slate-100 dark:border-slate-800/80 last:border-0">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "px-4 py-3 text-xs text-slate-700 dark:text-slate-100",
                        cell.column.id === "actions" && "text-right"
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-6 text-center text-sm text-slate-400"
                >
                  No departments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-600 dark:text-slate-400 mt-2">
        <div>
          Showing{" "}
          <span className="font-semibold">
            {startRow}–{endRow}
          </span>{" "}
          of <span className="font-semibold">{totalRows}</span> departments
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-8 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-xs text-slate-900 dark:text-slate-100 cursor-pointer"
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-8 w-8 cursor-pointer"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="w-3 h-3" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-8 w-8 cursor-pointer"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-8 w-8 cursor-pointer"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-8 w-8 cursor-pointer"
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="w-3 h-3" />
            </Button>
          </div>
          <div>
            Page{" "}
            <span className="font-semibold">
              {pageIndex + 1} / {Math.max(pageCount, 1)}
            </span>
          </div>
        </div>
      </div>

      {/* Create / Edit department dialog (reused) */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingDept(null);
            setNameInput("");
            setImagePreview(undefined);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingDept ? "Edit Department" : "Create Department"}</DialogTitle>
            <DialogDescription>
              {editingDept
                ? "Update the department name or image."
                : "Add a new department with name and optional image."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Department Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                placeholder="Enter department name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                Department Image
              </label>
              <div className="flex items-center gap-3">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Department"
                    className="w-12 h-12 rounded-md object-cover border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-md border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 text-[10px]">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}
                <label className="inline-flex items-center gap-2 text-xs font-medium text-orange-600 cursor-pointer">
                  <span className="px-3 py-1.5 rounded-lg border border-orange-500 text-orange-600 bg-white dark:bg-slate-950 hover:bg-orange-50">
                    Upload Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              {editingDept ? "Save Changes" : "Create Department"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

