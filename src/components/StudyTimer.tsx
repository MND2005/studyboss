
'use client';

import { useState, useEffect, useRef } from 'react';
import type { User } from 'firebase/auth';
import { collection, addDoc, doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { StudySession } from '@/lib/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Play, Pause, Square } from 'lucide-react';

interface StudyTimerProps {
  user: User;
  sessions: StudySession[];
}

export function StudyTimer({ user, sessions }: StudyTimerProps) {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleStart = async () => {
    const newSession = {
      uid: user.uid,
      startTime: serverTimestamp(),
      duration: 0,
      // Add a placeholder endTime which will be updated on stop
      endTime: null, 
    };
    const docRef = await addDoc(collection(db, 'studySessions'), newSession);
    setCurrentSessionId(docRef.id);
    setTime(0);
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (currentSessionId) {
      const sessionRef = doc(db, 'studySessions', currentSessionId);
      await updateDoc(sessionRef, {
        endTime: serverTimestamp(),
        duration: time,
      });
    }
    setIsActive(false);
    setIsPaused(false);
    setCurrentSessionId(null);
    setTime(0);
  };
  
  const todayStudyTime = sessions
    .filter(s => {
      if (!s.startTime) return false;
      const sessionDate = s.startTime.toDate();
      const today = new Date();
      return sessionDate.getDate() === today.getDate() &&
             sessionDate.getMonth() === today.getMonth() &&
             sessionDate.getFullYear() === today.getFullYear();
    })
    .reduce((total, s) => total + s.duration, 0);

  return (
    <Card className="p-4 bg-black/40 border-accent shadow-lg h-full flex flex-col">
      <h2>Study Timer</h2>
      <div className="flex-grow flex flex-col justify-center">
        <div className="text-5xl text-center my-4 font-mono text-primary-foreground" style={{textShadow: '0 0 10px hsl(var(--primary))'}}>
          {formatTime(time)}
        </div>
        <div className="flex justify-center gap-4 my-6">
          <Button onClick={handleStart} disabled={isActive} variant="primary">
              <Play /> Start
          </Button>
          <Button onClick={handlePauseResume} disabled={!isActive} variant="secondary">
              {isPaused ? <Play /> : <Pause />} {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button onClick={handleStop} disabled={!isActive} variant="destructive">
              <Square/> Stop
          </Button>
        </div>
      </div>
      <div className="text-center text-lg mt-auto">
        <p>Today's study time: <span className="font-bold text-primary-foreground">{formatTime(todayStudyTime)}</span></p>
      </div>
    </Card>
  );
}
