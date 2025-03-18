"use client";

import { Button } from "../../ui/button";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";

interface DataTableResetFiltersProps {
  onReset?: () => void;
}

export default function DataTableResetFilters({ onReset }: DataTableResetFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleResetFilters = () => {
    // First replace the URL to remove all query parameters
    replace(pathname);
    
    // Then call the onReset callback if provided
    if (onReset) {
      onReset();
    }
  };

  const hasParams = searchParams.toString() !== "";

  if (!hasParams) return null;

  return (
    <Button
      variant="secondary"
      onClick={handleResetFilters}
      size="sm"
      className="flex items-center gap-1"
      id="datatable-reset-filters"
    >
      Reset filters
      <X className="size-3.5" />
    </Button>
  );
}