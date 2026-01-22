import { Paperclip, Send } from "lucide-react";
import React, { useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import toast from "react-hot-toast";

const MessageInput = () => {
  const {messages} = useChatStore();
  const { sendMessage, selectedUser } = useChatStore();
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
  };

  const removeImage = () => {
    if (image) setImage("");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !image) return;

    try {

      await sendMessage(
        selectedUser?._id as string,
          message.trim(),
          image || "");

    } catch (error) {
      toast.error("Failed to send message");
    }

    setMessage("");
    setImage(null);

  };

  return (
    <div
      className="w-[90%] absolute bottom-2 bg-blue-300/90 h-[10%] m-2 rounded-3xl flex flex-row 
      items-center justify-around px-6 gap-4"
    >
      <input
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        className="bg-white rounded-full flex-1 h-10 px-4 outline-none"
        placeholder="Type your message..."
      ></input>

      <input
        onChange={handleImageChange}
        type="file"
        accept="image/*"
        className="hidden"
        id="fileInput"
      />
      <label htmlFor="fileInput"></label>

      {image && (
        <div className="relative">
          <img
            src={image}
            alt="preview"
            className="w-16 h-16 object-cover rounded-md"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
          >
            X
          </button>
        </div>
      )}

      <button
        id="fileSelectBtn"
        onClick={() => document.getElementById("fileInput")?.click()}
        className="bg-white rounded-full p-2 items-center flex active:scale-90 active:bg-orange-400 hover:bg-orange-400"
      >
        <Paperclip />
      </button>

      <button
        onClick={handleSendMessage}
        disabled={!message.trim() && !image}
        className="bg-white rounded-full p-2 items-center flex active:scale-90 active:bg-red-400 hover:bg-red-400"
      >
        <Send />
      </button>
    </div>
  );
};

export default MessageInput;
