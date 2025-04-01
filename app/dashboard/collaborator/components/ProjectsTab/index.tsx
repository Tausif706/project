'use client';
import { Project, Application } from '../../types';

interface ProjectsTabProps {
  availableProjects: Project[];
  applications: Application[];
  handleApplyToProject: (projectId: string) => void;
}

export default function ProjectsTab({
  availableProjects,
  applications,
  handleApplyToProject
}: ProjectsTabProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl text-blue-500 font-semibold mb-4">Available Projects</h2>
      {availableProjects.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">No available projects at the moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {availableProjects.map(project => {
            const hasApplied = applications.some(app => app.project.id === project.id);
            return (
              <div key={project.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                    <p className="text-gray-600 mt-1">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.looking_for?.map(skill => (
                        <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center">
                      <span className="text-sm text-gray-600">
                        Owner: {project.owner.name}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleApplyToProject(project.id)}
                    className={`px-4 py-2 rounded-lg hover:shadow-lg transition-all ${
                      hasApplied
                        ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
                    }`}
                    disabled={hasApplied}
                  >
                    {hasApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}