import React from "react";

import { Skeleton } from "./ui/skeleton";

const Loading = ({
  width,
  height,
  type,
}: {
  width?: string;
  height?: string;
  type: "page" | "component";
}) => {
  return (
    <div>
      {type === "page" ? (
        <div className=" w-full h-screen flex items-center justify-center">
          <Skeleton className="w-96 h-96 rounded-2xl" />
        </div>
      ) : (
        <Skeleton className={`${width} ${height} ml-auto mr-auto`} />
      )}
    </div>
  );
};

export default Loading;
