"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, MessageSquarePlus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import createChat from "@/lib/chat/createChat";

interface CreateChatButtonProps {
  loginInfo: Me;
  chatOpen: boolean;
}

export default function CreateChatButton({
  loginInfo,
  chatOpen,
}: CreateChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateChat = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a user ID");
      return;
    }

    setIsCreating(true);

    try {
      const response = await createChat(loginInfo, userId);

      console.log(response);

      toast.success("Chat created successfully!");

      setUserId("");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to create chat");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full magical-gradient flex items-center justify-center shadow-lg z-20 ${
          chatOpen ? "hidden" : " visible"
        }`}
      >
        <Plus size={24} className="text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="glass-card w-full max-w-md p-6 m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MessageSquarePlus className="h-6 w-6 text-purple-300" />
                  <h2 className="text-xl font-semibold magical-text">
                    Create New Chat
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={20} className="text-purple-200" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">
                    Enter User ID
                  </label>
                  <Input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="User ID to chat with"
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300/50"
                  />
                  <p className="text-xs text-purple-300 mt-1">
                    Enter the ID of the user you want to chat with
                  </p>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="border-white/20 text-purple-200 hover:bg-white/10 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateChat}
                    disabled={isCreating}
                    className="magical-gradient text-white"
                  >
                    {isCreating ? (
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
                      <Send size={16} className="mr-2" />
                    )}
                    {isCreating ? "Creating..." : "Create Chat"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
