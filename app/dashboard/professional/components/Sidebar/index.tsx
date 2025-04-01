'use client';
import { ActiveMentorship } from './types';
import ProfileSection from 'app/dashboard/pitcher/components/ProfileSection'
interface SidebarProps {
  activeMentorships: ActiveMentorship[];
  currentProjectId: string | null;
  setCurrentProjectId: (id: string) => void;
  earnings: {
    total: number;
    pending: number;
  };
}

export default function Sidebar({
  activeMentorships,
  currentProjectId,
  setCurrentProjectId,
  earnings
}: SidebarProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Stats</h2>
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Active Mentorships</p>
            <p className="text-2xl font-bold mt-1">{activeMentorships.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Earnings</p>
            <p className="text-2xl font-bold mt-1">${earnings.total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {activeMentorships.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Active Mentorships</h2>
          <div className="space-y-3">
            {activeMentorships.map(mentorship => (
              <div 
                key={mentorship.id}
                className={`p-3 rounded-lg cursor-pointer ${
                  currentProjectId === mentorship.project_id 
                    ? 'bg-purple-50 border border-purple-200' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentProjectId(mentorship.project_id)}
              >
                <h3 className="font-medium text-gray-800">{mentorship.project.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Progress: {mentorship.progress}%
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