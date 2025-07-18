'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import type { WorkoutLog } from '@/types';
import { Dumbbell } from 'lucide-react';

interface DailyWorkoutLogProps {
  logs: WorkoutLog[];
  isLoading: boolean;
}

export default function DailyWorkoutLog({ logs, isLoading }: DailyWorkoutLogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Today's Workouts</CardTitle>
        <CardDescription>Activities you've completed today.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Dumbbell className="w-12 h-12 mb-4" />
              <p>No workouts logged yet today.</p>
              <p className="text-sm">Time to get moving!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead className="text-right">Calories Burned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.activityName}</TableCell>
                    <TableCell className="text-right">{log.caloriesBurned.toFixed(0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
