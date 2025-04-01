export interface MentorshipRequest {
  id: string;
  title: string;
  description: string;
  industry: string;
  stage: string;
  looking_for: string[];
  owner: {
    name: string;
  };
}

export interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  project_id: string;
  user: {
    name: string;
  };
  pending?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  assigned_to: string | null;
  project_id: string;
}

export interface Transaction {
  id: string;
  amount: number;
  project: string;
  date: string;
}