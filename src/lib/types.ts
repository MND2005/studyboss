export type StudySession = {
  id: string;
  subject: string;
  topic: string;
  date: Date;
  duration: number; // planned duration in minutes
  resources?: string;
  status: 'planned' | 'in-progress' | 'completed';
  startTime?: Date;
  actualDuration?: number; // in minutes
};

export type Subject = {
  name: string;
  color: string;
};
