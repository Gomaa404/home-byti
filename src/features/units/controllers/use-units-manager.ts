"use client";

import { useState, useMemo } from "react";
import { Unit, UnitFilterState } from "../types";
import { initialUnits } from "../data/mock-units";

const defaultAdvancedFilters: UnitFilterState = {
  property: "all",
  status: "all",
  unitType: "all",
  floor: "all",
  priceRange: "all",
  sortBy: "default",
};

export function useUnitsManager(initialData: Unit[] = initialUnits) {
  const [units] = useState<Unit[]>(initialData);
  const [pageSize, setPageSize] = useState<number>(8);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tabFilter, setTabFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [advancedFilters, setAdvancedFilters] =
    useState<UnitFilterState>(defaultAdvancedFilters);

  const handleTabChange = (newTab: string) => {
    setTabFilter(newTab);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setAdvancedFilters(defaultAdvancedFilters);
    setCurrentPage(1);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (advancedFilters.property !== "all") count++;
    if (advancedFilters.status !== "all") count++;
    if (advancedFilters.unitType !== "all") count++;
    if (advancedFilters.floor !== "all") count++;
    if (advancedFilters.priceRange !== "all") count++;
    if (advancedFilters.sortBy !== "default") count++;
    return count;
  }, [advancedFilters]);

  const filteredUnits = useMemo(() => {
    const list = units.filter((unit) => {
      if (tabFilter !== "all" && unit.status !== tabFilter) {
        return false;
      }

      if (
        advancedFilters.property !== "all" &&
        unit.propertyName !== advancedFilters.property
      ) {
        return false;
      }
      if (
        advancedFilters.status !== "all" &&
        unit.status !== advancedFilters.status
      ) {
        return false;
      }
      if (
        advancedFilters.unitType !== "all" &&
        unit.type !== advancedFilters.unitType
      ) {
        return false;
      }
      if (
        advancedFilters.floor !== "all" &&
        unit.floorNumber.toString() !== advancedFilters.floor
      ) {
        return false;
      }
      if (advancedFilters.priceRange === "less200" && unit.pricePerNight >= 200) {
        return false;
      }
      if (
        advancedFilters.priceRange === "200-350" &&
        (unit.pricePerNight < 200 || unit.pricePerNight > 350)
      ) {
        return false;
      }
      if (advancedFilters.priceRange === "more350" && unit.pricePerNight <= 350) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesUnit = unit.unitNumber.toLowerCase().includes(q);
        const matchesProperty = unit.propertyName.toLowerCase().includes(q);
        const matchesOwner = unit.ownerName.toLowerCase().includes(q);
        return matchesUnit || matchesProperty || matchesOwner;
      }

      return true;
    });

    if (advancedFilters.sortBy === "price_asc") {
      list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (advancedFilters.sortBy === "price_desc") {
      list.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (advancedFilters.sortBy === "unit_asc") {
      list.sort((a, b) => a.unitNumber.localeCompare(b.unitNumber));
    }

    return list;
  }, [units, tabFilter, searchQuery, advancedFilters]);

  const counts = useMemo(
    () => ({
      all: units.length,
      available: units.filter((u) => u.status === "available").length,
      occupied: units.filter((u) => u.status === "occupied").length,
      cleaning: units.filter((u) => u.status === "cleaning").length,
      maintenance: units.filter((u) => u.status === "maintenance").length,
    }),
    [units]
  );

  const totalHeadlineCount = 342;
  const totalFiltered = filteredUnits.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const activePage = Math.min(currentPage, totalPages);

  const startIndex = (activePage - 1) * pageSize;
  const paginatedUnits = filteredUnits.slice(startIndex, startIndex + pageSize);

  const fromIndex = totalFiltered === 0 ? 0 : startIndex + 1;
  const toIndex = Math.min(startIndex + pageSize, totalFiltered);

  return {
    units,
    paginatedUnits,
    counts,
    totalHeadlineCount,
    totalFiltered,
    totalPages,
    activePage,
    fromIndex,
    toIndex,
    tabFilter,
    searchQuery,
    pageSize,
    isFilterDrawerOpen,
    advancedFilters,
    activeFiltersCount,
    setTabFilter: handleTabChange,
    setSearchQuery: handleSearchChange,
    setPageSize: handlePageSizeChange,
    setCurrentPage,
    setIsFilterDrawerOpen,
    setAdvancedFilters,
    handleResetFilters,
  };
}
