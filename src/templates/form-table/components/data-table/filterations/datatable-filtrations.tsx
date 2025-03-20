"use client";

import React from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DataTableFilterStates } from "./datatable-filter-states";
import { DateRange } from "react-day-picker";
import DataTableResetFilters from "./datatable-reset-filters";
import { DataTableViewOptions } from "../datatable-coloumn-trigger";
import { Table } from "@tanstack/react-table";

interface DataTableFiltrationsProps<TData> {
  table: Table<TData>;
  searchBy?: string;
  dateRangeFilterText?: string;
  dateRangeFilter?: boolean;
  filters?: {
    title: string;
    options: { label: string; value: string }[];
    filterKey: string;
  }[];
}

export function DataTableFiltrations<TData>({
  table,
  searchBy,
  dateRangeFilter,
  dateRangeFilterText,
  filters,
}: DataTableFiltrationsProps<TData>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [searchValue, setSearchValue] = React.useState(
    searchParams.get("query")?.toString() || ""
  );
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (startDate && endDate) {
      return {
        from: new Date(startDate),
        to: new Date(endDate),
      };
    }
    return undefined;
  });

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);

    const params = new URLSearchParams(searchParams);
    if (newDate?.from) {
      params.set("startDate", format(newDate.from, "yyyy-MM-dd"));
    } else {
      params.delete("startDate");
    }

    if (newDate?.to) {
      params.set("endDate", format(newDate.to, "yyyy-MM-dd"));
    } else {
      params.delete("endDate");
    }

    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    handleSearch(value);
  };
  
  const handleReset = () => {
    setSearchValue("");
    setDate(undefined);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full justify-between gap-2">
      <div className="flex flex-col lg:flex-row items-start gap-2 lg:items-center w-full">
        {searchBy && (
          <Input
            placeholder={`Search by ${searchBy}`}
            onChange={handleInputChange}
            value={searchValue}
            className="w-full lg:max-w-[220px]"
          />
        )}
        <div className="flex lg:flex-row w-full gap-2">
          {filters?.map((filter) => (
            <DataTableFilterStates
              key={filter.filterKey}
              title={filter.title}
              options={filter.options}
              selectedValues={searchParams.getAll(filter.filterKey)}
              filterKey={filter.filterKey}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-2 md:!justify-end">
        <div className="flex gap-2">
          {dateRangeFilter && (
            <Popover>
              <PopoverTrigger asChild className="sm:w-fit">
                <Button
                  id="date"
                  size="sm"
                  variant="outline"
                  className={cn(!date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>{dateRangeFilterText}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
          <DataTableResetFilters onReset={handleReset} />
        </div>
        <div className="flex w-full md:!w-fit justify-end">
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}