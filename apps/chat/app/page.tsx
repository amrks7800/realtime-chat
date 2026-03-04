"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useChat, ChatSDK } from "@chatter/sdk";
import { Sidebar, SidebarView } from "@/components/chat/sidebar";
import { ChatWindow } from "@/components/chat/chat-window";
import { CreateGroupModal } from "@/components/chat/create-group-modal";
import { Loader2, Zap, MessageSquare, Plus, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [activeRoomId, setActiveRoomId] = useState<string | undefined>();
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [view, setView] = useState<SidebarView>("rooms");

  // Initialize Chat SDK
  const sdk = useChat(
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
    session?.session.token || "",
  );

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-6 h-6 text-indigo-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="h-screen bg-[#020617] text-white flex overflow-hidden selection:bg-indigo-500/30">
      <CreateGroupModal
        sdk={sdk}
        open={isGroupModalOpen}
        onOpenChange={setIsGroupModalOpen}
      />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="flex-1 flex relative z-10 w-full">
        <Sidebar
          sdk={sdk}
          activeRoomId={activeRoomId}
          onRoomSelect={(roomId) => {
            setActiveRoomId(roomId);
            setView("rooms"); // Always switch to rooms view when a room is selected
          }}
          view={view}
          onViewChange={setView}
          isGroupModalOpen={isGroupModalOpen}
          onGroupModalChange={setIsGroupModalOpen}
        />

        <main className="flex-1 h-full flex flex-col relative bg-slate-900/10">
          <AnimatePresence mode="wait">
            {!activeRoomId ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-linear-to-tr from-indigo-500/20 to-purple-500/10 rounded-[3rem] blur-2xl absolute inset-0 animate-pulse" />
                  <div className="w-24 h-24 bg-slate-800/50 backdrop-blur-xl border border-white/5 rounded-[2rem] flex items-center justify-center relative">
                    <MessageSquare className="w-10 h-10 text-indigo-400" />
                  </div>
                </div>
                <h2 className="text-3xl font-black text-white mb-3 tracking-tighter">
                  Select a Conversation
                </h2>
                <p className="text-slate-400 font-medium max-w-sm leading-relaxed">
                  Choose a room from the sidebar to start chatting or create a
                  new group to connect with friends.
                </p>

                <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-md">
                  <button
                    onClick={() => setView("search")}
                    className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-left group active:scale-95"
                  >
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-indigo-500 group-hover:text-white transition-all text-indigo-400">
                      <Plus className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-white">New Room</p>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tighter">
                      Find People
                    </p>
                  </button>
                  <button
                    onClick={() => setIsGroupModalOpen(true)}
                    className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-left group active:scale-95"
                  >
                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-500 group-hover:text-white transition-all text-purple-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-white">Create Group</p>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tighter">
                      Multiple Members
                    </p>
                  </button>
                </div>
              </motion.div>
            ) : (
              <ChatWindow
                key={activeRoomId}
                sdk={sdk}
                roomId={activeRoomId}
                onBack={() => setActiveRoomId(undefined)}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
