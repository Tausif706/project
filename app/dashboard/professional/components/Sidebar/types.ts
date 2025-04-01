export interface ActiveMentorship {
  id: string;
  project_id: string;
  project: {
    title: string;
    description: string;
  };
  progress: number;
  next_meeting: string;
}