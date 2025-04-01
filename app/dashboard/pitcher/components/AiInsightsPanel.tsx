'use client';
import { Message } from '../types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AiInsightsPanelProps {
  markedMessages: Message[];
  toggleMarkMessage: (id: string) => void;
  generateAiSummary: () => void;
  aiSummary: string;
}

export default function AiInsightsPanel({
  markedMessages,
  toggleMarkMessage,
  generateAiSummary,
  aiSummary
}: AiInsightsPanelProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h2 className="text-lg font-bold mb-3 text-gray-800">AI Insights</h2>
      {markedMessages.length === 0 ? (
        <p className="text-sm text-gray-500">Mark important messages to generate summary</p>
      ) : (
        <>
          <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
            {markedMessages.map(message => (
              <div key={message.id} className="p-2 bg-blue-50 rounded text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{message.user.name}</span>
                  <button 
                    onClick={() => toggleMarkMessage(message.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
                <p className="line-clamp-2">{message.content}</p>
              </div>
            ))}
          </div>
          <button
            onClick={generateAiSummary}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white px-3 py-2 rounded text-sm hover:from-blue-700 hover:to-teal-700"
          >
            Generate Summary
          </button>
          {aiSummary && (
            <div className="mt-3 p-3 bg-blue-50 rounded">
              <p className="text-sm">{aiSummary}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}