"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  MessageSquare,
  X,
  User,
  Users,
  Trash2,
  UserPlus,
  Instagram,
} from "lucide-react";
import getChatRooms from "@/lib/chat/getChatRooms";
import getChat from "@/lib/chat/getChat";
import { toast } from "sonner";
import UserPanel from "@/components/user-panel";
import CreateChatButton from "@/components/create-chat-button";
import MagicParticles from "./magic-particles";
import { sendMessage } from "@/lib/chat/sendMessage";
import { socket } from "@/socket";
import AddMemberModal from "@/components/add-member-modal";
import addMember from "@/lib/chat/addMember";
import deleteChatRoom from "@/lib/chat/deleteChatRoom";
import deleteMessage from "@/lib/chat/deleteMessage";

const ChatLobby = ({ loginInfo }: { loginInfo: Me }) => {
  // Get Chat Rooms
  const [chatRooms, setChatRooms] = useState<Room[]>([]);
  const [chatOpened, setChatOpened] = useState(false);
  const [chatMembers, setChatMembers] = useState<User[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [openRoomId, setOpenRoomId] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  const fetchChatRooms = async () => {
    const fetchedChatRooms = await getChatRooms();
    setChatRooms(fetchedChatRooms.rooms);
    console.log(fetchedChatRooms);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log({ socketId: socket.id });

      // Send broadcast to join room
      socket.emit("join_lobby", loginInfo.id);

      console.log({ socketId: socket.id });
    });

    socket.on("disconnect", () => {
      console.log(socket.id); // undefined
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.off("new_message");
    socket.on("new_message", (newChat) => {
      setChatMessages((prev) => [...prev, newChat]); // Add new message in real-time
    });

    socket.off("created_chat");
    socket.on("created_chat", (newChat) => {
      console.log({ newChatCreated: newChat });

      setChatRooms((prev) => [...prev, newChat]); // Add new chat in real-time
    });

    socket.off("deleted_message");
    socket.on("deleted_message", (message) => {
      setChatMessages((prev) =>
        prev.filter((msg) => {
          if (msg._id !== message._id) return message;
        })
      );
    });

    socket.off("deleted_chat");
    socket.on("deleted_chat", (chat) => {
      setChatRooms((prev) =>
        prev.filter((room) => {
          if (room._id !== chat._id) return chat;
        })
      );

      if (openRoomId === chat._id) {
        setChatOpened(false);
      }
    });

    socket.off("added_member");
    socket.on("added_member", (data) => {
      const { chatId, newMember } = data;
      setChatRooms((prev) =>
        prev.map((room) =>
          room._id === chatId
            ? { ...room, members: [...room.members, newMember] }
            : room
        )
      );

      if (openRoomId === chatId) {
        setChatMembers((prev) => [...prev, newMember]);
      }
    });

    return () => {
      socket.off("created_chat");
      socket.off("new_message");
      socket.off("deleted_message");
      socket.off("deleted_chat");
      socket.off("added_member");
    };
  }, [openRoomId]);

  useEffect(() => {
    toast.promise(fetchChatRooms(), {
      loading: "Loading chat rooms...",
      success: "Chat rooms loaded successfully",
      error: "Failed to load chat rooms",
    });
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleToggleChat = async (roomId: string) => {
    console.log(roomId);

    const fetchedChat = await getChat(roomId);

    setChatMembers(fetchedChat.members);
    setChatMessages(fetchedChat.messages);
    setChatOpened(true);
    setOpenRoomId(roomId);
  };

  const handleSendMessage = async () => {
    console.log("Sending Message");
    if (messageInput === "") return;

    // Send message
    const newMessage = await sendMessage(loginInfo, openRoomId, messageInput);

    if (!newMessage) return;

    setMessageInput("");

    console.log({ messageInput, openRoomId });

    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteRoom = async (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();

    console.log({ roomId });

    try {
      const deletedChat = await deleteChatRoom(roomId, loginInfo);

      if (!deletedChat) {
        toast.error(`Failed to delete chat room ${roomId}`);
        console.log(roomId);
        return;
      }

      toast.success("Chat room deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete chat room");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const deletedMessage = await deleteMessage(
        messageId,
        loginInfo,
        openRoomId
      );

      if (!deletedMessage) {
        toast.error("Failed to delete message");
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message");
    }
  };

  const handleAddMember = async (userId: string) => {
    if (!openRoomId) return;

    try {
      const newMember = await addMember(openRoomId, userId, loginInfo);

      if (!newMember) {
        toast.error("Failed to add member");
        return;
      }

      setIsAddMemberOpen(false);
      toast.success("Member added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add member");
    }
  };

  return (
    <div className="min-h-screen text-white p-6 flex flex-col">
      <MagicParticles />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold magical-text mb-2">
          super-basic-chat-app
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg text-purple-200 flex items-center justify-center gap-1"
        >
          Built by Lime Juice 🧃
          <span>
            <a
              href="https://www.instagram.com/oxleaff/"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram className="w-6 h-6 ml-2" />
            </a>
          </span>
        </motion.p>
      </motion.div>

      {/* User Panel */}
      <UserPanel loginInfo={loginInfo} />

      <div className="flex flex-col md:flex-row gap-6 flex-1">
        {/* Chat Rooms List */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full md:w-1/3 glass-card p-4 overflow-hidden flex flex-col"
          style={{ maxHeight: "70vh" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-emerald-300" />
            <h2 className="text-xl font-semibold text-emerald-300">
              Chat Rooms
            </h2>
          </div>

          <div
            className="space-y-3 mt-4 overflow-y-auto pr-2 flex-grow"
            ref={chatListRef}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.2) transparent",
            }}
          >
            <AnimatePresence>
              {chatRooms.length > 0 ? (
                chatRooms.map((room, index) => (
                  <motion.div
                    key={room._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                      openRoomId === room._id
                        ? "bg-gradient-to-r from-purple-500/70 to-emerald-500/70 shadow-lg shadow-purple-500/20"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-emerald-500/0 group-hover:from-purple-600/20 group-hover:to-emerald-500/20 transition-all duration-500"
                      onClick={() => handleToggleChat(room._id)}
                    ></div>

                    <div className="flex justify-between items-start relative z-10">
                      <div
                        className="flex-1"
                        onClick={() => handleToggleChat(room._id)}
                      >
                        {room.members.length > 0 ? (
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                              {room.members.slice(0, 2).map((member, i) => (
                                <div
                                  key={`room._id-${i}`}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                                    i === 0 ? "bg-purple-400" : "bg-emerald-400"
                                  }`}
                                >
                                  {member.name && member.name.charAt(0)}
                                </div>
                              ))}
                            </div>
                            <div className="font-medium">
                              {room.members[0]?.name}{" "}
                              {room.members.length > 1 &&
                                `& ${room.members[1]?.name}`}
                              {room.members.length > 2 &&
                                ` +${room.members.length - 2}`}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-300" />
                            <span className="text-gray-300">No members</span>
                          </div>
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleDeleteRoom(e, room._id)}
                        className="p-2 rounded-full hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4 text-red-300" />
                      </motion.button>
                    </div>

                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-400 to-emerald-400"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 rounded-xl bg-white/10 text-center"
                >
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-purple-300 opacity-70" />
                  <p className="text-purple-200">No chat rooms available</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Chat Window */}
        <AnimatePresence mode="wait">
          {chatOpened ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="flex-1 glass-card flex flex-col overflow-hidden"
              style={{ maxHeight: "70vh" }}
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-purple-600/30 to-emerald-600/30">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {chatMembers.slice(0, 2).map((member, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          i === 0 ? "bg-purple-400" : "bg-emerald-400"
                        }`}
                      >
                        {member.name.charAt(0)}
                      </div>
                    ))}
                    {chatMembers.length > 2 && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-purple-300/50">
                        +{chatMembers.length - 2}
                      </div>
                    )}
                  </div>
                  <h2 className="font-semibold">
                    {chatMembers.length <= 2
                      ? chatMembers.map((member) => member.name).join(" & ")
                      : `${chatMembers[0].name}, ${chatMembers[1].name} & ${
                          chatMembers.length - 2
                        } more`}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsAddMemberOpen(true)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    title="Add member"
                  >
                    <UserPlus className="h-5 w-5 text-emerald-300" />
                  </motion.button>

                  <button
                    onClick={() => setChatOpened(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(255,255,255,0.2) transparent",
                }}
              >
                <AnimatePresence>
                  {chatMessages.map((message, index) => {
                    const isMe = message.senderId === loginInfo.id;
                    const sender = chatMembers.find(
                      (member) => member._id === message.senderId
                    );

                    return (
                      <motion.div
                        key={message._id || index}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] group ${
                            isMe ? "order-2" : "order-1"
                          }`}
                        >
                          <div className="relative">
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                isMe
                                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-br-none"
                                  : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-bl-none"
                              }`}
                            >
                              <p>{message.text}</p>
                            </div>

                            {isMe && (
                              <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ opacity: 1, scale: 1 }}
                                className="absolute top-0 right-0 -mt-2 -mr-2 p-1 rounded-full bg-red-500/80 opacity-0 group-hover:opacity-70 transition-opacity"
                                onClick={() => handleDeleteMessage(message._id)}
                              >
                                <X className="h-3 w-3 text-white" />
                              </motion.button>
                            )}
                          </div>
                          <p
                            className={`text-xs mt-1 text-purple-200 ${
                              isMe ? "text-right" : "text-left"
                            }`}
                          >
                            {sender?.name || "Unknown"}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 border-t border-white/10 bg-black/30"
              >
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a magical message..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-200"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 text-white shadow-lg"
                  >
                    <Send className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 glass-card flex flex-col justify-center items-center p-8"
              style={{ maxHeight: "70vh" }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  duration: 2,
                }}
              >
                <MessageSquare className="h-16 w-16 text-purple-300 opacity-70 mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-center magical-text mb-2">
                Select a chat to start messaging
              </h3>
              <p className="text-purple-200 text-center max-w-md">
                Choose one of your magical chat rooms from the list to begin
                your conversation
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Chat Button */}
      <CreateChatButton loginInfo={loginInfo} chatOpen={chatOpened} />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAddMember={handleAddMember}
      />
    </div>
  );
};

export default ChatLobby;
