"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import type { StudySession } from "@/lib/types";

type SchedulerCalendarProps = {
  sessions: StudySession[];
};

export function SchedulerCalendar({ sessions }: SchedulerCalendarProps) {
  const sessionDates = sessions.map(s => s.date);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduler</CardTitle>
        <CardDescription>Your study sessions at a glance. Days with sessions are highlighted.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          modifiers={{ scheduled: sessionDates }}
          modifiersStyles={{
            scheduled: {
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                borderRadius: 'var(--radius)',
            }
          }}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
}
