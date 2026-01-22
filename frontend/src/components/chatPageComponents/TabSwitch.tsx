import React from "react";
import { useChatStore } from "../../store/useChatStore";

const TabSwitch = () => {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div
      className="tab-switch
    text-center mt-0.5 m-2  bg-gray-500/30 rounded-md h-10
      flex items-center justify-center gap-6
    "
    >
      <div
        onClick={() => {
          setActiveTab("chats");
        }}
      className={`chats  px-3 py-1 rounded-2xl
        cursor-pointer active:scale-95 hover:bg-blue-400/50
        ${activeTab === "chats" ? "bg-blue-400/50" : "bg-gray-400/30"}
        `}
      >
        Chats
      </div>

      <div
        onClick={() => {
          setActiveTab("contacts");
        }}
      className={`chats  px-3 py-1 rounded-2xl
        cursor-pointer active:scale-95 hover:bg-blue-400/50
        ${activeTab === "chats" ? "bg-gray-400/50" : "bg-blue-400/50"}
        `}
      >
        Contacts
      </div>
    </div>
  );
};

export default TabSwitch;
