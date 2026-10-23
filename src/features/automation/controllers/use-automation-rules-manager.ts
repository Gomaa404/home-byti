"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { AutomationRule } from "../types";
import { initialAutomationRules } from "../data/mock-automation";

export function useAutomationRulesManager(
  initialRules: AutomationRule[] = initialAutomationRules
) {
  const [rules, setRules] = useState<AutomationRule[]>(initialRules);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused">(
    "all"
  );
  const [isEmptyPreview, setIsEmptyPreview] = useState(false);

  // Modals state
  const [activeRuleForModal, setActiveRuleForModal] =
    useState<AutomationRule | null>(null);
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      if (statusFilter === "active" && rule.status !== "active") return false;
      if (statusFilter === "paused" && rule.status !== "paused") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          rule.title.toLowerCase().includes(q) ||
          rule.ruleCode.toLowerCase().includes(q) ||
          rule.triggerLabel.toLowerCase().includes(q) ||
          rule.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [rules, statusFilter, searchQuery]);

  const handleExport = () => {
    toast.success("جاري تصدير قائمة قواعد الأتمتة...");
  };

  const handleToggleStatus = (rule: AutomationRule) => {
    setActiveRuleForModal(rule);
    if (rule.status === "active") {
      setIsPauseOpen(true);
    } else {
      setIsActivateOpen(true);
    }
  };

  const handleDeleteRule = (rule: AutomationRule) => {
    setActiveRuleForModal(rule);
    setIsDeleteOpen(true);
  };

  const confirmPause = () => {
    if (activeRuleForModal) {
      setRules((prev) =>
        prev.map((r) =>
          r.id === activeRuleForModal.id ? { ...r, status: "paused" } : r
        )
      );
      toast.success(`تم إيقاف القاعدة: ${activeRuleForModal.title}`);
    }
  };

  const confirmActivate = () => {
    if (activeRuleForModal) {
      setRules((prev) =>
        prev.map((r) =>
          r.id === activeRuleForModal.id ? { ...r, status: "active" } : r
        )
      );
      toast.success(`تم تفعيل القاعدة: ${activeRuleForModal.title}`);
    }
  };

  const confirmDelete = () => {
    if (activeRuleForModal) {
      setRules((prev) => prev.filter((r) => r.id !== activeRuleForModal.id));
      toast.success(`تم حذف القاعدة: ${activeRuleForModal.title}`);
    }
  };

  return {
    rules,
    searchQuery,
    statusFilter,
    isEmptyPreview,
    activeRuleForModal,
    isPauseOpen,
    isActivateOpen,
    isDeleteOpen,
    openDropdownId,
    filteredRules,
    setSearchQuery,
    setStatusFilter,
    setIsEmptyPreview,
    setOpenDropdownId,
    setIsPauseOpen,
    setIsActivateOpen,
    setIsDeleteOpen,
    handleExport,
    handleToggleStatus,
    handleDeleteRule,
    confirmPause,
    confirmActivate,
    confirmDelete,
  };
}
