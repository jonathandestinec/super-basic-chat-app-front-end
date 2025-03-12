"use client";
import { motion } from "framer-motion";
import { Copy, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Me {
  id: string;
  name: string;
}

const UserPanel = ({ loginInfo }: { loginInfo: Me }) => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear me from local storage
    localStorage.removeItem("me");

    // Refresh
    router.push("/");
    window.location.reload();
  };

  const handleCopyID = () => {
    navigator.clipboard.writeText(loginInfo.id);
    toast("ID copied to clipboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-4 mb-6"
    >
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-12 h-12 rounded-full magical-gradient flex items-center justify-center text-white font-bold text-lg shadow-lg"
        >
          {loginInfo.name.charAt(0)}
        </motion.div>

        <div className="flex-1">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-semibold text-lg"
          >
            {loginInfo.name}
          </motion.h3>

          <div className=" flex items-center justify-start gap-3">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-purple-200 truncate"
            >
              ID: {loginInfo.id.substring(0, 8)}...
            </motion.p>

            {/* Copy ID */}
            <motion.button
              onClick={handleCopyID}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Copy size={18} className="text-purple-200" />
            </motion.button>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Settings size={18} className="text-purple-200" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <LogOut size={18} className="text-purple-200" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserPanel;
