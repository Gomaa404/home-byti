"use client";

import { OperationsHeader } from "./operations-header";
import { OperationsStatusSummary } from "./operations-status-summary";
import { OperationsFilters } from "./operations-filters";
import { OperationsTable } from "./operations-table";
import { OperationsGovernanceCard } from "./operations-governance-card";
import { OperationsAdvancedFilterDrawer } from "./operations-advanced-filter-drawer";
import { useOperationsManager } from "../controllers/use-operations-manager";

export function OperationsBoardView() {
  const {
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
  } = useOperationsManager();

  return (
    <div className="space-y-6">
      {/* 1. Header with Actions */}
      <OperationsHeader />

      {/* 2. Top Segmented Pills (All, Cleaning, Maintenance) */}
      <OperationsStatusSummary
        currentCategory={categoryFilter}
        onCategoryChange={setCategoryFilter}
        counts={counts}
      />

      {/* 3. Search, Filter Button, and Sub Status Pills */}
      <OperationsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentSubFilter={subFilter}
        onSubFilterChange={setSubFilter}
        subCounts={subCounts}
        onOpenAdvancedFilter={() => setIsFilterDrawerOpen(true)}
        activeFiltersCount={activeFiltersCount}
      />

      {/* 4. Table */}
      <OperationsTable tasks={filteredTasks} />

      {/* 5. Central Governance Banner */}
      <OperationsGovernanceCard />

      {/* 6. Advanced Filter Drawer */}
      <OperationsAdvancedFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={advancedFilters}
        onApplyFilters={setAdvancedFilters}
        onResetFilters={handleResetAdvancedFilters}
        totalResultsCount={filteredTasks.length}
      />
    </div>
  );
}
