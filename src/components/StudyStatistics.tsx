'use client';

import { useMemo } from 'react';
import type { StudySession } from '@/lib/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Timer, CalendarCheck, Trophy, LineChart, Download } from 'lucide-react';

interface StudyStatisticsProps {
  sessions: StudySession[];
}

const StatCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
    <div className="bg-secondary/50 rounded-lg p-4 flex items-center gap-4 hover:bg-secondary transition-colors">
        <div className="text-primary bg-primary/10 rounded-lg p-2">
            {icon}
        </div>
        <div>
            <h3 className="text-muted-foreground text-sm">{title}</h3>
            <p className="text-lg font-bold text-foreground">{value}</p>
        </div>
    </div>
)

export function StudyStatistics({ sessions }: StudyStatisticsProps) {
    const stats = useMemo(() => {
        const completedSessions = sessions.filter(s => s.endTime && s.startTime);
        if (completedSessions.length === 0) {
            return { weeklyTotal: '0h 0m', bestDay: 'None', avgDaily: '0h 0m', streak: '0 days'};
        }

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyTotalSeconds = completedSessions
            .filter(s => s.startTime.toDate() > oneWeekAgo)
            .reduce((acc, s) => acc + s.duration, 0);
        const weeklyTotal = `${Math.floor(weeklyTotalSeconds / 3600)}h ${Math.floor((weeklyTotalSeconds % 3600) / 60)}m`;

        const dailyTotals: { [key: string]: number } = {};
        completedSessions.forEach(s => {
            const date = s.startTime.toDate().toLocaleDateString();
            dailyTotals[date] = (dailyTotals[date] || 0) + s.duration;
        });

        const bestDayEntry = Object.entries(dailyTotals).sort((a, b) => b[1] - a[1])[0];
        const bestDay = bestDayEntry ? `${new Date(bestDayEntry[0]).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})} (${Math.floor(bestDayEntry[1]/60)}m)` : 'None';
        
        const totalStudyDays = Object.keys(dailyTotals).length;
        const totalSeconds = completedSessions.reduce((acc, s) => acc + s.duration, 0);
        const avgDailySeconds = totalStudyDays > 0 ? totalSeconds / totalStudyDays : 0;
        const avgDaily = `${Math.floor(avgDailySeconds / 3600)}h ${Math.floor((avgDailySeconds % 3600) / 60)}m`;

        const studyDays = [...new Set(completedSessions.map(s => s.startTime.toDate().setHours(0,0,0,0)))].sort((a, b) => b - a);
        let streak = 0;
        if(studyDays.length > 0) {
            const today = new Date().setHours(0,0,0,0);
            const yesterday = new Date(today).setDate(new Date(today).getDate() - 1);
            if (studyDays[0] === today || studyDays[0] === yesterday) {
                streak = 1;
                for (let i = 0; i < studyDays.length - 1; i++) {
                    const diff = (studyDays[i] - studyDays[i+1]) / (1000 * 3600 * 24);
                    if (diff === 1) {
                        streak++;
                    } else {
                        break;
                    }
                }
            }
        }
        
        return { weeklyTotal, bestDay, avgDaily, streak: `${streak} days` };

    }, [sessions]);

    const hasCompletedSessions = useMemo(() => {
        return sessions.some(s => s.endTime && s.startTime);
    }, [sessions]);

    const handleDownload = () => {
        const completedSessions = sessions.filter(s => s.endTime && s.startTime);
        if (completedSessions.length === 0) {
          return;
        }

        const csvHeaders = ["Date", "Start Time", "End Time", "Duration (minutes)"];
        const csvRows = completedSessions.map(session => {
            const date = session.startTime.toDate().toLocaleDateString();
            const startTime = session.startTime.toDate().toLocaleTimeString();
            const endTime = session.endTime!.toDate().toLocaleTimeString();
            const durationMinutes = Math.round(session.duration / 60);
            return [date, startTime, endTime, durationMinutes].join(',');
        });

        const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "study_report.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Card className="p-6 bg-card/80 backdrop-blur-sm h-full flex flex-col">
            <div>
                <h2 className="text-xl font-semibold mb-4">Study Statistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <StatCard icon={<Timer/>} title="Weekly Total" value={stats.weeklyTotal} />
                    <StatCard icon={<CalendarCheck />} title="Best Day" value={stats.bestDay} />
                    <StatCard icon={<Trophy />} title="Average Daily" value={stats.avgDaily} />
                    <StatCard icon={<LineChart />} title="Current Streak" value={stats.streak} />
                </div>
            </div>
            <div className="mt-auto pt-4">
                <Button onClick={handleDownload} className="w-full" disabled={!hasCompletedSessions}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                </Button>
            </div>
        </Card>
    );
}
