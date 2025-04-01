'use client';
import { ActiveMentorship } from '../types';

interface MentorshipsTabProps {
  activeMentorships: ActiveMentorship[];
  currentProjectId: string | null;
  setCurrentProjectId: (id: string) => void;
}

export default function MentorshipsTab({
  activeMentorships,
  currentProjectId,
  setCurrentProjectId
}: MentorshipsTabProps) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl text-purple-500 font-semibold mb-4">Active Mentorships</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeMentorships.length === 0 ? (
          <div className="col-span-2 text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">You don't have any active mentorships yet</p>
          </div>
        ) : (
          activeMentorships.map(mentorship => (
            <div 
              key={mentorship.id} 
              className={`bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer ${
                currentProjectId === mentorship.project_id ? 'border-purple-500' : ''
              }`}
              onClick={() => setCurrentProjectId(mentorship.project_id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{mentorship.project.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Next Meeting: {new Date(mentorship.next_meeting).toLocaleDateString()}
                  </p>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full" 
                      style={{ width: `${mentorship.progress}%` }}
                    />
                  </div>
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-indigo-700">
                  Join Call
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}