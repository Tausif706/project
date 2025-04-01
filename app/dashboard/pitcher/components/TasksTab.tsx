'use client';
import { useState } from 'react';
import { Task } from '../types';
import TaskColumn from './TaskColumn';

interface TasksTabProps {
  tasks: Task[];
  currentProjectId: string | null;
  handleCreateTask: (title: string, description: string, status: string) => void;
  handleUpdateTaskStatus: (taskId: string, newStatus: string) => void;
}

export default function TasksTab({
  tasks,
  currentProjectId,
  handleCreateTask,
  handleUpdateTaskStatus
}: TasksTabProps) {
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    status: 'todo' as 'todo' | 'in_progress' | 'done' 
  });

  const onCreateTask = () => {
    handleCreateTask(newTask.title, newTask.description, newTask.status);
    setIsCreatingTask(false);
    setNewTask({ title: '', description: '', status: 'todo' });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-blue-500 font-semibold">Task Board</h2>
        <button 
          onClick={() => setIsCreatingTask(true)}
          className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded hover:from-blue-700 hover:to-teal-700"
        >
          Add Task
        </button>
      </div>
      
      {isCreatingTask && (
        <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4">
          <h3 className="text-lg font-semibold mb-3">Create New Task</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Task title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="w-full border border-gray-300 p-2 rounded"
                rows={2}
                placeholder="Task details..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({...newTask, status: e.target.value as any})}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsCreatingTask(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={onCreateTask}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded hover:from-blue-700 hover:to-teal-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TaskColumn 
          title="To Do"
          tasks={tasks.filter(task => task.status === 'todo')}
          status="todo"
          onUpdateStatus={handleUpdateTaskStatus}
        />
        <TaskColumn 
          title="In Progress"
          tasks={tasks.filter(task => task.status === 'in_progress')}
          status="in_progress"
          onUpdateStatus={handleUpdateTaskStatus}
        />
        <TaskColumn 
          title="Done"
          tasks={tasks.filter(task => task.status === 'done')}
          status="done"
          onUpdateStatus={handleUpdateTaskStatus}
        />
      </div>
    </div>
  );
}