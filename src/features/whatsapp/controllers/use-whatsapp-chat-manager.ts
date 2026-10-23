"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  WhatsAppConversationItem,
  WhatsAppChatMessage,
  WhatsAppTopFilter,
  TaskDetails,
} from "../types";
import {
  defaultConversations,
  defaultChatMessages,
} from "../data/mock-whatsapp-conversations";

export function useWhatsAppChatManager(
  initialConversations: WhatsAppConversationItem[] = defaultConversations,
  initialMessages: Record<string, WhatsAppChatMessage[]> = defaultChatMessages
) {
  const [conversations] = useState<WhatsAppConversationItem[]>(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState("conv-1");
  const [chatMessages, setChatMessages] =
    useState<Record<string, WhatsAppChatMessage[]>>(initialMessages);

  // Operational task state
  const [taskStatus, setTaskStatus] = useState<TaskDetails["status"]>("pending");
  const [photoCount, setPhotoCount] = useState<number>(0);

  // Top filter bar state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [activeFilter, setActiveFilter] = useState<WhatsAppTopFilter>("all");

  const currentConversation =
    conversations.find((c) => c.id === selectedConversationId) || conversations[0];

  const currentMessages = chatMessages[selectedConversationId] || [];

  const handleSendMessage = (text: string) => {
    const timeFormatted = new Intl.DateTimeFormat("ar-SA", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date());

    const newMessage: WhatsAppChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "agent",
      type: "text",
      time: timeFormatted,
      content: text,
      status: "delivered",
    };

    setChatMessages((prev) => ({
      ...prev,
      [selectedConversationId]: [
        ...(prev[selectedConversationId] || []),
        newMessage,
      ],
    }));

    toast.success("تم إرسال الرسالة عبر WhatsApp Business API", {
      description: `تم التسليم إلى: ${currentConversation.name}`,
    });
  };

  const handleAcceptTask = () => {
    if (taskStatus !== "pending") return;
    setTaskStatus("accepted");

    const timeFormatted = new Intl.DateTimeFormat("ar-SA", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date());

    const sysMessage: WhatsAppChatMessage = {
      id: `msg-accept-${Date.now()}`,
      sender: "system",
      type: "system_notice",
      time: timeFormatted,
      content: "تم استلام المهمة CLN-2048 بنجاح — كود الدخول الذكي للباب هو: 583921",
    };

    setChatMessages((prev) => ({
      ...prev,
      [selectedConversationId]: [
        ...(prev[selectedConversationId] || []),
        sysMessage,
      ],
    }));

    toast.success("تم استلام المهمة (CLN-2048) بنجاح!", {
      description: "تم حجز المهمة وتفعيل كود الباب الذكي (583921) للوحدة 204.",
    });
  };

  const handleStartCleaning = () => {
    if (taskStatus !== "accepted") return;
    setTaskStatus("in_progress");

    toast.info("تم بدء التنظيف الفندقي للوحدة 204", {
      description: "تم تشغيل عداد الوقت التشغيلي وإبلاغ المشرف الميداني بالبدء.",
    });
  };

  const handleUploadPhotos = () => {
    const nextCount = Math.min(photoCount + 1, 4);
    setPhotoCount(nextCount);

    if (nextCount < 4) {
      toast.info(`تم رفع صورة المعاينة (${nextCount}/4)`, {
        description: "تم الحفظ في سجل الجودة التشغيلي للوحدة 204.",
      });
    } else {
      toast.success("اكتمل رفع كافة صور المعاينة (4/4)!", {
        description: "تم اعتماد مطابقة بروتوكول النظافة الفندقي الشامل.",
      });
    }
  };

  const handleCompleteTask = () => {
    setTaskStatus("completed");

    const timeFormatted = new Intl.DateTimeFormat("ar-SA", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date());

    const completeMsg: WhatsAppChatMessage = {
      id: `msg-done-${Date.now()}`,
      sender: "system",
      type: "system_notice",
      time: timeFormatted,
      content:
        "تم إنهاء مهمة التنظيف (CLN-2048) بالكامل — جاهزية الوحدة 204 معتمدة لاستقبال النزيل القادم",
    };

    setChatMessages((prev) => ({
      ...prev,
      [selectedConversationId]: [
        ...(prev[selectedConversationId] || []),
        completeMsg,
      ],
    }));

    toast.success("تم تأكيد إنجاز المهمة (CLN-2048) بنجاح!", {
      description: "تم تغيير حالة الوحدة 204 إلى (جاهزة للاستلام) وتوثيق تقرير النظافة.",
    });
  };

  return {
    conversations,
    selectedConversationId,
    currentConversation,
    currentMessages,
    taskStatus,
    photoCount,
    searchQuery,
    selectedProperty,
    activeFilter,
    setSelectedConversationId,
    setSearchQuery,
    setSelectedProperty,
    setActiveFilter,
    handleSendMessage,
    handleAcceptTask,
    handleStartCleaning,
    handleUploadPhotos,
    handleCompleteTask,
  };
}
