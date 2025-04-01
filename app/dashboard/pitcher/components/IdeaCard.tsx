'use client';
import { Idea } from '../types';
import { UserGroupIcon, StarIcon } from '@heroicons/react/24/outline';

interface IdeaCardProps {
  idea: Idea;
  currentProjectId: string | null;
  setCurrentProjectId: (id: string) => void;
  handleUpdateProjectStatus: (projectId: string, newStatus: string) => void;
}

export default function IdeaCard({
  idea,
  currentProjectId,
  setCurrentProjectId,
  handleUpdateProjectStatus
}: IdeaCardProps) {
  return (
    <div 
      className={`bg-white p-4 rounded-lg border ${
        currentProjectId === idea.id ? 'border-blue-500' : 'border-gray-200'
      } hover:shadow-md transition-all cursor-pointer`}
      onClick={() => setCurrentProjectId(idea.id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg text-blue-400 font-semibold">{idea.title}</h3>
          <p className="text-sm text-gray-600 mt-1">Status: {idea.status}</p>
        </div>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          {idea.progress}%
        </span>
      </div>
      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{idea.description}</p>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-teal-500 h-1.5 rounded-full" 
            style={{ width: `${idea.progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center">
            <UserGroupIcon className="h-4 w-4 mr-1 text-gray-600" />
            <span className="text-sm text-gray-600">{idea.collaborators}</span>
          </div>
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 mr-1 text-amber-400" />
            <span className="text-sm text-amber-400">{idea.stars}</span>
          </div>
        </div>
        {currentProjectId === idea.id && (
          <div className="mt-3 flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateProjectStatus(idea.id, idea.status === 'open' ? 'draft' : 'open');
              }}
              className={`text-sm px-2 py-1 rounded ${
                idea.status === 'open' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {idea.status === 'open' ? 'Set to Draft' : 'Open for Collaboration'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}