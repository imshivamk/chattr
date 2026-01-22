import { useEffect, useRef } from 'react'
import { useChatStore } from '../../store/useChatStore'
import { useAuthStore } from '../../store/useAuthStore';

const MessageList = () => {

  const {messages, getMessages, selectedUser, listenForMessages, stopListeningForMessages} = useChatStore();
  const {user} = useAuthStore();
  const latestMsgRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const fetchMessages = async () => {
      if(selectedUser){
        await getMessages(selectedUser._id);
        listenForMessages();
      }
    }
    fetchMessages();
    
    return ()=> {
      stopListeningForMessages();
    }
  }, [selectedUser?._id])

  useEffect(()=>{
    latestMsgRef.current && messages && latestMsgRef.current.scrollIntoView({
      behavior: "smooth"
    })
  })

return (

    <div className="flex flex-col w-full overflow-y-auto [scrollbar-width:none]
     px-4 py-16  space-y-4">
      
      {messages.map((m) => {
        const isMe = m.senderId === user?._id;

        return (
          <div
            key={m._id}
            className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
          >
            
            <div
              className={`chatBubble 
                max-w-[75%] md:max-w-[60%] p-3 shadow-sm transition-all 
                ${
                isMe
                  ? "bg-blue-500 text-white rounded-2xl rounded-tr-none"
                  : "bg-white text-zinc-800 rounded-2xl rounded-tl-none border border-zinc-200"
                } 
                ${m.isSending ? "opacity-70 italic" : "opacity-100"}`}
            >

              {/* image */}
              {m.image && (
                <img
                  src={m.image}
                  alt="Attachment"
                  className="rounded-lg mb-2 max-h-72 w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                />
              )}

              {/* text */}
              {m.text && <p className="text-sm md:text-base wrap-break-word leading-relaxed
              ">{m.text}</p>}

            </div>

            
          </div>
        );
      })}

      {/* 3. Invisible dummy div that we scroll into view */}
      <div ref={latestMsgRef} />
    </div>
  );
};

export default MessageList
