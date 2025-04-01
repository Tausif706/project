import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signUp(email: string, password: string, userData: {
  name: string;
  role: string;
  expertise?: string;
  skills?: string[];
  ideaDescription?: string;
}) {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name: userData.name,
        role: userData.role,
        expertise: userData.expertise,
        skills: userData.skills,
        idea_description: userData.ideaDescription,
      })
      .select()
      .single();

    if (profileError) throw profileError;

    return authData;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Fetch user profile after successful sign in
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        ...data,
        profile
      };
    }

    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function fetchUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Project Management Functions
export async function createProject(data: {
  title: string;
  description: string;
  owner_id: string;
  looking_for?: string[];
}) {
  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      ...data,
      status: 'draft',
      progress: 0
    })
    .select()
    .single();

  if (error) throw error;
  return project;
}

export async function updateProject(projectId: string, updates: {
  title?: string;
  description?: string;
  status?: string;
  looking_for?: string[];
}) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchUserProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      collaborator_requests(count)
    `)
    .eq('owner_id', userId);

  if (error) throw error;
  return data;
}

// Add type checking for user roles
export type UserRole = 'pitcher' | 'collaborator' | 'professional';

export function isValidRole(role: string): role is UserRole {
  return ['pitcher', 'collaborator', 'professional'].includes(role);
}

// Professional-related functions
export async function fetchAvailableProfessionals() {
  const { data, error } = await supabase
    .from('professional_profiles')
    .select(`
      *,
      user:users!professional_profiles_id_fkey(
        id,
        name
      )
    `);

  if (error) throw error;
  return data;
}

export async function createProfessionalRequest(projectId: string, professionalId: string) {
  const { data, error } = await supabase
    .from('professional_requests')
    .insert({
      project_id: projectId,
      professional_id: professionalId,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchProjectProfessionalRequests(projectId: string) {
  const { data, error } = await supabase
    .from('professional_requests')
    .select(`
      *,
      professional:users!professional_requests_professional_id_fkey(
        id,
        name,
        expertise
      )
    `)
    .eq('project_id', projectId);

  if (error) throw error;
  return data;
}

export async function fetchAvailableProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      owner:users(name)
    `)
    .eq('status', 'open');

  if (error) throw error;
  return data;
}

export async function createCollaborationRequest(projectId: string, userId: string) {
  const { data, error } = await supabase
    .from('collaborator_requests')
    .insert({
      project_id: projectId,
      user_id: userId,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchMentorshipRequests() {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      owner:users(name)
    `)
    .eq('status', 'seeking_mentor');

  if (error) throw error;
  return data;
}

export async function createTask(data: {
  project_id: string;
  title: string;
  description?: string;
  status?: string;
  assigned_to?: string;
}) {
  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      ...data,
      status: data.status || 'todo'
    })
    .select()
    .single();

  if (error) throw error;
  return task;
}

export async function updateTask(taskId: string, updates: {
  title?: string;
  description?: string;
  status?: string;
  assigned_to?: string;
}) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchProjectTasks(projectId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function sendMessage(projectId: string, userId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      project_id: projectId,
      user_id: userId,
      content,
    })
    .select(`
      *,
      user:users!messages_user_id_fkey(
        id,
        name,
        avatar_url
      )
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchProjectMessages(projectId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      user:users!messages_user_id_fkey(
        id,
        name,
        avatar_url
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function subscribeToMessages(projectId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`messages:${projectId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `project_id=eq.${projectId}`,
      },
      callback
    )
    .subscribe();
}