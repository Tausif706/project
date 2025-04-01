'use client';
import { useState, useRef } from 'react';
import { Message, Idea } from '../types';
import { StarIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import MessageItem from './MessageItem';

interface ChatTabProps {
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  currentProjectId: string | null;
  ideas: Idea[];
  markedMessages: Message[];
  toggleMarkMessage: (id: string) => void;
  generateAiSummary: () => void;
  isGeneratingSummary: boolean;
  aiSummary: string;
  setAiSummary: (summary: string) => void;
  summaryError: string | null;
  user: { id: string } | null;
}

export default function ChatTab({
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  currentProjectId,
  ideas,
  markedMessages,
  toggleMarkMessage,
  generateAiSummary,
  isGeneratingSummary,
  aiSummary,
  setAiSummary,
  summaryError,
  user
}: ChatTabProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-gray-50 sticky top-0 z-10">
        <h3 className="font-semibold text-gray-800">
          {currentProjectId 
            ? `Project Chat - ${ideas.find(i => i.id === currentProjectId)?.title}`
            : 'No active project selected'}
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {messages.map((message) => {
                console.log('Rendering Message:', {
                messageId: message.id,
                userId: message.user_id,
                currentUserId: user?.id,
                isCurrentUser: message.user_id === user?.id
                });
                
                return (
                <MessageItem
                    key={message.id}
                    message={message}
                    isCurrentUser={message.user_id === user?.id}
                    toggleMarkMessage={toggleMarkMessage}
                    isMarked={markedMessages.some(m => m.id === message.id)}
                />
                );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="sticky bottom-0 bg-white border-t p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type a message..."
            disabled={!currentProjectId}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !currentProjectId}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {markedMessages.length > 0 && (
        <div className="fixed bottom-20 right-8">
          <button
            onClick={generateAiSummary}
            disabled={isGeneratingSummary}
            className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-50"
            style={{ width: '56px', height: '56px' }}
          >
            {isGeneratingSummary ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <StarIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      )}
      
      {aiSummary && (
        <div className="fixed bottom-32 right-8 bg-white p-4 rounded-lg shadow-lg max-w-md border border-blue-200 z-50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-blue-600">AI Conversation Summary</h4>
            <button 
              onClick={() => setAiSummary('')}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="prose prose-sm text-gray-700 max-h-64 overflow-y-auto">
            {aiSummary.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}