'use client';
import { Application } from '../../types';

interface ApplicationsTabProps {
  applications: Application[];
  currentProjectId: string | null;
  setCurrentProjectId: (id: string) => void;
}

export default function ApplicationsTab({
  applications,
  currentProjectId,
  setCurrentProjectId
}: ApplicationsTabProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl text-blue-500 font-semibold mb-4">My Applications</h2>
      <div className="space-y-3">
        {applications.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-500">You haven't applied to any projects yet</p>
          </div>
        ) : (
          applications.map(app => (
            <div 
              key={app.id} 
              className={`bg-white p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer ${
                currentProjectId === app.project.id ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => setCurrentProjectId(app.project.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">{app.project.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Applied on {new Date(app.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-2">
                    Owner: {app.project.owner.name}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  app.status === 'accepted' 
                    ? 'bg-green-100 text-green-800' 
                    : app.status === 'pending'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}