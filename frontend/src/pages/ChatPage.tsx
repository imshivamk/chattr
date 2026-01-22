import ChatHeader from "../components/chatPageComponents/ChatHeader";
import ChatsList from "../components/chatPageComponents/ChatsList";
import ContactList from "../components/chatPageComponents/ContactList";
import MessageInput from "../components/chatPageComponents/MessageInput";
import MessageList from "../components/chatPageComponents/MessageList";
import ProfileHeader from "../components/chatPageComponents/ProfileHeader";
import TabSwitch from "../components/chatPageComponents/TabSwitch";
import { useChatStore } from "../store/useChatStore";

const ChatPage = () => {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="main flex items-center justify-center">
      <div className="container bg-gray-800/50 backdrop-blur-sm
      max-h-screen h-180 w-270 mt-8 rounded-3xl
      flex items-center justify-center p-4
      ">

        <div className="left-side flex flex-col bg-gray-600/30
        h-[90%] w-[30%] rounded-2xl m-4
        ">
          <ProfileHeader/>
          <TabSwitch/>
          <div className="flex-1 overflow-y-auto space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>

        </div>

        <div className="right-side flex flex-col items-center bg-gray-600/30
        h-[90%] w-[70%] rounded-2xl m-4 relative
        ">
          {selectedUser ? (
            <>
              <ChatHeader />
              <MessageList/>
              <MessageInput/>
              {/* <div className="p-4 text-center text-gray-400">
                Chat with user ID: {selectedUser._id}
              </div> */}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <h2 className="text-2xl font-semibold mb-4">Select a chat or contact</h2>
              <p className="text-center px-8">
                Choose a conversation from the left or start a new chat by selecting a contact.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
