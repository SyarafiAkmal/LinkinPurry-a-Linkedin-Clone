import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import useAuth from '@/hooks/useAuth';

export type UserConnected = {
  id: string;
  profile_photo_path: string;
  full_name: string;
};

export type Message = {
  id: string;
  from_id: string;
  to_id: string;
  message: string;
  timestamp: string;
}

export type Chat = {
  user: UserConnected;
  messages: Message[];
}

export default function Chat() {
  const [users, setUsers] = useState<UserConnected[]>([]);
  // const [client, setClient] = useState<UserConnected>();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetch(`http://localhost:3000/api/connections/${user?.id}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.body.users);
        setUsers(data.body.users);
        // setClient(user);
      })
      .catch((error) => console.error('Failed to fetch chats:', error));
  }, [user]);
  
  // useEffect(() => {
  //   fetch(`http://localhost:3000/api/chat-history/${user?.id}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (Array.isArray(data.chathistory) && data.chathistory.length > 0) {
  //         users?.map((user: UserConnected) => {
  //           const msg_holder: Message[] = [];
  //           data.chathistory.map((msg: Message) => {
  //             if(msg.from_id === user.id || msg.to_id === user.id) {
  //               msg_holder.push({
  //                 id: msg.id,
  //                 from_id: msg.from_id,
  //                 to_id: msg.to_id,
  //                 message: msg.message,
  //                 timestamp: msg.timestamp
  //               });
  //             }
  //           });
  //           setChats((prevChats) => [...prevChats, {
  //             user: user,
  //             messages: msg_holder
  //           }]);
  //           // console.log(msg_holder, 'chat holder');
  //         })
  //       } else {
  //         console.error('chathistory is either not an array or is empty');
  //       }
  //     })
  //     .catch((error) => console.error('Failed to fetch chats:', error));
  // }, [user]);

  // chats?.map((chat: Chat) => {
  //   // console.log(chat.id, 'id');
  //   chat.messages?.map((msg: Message) => {
  //     console.log(msg.message);
  //     console.log(msg.timestamp.toLocaleTimeString('en-US'));
  //   })
  // });
  // console.log(client, 'client');
  const toggleChat = (chatId: string) => {
    setActiveChat((prev) => (prev === chatId ? null : chatId)); // Toggle active chat
  };

  return (
    <div className="fixed bottom-0 right-4 flex flex items-end space-x-3">
      <ChatList users={users} toggleChat={toggleChat} activeChat={activeChat}/>
      {activeChat && (
        <ChatWindow
          key={activeChat}
          userChat={users.find(user => user.id === activeChat)!}
          onClose={() => setActiveChat(null)} // Close the active chat
          user={user}
        />
      )}
    </div>
  );
}