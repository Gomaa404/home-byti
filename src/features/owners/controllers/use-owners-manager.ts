"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Owner, OwnerStatus } from "../types";
import { defaultOwners } from "../data/mock-owners";
import { AdvancedFilterState } from "../components/owners-advanced-filter-drawer";

const defaultAdvancedFilters: AdvancedFilterState = {
  status: "all",
  propertiesRange: "all",
  minUnits: "",
  maxUnits: "",
  period: "all",
  startDate: "",
  endDate: "",
  sortBy: "date_desc",
};

const arabicMonthMap: Record<string, string> = {
  يناير: "01",
  فبراير: "02",
  مارس: "03",
  أبريل: "04",
  مايو: "05",
  يونيو: "06",
  يوليو: "07",
  أغسطس: "08",
  سبتمبر: "09",
  أكتوبر: "10",
  نوفمبر: "11",
  ديسمبر: "12",
};

function parseArabicDate(dateStr: string): Date | null {
  const parts = dateStr.trim().split(" ");
  if (parts.length < 3) return null;
  const day = parts[0].padStart(2, "0");
  const month = arabicMonthMap[parts[1]] || "01";
  const year = parts[2];
  return new Date(`${year}-${month}-${day}T00:00:00`);
}

export function useOwnersManager(initialData: Owner[] = defaultOwners) {
  const [owners, setOwners] = useState<Owner[]>(initialData);
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [advancedFilters, setAdvancedFilters] =
    useState<AdvancedFilterState>(defaultAdvancedFilters);

  const activeFiltersCount = useMemo(() => {
    return (
      (advancedFilters.status !== "all" ? 1 : 0) +
      (advancedFilters.propertiesRange !== "all" ? 1 : 0) +
      (advancedFilters.minUnits !== "" || advancedFilters.maxUnits !== "" ? 1 : 0) +
      (advancedFilters.startDate !== "" ||
      advancedFilters.endDate !== "" ||
      advancedFilters.period !== "all"
        ? 1
        : 0) +
      (advancedFilters.sortBy !== "date_desc" ? 1 : 0)
    );
  }, [advancedFilters]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setAdvancedFilters((prev) => ({ ...prev, status: newFilter }));
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleApplyAdvancedFilters = (newFilters: AdvancedFilterState) => {
    setAdvancedFilters(newFilters);
    setFilter(newFilters.status);
    setCurrentPage(1);
  };

  const handleResetAdvancedFilters = () => {
    setAdvancedFilters(defaultAdvancedFilters);
    setFilter("all");
    setCurrentPage(1);
  };

  const filteredOwners = useMemo(() => {
    return owners
      .filter((owner) => {
        // Status filter
        if (filter === "active" && owner.status !== "active") return false;
        if (filter === "pending" && owner.status !== "pending") return false;
        if (filter === "inactive" && owner.status !== "inactive") return false;

        // Properties range filter
        if (
          advancedFilters.propertiesRange === "1-2" &&
          (owner.propertiesCount < 1 || owner.propertiesCount > 2)
        )
          return false;
        if (
          advancedFilters.propertiesRange === "3-5" &&
          (owner.propertiesCount < 3 || owner.propertiesCount > 5)
        )
          return false;
        if (
          advancedFilters.propertiesRange === "6+" &&
          owner.propertiesCount < 6
        )
          return false;

        // Units range filter
        if (
          advancedFilters.minUnits &&
          owner.unitsCount < parseInt(advancedFilters.minUnits)
        )
          return false;
        if (
          advancedFilters.maxUnits &&
          owner.unitsCount > parseInt(advancedFilters.maxUnits)
        )
          return false;

        // Registration Date filter
        if (advancedFilters.startDate || advancedFilters.endDate) {
          const ownerDate = parseArabicDate(owner.registrationDate);
          if (ownerDate) {
            if (advancedFilters.startDate) {
              const start = new Date(advancedFilters.startDate);
              start.setHours(0, 0, 0, 0);
              if (ownerDate < start) return false;
            }
            if (advancedFilters.endDate) {
              const end = new Date(advancedFilters.endDate);
              end.setHours(23, 59, 59, 999);
              if (ownerDate > end) return false;
            }
          }
        }

        // Search query
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          return (
            owner.name.toLowerCase().includes(q) ||
            owner.email.toLowerCase().includes(q) ||
            owner.phone.toLowerCase().includes(q)
          );
        }

        return true;
      })
      .sort((a, b) => {
        if (advancedFilters.sortBy === "properties_desc") {
          return b.propertiesCount - a.propertiesCount;
        }
        if (advancedFilters.sortBy === "properties_asc") {
          return a.propertiesCount - b.propertiesCount;
        }
        if (advancedFilters.sortBy === "units_desc") {
          return b.unitsCount - a.unitsCount;
        }
        if (advancedFilters.sortBy === "units_asc") {
          return a.unitsCount - b.unitsCount;
        }
        if (advancedFilters.sortBy === "name_asc") {
          return a.name.localeCompare(b.name, "ar");
        }
        if (advancedFilters.sortBy === "date_asc") {
          return parseInt(a.id) - parseInt(b.id);
        }
        return parseInt(b.id) - parseInt(a.id);
      });
  }, [owners, filter, search, advancedFilters]);

  const totalHeadlineCount = 248;
  const totalFiltered = filteredOwners.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const activePage = Math.min(currentPage, totalPages);

  const startIndex = (activePage - 1) * pageSize;
  const paginatedOwners = filteredOwners.slice(
    startIndex,
    startIndex + pageSize
  );

  const fromIndex = totalFiltered === 0 ? 0 : startIndex + 1;
  const toIndex = Math.min(startIndex + pageSize, totalFiltered);

  const counts = {
    all: owners.length,
    active: owners.filter((o) => o.status === "active").length,
    inactive: owners.filter((o) => o.status === "inactive").length,
    pending: owners.filter((o) => o.status === "pending").length,
  };

  const handleDeleteOwner = (id: string, name: string) => {
    setOwners((prev) => prev.filter((o) => o.id !== id));
    toast.success(`تم حذف المالك: ${name}`);
  };

  return {
    owners,
    paginatedOwners,
    counts,
    totalHeadlineCount,
    totalFiltered,
    totalPages,
    activePage,
    fromIndex,
    toIndex,
    filter,
    search,
    pageSize,
    isDrawerOpen,
    advancedFilters,
    activeFiltersCount,
    setFilter: handleFilterChange,
    setSearch: handleSearchChange,
    setPageSize: handlePageSizeChange,
    setCurrentPage,
    setIsDrawerOpen,
    handleApplyAdvancedFilters,
    handleResetAdvancedFilters,
    handleDeleteOwner,
  };
}
