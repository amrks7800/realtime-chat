"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChatSDK } from "@chatter/sdk";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUpload } from "@chatter/sdk";

const createGroupSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters"),
  image: z.string().optional(),
});

type CreateGroupData = z.infer<typeof createGroupSchema>;

interface CreateGroupModalProps {
  sdk: ChatSDK;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroupModal({
  sdk,
  open,
  onOpenChange,
}: CreateGroupModalProps) {
  const queryClient = useQueryClient();
  const uploadMutation = useUpload(sdk);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    // @ts-ignore
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const createRoomMutation = useMutation({
    mutationFn: (data: CreateGroupData) =>
      sdk.http.client.post("/api/rooms", { ...data, type: "group" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      onOpenChange(false);
      reset();
      setImageUrl(null);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const res = await uploadMutation.mutateAsync(file);
        setImageUrl(res.url);
        setValue("image", res.url);
      } catch (error) {
        console.error("Upload failed", error);
      }
    }
  };

  const onSubmit = (data: CreateGroupData) => {
    createRoomMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-950 border-white/5 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-black italic tracking-tighter">
            Create Group
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            Form a new community. Give it a name and an identity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-500/50">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Group Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-slate-700 group-hover:text-indigo-500 transition-colors" />
                )}
              </div>
              <label
                htmlFor="group-image"
                className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 rounded-xl shadow-lg cursor-pointer hover:bg-indigo-500 transition-all active:scale-90"
              >
                {uploadMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                <input
                  id="group-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              Group Identity
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]"
              >
                Group Name
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Aura Squad, Dev Team, etc."
                className="bg-white/5 border-white/5 text-white h-12 rounded-2xl focus:ring-1 focus:ring-indigo-500/50"
              />
              {errors.name && (
                <p className="text-red-500 text-[10px] font-bold">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={
                createRoomMutation.isPending || uploadMutation.isPending
              }
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-12 rounded-2xl shadow-lg shadow-indigo-600/20 font-bold"
            >
              {createRoomMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                "Create Group"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
