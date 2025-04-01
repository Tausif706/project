'use client';
import { Application } from '../types';
import ProfileSection from 'app/dashboard/pitcher/components/ProfileSection'

interface SidebarProps {
  acceptedProjects: Application[];
  currentProjectId: string | null;
  setCurrentProjectId: (id: string) => void;
  pendingApplicationsCount: number;
}

export default function Sidebar({
  acceptedProjects,
  currentProjectId,
  setCurrentProjectId,
  pendingApplicationsCount
}: SidebarProps) {
  return (
    <div className="col-span-1 flex flex-col space-y-4">
      <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-blue-600">Quick Stats</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Active Projects</p>
            <p className="text-2xl font-bold mt-1 text-gray-800">
              {acceptedProjects.length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Pending Applications</p>
            <p className="text-2xl font-bold mt-1 text-gray-800">
              {pendingApplicationsCount}
            </p>
          </div>
        </div>
      </div>

      {acceptedProjects.length > 0 && (
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Active Projects</h2>
          <div className="space-y-3">
            {acceptedProjects.map(app => (
              <div 
                key={app.id}
                className={`p-3 rounded-lg cursor-pointer ${
                  currentProjectId === app.project.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentProjectId(app.project.id)}
              >
                <h3 className="font-medium text-gray-800">{app.project.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Owner: {app.project.owner.name}
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