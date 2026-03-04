"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceRecorderProps {
  onSend: (file: File) => Promise<void>;
  onCancel: () => void;
  isUploading?: boolean;
}

export function VoiceRecorder({
  onSend,
  onCancel,
  isUploading,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startRecording();
    return () => stopRecording();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([audioBlob], `voice-msg-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        // We handle sending in the finish handler
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording:", err);
      onCancel();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleFinish = async () => {
    stopRecording();
    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
    const file = new File([audioBlob], `voice-msg-${Date.now()}.webm`, {
      type: "audio/webm",
    });
    await onSend(file);
  };

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center gap-4 bg-slate-900 border border-indigo-500/30 rounded-full px-6 py-2 shadow-2xl shadow-indigo-500/20"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-30" />
        </div>
        <span className="text-sm font-bold text-white font-mono tabular-nums">
          {formatDuration(duration)}
        </span>
      </div>

      <div className="flex-1 h-8 flex items-center gap-0.5">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: isRecording ? [8, 24, 12, 20, 8][(i + duration) % 5] : 8,
            }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="w-1 bg-indigo-500/50 rounded-full"
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onCancel}
          className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all active:scale-90"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <button
          onClick={handleFinish}
          disabled={isUploading}
          className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-600/20 transition-all active:scale-90 disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
