"use client";

import { Eye, Building2, Trash2, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { OwnerStatus } from "../types";
import { OwnersFilters } from "./owners-filters";
import { OwnersAdvancedFilterDrawer } from "./owners-advanced-filter-drawer";
import { ActionDropdown } from "@/components/shared/action-dropdown";
import { TableDateCell } from "@/components/shared/table-date-cell";
import { TablePagination } from "@/components/shared/table-pagination";
import { useOwnersManager } from "../controllers/use-owners-manager";

export function OwnersTable() {
  const {
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
    setFilter,
    setSearch,
    setPageSize,
    setCurrentPage,
    setIsDrawerOpen,
    handleApplyAdvancedFilters,
    handleResetAdvancedFilters,
    handleDeleteOwner,
  } = useOwnersManager();

  const renderStatusBadge = (status: OwnerStatus) => {
    if (status === "active") {
      return (
        <span className="bg-[#E2F0D9] text-[#2E7D32] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
          <span>نشط</span>
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span className="bg-[#FEF3C7] text-[#D97706] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
          <span>بانتظار المراجعة</span>
        </span>
      );
    }
    return (
      <span className="bg-[#F3F4F6] text-[#6B7280] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" />
        <span>غير نشط</span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search & Tabs Filter Bar */}
      <OwnersFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        searchQuery={search}
        onSearchChange={setSearch}
        counts={counts}
        onOpenAdvancedFilter={() => setIsDrawerOpen(true)}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Advanced Filter Drawer (Opens from LEFT - opposite of the sidebar) */}
      <OwnersAdvancedFilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        filters={advancedFilters}
        onApplyFilters={handleApplyAdvancedFilters}
        onResetFilters={handleResetAdvancedFilters}
        totalResultsCount={totalFiltered}
      />

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-[#E2E6DC] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EEF2E6] text-[#7D8A78] text-[11px] font-semibold bg-[#FAFCF8]/60">
                <th className="py-4 px-4 sm:px-6 text-start">مالك العقار</th>
                <th className="py-4 px-4 sm:px-6 text-center">رقم الجوال</th>
                <th className="py-4 px-4 sm:px-6 text-center">عدد العقارات</th>
                <th className="py-4 px-4 sm:px-6 text-center">عدد الوحدات</th>
                <th className="py-4 px-4 sm:px-6 text-center">تاريخ التسجيل</th>
                <th className="py-4 px-4 sm:px-6 text-center">الحالة</th>
                <th className="py-4 px-4 sm:px-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF2E6]">
              {paginatedOwners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#7D8A78]">
                    لا توجد نتائج تطابق معايير البحث
                  </td>
                </tr>
              ) : (
                paginatedOwners.map((owner) => (
                  <tr
                    key={owner.id}
                    className="hover:bg-[#F9FAF7] transition-colors group"
                  >
                    {/* Owner Name & Avatar */}
                    <td className="py-4 px-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#E2E6DC] text-[#34432E] font-bold text-xs flex items-center justify-center shrink-0">
                          {owner.initials}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-[#172115]">
                            {owner.name}
                          </div>
                          <div className="text-[11px] text-[#7D8A78]">
                            {owner.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-4 sm:px-6 text-center font-medium text-[#2C3825] font-mono text-[11px]">
                      <span dir="ltr" className="inline-block">{owner.phone}</span>
                    </td>

                    {/* Properties Count */}
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <span className="font-bold text-[#172115]">
                        {owner.propertiesCount}
                      </span>{" "}
                      <span className="text-[#7D8A78]">عقارات</span>
                    </td>

                    {/* Units Count */}
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <span className="font-bold text-[#172115]">
                        {owner.unitsCount}
                      </span>{" "}
                      <span className="text-[#7D8A78]">وحدة</span>
                    </td>

                    {/* Registration Date */}
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <TableDateCell
                        date={owner.registrationDate}
                        relativeTime={owner.relativeTime}
                      />
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex justify-center">
                        {renderStatusBadge(owner.status)}
                      </div>
                    </td>

                    {/* Actions Menu */}
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <ActionDropdown
                        items={[
                          {
                            label: "عرض ملف المالك",
                            icon: Eye,
                            href: `/dashboard/owners/${owner.id}`,
                          },
                          {
                            label: "تعديل بيانات المالك",
                            icon: SlidersHorizontal,
                            onClick: () =>
                              toast.info(`تعديل بيانات المالك: ${owner.name}`),
                          },
                          {
                            label: "سجل العقارات والمحفظة",
                            icon: Building2,
                            href: `/dashboard/owners/${owner.id}`,
                          },
                          {
                            label: "تعطيل حساب المالك",
                            icon: Trash2,
                            variant: "destructive",
                            onClick: () =>
                              toast.error(`تم تعطيل حساب: ${owner.name}`),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <TablePagination
          currentPage={activePage}
          totalPages={totalPages}
          totalCount={totalHeadlineCount}
          fromIndex={fromIndex}
          toIndex={toIndex}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => setPageSize(size)}
          entityName="مالك"
          pluralEntityName="ملاك"
          registeredLabel="مسجل"
        />
      </div>
    </div>
  );
}
