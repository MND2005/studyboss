import type { Timestamp } from "firebase/firestore";

export type StudySession = {
  id: string;
  uid: string;
  startTime: Timestamp;
  endTime?: Timestamp;
  duration: number; // in seconds
};


export type Countdown = {
    id: string;
    uid: string;
    title: string;
    targetDate: Timestamp;
}
