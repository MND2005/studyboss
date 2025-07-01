'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { StudySession, AppUser } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type LeaderboardEntry = {
  uid: string;
  displayName: string;
  totalDuration: number;
};

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h > 0 ? `${h}h ` : ''}${m}m`;
};

const getTrophyColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'text-yellow-400';
    case 2:
      return 'text-gray-400';
    case 3:
      return 'text-yellow-600';
    default:
      return 'text-muted-foreground';
  }
};

export function Leaderboard() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map(doc => doc.data() as AppUser);
        setUsers(usersData);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sessionsQuery = query(
          collection(db, 'studySessions'),
          where('startTime', '>=', Timestamp.fromDate(sevenDaysAgo))
        );
        const sessionsSnapshot = await getDocs(sessionsQuery);
        const sessionsData = sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as StudySession);
        setSessions(sessionsData);
      } catch (e: any) {
        console.error(e);
        setError('Failed to load leaderboard data. Please check Firestore rules.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { dailyLeaderboard, weeklyLeaderboard } = useMemo(() => {
    const userMap = new Map(users.map(u => [u.uid, u.displayName]));

    const processSessions = (filteredSessions: StudySession[]): LeaderboardEntry[] => {
      const userDurations = new Map<string, number>();
      filteredSessions.forEach(session => {
        if (session.duration > 0) {
          userDurations.set(session.uid, (userDurations.get(session.uid) || 0) + session.duration);
        }
      });
      return Array.from(userDurations.entries())
        .map(([uid, totalDuration]) => ({
          uid,
          displayName: userMap.get(uid) || 'Unknown User',
          totalDuration,
        }))
        .sort((a, b) => b.totalDuration - a.totalDuration)
        .slice(0, 10);
    };

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const dailySessions = sessions.filter(s => s.startTime && s.startTime.toDate() >= startOfToday);

    return {
      dailyLeaderboard: processSessions(dailySessions),
      weeklyLeaderboard: processSessions(sessions),
    };
  }, [sessions, users]);

  const LeaderboardTable = ({ data }: { data: LeaderboardEntry[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((entry, index) => (
            <TableRow key={entry.uid}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Trophy className={`h-5 w-5 ${getTrophyColor(index + 1)}`} />
                  {index + 1}
                </div>
              </TableCell>
              <TableCell>{entry.displayName}</TableCell>
              <TableCell className="text-right">{formatDuration(entry.totalDuration)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground">
              No study sessions recorded yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm h-full flex flex-col">
      <CardHeader className="p-0 mb-4">
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>See who's putting in the most time.</CardDescription>
      </CardHeader>
      {loading ? (
         <div className="space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
         </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full text-destructive">
            <p>{error}</p>
        </div>
      ) : (
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
        </TabsList>
        <TabsContent value="today">
          <LeaderboardTable data={dailyLeaderboard} />
        </TabsContent>
        <TabsContent value="week">
          <LeaderboardTable data={weeklyLeaderboard} />
        </TabsContent>
      </Tabs>
      )}
    </Card>
  );
}
