"use client";
import { motion } from "framer-motion";

const Loading = ({ type }: { type: "page" | "component" }) => {
  return (
    <div>
      {type === "page" ? (
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="w-16 h-16"
            >
              <svg viewBox="0 0 24 24" className="w-16 h-16">
                <motion.path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-lg font-medium discord-text"
          >
            Loading...
          </motion.p>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full w-full">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-8 h-8"
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <motion.path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Loading;
