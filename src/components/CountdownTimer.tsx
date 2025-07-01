
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { User } from 'firebase/auth';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Countdown } from '@/lib/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from './ui/label';
import { FilePenLine } from 'lucide-react';

interface CountdownTimerProps {
  user: User;
  countdowns: Countdown[];
}

export function CountdownTimer({ user, countdowns }: CountdownTimerProps) {
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCountdownId, setSelectedCountdownId] = useState<string | null>(null);

  const activeCountdown = useMemo(() => {
    return countdowns.find(c => c.id === selectedCountdownId) || null;
  }, [countdowns, selectedCountdownId]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    if (countdowns.length > 0 && !selectedCountdownId) {
        setSelectedCountdownId(countdowns[0].id);
        setIsEditing(false);
    } else if (countdowns.length === 0) {
        setSelectedCountdownId(null);
        setIsEditing(true);
    }
  }, [countdowns, selectedCountdownId]);

  useEffect(() => {
    if (!activeCountdown) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if(countdowns.length === 0) setIsEditing(true);
        return;
    };
    
    setIsEditing(false);
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const target = activeCountdown.targetDate.toDate().getTime();
        const distance = target - now;

        if (distance < 0) {
            clearInterval(interval);
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        } else {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft({ days, hours, minutes, seconds });
        }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeCountdown, countdowns.length]);

  const handleSetCountdown = async () => {
    if (!title || !targetDate) return;
    const newCountdownData = {
        uid: user.uid,
        title,
        targetDate: Timestamp.fromDate(new Date(targetDate)),
    };
    
    // Logic to decide whether to update or add a new countdown
    const countdownToUpdate = countdowns.find(c => c.title.toLowerCase() === title.toLowerCase());

    if (countdownToUpdate) {
        const countdownRef = doc(db, 'countdowns', countdownToUpdate.id);
        await updateDoc(countdownRef, newCountdownData);
        setSelectedCountdownId(countdownToUpdate.id);
    } else {
        const docRef = await addDoc(collection(db, 'countdowns'), newCountdownData);
        setSelectedCountdownId(docRef.id);
    }
    setIsEditing(false);
  };
  
  const handleEdit = () => {
      if (!activeCountdown) {
          setTitle('');
          setTargetDate('');
      } else {
        setTitle(activeCountdown.title);
        const date = activeCountdown.targetDate.toDate();
        const formattedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        setTargetDate(formattedDate);
      }
      setIsEditing(true);
  }

  const handleSelectChange = (id: string) => {
    setSelectedCountdownId(id);
    const selected = countdowns.find(c => c.id === id);
    if (selected) {
        setTitle(selected.title);
        const date = selected.targetDate.toDate();
        const formattedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        setTargetDate(formattedDate);
        setIsEditing(false);
    }
  }

  return (
    <Card className="p-4 bg-black/40 border-accent shadow-lg h-full flex flex-col">
      <h2>Countdown Timer</h2>
      
      {isEditing ? (
        <div className="space-y-4 flex-grow flex flex-col justify-center">
            <div>
              <Label htmlFor="countdown-title">Title</Label>
              <Input id="countdown-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Exam/Project Name" className="bg-input border-accent text-white" />
            </div>
            <div>
              <Label htmlFor="countdown-date">Target Date</Label>
              <Input id="countdown-date" type="datetime-local" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="bg-input border-accent text-white" />
            </div>
            <div className="flex gap-2">
                <Button onClick={handleSetCountdown} variant="primary">
                    Set Countdown
                </Button>
                {countdowns.length > 0 && <Button onClick={() => setIsEditing(false)} variant="secondary">Cancel</Button>}
            </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col justify-center">
            <div className="flex justify-center items-center gap-4 mb-4">
                <Select onValueChange={handleSelectChange} value={selectedCountdownId || ''}>
                    <SelectTrigger className="w-[280px] bg-input border-accent text-white">
                        <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-accent text-popover-foreground">
                        {countdowns.map(cd => (
                            <SelectItem key={cd.id} value={cd.id}>{cd.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleEdit} variant="secondary" size="sm">
                    <FilePenLine className="mr-2 h-4 w-4"/> Edit/Add New
                </Button>
            </div>
             <div className="flex justify-center gap-4 text-center flex-wrap">
                <div className="bg-black/80 border border-accent p-4 rounded-lg min-w-[100px] text-center">
                    <div className="text-4xl font-bold text-primary-foreground">{timeLeft.days}</div>
                    <span>Days</span>
                </div>
                <div className="bg-black/80 border border-accent p-4 rounded-lg min-w-[100px] text-center">
                    <div className="text-4xl font-bold text-primary-foreground">{timeLeft.hours}</div>
                    <span>Hours</span>
                </div>
                <div className="bg-black/80 border border-accent p-4 rounded-lg min-w-[100px] text-center">
                    <div className="text-4xl font-bold text-primary-foreground">{timeLeft.minutes}</div>
                    <span>Minutes</span>
                </div>
                <div className="bg-black/80 border border-accent p-4 rounded-lg min-w-[100px] text-center">
                    <div className="text-4xl font-bold text-primary-foreground">{timeLeft.seconds}</div>
                    <span>Seconds</span>
                </div>
            </div>
        </div>
      )}
    </Card>
  );
}
