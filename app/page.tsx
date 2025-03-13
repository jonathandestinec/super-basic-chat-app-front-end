"use client";

import React from "react";

import { toast } from "sonner";

import Login from "@/components/login";
import Loading from "@/components/loading";
import ChatLobby from "@/components/chat-lobby";
import useUser from "../hooks/useUser";

const Page = () => {
  const { loginInfo, isLoading } = useUser();

  if (isLoading) {
    toast("Checking auth");
    return <Loading type="page" />;
  }

  return (
    <div>
      {isLoading ? (
        <Loading type="page" />
      ) : loginInfo ? (
        <div>
          <div>
            <ChatLobby loginInfo={loginInfo} />
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Page;
