"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storeUser } from "@/lib/auth/storeUser";
import { MessageSquare, Lock, User, UserPlus, LogIn } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setName("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/${isSignup ? "user" : "login"}`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          password,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.log(error);
        toast.error(error.message || "Something went wrong");
        setIsLoading(false);
        return;
      }

      if (isSignup) {
        setIsSignup(false);
        toast.success("Account created successfully");
        setIsLoading(false);
      } else {
        const login = await res.json();
        storeUser({
          id: login.user.id,
          name: login.user.name,
          token: login.token,
        });

        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card w-full max-w-md mx-4 p-6 sm:p-8 z-10 my-4 rounded-lg border border-border shadow-xl"
      >
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6 w-full overflow-hidden">
          <div className="bg-secondary p-1 rounded-full w-full max-w-[200px]">
            <div className="relative flex">
              <motion.div
                className="absolute inset-0 z-0"
                animate={{ x: isSignup ? "50%" : "0%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="h-full w-1/2 discord-gradient rounded-full" />
              </motion.div>

              <button
                onClick={() => !isSignup || toggleMode()}
                className={`relative z-10 flex-1 px-3 py-1.5 rounded-full transition-colors ${
                  !isSignup
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <LogIn size={14} />
                  <span className="text-sm">Login</span>
                </div>
              </button>

              <button
                onClick={() => isSignup || toggleMode()}
                className={`relative z-10 flex-1 px-3 py-1.5 rounded-full transition-colors ${
                  isSignup
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <UserPlus size={14} />
                  <span className="text-sm">Signup</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
            className="w-14 h-14 sm:w-16 sm:h-16 discord-gradient rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignup ? "signup" : "login"}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
              >
                {isSignup ? (
                  <UserPlus size={28} className="text-white" />
                ) : (
                  <MessageSquare size={28} className="text-white" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isSignup ? "signup-text" : "login-text"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-1"
            >
              <motion.h1 className="text-2xl sm:text-3xl font-bold discord-text">
                {isSignup ? "Create Account" : "Welcome Back"}
              </motion.h1>
              <motion.p className="text-sm sm:text-base text-muted-foreground">
                {isSignup
                  ? "Sign up to start chatting"
                  : "Sign in to continue to your chats"}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6"
        >
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="username" className="text-sm">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="username"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your username"
                required
                className="pl-10 h-10 bg-secondary border-border"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="pl-10 h-10 bg-secondary border-border"
              />
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 discord-gradient text-white"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1,
                    ease: "linear",
                  }}
                  className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <motion.div
                  key={isSignup ? "signup-icon" : "login-icon"}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mr-2"
                >
                  {isSignup ? <UserPlus size={16} /> : <LogIn size={16} />}
                </motion.div>
              )}
              {isLoading
                ? isSignup
                  ? "Creating Account..."
                  : "Signing In..."
                : isSignup
                ? "Create Account"
                : "Sign In"}
            </Button>
          </motion.div>
        </motion.form>

        <motion.div
          className="mt-4 sm:mt-6 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {isSignup ? "Already have an account?" : "Don't have an account yet?"}
          <button
            onClick={toggleMode}
            className="ml-1 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
