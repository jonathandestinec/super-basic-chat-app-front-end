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

  /* 
    We will be changing the entire design of the project.

    The shouty colors will be taken off, and some necessary UI adjustments would be made.

    First, let's change the color scheme. We'll make it black and light purple instead (just like discord)

    The loading aimation has to chnge too. Make it something more different like a spinning str, globe or something.

    Also, the particles animation should be removed.

    Change the overall vibe to be like discord instead.

    Add animations to necessary components

    Now for the chat lobby component, Let only the chat rooms list be present on it on mobile. On larger screens, you can place them side-by-side, but beautifully and cleanly. On each chat room list component, add a preview of the most recent message from that chat to it. You can get that from the chatMessages state because it wouold be updated with socket.io. 

    Also, take off the chat delete button from where it currently is. It's very easy to mistakenlt click on it. Make it appear in the opened chat screen instead. In a menu that can be opened which would contain utility buttons like delete chat

    also, take off the user panel. I want the chat-lobby page to look more neat and clean and beautiful too. The header will have only the user's icon(the first letter in the name since ther isn't any photo icon) and the text "Chat Lobby".

    When the user profile icon is clicker, it should open a drawer or panel that is beautifully animated. This would contain the user's other information and some necessary util buttons. Including the developer's information, which is me. Add my email too jonathandestinec@gmail.com along with my instagram and whatsapp number link +2349061426386

    Next, chts should be opened in full screen on mobile. When a user clicks a chat, it should open in fullscreen, not cropped like we have it currently.

    Also, most recemntly created chats should be appended to the top of the list instead of the bottom.

    Also, for the chat opened screen, we should disable the send button immediately after the api call request is made This would prevent people from mistakenly calling the send multiple times.

    These are the changes so far. 

  */

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
