"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  OnChangeFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./datatable-pagination";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { DataTableFiltrations } from "./filterations/datatable-filtrations";

interface DataTableProps<TData, TValue> {
  dateRangeFilter?: boolean;
  dateRangeFilterText?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  searchBy?: string;
  tableMessage?: string;
  filters?: {
    title: string;
    options: { label: string; value: string }[];
    filterKey: string;
  }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageIndex,
  pageSize,
  searchBy,
  filters,
  dateRangeFilter,
  dateRangeFilterText = "Pick a date range",
  tableMessage = "No results.",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSorting: OnChangeFn<SortingState> = (updaterOrValue) => {
    const newValue =
      typeof updaterOrValue === "function"
        ? updaterOrValue(sorting)
        : updaterOrValue;

    setSorting(newValue);

    const params = new URLSearchParams(searchParams);
    if (newValue.length > 0) {
      params.set("sort", newValue[0].id);
      params.set("order", newValue[0].desc ? "desc" : "asc");
    } else {
      params.delete("sort");
      params.delete("order");
    }
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  const table = useReactTable({
    data,
    columns,
    pageCount,
    onSortingChange: handleSorting,
    onRowSelectionChange: setRowSelection,
    manualSorting: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: true,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4 gap-2">
        <DataTableFiltrations
          searchBy={searchBy}
          filters={filters}
          dateRangeFilterText={dateRangeFilterText}
          dateRangeFilter={dateRangeFilter}
          table={table}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {tableMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <DataTablePagination
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        pathname={pathname}
        searchParams={searchParams}
        replace={replace}
      />
    </div>
  );
}
