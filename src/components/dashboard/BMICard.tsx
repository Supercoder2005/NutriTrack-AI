'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { calculateBMI, getBMICategory } from '@/lib/helpers';
import type { UserProfile } from '@/types';
import { Badge } from '../ui/badge';
import { Target, TrendingUp } from 'lucide-react';

interface BMICardProps {
  profile: UserProfile;
}

export default function BMICard({ profile }: BMICardProps) {
  if (!profile.weight || !profile.height) {
    return null;
  }

  const bmi = calculateBMI(profile.weight, profile.height);
  const category = getBMICategory(bmi);
  const goalText = profile.goal ? `Goal: ${profile.goal.charAt(0).toUpperCase() + profile.goal.slice(1)} Weight` : '';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><TrendingUp/> Your Status</CardTitle>
        <CardDescription>Based on your profile information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 rounded-lg bg-background">
            <p className="text-sm text-muted-foreground">Your BMI</p>
            <p className="text-4xl font-bold text-primary">{bmi}</p>
            <Badge variant="secondary">{category}</Badge>
        </div>
        <div className="text-center p-4 rounded-lg bg-background flex items-center justify-center gap-3">
            <Target className="text-accent" />
            <div>
                <p className="font-semibold text-foreground">{goalText}</p>
                <p className="text-sm text-muted-foreground">Calorie Target: {profile.calorieGoal?.toLocaleString()} kcal</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
