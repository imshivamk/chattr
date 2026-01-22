import React from 'react'
import { useChatStore } from '../../store/useChatStore'
import { getRandomTailwindColorClass } from '../../utils';

const ChatHeader = () => {

    const {selectedUser} = useChatStore() as any;
  return (
    <div className='w-[90%] bg-blue-300/90 h-[10%] m-2 p-2 rounded-3xl flex flex-row items-center px-6 gap-4'>
      <div className={`w-10 h-10 ${getRandomTailwindColorClass()} rounded-full flex items-center justify-center font-bold`}>
                  {selectedUser.name?.charAt(0) || selectedUser.username?.charAt(0)}
                </div>
        <h2 className='text-lg font-semibold text-white'>{selectedUser.name || selectedUser.username}</h2>
    </div>
  )
}

export default ChatHeader
