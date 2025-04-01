import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from '@/app/dashboard/collaborator/types';

export function useSupabaseChat(projectId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [channelStatus, setChannelStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  useEffect(() => {
    if (!projectId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setChannelStatus('connecting');

    
    // Load initial messages
    const loadMessages = async () => {
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
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

   const channel = supabase
      .channel(`messages:${projectId}`, {
        config: {
          presence: {
            key: 'anonymous', // You might want to use userId here
          },
        },
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `project_id=eq.${projectId}`
        },
        async (payload) => {
          // Your existing payload handling...
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

    return () => {
      supabase.removeChannel(channel);
      setChannelStatus('disconnected');
    };
  }, [projectId]);

  const sendMessage = async (content: string, userId: string) => {
    if (!projectId || !content.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      content,
      user_id: userId,
      project_id: projectId,
      created_at: new Date().toISOString(),
      user: { name: 'You' },
      pending: true
    };

    setMessages(prev => [...prev, tempMessage as Message]);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          content,
          project_id: projectId,
          user_id: userId
        })
        .select('*, user:users(name)')
        .single();

      if (error) throw error;

      setMessages(prev => [
        ...prev.filter(m => m.id !== tempId),
        {
          ...data,
          user: { name: data.user?.name || 'Unknown' },
          pending: false
        }
      ]);
    } catch (error) {
      console.error('Message send failed:', error);
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    channelStatus
  };
}