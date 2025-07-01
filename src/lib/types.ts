import type { Timestamp } from "firebase/firestore";

export type StudySession = {
  id: string;
  uid: string;
  startTime: Timestamp;
  endTime?: Timestamp;
  duration: number; // in seconds
};

export type AppUser = {
  uid: string;
  displayName: string;
  email: string;
};
