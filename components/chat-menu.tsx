"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, UserPlus, Trash2 } from "lucide-react";

interface ChatMenuProps {
  onAddMember: () => void;
  onDeleteChat: () => void;
}

const ChatMenu = ({ onAddMember, onDeleteChat }: ChatMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-secondary transition-colors"
      >
        <MoreVertical size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={closeMenu}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-50"
            >
              <div className="p-1">
                <button
                  onClick={() => {
                    onAddMember();
                    closeMenu();
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-secondary transition-colors text-left"
                >
                  <UserPlus size={16} />
                  <span>Add Member</span>
                </button>

                <button
                  onClick={() => {
                    onDeleteChat();
                    closeMenu();
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-destructive/20 transition-colors text-destructive text-left"
                >
                  <Trash2 size={16} />
                  <span>Delete Chat</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatMenu;
