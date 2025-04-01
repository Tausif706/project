'use client';
import { Idea } from '../types';

interface CurrentProjectPanelProps {
  currentProjectId: string | null;
  ideas: Idea[];
}

export default function CurrentProjectPanel({ currentProjectId, ideas }: CurrentProjectPanelProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Current Project</h2>
      {currentProjectId && (
        <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
          <h3 className="font-semibold text-gray-900">
            {ideas.find(i => i.id === currentProjectId)?.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Progress: {ideas.find(i => i.id === currentProjectId)?.progress}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-teal-500 h-1.5 rounded-full" 
              style={{ width: `${ideas.find(i => i.id === currentProjectId)?.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}