'use client';
import { useSupabaseChat } from '@/hooks/useSupabaseChat';
import { Project } from '../../types';
import MessageItem from './MessageItem';
import { useState, useEffect, useRef } from 'react';

interface ChatTabProps {
  currentProject: Project | null;
  currentProjectId: string | null;
  setActiveTab: (tab: string) => void;
  user: { id: string } | null;
}

export default function ChatTab({
  currentProject,
  currentProjectId,
  setActiveTab,
  user
}: ChatTabProps) {
  const { messages, loading, sendMessage ,channelStatus} = useSupabaseChat(currentProjectId);
  const [newMessage, setNewMessage] = useState('');
  const handleSendMessage = () => {
    if (!user || !newMessage.trim()) return;
    sendMessage(newMessage, user.id);
    setNewMessage('');
  };

  return (
    <>
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-gray-50">
        <h3 className="font-semibold text-gray-800">
          {currentProject 
            ? `Project Chat - ${currentProject.title}`
            : 'No active project selected'}
        </h3>
      </div>
      {currentProject ? (
        <>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : messages.length === 0 ? (
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
                className="flex-1 border border-gray-300 p-2 rounded text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your message..."
              />
              <button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-gray-500">You need to be accepted to a project to access the chat</p>
            <button 
              onClick={() => setActiveTab('applications')}
              className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded hover:from-blue-700 hover:to-indigo-800 transition-all"
            >
              View Applications
            </button>
          </div>
        </div>
      )}
    </>
  );
}