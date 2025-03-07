import React from "react";

const UserPanel = ({ loginInfo }: { loginInfo: Me }) => {
  return (
    <div>
      <h1>{loginInfo.id}</h1>
      <h1>{loginInfo.name}</h1>
    </div>
  );
};

export default UserPanel;
