import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Filter, Plus, UserX, ArrowUpDown } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { cn } from "../../lib/cn";

type UserRecord = {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: "active" | "inactive";
};

const mockUsers: UserRecord[] = [
  {
    id: 1,
    employeeId: "EMP-1001",
    firstName: "Rahul",
    lastName: "Singh",
    email: "rahul.singh@example.com",
    phone: "+91-9876543210",
    role: "Superadmin",
    department: "Management",
    status: "active",
  },
  {
    id: 2,
    employeeId: "EMP-1002",
    firstName: "Simran",
    lastName: "Kaur",
    email: "simran.kaur@example.com",
    phone: "+91-9876500000",
    role: "Admin",
    department: "Sales",
    status: "active",
  },
  {
    id: 3,
    employeeId: "EMP-1003",
    firstName: "Amandeep",
    lastName: "Arora",
    email: "amandeep.arora@example.com",
    phone: "+91-9876511111",
    role: "Assignee",
    department: "Delivery",
    status: "inactive",
  },
];

export function AllUsers() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState(5);
  const [data, setData] = useState<UserRecord[]>(mockUsers);

  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const columns = useMemo<ColumnDef<UserRecord>[]>(
    () => [
      {
        accessorKey: "id",
        header: "User ID",
        cell: ({ row }) => <span className="font-mono text-xs text-slate-600 dark:text-slate-300">#{row.original.id}</span>,
      },
      {
        accessorKey: "employeeId",
        header: "Employee ID",
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.employeeId}</span>,
      },
      {
        id: "name",
        header: "Name",
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {row.original.firstName} {row.original.lastName}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "Phone Number",
      },
      {
        accessorKey: "role",
        header: "Role",
      },
      {
        accessorKey: "department",
        header: "Department",
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const user = row.original;
          const isInactive = user.status === "inactive";
          return (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 rounded-full px-3 text-[11px] border-slate-500/60 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => {
                  setSelectedUser(user);
                  setIsEditing(false);
                  setIsDetailsOpen(true);
                }}
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={cn(
                  "h-8 rounded-full px-3 text-[11px]",
                  isInactive
                    ? "border-emerald-500/70 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                    : "border-red-500/70 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10"
                )}
                onClick={() => {
                  setData((prev) =>
                    prev.map((u) =>
                      u.id === user.id
                        ? { ...u, status: u.status === "active" ? "inactive" : "active" }
                        : u
                    )
                  );
                }}
              >
                <UserX className="w-3 h-3 mr-1" />
                {isInactive ? "Activate" : "Deactivate"}
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const departments = Array.from(new Set(data.map((u) => u.department))).filter(Boolean);
  const roles = Array.from(new Set(data.map((u) => u.role))).filter(Boolean);

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase();
    return data.filter((u) => {
      const matchesSearch =
        !term ||
        u.employeeId.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(term);
      const matchesDept =
        departmentFilter === "all" || u.department.toLowerCase() === departmentFilter.toLowerCase();
      const matchesRole =
        categoryFilter === "all" || u.role.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesDept && matchesRole;
    });
  }, [data, search, departmentFilter, categoryFilter]);

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

  // Keep table page size in sync with select
  if (table.getState().pagination.pageSize !== pageSize) {
    table.setPageSize(pageSize);
  }

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const totalRows = filteredData.length;
  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = totalRows === 0 ? 0 : Math.min(startRow + pageSize - 1, totalRows);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          All Users
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by employee ID, email, or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
          />
          <div className="flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs flex items-center gap-1"
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter className="w-3 h-3" />
              Filter
            </Button>
            <Button
              type="button"
              className="h-9 px-3 text-xs flex items-center gap-1"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="w-3 h-3" />
              Create User
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-slate-50 dark:bg-slate-900">
              {table.getFlatHeaders().map((header) => {
                const canSort = header.column.getCanSort();
                const sortDir = header.column.getIsSorted();
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "px-4 py-4 text-[11px] font-semibold tracking-wide text-slate-600 dark:text-slate-200",
                      canSort && "cursor-pointer select-none",
                      header.id === "actions" && "text-center"
                    )}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  >
                    <div className="flex items-center gap-1">
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
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-600 dark:text-slate-400 mt-2">
        <div>
          Showing{" "}
          <span className="font-semibold">
            {startRow}–{endRow}
          </span>{" "}
          of <span className="font-semibold">{totalRows}</span> users
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
            <div className="px-2">
            Page{" "}
            <span className="font-semibold">
              {pageIndex + 1} / {Math.max(pageCount, 1)}
            </span>
          </div>
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
         
        </div>
      </div>

      {/* Filter modal */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Users</DialogTitle>
            <DialogDescription>
              Filter users by department and role category.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                Department
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                Category (Role)
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="all">All Roles</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDepartmentFilter("all");
                setCategoryFilter("all");
              }}
            >
              Reset
            </Button>
            <Button type="button" onClick={() => setIsFilterOpen(false)}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create user modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Add a new user to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 mt-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue="rpsingh@seasiainfotech.com"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="•••••••••••"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Role
                </label>
                <select className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100">
                  <option value="">Select your role</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Agency
                </label>
                <select className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100">
                  <option value="">Select Agencies</option>
                  <option>Agency A</option>
                  <option>Agency B</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Department
                </label>
                <select className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100">
                  <option value="">Select Departments</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                // TODO: implement create user via API
                setIsCreateOpen(false);
              }}
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View / edit user dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={(open) => {
        setIsDetailsOpen(open);
        if (!open) {
          setIsEditing(false);
        }
      }}>
        <DialogContent className="max-w-2xl">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  View and edit user information. Employee ID is read-only.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Employee ID
                  </label>
                  <p className="text-sm font-mono text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700">
                    {selectedUser.employeeId}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    User ID
                  </label>
                  <p className="text-sm font-mono text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700">
                    #{selectedUser.id}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    defaultValue={selectedUser.firstName}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    defaultValue={selectedUser.lastName}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    defaultValue={selectedUser.email}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    defaultValue={selectedUser.phone}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    defaultValue={selectedUser.role}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    defaultValue={selectedUser.department}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing((prev) => !prev)}
                >
                  {isEditing ? "Cancel Edit" : "Edit"}
                </Button>
                {isEditing && (
                  <Button
                    type="button"
                    onClick={() => {
                      // TODO: persist changes via API; for now, just close edit mode
                      setIsEditing(false);
                    }}
                  >
                    Save Changes
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

