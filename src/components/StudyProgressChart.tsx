
"use client"

import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { StudySession } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

type StudyProgressChartProps = {
  sessions: StudySession[];
};

export function StudyProgressChart({ sessions }: StudyProgressChartProps) {
  const chartData = useMemo(() => {
    const dailyData: { [key: string]: number } = {};
    
    sessions.forEach(session => {
        if(session.endTime && session.startTime) {
            const date = session.startTime.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!dailyData[date]) {
                dailyData[date] = 0;
            }
            dailyData[date] += session.duration / 60; 
        }
    });

    const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse();
    
    return last7Days.map(date => ({
        date,
        minutes: Math.round(dailyData[date] || 0)
    }));
  }, [sessions]);

  return (
    <Card className="p-4 bg-black/40 border-accent shadow-lg h-full">
      <h2>Daily Study Progress (Last 7 Days)</h2>
      <CardContent className="h-[250px] p-0 mt-6">
        <ChartContainer config={{}} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 77, 77, 0.2)" />
              <XAxis dataKey="date" stroke="#e0e0e0" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#e0e0e0" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#e0e0e0' }} />
              <Tooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: 'rgba(255, 77, 77, 0.2)' }}
                wrapperStyle={{ backgroundColor: 'rgb(var(--card))', border: '1px solid rgb(var(--border))' }}
              />
              <Bar dataKey="minutes" fill="rgb(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
