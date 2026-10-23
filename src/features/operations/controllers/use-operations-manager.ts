"use client";

import { useState, useMemo } from "react";
import { initialOperationsTasks } from "../data/mock-operations";
import {
  OperationCategoryFilter,
  OperationSubFilter,
  OperationTask,
  OperationFilterState,
  initialOperationFilterState,
} from "../types";

export function useOperationsManager(
  initialTasks: OperationTask[] = initialOperationsTasks
) {
  const [tasks] = useState<OperationTask[]>(initialTasks);
  const [categoryFilter, setCategoryFilter] =
    useState<OperationCategoryFilter>("all");
  const [subFilter, setSubFilter] = useState<OperationSubFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<OperationFilterState>(
    initialOperationFilterState
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (advancedFilters.type !== "all") count++;
    if (advancedFilters.status !== "all") count++;
    if (advancedFilters.priority !== "all") count++;
    if (advancedFilters.city !== "all") count++;
    if (advancedFilters.property !== "all") count++;
    if (advancedFilters.assigneeStatus !== "all") count++;
    if (advancedFilters.assigneeName !== "all") count++;
    if (advancedFilters.timePeriod !== "all") count++;
    if (advancedFilters.sortBy !== "default") count++;
    return count;
  }, [advancedFilters]);

  const counts = useMemo(() => {
    return {
      all: 48,
      cleaning: 28,
      maintenance: 20,
    };
  }, []);

  const subCounts = useMemo(() => {
    return {
      all: 2,
      pending: 1,
      current: 2,
      in_progress: 2,
    };
  }, []);

  const filteredTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      // 1. Top Category filter
      if (categoryFilter === "cleaning" && task.type !== "cleaning") return false;
      if (categoryFilter === "maintenance" && task.type !== "maintenance")
        return false;

      // 2. Sub filter
      if (subFilter === "pending" && task.status !== "needs_cleaning")
        return false;
      if (subFilter === "in_progress" && task.status !== "in_progress")
        return false;
      if (subFilter === "current" && task.status === "completed") return false;

      // 3. Advanced Drawer Filters
      if (advancedFilters.type !== "all" && task.type !== advancedFilters.type) {
        return false;
      }
      if (
        advancedFilters.status !== "all" &&
        task.status !== advancedFilters.status
      ) {
        return false;
      }
      if (
        advancedFilters.priority !== "all" &&
        task.priority !== advancedFilters.priority
      ) {
        return false;
      }
      if (
        advancedFilters.city !== "all" &&
        !task.city?.includes(advancedFilters.city)
      ) {
        return false;
      }
      if (
        advancedFilters.property !== "all" &&
        !task.propertyName?.includes(advancedFilters.property)
      ) {
        return false;
      }
      if (advancedFilters.assigneeStatus === "assigned") {
        if (!task.assigneeName || task.assigneeName.includes("غير مسند"))
          return false;
      }
      if (advancedFilters.assigneeStatus === "unassigned") {
        if (task.assigneeName && !task.assigneeName.includes("غير مسند"))
          return false;
      }
      if (
        advancedFilters.assigneeName !== "all" &&
        !task.assigneeName?.includes(advancedFilters.assigneeName)
      ) {
        return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesCode = task.taskNumber.toLowerCase().includes(q);
        const matchesUnit = task.unitName.toLowerCase().includes(q);
        const matchesProperty = task.propertyName.toLowerCase().includes(q);
        const matchesOwner = task.ownerName.toLowerCase().includes(q);
        const matchesAssignee = task.assigneeName?.toLowerCase().includes(q);
        return (
          matchesCode ||
          matchesUnit ||
          matchesProperty ||
          matchesOwner ||
          matchesAssignee
        );
      }

      return true;
    });

    // 5. Sorting
    if (advancedFilters.sortBy === "task_asc") {
      result.sort((a, b) => a.taskNumber.localeCompare(b.taskNumber));
    } else if (advancedFilters.sortBy === "priority_desc") {
      const priorityWeights: Record<string, number> = {
        urgent: 4,
        high: 3,
        medium: 2,
        low: 1,
      };
      result.sort(
        (a, b) =>
          (priorityWeights[b.priority || "low"] || 0) -
          (priorityWeights[a.priority || "low"] || 0)
      );
    } else if (advancedFilters.sortBy === "date_desc") {
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else if (advancedFilters.sortBy === "date_asc") {
      result.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }

    return result;
  }, [tasks, categoryFilter, subFilter, advancedFilters, searchQuery]);

  const handleResetAdvancedFilters = () => {
    setAdvancedFilters(initialOperationFilterState);
  };

  return {
    tasks,
    categoryFilter,
    subFilter,
    searchQuery,
    isFilterDrawerOpen,
    advancedFilters,
    activeFiltersCount,
    counts,
    subCounts,
    filteredTasks,
    setCategoryFilter,
    setSubFilter,
    setSearchQuery,
    setIsFilterDrawerOpen,
    setAdvancedFilters,
    handleResetAdvancedFilters,
  };
}
