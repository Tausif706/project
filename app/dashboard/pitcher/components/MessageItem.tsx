'use client';
import { Message } from '../types';
import { StarIcon } from '@heroicons/react/24/outline';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  toggleMarkMessage: (id: string) => void;
  isMarked: boolean;
}

export default function MessageItem({
  message,
  isCurrentUser,
  toggleMarkMessage,
  isMarked
}: MessageItemProps) {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] rounded-lg p-3 relative ${
          isCurrentUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        } ${message.pending ? 'opacity-70' : ''}`}
      >
        {message.pending && (
          <div className="absolute top-1 right-1">
            <svg className="animate-spin h-4 w-4 text-blue-200" 
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
        
        {!isCurrentUser && (
          <p className="text-xs font-semibold mb-1">{message.user.name}</p>
        )}
        
        <p className="text-sm">{message.content}</p>
        
        <div className={`flex items-center justify-end mt-1 space-x-1 ${
          isCurrentUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span className="text-xs">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleMarkMessage(message.id);
            }}
            className={`p-0.5 rounded-full ${
              isMarked
                ? 'text-amber-300'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <StarIcon className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}