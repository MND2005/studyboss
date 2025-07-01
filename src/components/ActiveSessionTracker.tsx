'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { StudySession } from '@/lib/types';
import { Timer } from 'lucide-react';

type ActiveSessionTrackerProps = {
  session: StudySession & { startTime: Date };
  onEndSession: (sessionId: string) => Promise<void>;
};

export function ActiveSessionTracker({ session, onEndSession }: ActiveSessionTrackerProps) {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const start = session.startTime;
      const diff = now.getTime() - start.getTime();

      const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
      const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

      setElapsedTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [session.startTime]);
  
  const handleEndSession = async () => {
    setIsEnding(true);
    await onEndSession(session.id);
    // No need to set isEnding back to false, as the component will unmount on next render.
  };


  return (
    <Card className="bg-primary/10 border-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="animate-spin" />
          <span>Currently Studying</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-bold text-lg">{session.topic}</p>
          <p className="text-muted-foreground">{session.subject}</p>
        </div>
        <div className="flex items-center gap-4">
            <p className="font-mono text-2xl font-bold tracking-widest">{elapsedTime}</p>
            <Button onClick={handleEndSession} disabled={isEnding}>
                {isEnding ? 'Ending...' : 'End Session'}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
