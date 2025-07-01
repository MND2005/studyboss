"use client";

import { useState, useEffect, useMemo } from "react";
import { PlusCircle } from "lucide-react";
import type { User } from "firebase/auth";
import { collection, query, where, onSnapshot, addDoc, Timestamp, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { StudySession } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AddSessionDialog } from "@/components/AddSessionDialog";
import { StudyProgressChart } from "@/components/StudyProgressChart";
import { UpcomingDeadlines } from "@/components/UpcomingDeadlines";
import { SchedulerCalendar } from "@/components/SchedulerCalendar";
import { Skeleton } from "@/components/ui/skeleton";
import { ActiveSessionTracker } from "@/components/ActiveSessionTracker";
import { useToast } from "@/hooks/use-toast";

type DashboardClientProps = {
  user: User;
};

export function DashboardClient({ user }: DashboardClientProps) {
  const [sessions, setSessions] = useState<StudySession[] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

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
          status: data.status || 'planned',
          startTime: data.startTime ? (data.startTime as Timestamp).toDate() : undefined,
          actualDuration: data.actualDuration,
        });
      });
      setSessions(sessionsData);
    });

    return () => unsubscribe();
  }, [user]);

  const activeSession = useMemo(() => {
      if (!sessions) return null;
      return sessions.find(s => s.status === 'in-progress') || null;
  }, [sessions]);

  const addSession = async (newSessionData: Omit<StudySession, 'id' | 'status' | 'startTime' | 'actualDuration'>) => {
    if (!user) {
        throw new Error("You must be logged in to add a session.");
    };
    
    await addDoc(collection(db, "studySessions"), {
        ...newSessionData,
        date: Timestamp.fromDate(newSessionData.date),
        uid: user.uid,
        status: 'planned',
    });
  };

  const startSession = async (sessionId: string) => {
      const sessionRef = doc(db, 'studySessions', sessionId);
      try {
          await updateDoc(sessionRef, {
              status: 'in-progress',
              startTime: serverTimestamp(),
          });
          toast({ title: "Session Started!", description: "Your study timer has begun." });
      } catch (error: any) {
          toast({ variant: 'destructive', title: "Error Starting Session", description: error.message });
      }
  };

  const endSession = async (sessionId: string) => {
    const sessionToEnd = sessions?.find(s => s.id === sessionId);
    if (!sessionToEnd || !sessionToEnd.startTime) {
        toast({ variant: 'destructive', title: "Error Ending Session", description: "Could not find session start time." });
        return;
    }

    const sessionRef = doc(db, 'studySessions', sessionId);
    const endTime = new Date();
    const startTime = sessionToEnd.startTime;
    const durationInMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    try {
        await updateDoc(sessionRef, {
            status: 'completed',
            actualDuration: durationInMinutes,
        });
        toast({ title: "Session Completed!", description: `Great job! You studied for ${durationInMinutes} minutes.` });
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Error Ending Session", description: error.message });
    }
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
           {activeSession && activeSession.startTime && (
              <ActiveSessionTracker 
                session={{...activeSession, startTime: activeSession.startTime}} 
                onEndSession={endSession} 
              />
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <StudyProgressChart sessions={sessions} />
            </div>
            <UpcomingDeadlines sessions={sessions} onStartSession={startSession} activeSession={activeSession} />
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
