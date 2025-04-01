export interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  pending?: boolean;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  collaborators: number;
  stars: number;
}

export interface CollaboratorRequest {
  id: string;
  user: {
    id: string;
    name: string;
    skills: string[];
    rating: number;
  };
  status: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string; // 'todo', 'in_progress', or 'done'
  assigned_to: string | null;
  project_id: string;
}

export interface Professional {
  id: string;
  name: string;
  expertise: string;
  rating: number;
  projects_completed: number;
  hourly_rate: number;
  availability: string;
  skills: string[];
}