"use client"

import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import type { StudySession } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type StudyProgressChartProps = {
  sessions: StudySession[];
};

const chartConfig = {
  minutes: {
    label: "Minutes",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export function StudyProgressChart({ sessions }: StudyProgressChartProps) {
  const chartData = useMemo(() => {
    const subjectMinutes = sessions
      .filter(session => session.status === 'completed' && session.actualDuration)
      .reduce((acc, session) => {
        acc[session.subject] = (acc[session.subject] || 0) + session.actualDuration!;
        return acc;
    }, {} as { [key: string]: number });

    return Object.entries(subjectMinutes).map(([subject, minutes]) => ({
      subject,
      minutes: Math.round(minutes),
    }));
  }, [sessions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Progress</CardTitle>
        <CardDescription>Total time studied per subject (in minutes).</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="subject"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--secondary))' }}
              content={<ChartTooltipContent hideLabel />} 
            />
            <Bar dataKey="minutes" fill="var(--color-minutes)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
