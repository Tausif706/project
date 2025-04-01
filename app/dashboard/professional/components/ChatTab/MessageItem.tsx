'use client';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

export default function MessageItem({ message, isCurrentUser }: MessageItemProps) {
  return (
    <div key={message.id} className={`flex items-start gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-3 rounded-lg max-w-[70%] relative ${
        isCurrentUser
          ? 'bg-purple-50 border border-purple-100'
          : 'bg-gray-50 border border-gray-100'
      } ${message.pending ? 'opacity-70' : ''}`}>
        {message.pending && (
          <div className="absolute top-1 right-1">
            <svg className="animate-spin h-4 w-4 text-purple-500" 
                 xmlns="http://www.w3.org/2000/svg" fill="none" 
                 viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" 
                      stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </div>
        )}
        <p className="text-sm font-medium text-gray-800">{message.user.name}</p>
        <p className="text-gray-700 mt-1">{message.content}</p>
        <span className="text-xs text-gray-500 mt-1 block">
          {new Date(message.created_at).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}