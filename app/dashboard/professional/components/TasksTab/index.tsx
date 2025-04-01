'use client';
import { Task, ActiveMentorship } from '../types';
import TaskColumn from './TaskColumn';
import { useState } from 'react';

interface TasksTabProps {
  tasks: Task[];
  activeMentorships: ActiveMentorship[];
  currentProjectId: string | null;
  isCreatingTask: boolean;
  setIsCreatingTask: (value: boolean) => void;
  newTask: { title: string; description: string; status: string };
  setNewTask: (task: { title: string; description: string; status: string }) => void;
  handleCreateTask: () => void;
  handleUpdateTaskStatus: (taskId: string, newStatus: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function TasksTab({
  tasks,
  activeMentorships,
  currentProjectId,
  isCreatingTask,
  setIsCreatingTask,
  newTask,
  setNewTask,
  handleCreateTask,
  handleUpdateTaskStatus,
  setActiveTab
}: TasksTabProps) {
  const mentorshipForTasks = activeMentorships.find(m => m.project_id === currentProjectId);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-purple-500 font-semibold">
          {mentorshipForTasks ? `${mentorshipForTasks.project.title} Tasks` : 'Task Board'}
        </h2>
        {mentorshipForTasks && (
          <button 
            onClick={() => setIsCreatingTask(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-indigo-700"
          >
            Add Task
          </button>
        )}
      </div>
      
      {isCreatingTask && (
        <div className="bg-white p-4 rounded-lg border border-purple-200 mb-4">
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
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsCreatingTask(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-indigo-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      
      {mentorshipForTasks ? (
        tasks.length > 0 ? (
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
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">No tasks created yet for this mentorship</p>
          </div>
        )
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">Select an active mentorship to view tasks</p>
          <button 
            onClick={() => setActiveTab('mentorships')}
            className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-indigo-700"
          >
            View Mentorships
          </button>
        </div>
      )}
    </div>
  );
}