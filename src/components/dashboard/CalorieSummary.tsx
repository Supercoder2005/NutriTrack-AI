'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CalorieSummaryProps {
  consumed: number;
  burned: number;
  goal: number;
}

export default function CalorieSummary({ consumed, burned, goal }: CalorieSummaryProps) {
  const remaining = goal - consumed + burned;
  const netCalories = consumed - burned;
  
  const chartData = [
    { name: 'Consumed', value: consumed, fill: 'hsl(var(--chart-1))' },
    { name: 'Remaining', value: Math.max(0, remaining), fill: 'hsl(var(--muted))' },
  ];
  
  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Calorie Summary</CardTitle>
        <CardDescription>Your net calorie intake for today.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="h-48 sm:h-56">
                <ChartContainer config={{}} className="w-full h-full">
                    <ResponsiveContainer>
                        <PieChart>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius="60%"
                                outerRadius="100%"
                                strokeWidth={5}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
            <div className="sm:col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-muted-foreground">Goal</p>
                    <p className="text-2xl font-bold">{goal.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-muted-foreground">Consumed</p>
                    <p className="text-2xl font-bold text-primary">{consumed.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-muted-foreground">Burned</p>
                    <p className="text-2xl font-bold text-accent">{burned.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-background rounded-lg col-span-2 lg:col-span-3">
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-3xl font-bold text-foreground">{remaining.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Net: {netCalories.toLocaleString()} kcal</p>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
