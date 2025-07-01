"use client";

import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import type { StudySession } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AddSessionDialog } from "@/components/AddSessionDialog";
import { StudyProgressChart } from "@/components/StudyProgressChart";
import { UpcomingDeadlines } from "@/components/UpcomingDeadlines";
import { SchedulerCalendar } from "@/components/SchedulerCalendar";
import { Skeleton } from "@/components/ui/skeleton";

// This function will only be called on the client side
const getInitialSessions = (): StudySession[] => {
  return [
    { id: '1', subject: 'Mathematics', topic: 'Calculus I Review', date: new Date(new Date().setDate(new Date().getDate() + 3)), duration: 120, resources: 'Textbook Ch. 1-3' },
    { id: '2', subject: 'History', topic: 'The Roman Empire', date: new Date(new Date().setDate(new Date().getDate() + 5)), duration: 90, resources: 'Documentary on YouTube' },
    { id: '3', subject: 'Science', topic: 'Photosynthesis', date: new Date(new Date().setDate(new Date().getDate() - 2)), duration: 60, resources: 'Khan Academy videos' },
    { id: '4', subject: 'Mathematics', topic: 'Algebraic Equations', date: new Date(new Date().setDate(new Date().getDate() - 4)), duration: 75, resources: 'Practice worksheets' },
    { id: '5', subject: 'English', topic: 'Shakespeare Sonnets', date: new Date(new Date().setDate(new Date().getDate() + 7)), duration: 45, resources: 'Complete Works of Shakespeare' },
    { id: '6', subject: 'Science', topic: 'Cellular Respiration', date: new Date(), duration: 80, resources: 'Biology Textbook Ch. 9' },
  ];
};

export function DashboardClient() {
  const [sessions, setSessions] = useState<StudySession[] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Generate initial sessions only on the client-side after mounting
    // to prevent hydration mismatch.
    setSessions(getInitialSessions());
  }, []);

  const addSession = (newSession: Omit<StudySession, 'id'>) => {
    setSessions(prev => (prev ? [...prev, { ...newSession, id: crypto.randomUUID() }] : [{ ...newSession, id: crypto.randomUUID() }]));
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
