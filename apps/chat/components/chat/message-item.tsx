"use client";

import { Message } from "@repo/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CheckCheck, Play, Pause } from "lucide-react";
import { useState, useRef } from "react";

interface MessageItemProps {
  message: Message;
  isMe: boolean;
  showAvatar?: boolean;
}

export function MessageItem({ message, isMe, showAvatar }: MessageItemProps) {
  const sender = typeof message.userId === "object" ? message.userId : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full group",
        isMe ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "flex max-w-[80%] md:max-w-[70%] gap-3",
          isMe ? "flex-row-reverse" : "flex-row",
        )}
      >
        {/* Avatar */}
        <div className="flex flex-col justify-end pb-1">
          {showAvatar ? (
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-xs font-black text-slate-300 shadow-lg border border-white/5 overflow-hidden">
              {sender?.image ? (
                <img
                  src={sender.image}
                  alt={sender.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                (sender?.name?.[0] || "U").toUpperCase()
              )}
            </div>
          ) : (
            <div className="w-8" />
          )}
        </div>

        {/* Bubble Content */}
        <div className="flex flex-col gap-1">
          {!isMe && showAvatar && (
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
              {sender?.name || "User"}
            </span>
          )}

          <div
            className={cn(
              "relative p-4 rounded-3xl shadow-xl",
              isMe
                ? "bg-linear-to-tr from-indigo-600 to-indigo-500 text-white rounded-br-none"
                : "bg-white/5 backdrop-blur-xl border border-white/5 text-slate-200 rounded-bl-none",
            )}
          >
            <div className="space-y-2">
              <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap wrap-break-word">
                {message.content}
              </p>

              {/* Attachments (e.g. Audio) */}
              {message.attachments?.map((attachment, i) => (
                <div key={i} className="mt-2">
                  {attachment.type === "audio" ? (
                    <AudioPlayer url={attachment.url} isMe={isMe} />
                  ) : attachment.type === "image" ? (
                    <img
                      src={attachment.url}
                      alt="attachment"
                      className="rounded-2xl max-w-full border border-white/10"
                    />
                  ) : null}
                </div>
              ))}
            </div>

            {/* Meta */}
            <div
              className={cn(
                "flex items-center gap-1.5 mt-2",
                isMe ? "justify-end" : "justify-start",
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-tighter",
                  isMe ? "text-indigo-200/50" : "text-slate-500",
                )}
              >
                {format(new Date(message.createdAt), "HH:mm")}
              </span>
              {isMe && (
                <div className="text-indigo-200/50">
                  <CheckCheck className="w-3 h-3" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AudioPlayer({ url, isMe }: { url: string; isMe: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl min-w-[200px]",
        isMe ? "bg-white/10" : "bg-black/20",
      )}
    >
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      <button
        onClick={togglePlay}
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90",
          isMe ? "bg-white text-indigo-600" : "bg-indigo-600 text-white",
        )}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      <div className="flex-1 space-y-1.5">
        <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full", isMe ? "bg-white" : "bg-indigo-500")}
            initial={false}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-50">
          <span>0:00</span>
          <span>Voice Msg</span>
        </div>
      </div>
    </div>
  );
}
