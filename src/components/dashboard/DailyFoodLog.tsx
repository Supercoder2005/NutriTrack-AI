'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import type { FoodLog } from '@/types';
import { UtensilsCrossed } from 'lucide-react';
import Image from 'next/image';

interface DailyFoodLogProps {
  logs: FoodLog[];
  isLoading: boolean;
}

export default function DailyFoodLog({ logs, isLoading }: DailyFoodLogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Today's Food Log</CardTitle>
        <CardDescription>Meals and snacks you've logged today.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <UtensilsCrossed className="w-12 h-12 mb-4" />
              <p>No meals logged yet today.</p>
              <p className="text-sm">Use "Log Meal" to add your first one!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meal</TableHead>
                  <TableHead className="text-right">Calories</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      {log.imageUrl && <Image src={log.imageUrl} alt={log.foodName} width={32} height={32} className="rounded-md" data-ai-hint="food meal"/>}
                      <span>{log.foodName}</span>
                    </TableCell>
                    <TableCell className="text-right">{log.calories.toFixed(0)}</TableCell>
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
