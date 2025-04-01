'use client';
import { Task } from '../../types';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: 'todo' | 'in_progress' | 'done';
  onUpdateStatus: (taskId: string, newStatus: string) => void;
}

export default function TaskColumn({
  title,
  tasks,
  status,
  onUpdateStatus
}: TaskColumnProps) {
  const getButtonText = () => {
    switch(status) {
      case 'todo': return 'Start';
      case 'in_progress': return 'Complete';
      default: return '';
    }
  };

  const getNextStatus = () => {
    switch(status) {
      case 'todo': return 'in_progress';
      case 'in_progress': return 'done';
      default: return 'done';
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="font-semibold mb-3 text-gray-700">{title}</h3>
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-sm p-2">No tasks yet</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="bg-white p-3 rounded border border-gray-200 shadow-sm">
              <h4 className="font-medium text-gray-800">{task.title}</h4>
              {task.description && (
                <p className="text-gray-600 text-sm mt-1">{task.description}</p>
              )}
              {status !== 'done' && (
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => onUpdateStatus(task.id, getNextStatus())}
                    className={`text-xs px-2 py-1 rounded ${
                      status === 'todo' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {getButtonText()}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}