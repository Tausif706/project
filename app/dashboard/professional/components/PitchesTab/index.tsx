'use client';
import { MentorshipRequest } from '../types';

interface PitchesTabProps {
  mentorshipRequests: MentorshipRequest[];
  handleAcceptMentorship: (projectId: string) => void;
}

export default function PitchesTab({
  mentorshipRequests,
  handleAcceptMentorship
}: PitchesTabProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl text-purple-500 font-semibold mb-4">Open Pitches</h2>
      <div className="space-y-4">
        {mentorshipRequests.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">No open pitches available at the moment</p>
          </div>
        ) : (
          mentorshipRequests.map(pitch => (
            <div key={pitch.id} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-all">
              <h3 className="text-lg font-semibold">{pitch.title}</h3>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-sm text-gray-600">Industry</p>
                  <p className="font-medium">{pitch.industry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stage</p>
                  <p className="font-medium">{pitch.stage}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Looking For:</p>
                <div className="flex flex-wrap gap-2">
                  {pitch.looking_for.map(role => (
                    <span key={role} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => handleAcceptMentorship(pitch.id)}
                className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-indigo-700 transition-all"
              >
                Offer Guidance
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}