"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginValues } from "@/lib/validations/auth";
import {
  Loader2,
  Mail,
  Lock,
  LogIn,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    // @ts-ignore
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const onSubmit = async (values: LoginValues) => {
    setError(null);
    const { error } = await signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setError(error.message || "Invalid email or password");
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative"
      >
        <div className="bg-slate-900/50 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="mb-12 text-center relative z-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-16 h-16 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl shadow-indigo-500/30"
            >
              <LogIn className="w-8 h-8 text-white" strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-400 font-medium">
              Continue your journey in Aura
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 relative z-10"
          >
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3.5 rounded-2xl text-sm font-semibold flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

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
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
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
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-2xl mt-6 transition-all duration-300 shadow-xl shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In to Aura
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-800/50 text-center relative z-10">
            <p className="text-slate-400 font-medium">
              New to Aura?{" "}
              <Link
                href="/register"
                className="text-white hover:text-indigo-400 font-bold transition-colors underline decoration-indigo-500/30 underline-offset-4"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
