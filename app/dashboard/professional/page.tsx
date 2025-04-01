'use client';
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/lib/supabase';
import { useSupabaseChat } from '@/hooks/useSupabaseChat';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatTab from './components/ChatTab';
import TasksTab from './components/TasksTab';
import MentorshipsTab from './components/MentorshipsTab';
import PitchesTab from './components/PitchesTab';
import EarningsTab from './components/EarningsTab';
import ScheduleTab from './components/ScheduleTab';

export default function ProfessionalDashboard() {
  const { user, loading } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState('pitches');
  const [mentorshipRequests, setMentorshipRequests] = useState([]);
  const [activeMentorships, setActiveMentorships] = useState([]);
  const [earnings, setEarnings] = useState({
    total: 0,
    pending: 0,
    recent: []
  });
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo' });
  const { messages, loading: chatLoading, sendMessage } = useSupabaseChat(currentProjectId);

  useEffect(() => {
    if (user) {
      loadMentorshipRequests();
      loadActiveMentorships();
      loadEarnings();
    }
  }, [user]);

  useEffect(() => {
    if (currentProjectId) {
      loadTasks();
    }
  }, [currentProjectId]);

  const loadMentorshipRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          industry,
          stage,
          looking_for,
          owner:users(name)
        `)
        .eq('status', 'seeking_mentor');

      if (error) throw error;
      setMentorshipRequests(data || []);
    } catch (error) {
      console.error('Error loading mentorship requests:', error);
    }
  };

  const loadActiveMentorships = async () => {
    try {
      const { data, error } = await supabase
        .from('mentorships')
        .select(`
          id,
          project_id,
          project:projects(title, description),
          progress,
          next_meeting
        `)
        .eq('mentor_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      setActiveMentorships(data || []);

      if (data?.length > 0 && !currentProjectId) {
        setCurrentProjectId(data[0].project_id);
      }
    } catch (error) {
      console.error('Error loading active mentorships:', error);
    }
  };

  // const loadEarnings = async () => {
  //   try {
  //     const { data: stats, error: statsError } = await supabase
  //       .from('mentor_stats')
  //       .select('total_earnings, pending_earnings')
  //       .eq('mentor_id', user.id)
  //       .single();

  //     if (statsError) {
  //       if (statsError.code === 'PGRST116') {
  //         const { data: newStats, error: createError } = await supabase
  //           .from('mentor_stats')
  //           .insert({
  //             mentor_id: user.id,
  //             total_earnings: 0,
  //             pending_earnings: 0
  //           })
  //           .select()
  //           .single();

  //         if (createError) throw createError;
  //         stats = newStats;
  //       } else {
  //         throw statsError;
  //       }
  //     }

  //     const { data: recent, error: recentError } = await supabase
  //       .from('mentor_earnings')
  //       .select('*')
  //       .eq('mentor_id', user.id)
  //       .order('created_at', { ascending: false })
  //       .limit(5);

  //     if (recentError) throw recentError;

  //     setEarnings({
  //       total: stats?.total_earnings || 0,
  //       pending: stats?.pending_earnings || 0,
  //       recent: recent || []
  //     });
  //   } catch (error) {
  //     console.error('Error loading earnings:', error);
  //   }
  // };
const loadEarnings = async () => {
  try {
    let stats; // Declare as let instead of const
    const { data: initialStats, error: statsError } = await supabase
      .from('mentor_stats')
      .select('total_earnings, pending_earnings')
      .eq('mentor_id', user.id)
      .single();

    if (statsError) {
      if (statsError.code === 'PGRST116') {
        const { data: newStats, error: createError } = await supabase
          .from('mentor_stats')
          .insert({
            mentor_id: user.id,
            total_earnings: 0,
            pending_earnings: 0
          })
          .select()
          .single();

        if (createError) throw createError;
        stats = newStats;
      } else {
        throw statsError;
      }
    } else {
      stats = initialStats;
    }

    const { data: recent, error: recentError } = await supabase
      .from('mentor_earnings')
      .select('*')
      .eq('mentor_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) throw recentError;

    setEarnings({
      total: stats?.total_earnings || 0,
      pending: stats?.pending_earnings || 0,
      recent: recent || []
    });
  } catch (error) {
    console.error('Error loading earnings:', error);
  }
};
  const loadTasks = async () => {
    if (!currentProjectId) return;
    
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

  const handleAcceptMentorship = async (projectId) => {
    try {
      const { error } = await supabase
        .from('mentorships')
        .insert({
          project_id: projectId,
          mentor_id: user.id,
          status: 'active'
        });

      if (error) throw error;

      await Promise.all([
        loadMentorshipRequests(),
        loadActiveMentorships()
      ]);
      
      setCurrentProjectId(projectId);
      setActiveTab('mentorships');
    } catch (error) {
      console.error('Error accepting mentorship:', error);
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

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
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

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="grid grid-cols-4 gap-4 p-4 h-[calc(100vh-4rem)]">
        <Sidebar 
          activeMentorships={activeMentorships}
          currentProjectId={currentProjectId}
          setCurrentProjectId={setCurrentProjectId}
          earnings={earnings}
        />

        <div className="col-span-3 bg-white rounded-lg shadow border border-gray-200 flex flex-col">
          {activeTab === 'pitches' && (
            <PitchesTab 
              mentorshipRequests={mentorshipRequests}
              handleAcceptMentorship={handleAcceptMentorship}
            />
          )}

          {activeTab === 'mentorships' && (
            <MentorshipsTab 
              activeMentorships={activeMentorships}
              currentProjectId={currentProjectId}
              setCurrentProjectId={setCurrentProjectId}
            />
          )}

          {activeTab === 'chat' && (
            <ChatTab
              messages={messages}
              loading={chatLoading}
              sendMessage={sendMessage}
              activeMentorships={activeMentorships}
              currentProjectId={currentProjectId}
              setActiveTab={setActiveTab}
              user={user}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksTab
              tasks={tasks}
              activeMentorships={activeMentorships}
              currentProjectId={currentProjectId}
              isCreatingTask={isCreatingTask}
              setIsCreatingTask={setIsCreatingTask}
              newTask={newTask}
              setNewTask={setNewTask}
              handleCreateTask={handleCreateTask}
              handleUpdateTaskStatus={handleUpdateTaskStatus}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleTab activeMentorships={activeMentorships} />
          )}

          {activeTab === 'earnings' && (
            <EarningsTab earnings={earnings} />
          )}
        </div>
      </div>
    </div>
  );
}