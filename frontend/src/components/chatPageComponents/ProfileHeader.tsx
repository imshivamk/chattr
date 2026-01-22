import React from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { LogOut } from 'lucide-react';

const ProfileHeader = () => {

  const { user, logout } = useAuthStore();

  return (
    <div className='profile-header
    text-center m-2 bg-gray-500/30 rounded-md h-12
    flex items-center justify-between p-3
    '>
      <div className="text-white font-mono">
        {user?.name}
      </div>
      
      <button onClick={()=> logout()} 
      className="bg-white/40 p-1 rounded-full
      hover:bg-white active:scale-90
      cursor-pointer
      
      "><LogOut/></button>

    </div>
  )
}

export default ProfileHeader
