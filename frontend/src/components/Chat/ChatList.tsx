import React, { useState } from 'react';
import userIcon from "@/assets/user.svg"
import { ChevronUp, ChevronDown, MessageCircle } from 'lucide-react'
import { UserConnected, Chat } from './Chat';


type ChatListProps = {
  users: UserConnected[] | null;
  toggleChat: (chatId: string) => void;
  activeChat: string | null;
};

export default function ChatList({ users, toggleChat, activeChat }: ChatListProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-t-lg shadow-lg w-64">
      <div
        className="flex items-center justify-between p-3 bg-white hover:bg-gray-100 text-black cursor-pointer rounded-t-lg"
        onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center">
          <span className="font-semibold">Messaging</span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[400px]' : 'max-h-0'}`}
      >
        <div className="max-h-96 overflow-y-auto">
          {users && users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer ${
                  activeChat === user.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => {
                    toggleChat(user.id);
                }}
              >
                <img
                  src={userIcon}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="flex-1">
                  <h6 className="flex align-start font-semibold text-black">{user.full_name}</h6>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic p-3">You haven't connect with anyone yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}