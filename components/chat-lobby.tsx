"use client";

import React from "react";

import getChatRooms from "@/lib/chat/getChatRooms";

import { toast } from "sonner";
import getChat from "@/lib/chat/getChat";

const ChatLobby = ({ loginInfo }: { loginInfo: Me }) => {
  // Get Chat Rooms
  const [chatRooms, setChatRooms] = React.useState<Room[]>([]);
  const [chatOpened, setChatOpened] = React.useState(false);
  const [chatMembers, setChatMembers] = React.useState<User[]>([]);
  const [chatMessages, setChatMessages] = React.useState<Message[]>([]);
  const [messageInput, setMessageInput] = React.useState("");
  const [openRoomId, setOpenRoomId] = React.useState("");

  React.useEffect(() => {
    const fetchLobbyData = async () => {
      const fetchedChatRooms = await getChatRooms(loginInfo);

      setChatRooms(fetchedChatRooms.rooms);
      console.log(fetchedChatRooms);
    };

    toast.promise(fetchLobbyData(), {
      loading: "Loading chat rooms...",
      success: "Chat rooms loaded successfully",
      error: "Failed to load chat rooms",
    });
  }, []);

  const handleToggleChat = async (roomId: string) => {
    console.log(roomId);

    const fetchedChat = await getChat(roomId);

    setChatMembers(fetchedChat.members);
    setChatMessages(fetchedChat.messages);
    setChatOpened(true);
    setOpenRoomId(roomId);
  };

  const handleSendMessage = async () => {
    console.log(openRoomId);
    if (messageInput === "") return;
    const newMessage: Message = {
      _id: "",
      chatId: chatRooms[0]._id,
      senderId: loginInfo.id,
      text: messageInput,
    };
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageInput("");
  };

  return (
    <div>
      <h1>Chat Lobby</h1>

      <p>{loginInfo.name}&apos;s Chats</p>

      {/* Available Chat Room Cards */}

      {/* The loop was causing multiple renders */}

      {chatRooms.length > 0 ? (
        chatRooms.map((room) => {
          return (
            <div key={room._id}>
              <div>
                {room.members.length > 0 ? (
                  <div
                    onClick={() => {
                      handleToggleChat(room._id);
                    }}
                  >
                    {room.members[0].name}+{room.members[1].name}
                  </div>
                ) : (
                  <div>No member</div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div>No chat room</div>
      )}

      {chatOpened && (
        <div>
          <h2>Chat</h2>
          <div>
            {chatMessages.map((message) => (
              <div key={message._id}>
                <p>
                  {
                    chatMembers.find(
                      (member) => member._id === message.senderId
                    )?.name
                  }
                </p>
                <p>{message.text}</p>
              </div>
            ))}
          </div>

          {/* message Input */}
          <div>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              className=" ml-16"
              onClick={() => {
                handleSendMessage();
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLobby;
