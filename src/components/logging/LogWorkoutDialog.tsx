'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { addWorkoutLog } from '@/lib/firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

const workoutLogSchema = z.object({
  activityName: z.string().min(1, 'Activity name is required'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
  caloriesBurned: z.coerce.number().min(1, 'Calories burned must be at least 1'),
});

interface LogWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogAdded: () => void;
}

export default function LogWorkoutDialog({ open, onOpenChange, onLogAdded }: LogWorkoutDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof workoutLogSchema>>({
    resolver: zodResolver(workoutLogSchema),
    defaultValues: { activityName: '' },
  });

  const onSubmit = async (values: z.infer<typeof workoutLogSchema>) => {
    if (!user) return;
    setLoading(true);

    try {
      await addWorkoutLog(user.uid, values);
      toast({ title: 'Workout Logged!', description: `${values.activityName} has been added to your log.` });
      form.reset();
      onLogAdded();
      onOpenChange(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save your workout log.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Log a Workout</DialogTitle>
          <DialogDescription>
            Add a physical activity to your log to track calories burned.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="activityName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Morning Run" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="duration" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (min)</FormLabel>
                    <FormControl><Input type="number" placeholder="30" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="caloriesBurned" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calories Burned</FormLabel>
                    <FormControl><Input type="number" placeholder="250" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Save Workout'}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
