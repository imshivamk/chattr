import { create } from "zustand";
import type { ChatState, User, Message } from "../types/types";
import toast from "react-hot-toast";
import { api } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create<ChatState>((set, get)=>({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab : "chats",
    selectedUser: null as null | User,
    isUserLoading: false,
    isMessageLoading: false,

    listenForMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) {
            console.log("No selected user, not listening for messages");
            return;
        }

        const socket = useAuthStore.getState().socket;
        if(!socket) {
            console.log("No socket connection, not listening for messages");
            return;
        }

        console.log("Setting up message listener for user:", selectedUser._id);
        socket.off("newMessage");

        socket.on("newMessage", (newMessage:Message)=>{
            console.log("Received newMessage event:", newMessage);
            if(newMessage.senderId === selectedUser._id){
                console.log("Message from selected user, adding to messages");
                set({
                    messages: [
                        ...get().messages,
                        newMessage
                    ]
                })
            } else {
                console.log("Message not from selected user:", newMessage.senderId, "vs", selectedUser._id);
            }
        })
    },

    stopListeningForMessages:() => {
        const socket = useAuthStore.getState().socket;
        if(socket) socket.off("newMessage")
    },

    setActiveTab: (tab:string) =>  set({activeTab: tab}),
    setSelectedUser: async (userId: string | null) => {
        const selectedUser = await api.get('/chat/' + userId); 
        set({selectedUser: selectedUser.data.user});
    },
    getAllContacts: async () => {
        set({isUserLoading: true});
        try {
            const res = await api.get("/chat/contacts");
            set({allContacts: res.data.contacts});
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            set({isUserLoading: false});
        }
    },
    getChatPartners: async () => {
        set({isUserLoading: true});
        try {
            const res = await api.get("/chat/chats");
            console.log("Fetched chats:", res.data.chatPartners);
            set({chats: res.data.chatPartners});
            
        } catch (error:any) {
            toast.error(error.response.data.message);
        } finally {
            set({isUserLoading: false});
        }
    },
    getMessages: async (chatId: string) => {
        set({isMessageLoading: true});
        try {
            const res = await api.get(`/chat/messages/${chatId}`);
            set({messages: res.data.messages});
        } catch (error:any) {
            toast.error(error.response.data.message);
        } finally {
            set({isMessageLoading: false});
        }
    },
    sendMessage: async (chatId: string, text: string, image:string) => {
        try {
            console.log("sending message")
            const res = await api.post(`/chat/send/${chatId}`, {
                text,
                image
            });
            const messages = get().messages;
            set({messages: [...messages, res.data.savedMessage ]})
        } catch (error:any) {
            toast.error(error.response.data.message);
        }
    },

}));
