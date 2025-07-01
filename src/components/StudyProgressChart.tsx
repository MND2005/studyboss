
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
    <Card className="p-6 bg-card/80 backdrop-blur-sm h-full">
      <h2 className="text-xl font-semibold">Daily Study Progress (Last 7 Days)</h2>
      <CardContent className="h-[250px] p-0 mt-6">
        <ChartContainer config={{
          minutes: {
            label: "Minutes",
            color: "hsl(var(--primary))",
          },
        }} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
              <XAxis dataKey="date" stroke="hsl(var(--foreground) / 0.5)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--foreground) / 0.5)" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: 'hsl(var(--accent))' }}
                wrapperStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
              />
              <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
