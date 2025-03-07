"use client";

import React from "react";

import { SWRConfig } from "swr";

import { toast } from "sonner";

import Login from "@/components/login";
import Loading from "@/components/loading";
import UserPanel from "@/components/user-panel";
import ChatLobby from "@/components/chat-lobby";
import useUser from "./hooks/useUser";

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
        <SWRConfig
          value={{
            refreshInterval: 3000,
            fetcher: (resource) =>
              fetch(resource, {
                headers: {
                  Authorization: `Bearer ${loginInfo.token}`,
                },
              }).then((res) => res.json()),
          }}
        >
          <div>
            <div>
              <UserPanel loginInfo={loginInfo} />
              <ChatLobby loginInfo={loginInfo} />
            </div>
          </div>
        </SWRConfig>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Page;
