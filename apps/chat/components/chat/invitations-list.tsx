"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatSDK } from "@chatter/sdk";
import { Check, X, Bell, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface InvitationsListProps {
  sdk: ChatSDK;
}

export function InvitationsList({ sdk }: InvitationsListProps) {
  const queryClient = useQueryClient();

  const { data: invitations, isLoading } = useQuery({
    queryKey: ["invitations", "my"],
    queryFn: () => sdk.http.getMyInvitations(),
    refetchInterval: 10000, // Poll every 10s for new invites
  });

  const respondMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "accepted" | "declined";
    }) => sdk.http.respondToInvitation(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", "my"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-3">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Loading invitations...
        </p>
      </div>
    );
  }

  if (!invitations || invitations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white/5 rounded-3xl border border-white/5 mx-2">
        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 text-indigo-500">
          <Bell className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white mb-1">
          No pending invites
        </h4>
        <p className="text-[11px] font-medium text-slate-500">
          When people invite you to chat, they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-2 pb-4">
      <div className="flex items-center gap-2 px-2 mb-4">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
        <h3 className="text-xs font-black text-white uppercase tracking-widest">
          Pending Requests ({invitations.length})
        </h3>
      </div>

      <AnimatePresence>
        {invitations.map((invite) => (
          <motion.div
            key={invite._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-indigo-500/30 transition-all shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-black text-white shadow-xl">
                  {invite.senderId.name?.[0] || invite.senderId.username[0]}
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-[#0f172a]">
                  <Check className="w-2 h-2 text-white" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {invite.senderId.name || invite.senderId.username}
                </h4>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">
                  Invited you to {invite.type === "direct" ? "chat" : "group"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  respondMutation.mutate({ id: invite._id, status: "declined" })
                }
                disabled={respondMutation.isPending}
                className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  respondMutation.mutate({ id: invite._id, status: "accepted" })
                }
                disabled={respondMutation.isPending}
                className="p-2.5 bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
              >
                {respondMutation.isPending &&
                respondMutation.variables?.status === "accepted" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
