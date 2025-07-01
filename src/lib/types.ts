export type StudySession = {
  id: string;
  subject: string;
  topic: string;
  date: Date;
  duration: number; // in minutes
  resources?: string;
};

export type Subject = {
  name: string;
  color: string;
};
