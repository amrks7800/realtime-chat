"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRooms, ChatSDK } from "@chatter/sdk";
import { Room } from "@repo/types";
import {
  Search,
  MessageSquare,
  Users,
  LogOut,
  Plus,
  Hash,
  Bell,
  Search as SearchIcon,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserSearch } from "./user-search";
import { InvitationsList } from "./invitations-list";
import { CreateGroupModal } from "./create-group-modal";
import { useQuery } from "@tanstack/react-query";

interface SidebarProps {
  sdk: ChatSDK;
  activeRoomId?: string;
  onRoomSelect: (roomId: string) => void;
  view: SidebarView;
  onViewChange: (view: SidebarView) => void;
  isGroupModalOpen: boolean;
  onGroupModalChange: (open: boolean) => void;
}

export type SidebarView = "rooms" | "search" | "invitations";

export function Sidebar({
  sdk,
  activeRoomId,
  onRoomSelect,
  view,
  onViewChange,
  isGroupModalOpen,
  onGroupModalChange,
}: SidebarProps) {
  const { data: session } = useSession();
  const { data: rooms, isLoading } = useRooms(sdk, session?.user.id || "");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: invitations } = useQuery({
    queryKey: ["invitations", "my"],
    queryFn: () => sdk.http.getMyInvitations(),
    refetchInterval: 10000,
  });

  const [tab, setTab] = useState<"messages" | "channels">("messages");

  const filteredRooms = rooms?.filter((room) => {
    const matchesSearch = room.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      tab === "messages" ? room.type === "private" : room.type === "group";
    return matchesSearch && matchesTab;
  });

  return (
    <div className="w-80 h-full flex flex-col bg-slate-950/40 backdrop-blur-3xl border-r border-white/5 relative z-20">
      <AnimatePresence mode="wait">
        {view === "rooms" ? (
          <motion.div
            key="rooms"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-6 pb-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <span className="text-white font-black text-xl tracking-tighter italic">
                      A
                    </span>
                  </div>
                  <h1 className="text-xl font-black text-white tracking-tighter">
                    Aura
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewChange("invitations")}
                    className="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/5 group active:scale-95"
                  >
                    <Bell className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    {invitations && invitations.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-[#030712] animate-bounce">
                        {invitations.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => onViewChange("search")}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/5 group active:scale-95 text-slate-400 hover:text-white"
                  >
                    <SearchIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onGroupModalChange(true)}
                    className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center transition-all shadow-lg shadow-indigo-600/20 group active:scale-95 text-white"
                  >
                    <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                  </button>
                </div>
              </div>

              <CreateGroupModal
                sdk={sdk}
                open={isGroupModalOpen}
                onOpenChange={onGroupModalChange}
              />

              {/* Search */}
              <div className="relative group mb-4">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex px-6 items-center gap-6 mb-2 border-b border-white/5 relative">
              <button
                onClick={() => setTab("messages")}
                className={cn(
                  "pb-3 text-sm font-bold transition-all relative",
                  tab === "messages"
                    ? "text-white"
                    : "text-slate-500 hover:text-white",
                )}
              >
                Messages
                {tab === "messages" && (
                  <motion.div
                    layoutId="sidebar-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                  />
                )}
              </button>
              <button
                onClick={() => setTab("channels")}
                className={cn(
                  "pb-3 text-sm font-bold transition-all relative",
                  tab === "channels"
                    ? "text-white"
                    : "text-slate-500 hover:text-white",
                )}
              >
                Channels
                {tab === "channels" && (
                  <motion.div
                    layoutId="sidebar-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                  />
                )}
              </button>
            </div>

            {/* Room List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
              {isLoading ? (
                <div className="space-y-4 p-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 animate-pulse"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white/5" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-24 bg-white/5 rounded" />
                        <div className="h-2 w-32 bg-white/5 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredRooms?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                  <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-4 transition-transform hover:scale-110">
                    <MessageSquare className="w-6 h-6 text-slate-700" />
                  </div>
                  <p className="text-slate-500 text-sm font-black uppercase tracking-tighter">
                    No {tab} found
                  </p>
                  <p className="text-[10px] text-slate-600 font-bold mt-1 uppercase tracking-widest leading-relaxed">
                    Start a new conversation <br /> using the buttons above
                  </p>
                </div>
              ) : (
                filteredRooms?.map((room) => (
                  <RoomItem
                    key={room.id}
                    room={room}
                    isActive={activeRoomId === room.id}
                    onClick={() => onRoomSelect(room.id)}
                    currentUserId={session?.user.id}
                  />
                ))
              )}
            </div>
          </motion.div>
        ) : view === "search" ? (
          <motion.div
            key="search"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full"
          >
            <div className="p-4 flex items-center gap-4 border-b border-white/5">
              <button
                onClick={() => onViewChange("rooms")}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">
                Add New Chat
              </h3>
            </div>
            <div className="flex-1 overflow-hidden">
              <UserSearch sdk={sdk} onClose={() => onViewChange("rooms")} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="invitations"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full"
          >
            <div className="p-4 flex items-center gap-4 border-b border-white/5">
              <button
                onClick={() => onViewChange("rooms")}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">
                Pending Requests
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
              <InvitationsList sdk={sdk} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Footer */}
      <div className="p-4 bg-slate-900/30 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-all group">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-black text-white shadow-lg">
              {session?.user.name?.[0].toUpperCase()}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#020617] rounded-full shadow-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {session?.user.name}
            </p>
            <p className="text-xs text-slate-500 truncate font-medium">
              @{session?.user.email?.split("@")[0]}
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="p-2 text-slate-500 hover:text-red-500 transition-colors group-hover:bg-white/5 rounded-xl"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function RoomItem({
  room,
  isActive,
  onClick,
  currentUserId,
}: {
  room: Room;
  isActive: boolean;
  onClick: () => void;
  currentUserId?: string;
}) {
  const otherUser =
    room.type === "private"
      ? room.participants?.find((p: any) => {
          const pId =
            typeof p.userId === "object"
              ? p.userId.id || p.userId._id
              : p.userId;
          return pId !== currentUserId;
        })?.userId
      : null;

  const displayName =
    room.type === "private" && otherUser ? otherUser.name : room.name;
  const displayImage =
    room.type === "private" && otherUser ? otherUser.image : room.image;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-2xl transition-all relative group active:scale-[0.98]",
        isActive
          ? "bg-linear-to-r from-indigo-600/20 to-indigo-600/5 border border-indigo-500/20"
          : "hover:bg-white/5 border border-transparent",
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shadow-lg overflow-hidden transition-transform group-hover:scale-105",
            room.type === "group"
              ? "bg-slate-800"
              : "bg-linear-to-tr from-slate-800 to-slate-700",
          )}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : room.type === "group" ? (
            <Hash className="w-5 h-5 text-indigo-400" />
          ) : (
            <span className="text-slate-400">{displayName[0]}</span>
          )}
        </div>
      </div>

      <div className="flex-1 text-left min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <p
            className={cn(
              "text-sm font-bold truncate",
              isActive ? "text-white" : "text-slate-200",
            )}
          >
            {displayName}
          </p>
        </div>
        <p className="text-xs text-slate-500 truncate font-medium flex items-center gap-1.5">
          {room.lastMessage || "No messages yet"}
        </p>
      </div>

      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.5)]"
        />
      )}
    </button>
  );
}
