"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Settings,
  Copy,
  X,
  User,
  Instagram,
  MessageSquare,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Me {
  id: string;
  name: string;
}

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  loginInfo: Me;
}

const UserDrawer = ({ isOpen, onClose, loginInfo }: UserDrawerProps) => {
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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-80 bg-card border-l border-border z-50"
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <h2 className="text-lg font-semibold">User Profile</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-secondary"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 flex items-center gap-4 border-b border-border">
                <div className="w-16 h-16 rounded-full discord-gradient flex items-center justify-center text-white font-bold text-2xl">
                  {loginInfo.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{loginInfo.name}</h3>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <span className="text-sm truncate">
                      ID: {loginInfo.id.substring(0, 10)}...
                    </span>
                    <button
                      onClick={handleCopyID}
                      className="ml-2 p-1 rounded-full hover:bg-secondary"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-4">
                  <button className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-secondary transition-colors">
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-secondary transition-colors text-red-400"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              <div className="p-4 border-t border-border">
                <h3 className="font-semibold mb-3">Developer</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User size={14} />
                    <span>Jonathan Destine</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare size={14} />
                    <a
                      href="mailto:jonathandestinec@gmail.com"
                      className="hover:text-primary transition-colors"
                    >
                      jonathandestinec@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Instagram size={14} />
                    <a
                      href="https://www.instagram.com/oxleaff/"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      @oxleaff
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone size={14} />
                    <a
                      href="https://wa.me/2349061426386"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      +234 906 142 6386
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserDrawer;
