import React, { useEffect } from 'react'
import { useChatStore } from '../../store/useChatStore'
import { getRandomTailwindColorClass } from '../../utils';

const ContactList = () => {

  const {
    getAllContacts,
    allContacts,
    isUserLoading,
    selectedUser,
    setSelectedUser
  } = useChatStore();


  useEffect(()=>{
    getAllContacts();
  }, [])

  if(isUserLoading){
      return <div className="p-4 text-center">Loading contacts...</div>;
  }
  if(allContacts.length === 0){
    return <div className="p-4 text-center text-gray-400">No contacts found</div>;
  }

  console.log("All Contacts:", allContacts);

  

  return (
      <div className='contact-list flex flex-col gap-1 p-2 bg-gray-500/10 rounded-md m-2 h-[95%] overflow-y-auto custom-scrollbar'>
        <h2 className="text-sm font-semibold px-2 mb-2 text-gray-400">Recent Chats</h2>
        
        {allContacts.map((contact: any) => (
          <button
            key={contact._id}
            onClick={() => setSelectedUser(contact._id)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 
              ${selectedUser === contact._id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'hover:bg-gray-500/20 text-gray-200'
              }`}
          >
            {/* Avatar Placeholder */}
            <div className={`w-10 h-10 ${getRandomTailwindColorClass()} rounded-full flex items-center justify-center font-bold`}>
              {contact.name?.charAt(0) || contact.username?.charAt(0)}
            </div>
  
            <div className="flex flex-col items-start overflow-hidden">
              <span className="font-medium truncate w-full text-left">
                {contact.name || contact.username}
              </span>
              {/* Optional: Show online status or last message snippet here */}
              <span className={`text-xs ${selectedUser === contact._id ? 'text-blue-100' : 'text-gray-400'}`}>
                Click to message
              </span>
            </div>
          </button>
        ))}
      </div>
    );
}

export default ContactList
