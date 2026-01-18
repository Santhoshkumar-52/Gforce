import React from "react";
import useAuthStore from "../store/useStore.js";

const Settings = () => {
  const { logout, staffs } = useAuthStore();
  console.log(staffs);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-medium text-gray-800">Settings</h1>
      <hr />
    </div>
  );
};

export default Settings;
