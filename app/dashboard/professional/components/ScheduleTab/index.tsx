'use client';
import { ActiveMentorship } from '../types';
import { ClockIcon } from '@heroicons/react/24/outline';

interface ScheduleTabProps {
  activeMentorships: ActiveMentorship[];
}

export default function ScheduleTab({ activeMentorships }: ScheduleTabProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl text-purple-500 font-semibold mb-4">Schedule</h2>
      <div className="space-y-4">
        {activeMentorships.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">No upcoming mentorship sessions</p>
          </div>
        ) : (
          activeMentorships.map(mentorship => (
            <div 
              key={mentorship.id} 
              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{mentorship.project.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(mentorship.next_meeting).toLocaleString()}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-purple-600">
                  <ClockIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}