"use client";

import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import type { User } from "firebase/auth";
import { collection, query, where, onSnapshot, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { StudySession } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AddSessionDialog } from "@/components/AddSessionDialog";
import { StudyProgressChart } from "@/components/StudyProgressChart";
import { UpcomingDeadlines } from "@/components/UpcomingDeadlines";
import { SchedulerCalendar } from "@/components/SchedulerCalendar";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardClientProps = {
  user: User;
};

export function DashboardClient({ user }: DashboardClientProps) {
  const [sessions, setSessions] = useState<StudySession[] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const sessionsCollection = collection(db, "studySessions");
    const q = query(sessionsCollection, where("uid", "==", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const sessionsData: StudySession[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessionsData.push({
          id: doc.id,
          subject: data.subject,
          topic: data.topic,
          date: (data.date as Timestamp).toDate(),
          duration: data.duration,
          resources: data.resources,
        });
      });
      setSessions(sessionsData);
    });

    return () => unsubscribe();
  }, [user]);

  const addSession = async (newSessionData: Omit<StudySession, 'id'>) => {
    if (!user) {
        throw new Error("You must be logged in to add a session.");
    };
    
    await addDoc(collection(db, "studySessions"), {
        ...newSessionData,
        date: Timestamp.fromDate(newSessionData.date),
        uid: user.uid,
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your study overview.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} disabled={sessions === null}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Session
        </Button>
      </div>
      
      {!sessions ? (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="lg:col-span-2 h-[382px] rounded-lg" />
                <Skeleton className="h-[382px] rounded-lg" />
            </div>
             <Skeleton className="h-[413px] rounded-lg" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <StudyProgressChart sessions={sessions} />
            </div>
            <UpcomingDeadlines sessions={sessions} />
          </div>

          <div>
            <SchedulerCalendar sessions={sessions} />
          </div>
        </>
      )}


      <AddSessionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddSession={addSession}
      />
    </div>
  );
}
