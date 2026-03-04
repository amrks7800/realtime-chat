"use client";

import { EmojiPicker as Frimousse } from "frimousse";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all active:scale-90">
          <Smile className="w-5 h-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="p-0 border-white/5 bg-slate-950/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl w-[320px]"
      >
        <Frimousse.Root onEmojiSelect={(emoji) => onEmojiSelect(emoji.emoji)}>
          <div className="p-3 border-b border-white/5">
            <Frimousse.Search className="w-full bg-white/5 border-none rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-indigo-500/50 outline-hidden" />
          </div>
          <Frimousse.Viewport className="h-[300px] p-2 custom-scrollbar">
            <Frimousse.List />
          </Frimousse.Viewport>
        </Frimousse.Root>
      </PopoverContent>
    </Popover>
  );
}
