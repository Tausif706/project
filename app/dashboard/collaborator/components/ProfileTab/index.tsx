'use client';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ProfileTabProps {
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  handleUpdateSkills: () => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
}

export default function ProfileTab({
  selectedSkills,
  setSelectedSkills,
  handleUpdateSkills,
  newSkill,
  setNewSkill
}: ProfileTabProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl text-blue-500 font-semibold mb-4">Skills Profile</h2>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Skills</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSkills.map(skill => (
              <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {skill}
                <button 
                  onClick={() => {
                    const newSkills = selectedSkills.filter(s => s !== skill);
                    setSelectedSkills(newSkills);
                    handleUpdateSkills();
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-700"
                >
                  <XMarkIcon className="h-4 w-4 inline" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add new skill"
              className="flex-1 border border-gray-300 p-2 rounded-lg text-gray-800"
            />
            <button 
              onClick={() => {
                if (newSkill.trim()) {
                  const updatedSkills = [...selectedSkills, newSkill.trim()];
                  setSelectedSkills(updatedSkills);
                  setNewSkill('');
                  handleUpdateSkills();
                }
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              Add Skill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}