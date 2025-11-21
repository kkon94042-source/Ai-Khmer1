import React from 'react';
import { ChatMessage } from '../types';

interface ChatMessageItemProps {
  message: ChatMessage;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
        } ${message.isError ? 'bg-red-100 text-red-600 border-red-200' : ''}`}
      >
        <div className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
            {/* Simple markdown-like rendering for basic formatting if needed, 
                but whitespace-pre-wrap handles most needs */}
            {message.text}
        </div>
        <div
          className={`text-[10px] mt-1 opacity-70 text-right w-full ${
            isUser ? 'text-indigo-100' : 'text-gray-400'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageItem;