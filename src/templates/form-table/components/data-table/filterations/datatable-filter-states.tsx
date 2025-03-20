"use client";

import { PlusCircle, Check } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface DataTableFilterProps {
  title: string;
  options: {
    label: string;
    value: string;
  }[];
  selectedValues?: string[];
  filterKey: string;
}

export function DataTableFilterStates({
  title,
  options,
  selectedValues = [],
  filterKey,
}: DataTableFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    let currentFilters = params.getAll(filterKey);

    if (currentFilters.includes(value)) {
      currentFilters = currentFilters.filter((filter) => filter !== value);
    } else {
      currentFilters.push(value);
    }

    params.delete(filterKey);
    currentFilters.forEach((filter) => {
      params.append(filterKey, filter);
    });
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete(filterKey);
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValues.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {selectedValues.length}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleFilter(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="capitalize">{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClearFilters}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
