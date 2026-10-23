"use client";

import { WhatsAppHeroBar } from "./whatsapp-hero-bar";
import { WhatsAppFilterBar } from "./whatsapp-filter-bar";
import { ConversationList } from "./conversation-list";
import { ActiveChatHeader } from "./active-chat-header";
import { ChatFeed } from "./chat-feed";
import { ChatActionShortcuts } from "./chat-action-shortcuts";
import { ChatComposer } from "./chat-composer";
import { useWhatsAppChatManager } from "../controllers/use-whatsapp-chat-manager";

export function WhatsAppStaffChatView() {
  const {
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
  } = useWhatsAppChatManager();

  const handleOpenLocation = () => {
    window.open("https://maps.google.com/?q=24.8015,46.6542", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-4 max-w-[1536px] w-full mx-auto pb-6" dir="rtl">
      {/* 1. Top Hero Greeting Bar */}
      <WhatsAppHeroBar />

      {/* 2. Filters & Property Selector Bar */}
      <WhatsAppFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedProperty={selectedProperty}
        onPropertyChange={setSelectedProperty}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* 3. Main Two-Column Inbox Container (exact 945px height in Figma) */}
      <div className="bg-white rounded-[16px] border border-[#E2E6DC]/80 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col lg:flex-row h-[860px] lg:h-[945px]">
        {/* Column 1: Conversations List Panel (360px wide, right in RTL) */}
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversationId}
          onSelect={setSelectedConversationId}
        />

        {/* Column 2: Active Conversation & Automated Workflow Desk */}
        <div className="flex-1 flex flex-col h-full bg-[#F6FBF1] min-w-0">
          {/* Active Chat Header */}
          <ActiveChatHeader conversation={currentConversation} />

          {/* Chat Feed */}
          <ChatFeed
            messages={currentMessages}
            taskStatus={taskStatus}
            onAcceptTask={handleAcceptTask}
          />

          {/* Horizontal Action Shortcuts Bar */}
          <ChatActionShortcuts
            taskStatus={taskStatus}
            photoCount={photoCount}
            onAcceptTask={handleAcceptTask}
            onStartCleaning={handleStartCleaning}
            onUploadPhotos={handleUploadPhotos}
            onCompleteTask={handleCompleteTask}
            onOpenLocation={handleOpenLocation}
          />

          {/* Bottom Messaging Composer */}
          <ChatComposer
            workerName={currentConversation.name.split("—")[0].trim()}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}
