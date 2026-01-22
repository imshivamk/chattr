import { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';

const MessageList = () => {
  const { messages, getMessages, selectedUser } = useChatStore();
  const { user } = useAuthStore();
  
  // Create a ref for the element at the very bottom of the list
  const messageEndRef = useRef<HTMLDivElement>(null);

  // 1. Handle fetching and Socket.io subscriptions
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }

  }, [selectedUser?._id, getMessages]);

  // 2. Automatic Scroll to Bottom whenever messages change
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 w-full overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50">
      {messages.map((m) => {
        const isMe = m.senderId === user?._id;

        return (
          <div
            key={m._id}
            className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
          >
            {/* The Message Bubble */}
            <div
              className={`max-w-[75%] md:max-w-[60%] p-3 shadow-sm transition-all ${
                isMe
                  ? "bg-blue-500 text-white rounded-2xl rounded-tr-none"
                  : "bg-white text-zinc-800 rounded-2xl rounded-tl-none border border-zinc-200"
              } ${m.isSending ? "opacity-70 italic" : "opacity-100"}`}
            >
              {/* Render Image if exists */}
              {m.image && (
                <img
                  src={m.image}
                  alt="Attachment"
                  className="rounded-lg mb-2 max-h-72 w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                />
              )}

              {/* Text content */}
              {m.text && <p className="text-sm md:text-base leading-relaxed break-words">{m.text}</p>}
            </div>

            
          </div>
        );
      })}

      {/* 3. Invisible dummy div that we scroll into view */}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;