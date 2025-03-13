"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  MessageSquare,
  X,
  ChevronLeft,
  Plus,
  MessageCircle,
} from "lucide-react";
import getChatRooms from "@/lib/chat/getChatRooms";
import getChat from "@/lib/chat/getChat";
import { toast } from "sonner";
import CreateChatButton from "@/components/create-chat-button";
import { sendMessage } from "@/lib/chat/sendMessage";
import { socket } from "@/socket";
import AddMemberModal from "@/components/add-member-modal";
import addMember from "@/lib/chat/addMember";
import deleteChatRoom from "@/lib/chat/deleteChatRoom";
import deleteMessage from "@/lib/chat/deleteMessage";
import UserDrawer from "@/components/user-drawer";
import ChatMenu from "@/components/chat-menu";
import Loading from "@/components/loading";
import { useMediaQuery } from "@/hooks/use-media-query";

const ChatLobby = ({ loginInfo }: { loginInfo: Me }) => {
  // State
  const [chatRooms, setChatRooms] = useState<Room[]>([]);
  const [chatOpened, setChatOpened] = useState(false);
  const [chatMembers, setChatMembers] = useState<User[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [openRoomId, setOpenRoomId] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  // Media query
  const isMobile = useMediaQuery("(max-width: 768px)");

  const fetchChatRooms = async () => {
    setIsLoading(true);
    try {
      const fetchedChatRooms = await getChatRooms();
      // Sort rooms by most recent first
      setChatRooms(fetchedChatRooms.rooms);
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
      toast.error("Failed to load chat rooms");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log({ socketId: socket.id, loginInfo: loginInfo.id });

      socket.emit("join_lobby", loginInfo.id);
    };

    handleConnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newChat: Message) => {
      console.log("New message received", newChat);

      setChatMessages((prev) => [...prev, newChat]);

      // Update the chat room's last message
      setChatRooms((prev) => {
        const updatedRooms = prev.map((room) => {
          if (room._id === newChat.chatId) {
            return {
              ...room,
              lastMessage: newChat,
              updatedAt: new Date().toISOString(),
              messages: [...room.messages, newChat],
            };
          }
          return room;
        });

        // Sort by most recent message
        return [...updatedRooms];
      });
    };

    const handleCreatedChat = (newChat: Room) => {
      setChatRooms((prev) => [newChat, ...prev]);
    };

    const handleDeletedMessage = (message: Message) => {
      setChatMessages((prev) => prev.filter((msg) => msg._id !== message._id));
      setChatRooms((prev) => {
        return prev.map((room) => {
          if (room._id === message.chatId) {
            return {
              ...room,
              messages: room.messages.filter((msg) => msg._id !== message._id),
            };
          }
          return room;
        });
      });
    };

    const handleDeletedChat = (chat: Room) => {
      setChatRooms((prev) => prev.filter((room) => room._id !== chat._id));
      if (openRoomId === chat._id) {
        setChatOpened(false);
      }
    };

    const handleAddedMember = (data: { chatId: string; newMember: User }) => {
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
    };

    socket.on("new_message", handleNewMessage);
    socket.on("created_chat", handleCreatedChat);
    socket.on("deleted_message", handleDeletedMessage);
    socket.on("deleted_chat", handleDeletedChat);
    socket.on("added_member", handleAddedMember);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("created_chat", handleCreatedChat);
      socket.off("deleted_message", handleDeletedMessage);
      socket.off("deleted_chat", handleDeletedChat);
      socket.off("added_member", handleAddedMember);
    };
  }, [openRoomId]);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleToggleChat = async (roomId: string) => {
    try {
      const fetchedChat = await getChat(roomId);
      setChatMembers(fetchedChat.members);
      setChatMessages(fetchedChat.messages);
      setChatOpened(true);
      setOpenRoomId(roomId);
    } catch (error) {
      console.error("Failed to fetch chat:", error);
      toast.error("Failed to open chat");
    }
  };

  const handleSendMessage = async () => {
    if (messageInput.trim() === "" || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(loginInfo, openRoomId, messageInput);
      setMessageInput("");
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await deleteChatRoom(openRoomId, loginInfo);
      toast.success("Chat deleted successfully");
      setChatOpened(false);
    } catch (error) {
      console.error("Failed to delete chat:", error);
      toast.error("Failed to delete chat");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId, loginInfo, openRoomId);
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleAddMember = async (userId: string) => {
    if (!openRoomId) return;

    try {
      await addMember(openRoomId, userId, loginInfo);
      setIsAddMemberOpen(false);
      toast.success("Member added successfully");
    } catch (error) {
      console.error("Failed to add member:", error);
      toast.error("Failed to add member");
    }
  };

  const getLastMessagePreview = (room: Room) => {
    if (!room.messages.at(-1)) return "No messages yet";

    const text = room.messages.at(-1)?.text;
    if (text) {
      return text.length > 30 ? `${text.substring(0, 30)}...` : text;
    }
  };

  const getSenderName = (room: Room) => {
    if (!room.messages.at(-1)) return "";

    const sender = room.members.find(
      (member) => member._id === room.messages.at(-1)?.senderId
    );
    return sender?.name || "Unknown";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Enhanced Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {isMobile && chatOpened ? (
              <button
                onClick={() => setChatOpened(false)}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            ) : (
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 100 }}
                  className="w-10 h-10 rounded-full discord-gradient flex items-center justify-center"
                >
                  <MessageCircle size={20} className="text-white" />
                </motion.div>
              </div>
            )}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-bold"
              >
                <span className="text-foreground">Super</span>{" "}
                <span className="text-foreground">Basic</span>{" "}
                <span className="text-foreground">Chat</span>
              </motion.h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsUserDrawerOpen(true)}
            className="relative w-10 h-10 rounded-full discord-gradient flex items-center justify-center text-white font-bold shadow-md"
          >
            {loginInfo.name.charAt(0)}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(139, 92, 246, 0.7)",
                  "0 0 0 10px rgba(139, 92, 246, 0)",
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
              className="absolute inset-0 rounded-full"
            />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <div
        className={`flex flex-1 overflow-hidden ${
          !isMobile ? "h-[calc(100vh-64px)]" : ""
        }`}
      >
        {/* Chat List */}
        {(!isMobile || !chatOpened) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-full md:w-80 border-r border-border flex flex-col ${
              !isMobile ? "h-[90vh]" : ""
            }`}
          >
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h2 className="font-semibold text-lg">Conversations</h2>
              <div className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
                {chatRooms.length} {chatRooms.length === 1 ? "chat" : "chats"}
              </div>
            </div>

            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loading type="component" />
              </div>
            ) : (
              <div
                className="flex-1 overflow-y-auto px-2 py-3"
                ref={chatListRef}
              >
                {chatRooms.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {chatRooms.map((room, index) => (
                      <motion.div
                        key={room._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { delay: index * 0.05 },
                        }}
                        onClick={() => handleToggleChat(room._id)}
                        className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-200 ${
                          openRoomId === room._id
                            ? "bg-secondary/80 border-primary"
                            : "bg-secondary/30 hover:bg-secondary/50 border-transparent"
                        } border-2 p-3`}
                      >
                        {/* Members avatars */}
                        <div className="flex items-center mb-3">
                          <div className="flex -space-x-3 mr-3">
                            {room.members.slice(0, 3).map((member, i) => (
                              <div
                                key={`${room._id}-${i}`}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 border-background ${
                                  i === 0
                                    ? "bg-indigo-500 z-30"
                                    : i === 1
                                    ? "bg-purple-500 z-20"
                                    : "bg-pink-500 z-10"
                                }`}
                              >
                                {member.name && member.name.charAt(0)}
                              </div>
                            ))}
                            {room.members.length > 3 && (
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium bg-secondary border-2 border-background z-0">
                                +{room.members.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {room.members.map((m) => m.name).join(", ")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {room.members.length}{" "}
                              {room.members.length === 1 ? "member" : "members"}
                            </div>
                          </div>
                        </div>

                        {/* Last message preview */}
                        {room.messages.at(-1) ? (
                          <div className="bg-background/50 rounded-lg p-3 mt-2">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-indigo-500">
                                {getSenderName(room).charAt(0)}
                              </div>
                              <span className="text-xs font-medium flex-1">
                                {getSenderName(room) === loginInfo.name
                                  ? "You"
                                  : getSenderName(room)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {getLastMessagePreview(room)}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-background/50 rounded-lg p-3 mt-2 text-center text-muted-foreground text-sm">
                            No messages yet
                          </div>
                        )}

                        {/* Subtle gradient overlay */}
                        <div
                          className={`absolute inset-0 opacity-20 pointer-events-none ${
                            openRoomId === room._id
                              ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20"
                              : ""
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <div className="relative w-20 h-20 mb-4">
                      <motion.div
                        className="absolute inset-0 bg-secondary/50 rounded-full"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 2,
                        }}
                      />
                      <MessageSquare className="absolute inset-0 m-auto h-10 w-10 text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="font-medium mb-2">No conversations yet</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Start a new chat by clicking the + button below to connect
                      with others
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-6 bg-primary/20 text-primary rounded-lg p-3 flex items-center gap-2"
                    >
                      <div className="w-8 h-8 rounded-full discord-gradient flex items-center justify-center">
                        <Plus size={16} className="text-white" />
                      </div>
                      <span>Create your first chat</span>
                    </motion.div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Chat Window */}
        {(!isMobile || chatOpened) && (
          <AnimatePresence mode="wait">
            {chatOpened ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex-1 flex flex-col ${
                  !isMobile ? "h-[90vh]" : "h-[90vh]"
                }`}
              >
                {/* Chat Header - Now sticky */}
                <div className="sticky top-0 z-10 p-4 border-b border-border flex justify-between items-center bg-card">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {chatMembers.slice(0, 2).map((member, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            i === 0 ? "bg-indigo-500" : "bg-purple-500"
                          }`}
                        >
                          {member.name.charAt(0)}
                        </div>
                      ))}
                      {chatMembers.length > 2 && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-secondary">
                          +{chatMembers.length - 2}
                        </div>
                      )}
                    </div>
                    <h2 className="font-semibold">
                      {chatMembers.length <= 2
                        ? chatMembers.map((member) => member.name).join(", ")
                        : `${chatMembers[0].name}, ${chatMembers[1].name} & ${
                            chatMembers.length - 2
                          } more`}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Close button added to header */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setChatOpened(false)}
                      className="p-2 rounded-full hover:bg-secondary/70 transition-colors"
                      aria-label="Close chat"
                    >
                      <X size={18} />
                    </motion.button>
                    <ChatMenu
                      onAddMember={() => setIsAddMemberOpen(true)}
                      onDeleteChat={handleDeleteRoom}
                    />
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <AnimatePresence initial={false}>
                    {chatMessages.map((message, index) => {
                      const isMe = message.senderId === loginInfo.id;
                      const sender = chatMembers.find(
                        (member) => member._id === message.senderId
                      );

                      // Group consecutive messages from the same sender
                      const prevMessage =
                        index > 0 ? chatMessages[index - 1] : null;
                      const isConsecutive =
                        prevMessage &&
                        prevMessage.senderId === message.senderId;

                      return (
                        <motion.div
                          key={message._id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex ${
                            isMe ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] group ${
                              isMe ? "items-end" : "items-start"
                            } ${isConsecutive ? "mt-1" : "mt-3"}`}
                          >
                            {!isConsecutive && (
                              <div
                                className={`flex items-center gap-2 mb-1 ${
                                  isMe ? "justify-end" : "justify-start"
                                }`}
                              >
                                {!isMe && (
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-indigo-500">
                                    {sender?.name.charAt(0)}
                                  </div>
                                )}
                                <span className="text-xs font-medium">
                                  {isMe ? "You" : sender?.name || "Unknown"}
                                </span>
                              </div>
                            )}

                            <div className="relative">
                              <div
                                className={`px-4 py-2 rounded-lg ${
                                  isMe
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground"
                                }`}
                              >
                                <p>{message.text}</p>
                              </div>

                              {isMe && (
                                <motion.button
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileHover={{ opacity: 1, scale: 1 }}
                                  className="absolute top-0 right-0 -mt-2 -mr-2 p-1 rounded-full bg-destructive opacity-0 group-hover:opacity-70 transition-opacity"
                                  onClick={() =>
                                    handleDeleteMessage(message._id)
                                  }
                                >
                                  <X className="h-3 w-3 text-white" />
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border bg-card">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type a message..."
                      disabled={isSending}
                      className="flex-1 bg-secondary border-none rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={isSending || messageInput.trim() === ""}
                      className={`p-3 rounded-full discord-gradient text-white shadow-md ${
                        isSending || messageInput.trim() === ""
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <Send className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col justify-center items-center p-8"
              >
                <div className="max-w-md text-center">
                  <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-6" />
                  <h3 className="text-xl font-semibold mb-2 discord-text">
                    Select a conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a chat from the list or create a new one to start
                    messaging
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Create Chat Button - hide when chat is open */}
      {!chatOpened && <CreateChatButton loginInfo={loginInfo} />}

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAddMember={handleAddMember}
      />

      {/* User Drawer */}
      <UserDrawer
        isOpen={isUserDrawerOpen}
        onClose={() => setIsUserDrawerOpen(false)}
        loginInfo={loginInfo}
      />
    </div>
  );
};

export default ChatLobby;
