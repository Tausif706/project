'use client';
import { Message, ActiveMentorship } from '../types';
import MessageItem from './MessageItem';
import { useState, useRef, useEffect } from 'react';

interface ChatTabProps {
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  activeMentorships: ActiveMentorship[];
  currentProjectId: string | null;
  setActiveTab: (tab: string) => void;
  user: { id: string } | null;
}

export default function ChatTab({
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  activeMentorships,
  currentProjectId,
  setActiveTab,
  user
}: ChatTabProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const currentMentorship = activeMentorships.find(m => m.project_id === currentProjectId);

  return (
    <>
      <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-gray-50">
        <h3 className="font-semibold text-gray-800">
          {currentMentorship 
            ? `Project Chat - ${currentMentorship.project.title}`
            : 'No active mentorship selected'}
        </h3>
      </div>
      
      {currentMentorship ? (
        <>
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-500">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <MessageItem 
                    key={message.id} 
                    message={message} 
                    isCurrentUser={message.user_id === user?.id} 
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border border-gray-300 p-2 rounded text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Type your message..."
              />
              <button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-gray-500">Select an active mentorship to access the chat</p>
            <button 
              onClick={() => setActiveTab('mentorships')}
              className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              View Mentorships
            </button>
          </div>
        </div>
      )}
    </>
  );
}