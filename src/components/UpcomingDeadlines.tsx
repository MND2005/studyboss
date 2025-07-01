"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow, isFuture } from "date-fns";
import type { StudySession } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "./ui/button";
import { PlayCircle } from "lucide-react";

type UpcomingDeadlinesProps = {
  sessions: StudySession[];
  onStartSession: (sessionId: string) => Promise<void>;
  activeSession: StudySession | null;
};

export function UpcomingDeadlines({ sessions, onStartSession, activeSession }: UpcomingDeadlinesProps) {
  const [startingSessionId, setStartingSessionId] = useState<string | null>(null);

  const upcomingSessions = useMemo(() => {
    return sessions
      .filter(session => session.status === 'planned' && isFuture(session.date))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 10);
  }, [sessions]);
  
  const handleStartSession = async (sessionId: string) => {
    setStartingSessionId(sessionId);
    await onStartSession(sessionId);
    // No need to reset, as component will re-render with new props
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
        <CardDescription>Ready to study? Pick a session and get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {upcomingSessions.length > 0 ? (
            <div className="space-y-2">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary">
                  <div>
                    <p className="font-medium">{session.topic}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.subject} - {formatDistanceToNow(session.date, { addSuffix: true })}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleStartSession(session.id)}
                    disabled={!!activeSession || !!startingSessionId}
                    aria-label={`Start session for ${session.topic}`}
                  >
                    {startingSessionId === session.id ? (
                      'Starting...'
                    ) : (
                      <>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
