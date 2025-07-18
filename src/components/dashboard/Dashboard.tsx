'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import { useAuth } from '@/contexts/AuthContext';
import CalorieSummary from './CalorieSummary';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import LogMealDialog from '../logging/LogMealDialog';
import LogWorkoutDialog from '../logging/LogWorkoutDialog';
import DailyFoodLog from './DailyFoodLog';
import DailyWorkoutLog from './DailyWorkoutLog';
import BMICard from './BMICard';
import { getFoodLogs, getWorkoutLogs } from '@/lib/firebase/firestore';
import type { FoodLog, WorkoutLog } from '@/types';
import FullPageSpinner from '../shared/FullPageSpinner';

export default function Dashboard() {
  const { user, userProfile, loading } = useAuth();
  const [isMealDialogOpen, setIsMealDialogOpen] = useState(false);
  const [isWorkoutDialogOpen, setIsWorkoutDialogOpen] = useState(false);
  
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  const fetchLogs = async () => {
    if (!user) return;
    setLogsLoading(true);
    const today = new Date();
    const [food, workouts] = await Promise.all([
      getFoodLogs(user.uid, today),
      getWorkoutLogs(user.uid, today)
    ]);
    setFoodLogs(food);
    setWorkoutLogs(workouts);
    setLogsLoading(false);
  };
  
  useEffect(() => {
    fetchLogs();
  }, [user]);

  const onLogAdded = () => {
    fetchLogs();
  };

  if (loading || !userProfile || !user) {
    return <FullPageSpinner />;
  }
  
  const totalCaloriesConsumed = foodLogs.reduce((sum, log) => sum + log.calories, 0);
  const totalCaloriesBurned = workoutLogs.reduce((sum, log) => sum + log.caloriesBurned, 0);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-background p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="font-headline text-3xl md:text-4xl text-foreground">
              Welcome back, {userProfile.name}!
            </h1>
            <p className="text-muted-foreground">Here is your summary for today.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
              <CalorieSummary 
                consumed={totalCaloriesConsumed}
                burned={totalCaloriesBurned}
                goal={userProfile.calorieGoal || 2000}
              />
              <div className="grid gap-8 sm:grid-cols-2">
                 <DailyFoodLog logs={foodLogs} isLoading={logsLoading} />
                 <DailyWorkoutLog logs={workoutLogs} isLoading={logsLoading} />
              </div>
            </div>
            <div className="space-y-8">
                <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <h3 className="font-headline text-xl mb-4">Quick Log</h3>
                    <div className="flex flex-col space-y-3">
                        <Button onClick={() => setIsMealDialogOpen(true)}><PlusCircle className="mr-2"/> Log Meal</Button>
                        <Button onClick={() => setIsWorkoutDialogOpen(true)} variant="secondary"><PlusCircle className="mr-2"/> Log Workout</Button>
                    </div>
                </div>
                <BMICard profile={userProfile} />
            </div>
          </div>
        </div>
      </main>
      <LogMealDialog open={isMealDialogOpen} onOpenChange={setIsMealDialogOpen} onLogAdded={onLogAdded} />
      <LogWorkoutDialog open={isWorkoutDialogOpen} onOpenChange={setIsWorkoutDialogOpen} onLogAdded={onLogAdded} />
    </div>
  );
}
