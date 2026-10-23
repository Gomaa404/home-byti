"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  MainBookingItem,
  BookingStatus,
  MainBookingFilterState,
  initialBookingFilterState,
} from "../types";
import { defaultMainBookings } from "../data/mock-main-bookings";

export function useBookingsManager(
  initialBookings: MainBookingItem[] = defaultMainBookings
) {
  const [bookings, setBookings] = useState<MainBookingItem[]>(initialBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | BookingStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Advanced Filter Drawer State
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [bookingFilters, setBookingFilters] =
    useState<MainBookingFilterState>(initialBookingFilterState);

  // Modals state
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isChangeUnitModalOpen, setIsChangeUnitModalOpen] = useState(false);
  const [selectedBookingCode, setSelectedBookingCode] =
    useState<string>("BK-10482");

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (bookingFilters.status !== "all") count++;
    if (bookingFilters.source !== "all") count++;
    if (bookingFilters.propertyName !== "all") count++;
    if (bookingFilters.unitType !== "all") count++;
    if (bookingFilters.paymentStatus !== "all") count++;
    if (bookingFilters.amountRange !== "all") count++;
    if (bookingFilters.stayDuration !== "all") count++;
    if (bookingFilters.sortBy !== "default") count++;
    return count;
  }, [bookingFilters]);

  const statusCounts = useMemo(() => {
    return {
      all: bookings.length,
      upcoming: bookings.filter((b) => b.status === "upcoming").length,
      active: bookings.filter((b) => b.status === "active").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    let list = bookings;

    // Status tab filter
    if (filterStatus !== "all") {
      list = list.filter((b) => b.status === filterStatus);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.bookingCode.toLowerCase().includes(q) ||
          b.guest.name.toLowerCase().includes(q) ||
          b.guest.phone.toLowerCase().includes(q) ||
          b.propertyName.toLowerCase().includes(q) ||
          b.unit.unitNumber.toLowerCase().includes(q) ||
          b.unit.unitType.toLowerCase().includes(q) ||
          b.source.toLowerCase().includes(q)
      );
    }

    // Advanced Drawer filters
    if (bookingFilters.status !== "all") {
      list = list.filter((b) => b.status === bookingFilters.status);
    }

    if (bookingFilters.source !== "all") {
      list = list.filter((b) =>
        b.source.toLowerCase().includes(bookingFilters.source.toLowerCase())
      );
    }

    if (bookingFilters.propertyName !== "all") {
      list = list.filter((b) =>
        b.propertyName.includes(bookingFilters.propertyName)
      );
    }

    if (bookingFilters.unitType !== "all") {
      list = list.filter((b) =>
        b.unit.unitType.includes(bookingFilters.unitType)
      );
    }

    if (bookingFilters.paymentStatus !== "all") {
      list = list.filter((b) =>
        b.amount.paymentStatus.includes(bookingFilters.paymentStatus)
      );
    }

    if (bookingFilters.amountRange !== "all") {
      list = list.filter((b) => {
        const num = parseFloat(b.amount.total.replace(/[^0-9.]/g, "")) || 0;
        if (bookingFilters.amountRange === "less1000") return num < 1000;
        if (bookingFilters.amountRange === "1000-3000")
          return num >= 1000 && num <= 3000;
        if (bookingFilters.amountRange === "more3000") return num > 3000;
        return true;
      });
    }

    if (bookingFilters.stayDuration !== "all") {
      list = list.filter((b) => {
        const nights = parseInt(b.checkOut.nights.replace(/[^0-9]/g, "")) || 1;
        if (bookingFilters.stayDuration === "1-2") return nights <= 2;
        if (bookingFilters.stayDuration === "3-7")
          return nights >= 3 && nights <= 7;
        if (bookingFilters.stayDuration === "more7") return nights > 7;
        return true;
      });
    }

    // Sort
    if (bookingFilters.sortBy === "code_asc") {
      list = [...list].sort((a, b) => a.bookingCode.localeCompare(b.bookingCode));
    } else if (bookingFilters.sortBy === "amount_desc") {
      list = [...list].sort((a, b) => {
        const aNum = parseFloat(a.amount.total.replace(/[^0-9.]/g, "")) || 0;
        const bNum = parseFloat(b.amount.total.replace(/[^0-9.]/g, "")) || 0;
        return bNum - aNum;
      });
    } else if (bookingFilters.sortBy === "amount_asc") {
      list = [...list].sort((a, b) => {
        const aNum = parseFloat(a.amount.total.replace(/[^0-9.]/g, "")) || 0;
        const bNum = parseFloat(b.amount.total.replace(/[^0-9.]/g, "")) || 0;
        return aNum - bNum;
      });
    } else if (bookingFilters.sortBy === "date_asc") {
      list = [...list].sort((a, b) => a.id.localeCompare(b.id));
    } else if (bookingFilters.sortBy === "date_desc") {
      list = [...list].sort((a, b) => b.id.localeCompare(a.id));
    }

    return list;
  }, [bookings, filterStatus, searchQuery, bookingFilters]);

  const totalFiltered = filteredBookings.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / rowsPerPage));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * rowsPerPage;
  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`تم نسخ رقم الحجز (${code})`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const handleExportCSV = () => {
    try {
      const headers = [
        "رقم الحجز",
        "اسم العميل",
        "رقم الهاتف",
        "العقار",
        "الوحدة",
        "تاريخ الوصول",
        "تاريخ المغادرة",
        "المصدر",
        "المبلغ الإجمالي",
        "حالة الحجز",
      ];
      const rows = filteredBookings.map((b) => [
        b.bookingCode,
        b.guest.name,
        b.guest.phone,
        b.propertyName,
        `${b.unit.unitNumber} (${b.unit.unitType})`,
        b.checkIn.date,
        b.checkOut.date,
        b.source,
        b.amount.total,
        b.statusLabel || b.status,
      ]);
      const csvContent =
        "data:text/csv;charset=utf-8,\uFEFF" +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `قائمة_الحجوزات_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("تم تصدير قائمة الحجوزات بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء تصدير القائمة");
    }
  };

  const handleResetFilters = () => {
    setBookingFilters(initialBookingFilterState);
    setCurrentPage(1);
  };

  const openExtendModal = (code: string) => {
    setSelectedBookingCode(code);
    setIsExtendModalOpen(true);
  };

  const openCancelModal = (code: string) => {
    setSelectedBookingCode(code);
    setIsCancelModalOpen(true);
  };

  const openChangeUnitModal = (code: string) => {
    setSelectedBookingCode(code);
    setIsChangeUnitModalOpen(true);
  };

  const handleConfirmExtend = () => {
    setIsExtendModalOpen(false);
    toast.success("تم تقديم طلب تمديد الإقامة بنجاح");
  };

  const handleConfirmChangeUnit = (newUnit: string) => {
    setIsChangeUnitModalOpen(false);
    toast.success(`تم تغيير الوحدة إلى (${newUnit}) بنجاح`);
  };

  const handleConfirmCancel = () => {
    setIsCancelModalOpen(false);
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingCode === selectedBookingCode
          ? { ...b, status: "cancelled", statusLabel: "ملغى" }
          : b
      )
    );
    toast.success("تم إلغاء الحجز بنجاح");
  };

  return {
    bookings,
    searchQuery,
    filterStatus,
    currentPage,
    rowsPerPage,
    copiedCode,
    isFilterDrawerOpen,
    bookingFilters,
    activeFiltersCount,
    isExtendModalOpen,
    isCancelModalOpen,
    isChangeUnitModalOpen,
    selectedBookingCode,
    statusCounts,
    filteredBookings,
    totalFiltered,
    totalPages,
    activePage,
    startIndex,
    paginatedBookings,
    setSearchQuery,
    setFilterStatus,
    setCurrentPage,
    setRowsPerPage,
    setIsFilterDrawerOpen,
    setBookingFilters,
    setIsExtendModalOpen,
    setIsCancelModalOpen,
    setIsChangeUnitModalOpen,
    handleCopyCode,
    handleExportCSV,
    handleResetFilters,
    openExtendModal,
    openCancelModal,
    openChangeUnitModal,
    handleConfirmExtend,
    handleConfirmChangeUnit,
    handleConfirmCancel,
  };
}
