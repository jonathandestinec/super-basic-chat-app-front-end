import { Suspense } from "react";
import Login from "./components/login";
import ChatLobby from "./components/chat-lobby";
import UserInfo from "./components/user-info";
import ME from "@/lib/auth/me";

export default async function Home() {
  const me = await ME();

  console.log("ME", me);

  if (!me) {
    return <Login />;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-6">Chat Rooms</h1>
          <Suspense fallback={<div>Loading chat rooms...</div>}>
            <ChatLobby />
          </Suspense>
        </div>
        <div>
          <UserInfo me={me} />
        </div>
      </div>
    </main>
  );
}
