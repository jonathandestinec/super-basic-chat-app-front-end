"use client";
import { motion } from "framer-motion";
import { Skeleton } from "./ui/skeleton";

const Loading = ({
  width = "w-96",
  height = "h-96",
  type,
}: {
  width?: string;
  height?: string;
  type: "page" | "component";
}) => {
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
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 blur-xl opacity-70"
              style={{ width: "100%", height: "100%" }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="relative w-32 h-32"
            >
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-emerald-500" />
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-emerald-400 border-b-purple-400" />
              <div className="absolute inset-4 rounded-full border-4 border-transparent border-l-purple-500 border-b-emerald-500" />
              <div className="absolute inset-0 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
              </div>
            </motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-lg font-medium magical-text"
          >
            Loading magic...
          </motion.p>
        </div>
      ) : (
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${width} ${height} relative flex items-center justify-center`}
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/30 to-emerald-500/30 blur-md"
            />
            <Skeleton className={`${width} ${height} bg-white/10`} />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute w-8 h-8"
            >
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-400 border-r-emerald-400" />
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Loading;
