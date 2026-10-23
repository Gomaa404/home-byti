"use client";

import { useRouter } from "next/navigation";

interface UnitsEmptyStateProps {
  onRefresh?: () => void;
  onAddUnit?: () => void;
}

export function UnitsEmptyState({ onRefresh, onAddUnit }: UnitsEmptyStateProps) {
  const router = useRouter();

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      router.refresh();
    }
  };

  const handleAdd = () => {
    if (onAddUnit) {
      onAddUnit();
    } else {
      router.push("/units/new/");
    }
  };

  return (
    <div className="bg-white border border-[#E5E8E2] rounded-[20px] shadow-[0px_4px_24px_0px_rgba(48,58,44,0.04)] p-12 sm:p-20 text-center flex flex-col items-center justify-center space-y-6 min-h-[520px] relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute bg-[rgba(234,241,232,0.6)] blur-[32px] -top-24 -start-24 rounded-full w-96 h-96 pointer-events-none" />
      <div className="absolute bg-[rgba(245,241,232,0.7)] blur-[32px] -bottom-24 -end-24 rounded-full w-96 h-96 pointer-events-none" />

      {/* Central Decorative Icon Container */}
      <div className="relative z-10">
        <div className="border border-[#D9E3D5] rounded-[16px] w-24 h-24 flex items-center justify-center p-1 relative shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.05)]" style={{ backgroundImage: "linear-gradient(135deg, rgb(234, 241, 232) 0%, rgb(245, 241, 232) 100%)" }}>
          {/* Door icon */}
          <i className="lucide-icon icon-door-closed w-[30px] h-[30px] text-[#4B5940]" />
        </div>

        {/* Plus Badge on Top-Right Corner */}
        <div className="absolute bg-[#4B5940] border-2 border-white rounded-full w-7 h-7 -top-1.5 -end-1.5 flex items-center justify-center shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)]">
          <i className="lucide-icon icon-plus w-2.5 h-2.5 text-white" />
        </div>
      </div>

      {/* Main Title & Narrative */}
      <div className="space-y-2 max-w-md mx-auto relative z-10">
        <h2 className="text-2xl font-bold text-[#232B20] tracking-tight">
          لا توجد وحدات حتى الآن
        </h2>
        <p className="text-[15px] leading-[24px] text-[#5F6C5B]">
          لم يتم تسجيل أي وحدات على المنصة حتى الآن.
        </p>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4 relative z-10">
        {/* Refresh Button */}
        <button
          type="button"
          onClick={handleRefresh}
          className="bg-[#F7F8F5] border border-[#E5E8E2] text-[#303A2C] text-sm font-semibold h-12 px-6 rounded-[12px] flex items-center gap-2 hover:bg-[#EEF2E6] transition-all cursor-pointer select-none"
        >
          <i className="lucide-icon icon-refresh-cw w-3 h-3 text-[#303A2C]" />
          <span>تحديث الصفحة</span>
        </button>

        {/* Add Unit Button */}
        <button
          type="button"
          onClick={handleAdd}
          className="bg-[#4B5940] hover:bg-[#3D4C35] text-white text-sm font-bold h-12 px-8 rounded-[12px] flex items-center gap-2 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] transition-all cursor-pointer select-none"
        >
          <i className="lucide-icon icon-plus w-3 h-3 text-white" />
          <span>إضافة وحدة</span>
        </button>
      </div>
    </div>
  );
}
