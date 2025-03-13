"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (userId: string) => void;
}

export default function AddMemberModal({
  isOpen,
  onClose,
  onAddMember,
}: AddMemberModalProps) {
  const [userId, setUserId] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddMember = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a user ID");
      return;
    }

    setIsAdding(true);

    try {
      await onAddMember(userId);
      setUserId("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-card w-full max-w-md p-6 m-4 rounded-lg border border-border shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <UserPlus className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Add Member to Chat</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Enter User ID
                </label>
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="User ID to add to chat"
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the ID of the user you want to add to this chat
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddMember}
                  disabled={isAdding}
                  className="discord-gradient text-white"
                >
                  {isAdding ? (
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
                    <UserPlus size={16} className="mr-2" />
                  )}
                  {isAdding ? "Adding..." : "Add Member"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
