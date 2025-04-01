'use client';
import { CollaboratorRequest } from '../types';
import { StarIcon, CheckCircleIcon ,XMarkIcon } from '@heroicons/react/24/outline';

interface CollaboratorsTabProps {
  collaboratorRequests: CollaboratorRequest[];
  handleAcceptCollaborator: (requestId: string) => void;
  handleRejectCollaborator: (requestId: string) => void;
}

export default function CollaboratorsTab({
  collaboratorRequests,
  handleAcceptCollaborator,
  handleRejectCollaborator
}: CollaboratorsTabProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl text-blue-500 font-semibold mb-4">Collaboration Requests</h2>
      <div className="space-y-4">
        {collaboratorRequests.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">No collaboration requests yet.</p>
            <p className="text-sm text-gray-500 mt-2">Open your project for collaboration to receive requests.</p>
          </div>
        ) : (
          collaboratorRequests.map(request => (
            <div key={request.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{request.user.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {request.user.skills?.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center mt-2">
                    <StarIcon className="h-4 w-4 text-amber-400" />
                    <span className="text-sm ml-1 text-amber-600">{request.user.rating}</span>
                  </div>
                </div>
                {request.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleAcceptCollaborator(request.id)}
                      className="text-green-600 hover:text-green-700 transition-colors"
                    >
                      <CheckCircleIcon className="h-6 w-6" />
                    </button>
                    <button 
                      onClick={() => handleRejectCollaborator(request.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}