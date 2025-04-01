'use client';
import { Idea } from '../types';
import { UserGroupIcon, StarIcon } from '@heroicons/react/24/outline';
import ProfileSection from './ProfileSection';

interface SidebarProps {
  currentProjectId: string | null;
  ideas: Idea[];
  setCurrentProjectId: (id: string) => void;
  markedMessages: any[];
}

export default function Sidebar({ 
  currentProjectId, 
  ideas, 
  setCurrentProjectId,
  markedMessages 
}: SidebarProps) {
  const acceptedProjects = ideas.filter(idea => idea.status === 'accepted');

  return (
    <div className="col-span-1 flex-1 flex flex-col space-y-4 h-[calc(100vh-4rem)] overflow-y-auto">
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
      
      {acceptedProjects.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-bold mb-3 text-gray-800">Active Projects</h2>
          <div className="space-y-3">
            {acceptedProjects.map(idea => (
              <div 
                key={idea.id}
                className={`p-3 rounded-lg cursor-pointer ${
                  currentProjectId === idea.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentProjectId(idea.id)}
              >
                <h3 className="font-medium text-gray-800">{idea.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Progress: {idea.progress}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      <ProfileSection />
    </div>
  );
}