'use client';
import { useState } from 'react';
import { Task, Project } from '../../types';
import TaskColumn from './TaskColumn';

interface TasksTabProps {
  tasks: Task[];
  currentProject: Project | null;
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
  currentProject,
  isCreatingTask,
  setIsCreatingTask,
  newTask,
  setNewTask,
  handleCreateTask,
  handleUpdateTaskStatus,
  setActiveTab
}: TasksTabProps) {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-blue-500 font-semibold">
          {currentProject ? `${currentProject.title} Tasks` : 'Task Board'}
        </h2>
        {currentProject && (
          <button 
            onClick={() => setIsCreatingTask(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded hover:from-blue-700 hover:to-indigo-800"
          >
            Add Task
          </button>
        )}
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
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsCreatingTask(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded hover:from-blue-700 hover:to-indigo-800"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      
      {currentProject ? (
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
            <p className="text-gray-600">No tasks created yet</p>
          </div>
        )
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">You need to be accepted to a project to view tasks</p>
          <button 
            onClick={() => setActiveTab('applications')}
            className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded hover:from-blue-700 hover:to-indigo-800"
          >
            View Applications
          </button>
        </div>
      )}
    </div>
  );
}