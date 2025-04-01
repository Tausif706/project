'use client';
import { useState, useEffect, useRef } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

import { 
  BriefcaseIcon,
  DocumentCheckIcon,
  UserCircleIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatTab from './components/ChatTab';
import ProjectsTab from './components/ProjectsTab';
import ApplicationsTab from './components/ApplicationsTab';
import TasksTab from './components/TasksTab';
import ProfileTab from './components/ProfileTab';
import { Message, Project, Application, Task, NavItem } from './types';

export default function CollaboratorDashboard() {
  const { user, loading } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo' });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const [channel, setChannel] = useState<any>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);


  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadProjects();
      loadApplications();
    }
  }, [user]);

  useEffect(() => {
    if (currentProjectId) {
      loadMessages();
      loadTasks().catch(err => console.log("Tasks table not available:", err.message));
      setupRealtimeSubscriptions();
    }
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [currentProjectId]);

//   const setupRealtimeSubscriptions = () => {
//   if (!currentProjectId || !user) return;

//   // Clean up existing channel if it exists
//   if (channel) {
//     supabase.removeChannel(channel);
//   }

//   const newChannel = supabase
//     .channel(`project_chat:${currentProjectId}`)
//     .on(
//       'postgres_changes',
//       {
//         event: 'INSERT',
//         schema: 'public',
//         table: 'messages',
//         filter: `project_id=eq.${currentProjectId}`
//       },
//       async (payload) => {
//         // Fetch user details for the new message
//         const { data: userData } = await supabase
//           .from('users')
//           .select('name, avatar_url')
//           .eq('id', payload.new.user_id)
//           .single();

//         setMessages(prev => [
//           ...prev.filter(m => !m.pending),
//           {
//             ...payload.new,
//             user: userData || { name: 'Unknown', avatar_url: null },
//             pending: false
//           }
//         ]);
//       }
//     )
//     .subscribe((status) => {
//       if (status === 'SUBSCRIBED') {
//         console.log('Successfully connected to chat channel');
//       }
//     });

//   setChannel(newChannel);

//   return () => {
//     if (newChannel) {
//       supabase.removeChannel(newChannel);
//     }
//   };
// };
// Add to your state
const [channelStatus, setChannelStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

// Update the setupRealtimeSubscriptions
const setupRealtimeSubscriptions = () => {
  if (!currentProjectId || !user) return;

  setChannelStatus('connecting');

  const newChannel = supabase
    .channel(`project_chat:${currentProjectId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    })
    .on('presence', { event: 'sync' }, () => {
      console.log('Online users: ', newChannel.presenceState());
    })
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `project_id=eq.${currentProjectId}`
      },
      async (payload) => {
        // Handle different event types
        if (payload.eventType === 'INSERT') {
          const { data: userData } = await supabase
            .from('users')
            .select('name, avatar_url')
            .eq('id', payload.new.user_id)
            .single();

          setMessages(prev => [
            ...prev.filter(m => !m.pending),
            {
              ...payload.new,
              user: userData || { name: 'Unknown', avatar_url: null },
              pending: false
            }
          ]);
        } else if (payload.eventType === 'DELETE') {
          setMessages(prev => prev.filter(m => m.id !== payload.old.id));
        }
      }
    )
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        setChannelStatus('connected');
      } else if (err) {
        setChannelStatus('disconnected');
        console.error('Channel error:', err);
      }
    });

  setChannel(newChannel);

  // Add error handling and reconnection logic
  newChannel.on('error', (error) => {
    console.error('Channel error:', error);
    setChannelStatus('disconnected');
  });

  newChannel.on('close', () => {
    console.log('Channel closed');
    setChannelStatus('disconnected');
  });

  return () => {
    if (newChannel) {
      supabase.removeChannel(newChannel);
      setChannelStatus('disconnected');
    }
  };
};
// Update the useEffect for channel management
useEffect(() => {
  if (currentProjectId && user) {
    const cleanup = setupRealtimeSubscriptions();
    return () => {
      cleanup?.();
    };
  }
}, [currentProjectId, user]);

  const handleRealtimeMessageUpdate = async (payload: any) => {
    switch (payload.eventType) {
      case 'INSERT':
        const { data: userData } = await supabase
          .from('users')
          .select('name')
          .eq('id', payload.new.user_id)
          .single();

        setMessages(prev => [
          ...prev.filter(m => !m.pending),
          {
            ...payload.new,
            user: userData || { name: 'Unknown' },
            pending: false
          }
        ]);
        break;

      case 'UPDATE':
        setMessages(prev => prev.map(m => 
          m.id === payload.new.id ? { 
            ...payload.new, 
            user: m.user 
          } : m
        ));
        break;

      case 'DELETE':
        setMessages(prev => prev.filter(m => m.id !== payload.old.id));
        break;
    }
  };

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
      if (data.skills) {
        setSelectedSkills(data.skills);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          status,
          looking_for,
          owner:users(name)
        `)
        .eq('status', 'open');

      if (error) throw error;
      setAvailableProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('collaborator_requests')
        .select(`
          id,
          status,
          created_at,
          project:projects(*, owner:users(name))
        `)
        .eq('user_id', user!.id);

      if (error) throw error;
      setApplications(data || []);

      if (!currentProjectId) {
        const acceptedApp = data?.find(app => app.status === 'accepted');
        if (acceptedApp) {
          setCurrentProjectId(acceptedApp.project.id);
        }
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const loadMessages = async () => {
    if (!currentProjectId) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          user_id,
          created_at,
          project_id,
          user:users(name)
        `)
        .eq('project_id', currentProjectId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
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

  const handleApplyToProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('collaborator_requests')
        .insert({
          project_id: projectId,
          user_id: user!.id,
          status: 'pending'
        });

      if (error) throw error;
      await loadApplications();
      await loadProjects();
    } catch (error) {
      console.error('Error applying to project:', error);
    }
  };

  const handleSendMessage = async () => {
  if (!newMessage.trim() || !currentProjectId || !user) return;

  const tempId = `temp-${Date.now()}`;
  const tempMessage = {
    id: tempId,
    content: newMessage,
    user_id: user.id,
    project_id: currentProjectId,
    created_at: new Date().toISOString(),
    user: { 
      name: user.user_metadata?.name || 'You',
      avatar_url: user.user_metadata?.avatar_url || null
    },
    pending: true
  };

  // Optimistic update
  setMessages(prev => [...prev, tempMessage as Message]);
  setNewMessage('');

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        content: newMessage,
        project_id: currentProjectId,
        user_id: user.id
      })
      .select('*, user:users(name, avatar_url)');

    if (error) throw error;

    // The real-time subscription will handle the update, but we'll still
    // update here in case there are any timing issues
    setMessages(prev => [
      ...prev.filter(m => m.id !== tempId),
      ...(data?.map(msg => ({
        ...msg,
        user: { 
          name: msg.user?.name || 'Unknown',
          avatar_url: msg.user?.avatar_url || null
        },
        pending: false
      })) || [])
    ]);
  } catch (error) {
    console.error('Message send failed:', error);
    // Remove the optimistic update if failed
    setMessages(prev => prev.filter(m => m.id !== tempId));
    alert('Failed to send message. Please try again.');
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
          status: newTask.status,
          assigned_to: user!.id
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

  const handleUpdateSkills = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ skills: selectedSkills })
        .eq('id', user!.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating skills:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const navItems: NavItem[] = [
    { id: 'projects', name: 'Available Projects', icon: BriefcaseIcon },
    { id: 'applications', name: 'My Applications', icon: DocumentCheckIcon },
    { id: 'chat', name: 'Project Chat', icon: ChatBubbleLeftIcon },
    { id: 'profile', name: 'Skills Profile', icon: UserCircleIcon },
  ];

  if (applications.some(app => app.status === 'accepted')) {
    navItems.splice(3, 0, { id: 'tasks', name: 'Task Board', icon: CheckCircleIcon });
  }

  const acceptedProjects = applications.filter(app => app.status === 'accepted');
  const pendingApplicationsCount = applications.filter(app => app.status === 'pending').length;
  const currentProject = applications.find(app => app.project.id === currentProjectId)?.project;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        navItems={navItems} 
      />

      <div className="grid grid-cols-4 gap-4 p-4 h-[calc(100vh-4rem)]">
        {/* Left Column - Sidebar */}
        <Sidebar 
          acceptedProjects={acceptedProjects}
          currentProjectId={currentProjectId}
          setCurrentProjectId={setCurrentProjectId}
          pendingApplicationsCount={pendingApplicationsCount}
        />

        {/* Main Content */}
        <div className="col-span-3 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
          {activeTab === 'projects' && (
            <ProjectsTab 
              availableProjects={availableProjects}
              applications={applications}
              handleApplyToProject={handleApplyToProject}
            />
          )}

          {activeTab === 'applications' && (
            <ApplicationsTab 
              applications={applications}
              currentProjectId={currentProjectId}
              setCurrentProjectId={setCurrentProjectId}
            />
          )}

          {activeTab === 'chat' && (
          <>
            {/* // In your ChatTab component, add this near the header */}
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${
                channelStatus === 'connected' ? 'bg-green-500' : 
                channelStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></span>
              <span className="text-xs text-gray-500">
                {channelStatus === 'connected' ? 'Connected' : 
                 channelStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
            <ChatTab
              currentProject={currentProject}
              currentProjectId={currentProjectId}
              setActiveTab={setActiveTab}
              user={user}
            />
            {/* <ChatTab
              messages={messages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              currentProject={currentProject}
              currentProjectId={currentProjectId}
              setActiveTab={setActiveTab}
              user={user}
            /> */}
          </>
          )}

          {activeTab === 'tasks' && (
            <TasksTab
              tasks={tasks}
              currentProject={currentProject}
              isCreatingTask={isCreatingTask}
              setIsCreatingTask={setIsCreatingTask}
              newTask={newTask}
              setNewTask={setNewTask}
              handleCreateTask={handleCreateTask}
              handleUpdateTaskStatus={handleUpdateTaskStatus}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              selectedSkills={selectedSkills}
              setSelectedSkills={setSelectedSkills}
              handleUpdateSkills={handleUpdateSkills}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
            />
          )}
        </div>
      </div>
    </div>
  );
}