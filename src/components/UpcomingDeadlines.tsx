"use client";

import { useMemo } from "react";
import { formatDistanceToNow, isFuture } from "date-fns";
import type { StudySession } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type UpcomingDeadlinesProps = {
  sessions: StudySession[];
};

export function UpcomingDeadlines({ sessions }: UpcomingDeadlinesProps) {
  const upcomingSessions = useMemo(() => {
    return sessions
      .filter(session => isFuture(session.date))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 10);
  }, [sessions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
        <CardDescription>Your next scheduled study sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {upcomingSessions.length > 0 ? (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary">
                  <div>
                    <p className="font-medium">{session.topic}</p>
                    <p className="text-sm text-muted-foreground">{session.subject}</p>
                  </div>
                  <Badge variant="outline">
                    {formatDistanceToNow(session.date, { addSuffix: true })}
                  </Badge>
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
