"use client";

import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { StudySession } from "@/lib/types";
import { StudyTimer } from "./StudyTimer";
import { Leaderboard } from "./Leaderboard";
import { StudyProgressChart } from "./StudyProgressChart";
import { StudyStatistics } from "./StudyStatistics";
import { MarksCard } from "./MarksCard";

type DashboardClientProps = {
  user: User;
};

export function DashboardClient({ user }: DashboardClientProps) {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  
  useEffect(() => {
    if (!user) {
        setSessions([]);
        return;
    };

    const sessionsQuery = query(collection(db, "studySessions"), where("uid", "==", user.uid));

    const unsubSessions = onSnapshot(sessionsQuery, (snapshot) => {
      const sessionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudySession));
      setSessions(sessionsData);
    });

    return () => {
        unsubSessions();
    };
  }, [user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
            <StudyTimer user={user} sessions={sessions} />
        </div>
        <div className="lg:col-span-2">
            <Leaderboard />
        </div>
        <div className="lg:col-span-2">
            <StudyProgressChart sessions={sessions} />
        </div>
        <div className="lg:col-span-1">
            <StudyStatistics sessions={sessions} />
        </div>
        <div className="lg:col-span-1">
            <MarksCard />
        </div>
    </div>
  );
}
