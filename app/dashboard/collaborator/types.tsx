export interface User {
    id: string;
    name: string;
    skills?: string[];
  }
  
  export interface Project {
    id: string;
    title: string;
    description: string;
    status: string;
    looking_for: string[];
    stars: number;
    owner: User;
  }
  
  export interface Application {
    id: string;
    project: Project;
    status: string;
    created_at: string;
  }
  
  export interface Message {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
    project_id: string;
    user: User;
    pending?: boolean;
  }
  
  export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
    assigned_to: string | null;
    project_id: string;
  }
  
  export interface NavItem {
    id: string;
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }