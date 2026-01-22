import type { Socket } from "socket.io-client";

export type User = {
  _id: string;
  email: string;
  name: string;
  isVerified: boolean;
  // add other safe fields that checkAuth returns
};

export type AuthState = {
  user: User | null;
  loading: boolean;

  socket: Socket | null;
  onlineUsers: [];

  authenticate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: {}) => Promise<void>;

  connectSocket: () => void;
  disconnectSocket: () => void;
}

export type ChatState = {
  allContacts: [];
  chats: [];
  messages: Message[];
  activeTab: string;
  selectedUser: User | null;
  isUserLoading: boolean;
  isMessageLoading: boolean;
  listenForMessages: () => void;
  stopListeningForMessages: () => void;
  setActiveTab: (tab:string) => void;
  setSelectedUser: (userId: string | null) => void;
  getAllContacts: () => Promise<void>;
  getChatPartners: () => Promise<void>;
  getMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, text: string, image:string) => Promise<void>;  

}


export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  isSending?: boolean; // For our Optimistic UI
}

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
export interface AuthProviderProps {
    children: React.ReactNode
}

