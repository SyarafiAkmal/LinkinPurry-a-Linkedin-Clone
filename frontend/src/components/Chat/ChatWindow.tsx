import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import userIcon from "@/assets/user.svg";
import { UserConnected, Message } from './Chat';
// import useAuth from '@/hooks/useAuth';

type ChatWindowProps = {
  userChat: UserConnected | undefined;
  onClose: () => void;
  user: UserConnected | undefined;
};

export default function ChatWindow({ userChat, onClose, user }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/chat-history/${user?.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.chathistory)) {
          const msg_holder: Message[] = [];
            data.chathistory.map((msg: Message) => {
              if(msg.from_id === userChat?.id || msg.to_id === userChat?.id) {
                msg_holder.push({
                  id: msg.id,
                  from_id: msg.from_id,
                  to_id: msg.to_id,
                  message: msg.message,
                  timestamp: msg.timestamp
                });
              }
            });
            setMessages(msg_holder);
        } else {
          console.error('Invalid chat history data:', data);
        }
      })
      .catch((error) => console.error('Failed to fetch chat history:', error));
  }, [user]);

  // console.log(messages);
  useEffect(() => {
    try {
      const ws = new WebSocket(`ws://127.0.0.1:3000/api/chat/${user?.id}`); // Should be /api/chat/current_client_id
      setSocket(ws);
  
      ws.onopen = (event) => {
        console.log('WebSocket connection established', event);
      };
  
      ws.onmessage = (event) => {
        console.log('Received message:', event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.status === 'success' && data.receivedMessage) {
            setMessages((prevMessages) => [...prevMessages, data.receivedMessage]);
          }
        } catch (parseError) {
          console.error('Error parsing message:', parseError);
        }
      };
  
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
      ws.onclose = (event) => {
        console.log('WebSocket closed', event);
      };
  
      return () => {
        ws.close();
      };
    } catch (connectionError) {
      console.error('WebSocket connection error:', connectionError);
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (message.trim() && socket && user && userChat) {
      const newMessage: Message = {
        id: (messages.length ? parseInt(messages[messages.length - 1].id) + 1 : 1).toString(),
        from_id: user.id, // current client id
        to_id: userChat.id,
        message: message,
        timestamp: new Date().toISOString(),
      };
      
      socket.send(JSON.stringify(newMessage));
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="bg-white rounded-t-lg shadow-lg w-80 flex flex-col h-96">
      <div className="flex items-center justify-between p-3 bg-gray-100 rounded-t-lg">
        <div className="flex items-center">
          <img
            src={userIcon}
            alt={userChat?.full_name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="font-semibold">{userChat?.full_name}</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div
        className="flex-1 overflow-y-auto p-3"
        ref={chatContainerRef} 
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-2 ${msg.from_id === user?.id ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg max-w-full break-words ${
              msg.from_id === user?.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}>  {/* It should be msg.from_id == current_client_id */}
              {msg.message}
            </div>
            <div className="text-xs text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleTimeString('en-US', 
                {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="ml-2 text-blue-600 hover:text-blue-700"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}