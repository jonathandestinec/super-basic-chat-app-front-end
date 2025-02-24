"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function ChatLobby() {
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      const response = await fetch("/api/chat-rooms");
      const data = await response.json();
      setChatRooms(data);
    };

    fetchChatRooms();
  }, []);

  return (
    <div className="space-y-4">
      <Button className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" /> Create New Chat Room
      </Button>

      <div className="grid gap-4">
        {chatRooms.map((room) => (
          <div
            key={room.id}
            className="p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <h2 className="text-lg font-semibold">{room.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
