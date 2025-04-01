'use client';
import { useState } from 'react';
import { Idea } from '../types';
import IdeaCard from './IdeaCard';

interface IdeasTabProps {
  ideas: Idea[];
  currentProjectId: string | null;
  setCurrentProjectId: (id: string) => void;
  handleCreateIdea: (title: string, description: string) => void;
  handleUpdateProjectStatus: (projectId: string, newStatus: string) => void;
}

export default function IdeasTab({
  ideas,
  currentProjectId,
  setCurrentProjectId,
  handleCreateIdea,
  handleUpdateProjectStatus
}: IdeasTabProps) {
  const [isCreatingIdea, setIsCreatingIdea] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: '', description: '' });

  const onCreateIdea = () => {
    handleCreateIdea(newIdea.title, newIdea.description);
    setIsCreatingIdea(false);
    setNewIdea({ title: '', description: '' });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-blue-500 font-semibold">My Ideas</h2>
        <button 
          onClick={() => setIsCreatingIdea(true)}
          className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded hover:from-blue-700 hover:to-teal-700"
        >
          New Idea
        </button>
      </div>
      
      {isCreatingIdea && (
        <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4">
          <h3 className="text-lg font-semibold mb-3">Create New Idea</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newIdea.title}
                onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Idea title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newIdea.description}
                onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
                className="w-full border border-gray-300 p-2 rounded"
                rows={3}
                placeholder="Describe your idea..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsCreatingIdea(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={onCreateIdea}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded hover:from-blue-700 hover:to-teal-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.length === 0 ? (
          <div className="col-span-2 text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">You don't have any ideas yet. Create your first one!</p>
          </div>
        ) : (
          ideas.map(idea => (
            <IdeaCard 
              key={idea.id}
              idea={idea}
              currentProjectId={currentProjectId}
              setCurrentProjectId={setCurrentProjectId}
              handleUpdateProjectStatus={handleUpdateProjectStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}