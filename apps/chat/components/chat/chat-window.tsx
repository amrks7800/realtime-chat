"use client";

import { useSession } from "@/lib/auth-client";
import { ChatSDK, useMessages, useSendMessage, useUpload } from "@chatter/sdk";
import { useQuery } from "@tanstack/react-query";
import { Message } from "@repo/types";
import {
  Send,
  Paperclip,
  Mic,
  Phone,
  Video,
  Info,
  Loader2,
  ChevronLeft,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MessageItem } from "./message-item";
import { VoiceRecorder } from "./voice-recorder";
import { EmojiPicker } from "./emoji-picker";

interface ChatWindowProps {
  sdk: ChatSDK;
  roomId: string;
  onBack?: () => void;
}

export function ChatWindow({ sdk, roomId, onBack }: ChatWindowProps) {
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { data: session } = useSession();
  const { data: roomData, isLoading: isLoadingRoom } = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => sdk.http.getRoom(roomId),
    enabled: !!roomId,
  });

  const { data: messages, isLoading } = useMessages(sdk, roomId);
  const sendMessageMutation = useSendMessage(sdk);
  const uploadMutation = useUpload(sdk);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      await sendMessageMutation.mutateAsync({
        roomId,
        content: content.trim(),
      });
      setContent("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const room = roomData?.room;

  const handleVoiceSend = async (file: File) => {
    try {
      const uploadResult = await uploadMutation.mutateAsync(file);
      await sendMessageMutation.mutateAsync({
        roomId,
        content: "Voice Message",
        attachments: [
          {
            type: "audio",
            url: uploadResult.url,
          },
        ],
      });
      setIsRecording(false);
    } catch (error) {
      console.error("Failed to send voice message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900/10 relative overflow-hidden">
      {/* Header */}
      <header className="h-20 px-6 flex items-center justify-between bg-slate-950/40 backdrop-blur-3xl border-b border-white/5 relative z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg overflow-hidden">
              {room?.type === "private" ? (
                (() => {
                  const otherUser = room?.participants?.find((p: any) => {
                    const pId =
                      typeof p.userId === "object"
                        ? p.userId.id || p.userId._id
                        : p.userId;
                    return pId !== session?.user.id;
                  })?.userId;
                  return otherUser?.image ? (
                    <img
                      src={otherUser.image}
                      className="w-full h-full object-cover"
                      alt={otherUser.name}
                    />
                  ) : (
                    otherUser?.name?.[0]?.toUpperCase() || "U"
                  );
                })()
              ) : room?.image ? (
                <img src={room.image} className="w-full h-full object-cover" alt={room.name} />
              ) : (
                room?.name?.[0]?.toUpperCase() || "R"
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#020617] rounded-full" />
          </div>

          <div>
            <h3 className="text-base font-black text-white leading-tight">
              {isLoadingRoom
                ? "Loading..."
                : room?.type === "private"
                  ? room?.participants?.find((p: any) => {
                      const pId =
                        typeof p.userId === "object"
                          ? p.userId.id || p.userId._id
                          : p.userId;
                      return pId !== session?.user.id;
                    })?.userId?.name || room.name
                  : room?.name || "Private Room"}
            </h3>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              {room?.type === "group"
                ? `${room?.participants?.length || 0} Members`
                : "Online"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-95">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-95">
            <Video className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-white/5 mx-2" />
          <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-95">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      {room ? (
        <>
          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-6 py-8 space-y-8 custom-scrollbar relative z-0"
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                  Hydrating conversation...
                </p>
              </div>
            ) : messages?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-6">
                  <span className="text-4xl">👋</span>
                </div>
                <h4 className="text-xl font-black text-white mb-2">
                  Start the Conversation
                </h4>
                <p className="text-slate-500 font-medium max-w-xs">
                  Send your first message to kick off the chat in this room.
                </p>
              </div>
            ) : (
              messages?.map((msg, idx) => {
                const msgUserId =
                  typeof msg.userId === "object"
                    ? msg.userId.id || msg.userId._id
                    : msg.userId;
                const prevMsgUserId =
                  idx > 0
                    ? typeof messages[idx - 1].userId === "object"
                      ? (messages[idx - 1].userId as any).id ||
                        (messages[idx - 1].userId as any)._id
                      : messages[idx - 1].userId
                    : null;

                return (
                  <MessageItem
                    key={msg.id || msg._id}
                    message={msg}
                    isMe={msgUserId === session?.user.id}
                    showAvatar={idx === 0 || prevMsgUserId !== msgUserId}
                  />
                );
              })
            )}
          </div>

          {/* Input Area */}
          <footer className="p-6 pt-0 relative z-10">
            <AnimatePresence mode="wait">
              {isRecording ? (
                <div className="flex justify-center mb-4">
                  <VoiceRecorder
                    onSend={handleVoiceSend}
                    onCancel={() => setIsRecording(false)}
                    isUploading={uploadMutation.isPending}
                  />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-slate-950/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-2 flex items-end gap-2 shadow-2xl"
                >
                  <div className="flex items-center gap-1 pl-2 mb-1">
                    <button className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all active:scale-90">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <EmojiPicker
                      onEmojiSelect={(emoji) =>
                        setContent((prev) => prev + emoji)
                      }
                    />
                  </div>

                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-600 py-3.5 px-2 resize-none max-h-40 font-medium leading-relaxed"
                    style={{ height: "auto" }}
                  />

                  <div className="flex items-center gap-2 pr-2 mb-1.5">
                    <AnimatePresence mode="wait">
                      {!content.trim() ? (
                        <motion.button
                          key="mic"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => setIsRecording(true)}
                          className="p-3 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all active:scale-90"
                        >
                          <Mic className="w-5 h-5" />
                        </motion.button>
                      ) : (
                        <motion.button
                          key="send"
                          initial={{ opacity: 0, scale: 0.8, x: 10 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.8, x: 10 }}
                          onClick={handleSend}
                          disabled={sendMessageMutation.isPending}
                          className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-90 disabled:opacity-50"
                        >
                          {sendMessageMutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </footer>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-4">
            Decrypting Room...
          </p>
        </div>
      )}
    </div>
  );
}
