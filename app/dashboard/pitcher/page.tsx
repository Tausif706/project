'use client';
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/lib/supabase';
import { useSupabaseChat } from '@/hooks/useSupabaseChat';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatTab from './components/ChatTab';
import TasksTab from './components/TasksTab';
import IdeasTab from './components/IdeasTab';
import CollaboratorsTab from './components/CollaboratorsTab';
import FindProfessionalTab from './components/FindProfessionalTab';

export default function PitcherDashboard() {
  const { user, loading } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState('ideas');
  const [ideas, setIdeas] = useState([]);
  const [collaboratorRequests, setCollaboratorRequests] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo' });
  const [markedMessages, setMarkedMessages] = useState([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [summaryError, setAiSummaryError] = useState(null);
  const { messages: chatMessages, loading: chatLoading, sendMessage } = useSupabaseChat(currentProjectId);

  useEffect(() => {
    if (user) {
      loadIdeas();
      loadCollaboratorRequests();
    }
  }, [user]);

  useEffect(() => {
    if (currentProjectId) {
      loadTasks();
    }
  }, [currentProjectId]);

  const loadIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user.id);

      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      console.error('Error loading ideas:', error);
    }
  };

  const loadCollaboratorRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('collaborator_requests')
        .select(`
          id,
          status,
          user:users(
            id,
            name,
            skills,
            rating
          )
        `)
        .eq('project_id', currentProjectId);

      if (error) throw error;
      setCollaboratorRequests(data || []);
    } catch (error) {
      console.error('Error loading collaborator requests:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', currentProjectId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleCreateIdea = async (title: string, description: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          title,
          description,
          owner_id: user.id,
          status: 'draft'
        });

      if (error) throw error;
      await loadIdeas();
    } catch (error) {
      console.error('Error creating idea:', error);
    }
  };

  const handleUpdateProjectStatus = async (projectId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);

      if (error) throw error;
      await loadIdeas();
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const handleAcceptCollaborator = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('collaborator_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;
      await loadCollaboratorRequests();
    } catch (error) {
      console.error('Error accepting collaborator:', error);
    }
  };

  const handleRejectCollaborator = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('collaborator_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;
      await loadCollaboratorRequests();
    } catch (error) {
      console.error('Error rejecting collaborator:', error);
    }
  };

  const handleCreateTask = async () => {
    if (!currentProjectId || !newTask.title.trim()) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          project_id: currentProjectId,
          title: newTask.title,
          description: newTask.description,
          status: newTask.status
        });
        
      if (error) throw error;
      
      setNewTask({ title: '', description: '', status: 'todo' });
      setIsCreatingTask(false);
      await loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);
        
      if (error) throw error;
      await loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleRequestProfessional = async (professionalId: string) => {
    if (!currentProjectId) return;

    try {
      const { error } = await supabase
        .from('professional_requests')
        .insert({
          project_id: currentProjectId,
          professional_id: professionalId,
          status: 'pending'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error requesting professional:', error);
      throw error;
    }
  };

  const toggleMarkMessage = (messageId: string) => {
    setMarkedMessages(prev => {
      const isMarked = prev.some(m => m.id === messageId);
      if (isMarked) {
        return prev.filter(m => m.id !== messageId);
      } else {
        const message = messages.find(m => m.id === messageId);
        return [...prev, message];
      }
    });
  };

  const generateAiSummary = async () => {
    if (markedMessages.length === 0) return;
    
    setIsGeneratingSummary(true);
    setAiSummaryError(null);

    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: markedMessages }),
      });

      if (!response.ok) throw new Error('Failed to generate summary');

      const data = await response.json();
      setAiSummary(data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setAiSummaryError('Failed to generate summary. Please try again.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="grid grid-cols-4 gap-4 p-4 h-[calc(100vh-4rem)]">
        <Sidebar 
          currentProjectId={currentProjectId}
          ideas={ideas}
          setCurrentProjectId={setCurrentProjectId}
          markedMessages={markedMessages}
        />

        <div className="col-span-3 bg-white rounded-lg shadow border border-gray-200 flex flex-col">
          {activeTab === 'ideas' && (
            <IdeasTab 
              ideas={ideas}
              currentProjectId={currentProjectId}
              setCurrentProjectId={setCurrentProjectId}
              handleCreateIdea={handleCreateIdea}
              handleUpdateProjectStatus={handleUpdateProjectStatus}
            />
          )}

          {activeTab === 'chat' && (
            <ChatTab
              messages={chatMessages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={sendMessage}
              currentProjectId={currentProjectId}
              ideas={ideas}
              markedMessages={markedMessages}
              toggleMarkMessage={toggleMarkMessage}
              generateAiSummary={generateAiSummary}
              isGeneratingSummary={isGeneratingSummary}
              aiSummary={aiSummary}
              setAiSummary={setAiSummary}
              summaryError={summaryError}
              user={user}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksTab
              tasks={tasks}
              currentProjectId={currentProjectId}
              handleCreateTask={handleCreateTask}
              handleUpdateTaskStatus={handleUpdateTaskStatus}
            />
          )}

          {activeTab === 'collaborators' && (
            <CollaboratorsTab
              collaboratorRequests={collaboratorRequests}
              handleAcceptCollaborator={handleAcceptCollaborator}
              handleRejectCollaborator={handleRejectCollaborator}
            />
          )}

          {activeTab === 'find-professionals' && (
            <FindProfessionalTab
              currentProjectId={currentProjectId}
              handleRequestProfessional={handleRequestProfessional}
            />
          )}
        </div>
      </div>
    </div>
  );
}