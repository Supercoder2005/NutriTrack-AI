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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/lib/firebase/firestore';
import { calculateCalorieGoal } from '@/lib/helpers';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '../icons';

const onboardingSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.coerce.number().min(1, { message: 'Age is required.' }),
  height: z.coerce.number().min(1, { message: 'Height is required (in cm).' }),
  weight: z.coerce.number().min(1, { message: 'Weight is required (in kg).' }),
  gender: z.enum(['male', 'female', 'other']),
  goal: z.enum(['lose', 'maintain', 'gain']),
});

export default function OnboardingForm() {
  const { user, refreshUserProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = async (values: z.infer<typeof onboardingSchema>) => {
    if (!user) return;
    setLoading(true);

    const calorieGoal = calculateCalorieGoal(values);
    
    try {
      await updateUserProfile(user.uid, {
        ...values,
        onboarded: true,
        calorieGoal,
      });
      await refreshUserProfile();
      toast({ title: 'Profile created!', description: "Let's start your fitness journey." });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save your profile.' });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <Logo className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">Tell Us About Yourself</CardTitle>
            <CardDescription>
            This information will help us personalize your experience and goals.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input placeholder="Jane Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl><Input type="number" placeholder="25" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="height" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl><Input type="number" placeholder="170" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="weight" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl><Input type="number" placeholder="65" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
              </div>

                <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="female" /></FormControl>
                                    <FormLabel className="font-normal">Female</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="male" /></FormControl>
                                    <FormLabel className="font-normal">Male</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="other" /></FormControl>
                                    <FormLabel className="font-normal">Other</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>

                <FormField control={form.control} name="goal" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fitness Goal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select your primary goal" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="lose">Lose Weight</SelectItem>
                                <SelectItem value="maintain">Maintain Weight</SelectItem>
                                <SelectItem value="gain">Gain Weight</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Complete Profile'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
