"use client";

import { useState, useEffect } from "react";
import { signUp, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterValues } from "@/lib/validations/auth";
import { useQuery } from "@tanstack/react-query";
import { ChatSDK } from "@chatter/sdk";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  User,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    // @ts-ignore
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      username: "",
    },
  });

  const username = watch("username");

  const { data: availability, isFetching: isCheckingUsername } = useQuery({
    queryKey: ["username-availability", username],
    queryFn: async () => {
      if (!username || username.length < 3) return null;
      const sdk = new ChatSDK(
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
        "",
      );
      return sdk.http.checkUsername(username);
    },
    enabled: !!username && username.length >= 3,
    staleTime: 5000,
  });

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const onSubmit = async (values: RegisterValues) => {
    setError(null);
    if (availability && !availability.available) {
      setError("Username is already taken");
      return;
    }

    const { error } = await signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
      // @ts-ignore
      username: values.username,
    });

    if (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 selection:bg-indigo-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative"
      >
        <div className="bg-slate-900/50 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="mb-10 text-center relative z-10">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-indigo-500/40"
            >
              <User className="w-10 h-10 text-white" strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
              Join Aura
            </h1>
            <p className="text-slate-400 font-medium">
              Elevate your conversation experience
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 relative z-10"
          >
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Display Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none">
                    <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                  <input
                    {...register("name")}
                    className={cn(
                      "w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all duration-300",
                      errors.name && "border-red-500/50 focus:ring-red-500/20",
                    )}
                    placeholder="Your Name"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none">
                    <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                      <span className="text-xs font-black">@</span>
                    </div>
                  </div>
                  <input
                    {...register("username")}
                    className={cn(
                      "w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-10 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all duration-300",
                      errors.username &&
                        "border-red-500/50 focus:ring-red-500/20",
                      availability?.available === false && "border-red-500/50",
                    )}
                    placeholder="unique_id"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {isCheckingUsername ? (
                      <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
                    ) : username?.length >= 3 && availability ? (
                      availability.available ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )
                    ) : null}
                  </div>
                </div>
                {errors.username && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    {errors.username.message}
                  </p>
                )}
                {availability?.available === false && !errors.username && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    Username is already taken
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
                <input
                  {...register("email")}
                  type="email"
                  className={cn(
                    "w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all duration-300",
                    errors.email && "border-red-500/50 focus:ring-red-500/20",
                  )}
                  placeholder="aura@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Secure Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
                <input
                  {...register("password")}
                  type="password"
                  className={cn(
                    "w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all duration-300",
                    errors.password &&
                      "border-red-500/50 focus:ring-red-500/20",
                  )}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={
                isSubmitting || !!(availability && !availability.available)
              }
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-2xl mt-4 transition-all duration-300 shadow-xl shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Crafting Account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Aura Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-800/50 text-center relative z-10">
            <p className="text-slate-400 font-medium">
              Existing member?{" "}
              <Link
                href="/login"
                className="text-white hover:text-indigo-400 font-bold transition-colors underline decoration-indigo-500/30 underline-offset-4"
              >
                Sign In here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
