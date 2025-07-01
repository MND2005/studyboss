'use client';

import { useState, useEffect, useRef } from 'react';
import type { User } from 'firebase/auth';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
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
  const [isFocusMode, setIsFocusMode] = useState(false);
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
      endTime: null, 
    };
    const docRef = await addDoc(collection(db, 'studySessions'), newSession);
    setCurrentSessionId(docRef.id);
    setTime(0);
    setIsActive(true);
    setIsPaused(false);
    setIsFocusMode(true);
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
    setIsFocusMode(false);
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

  if (isFocusMode) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="text-6xl sm:text-7xl md:text-9xl font-mono font-bold text-foreground tracking-normal sm:tracking-widest mb-8 md:mb-12">
          {formatTime(time)}
        </div>
        <div className="flex justify-center items-center gap-4 md:gap-6">
          <Button onClick={handlePauseResume} variant="secondary" size="lg" className="px-6 py-4 text-lg md:px-10 md:py-8 md:text-2xl">
              {isPaused ? <Play className="mr-2 md:mr-4 h-6 w-6 md:h-8 md:w-8" /> : <Pause className="mr-2 md:mr-4 h-6 w-6 md:h-8 md:w-8" />} {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button onClick={handleStop} variant="destructive" size="lg" className="px-6 py-4 text-lg md:px-10 md:py-8 md:text-2xl">
              <Square className="mr-2 md:mr-4 h-6 w-6 md:h-8 md:w-8"/> Stop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm h-full flex flex-col">
      <h2 className="text-xl font-semibold">Study Timer</h2>
      <div className="flex-grow flex flex-col justify-center">
        <div className="text-6xl text-center my-4 font-mono font-semibold text-foreground">
          {formatTime(time)}
        </div>
        <div className="flex justify-center gap-2 my-4">
          <Button onClick={handleStart} disabled={isActive} size="lg">
              <Play className="mr-2"/> Start
          </Button>
          <Button onClick={handlePauseResume} disabled={!isActive} variant="secondary" size="lg">
              {isPaused ? <Play className="mr-2" /> : <Pause className="mr-2" />} {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button onClick={handleStop} disabled={!isActive} variant="destructive" size="lg">
              <Square className="mr-2"/> Stop
          </Button>
        </div>
      </div>
      <div className="text-center text-md mt-auto">
        <p className="text-muted-foreground">Today's total: <span className="font-bold text-foreground">{formatTime(todayStudyTime)}</span></p>
      </div>
    </Card>
  );
}
