"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { ChatSDK } from "@chatter/sdk";
import { User } from "@repo/types";
import { useState } from "react";
import { Search, UserPlus, Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface UserSearchProps {
  sdk: ChatSDK;
  onClose?: () => void;
}

export function UserSearch({ sdk, onClose }: UserSearchProps) {
  const [search, setSearch] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", "search", search],
    queryFn: () => sdk.http.searchUsers(search),
    enabled: search.length > 2,
  });

  const inviteMutation = useMutation({
    mutationFn: (userId: string) =>
      sdk.http.sendInvitation({ receiverId: userId, type: "direct" }),
  });

  return (
    <div className="flex flex-col h-full bg-slate-950/90 backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-black text-white uppercase tracking-widest">
          Find People
        </h3>
        <button
          onClick={onClose}
          className="p-1 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or username..."
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500/50 outline-hidden transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-8 gap-3"
            >
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Searching users...
              </p>
            </motion.div>
          ) : !users || users.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-slate-700">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-xs font-medium text-slate-500">
                {search.length > 2
                  ? "No users found."
                  : "Type at least 3 characters to search."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              {users.map((user) => {
                const userId = user.id || (user as any)._id;
                return (
                  <div
                    key={userId}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-xs font-black text-slate-300 shadow-lg border border-white/5">
                        {user.name?.[0] || user.username[0]}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {user.name || user.username}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                          @{user.username}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => inviteMutation.mutate(userId)}
                      disabled={
                        inviteMutation.isPending &&
                        inviteMutation.variables === userId
                      }
                      className={cn(
                        "p-2.5 rounded-xl transition-all active:scale-95",
                        inviteMutation.isSuccess &&
                          inviteMutation.variables === userId
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-white/5 text-slate-400 hover:text-white hover:bg-indigo-600 shadow-lg",
                      )}
                    >
                      {inviteMutation.isPending &&
                      inviteMutation.variables === userId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : inviteMutation.isSuccess &&
                        inviteMutation.variables === userId ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
