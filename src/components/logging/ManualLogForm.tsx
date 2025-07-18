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
import { useToast } from '@/hooks/use-toast';
import { addFoodLog } from '@/lib/firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

const manualLogSchema = z.object({
  foodName: z.string().min(1, 'Food name is required'),
  calories: z.coerce.number().min(0, 'Calories must be a positive number'),
  protein: z.coerce.number().min(0, 'Protein must be a positive number'),
  fat: z.coerce.number().min(0, 'Fat must be a positive number'),
  carbohydrates: z.coerce.number().min(0, 'Carbohydrates must be a positive number'),
});

interface ManualLogFormProps {
    onSuccess: () => void;
}

export default function ManualLogForm({ onSuccess }: ManualLogFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof manualLogSchema>>({
    resolver: zodResolver(manualLogSchema),
    defaultValues: { foodName: '' },
  });

  const onSubmit = async (values: z.infer<typeof manualLogSchema>) => {
    if (!user) return;
    setLoading(true);

    try {
      await addFoodLog(user.uid, values);
      toast({ title: 'Meal Logged!', description: `${values.foodName} has been added to your log.` });
      form.reset();
      onSuccess();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save your meal log.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-4">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="foodName" render={({ field }) => (
                <FormItem><FormLabel>Food Name</FormLabel><FormControl><Input placeholder="e.g., Chicken Salad" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="calories" render={({ field }) => (
                    <FormItem><FormLabel>Calories</FormLabel><FormControl><Input type="number" placeholder="350" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="protein" render={({ field }) => (
                    <FormItem><FormLabel>Protein (g)</FormLabel><FormControl><Input type="number" placeholder="30" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="fat" render={({ field }) => (
                    <FormItem><FormLabel>Fat (g)</FormLabel><FormControl><Input type="number" placeholder="15" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="carbohydrates" render={({ field }) => (
                    <FormItem><FormLabel>Carbs (g)</FormLabel><FormControl><Input type="number" placeholder="20" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save to Log'}
            </Button>
        </form>
        </Form>
    </div>
  );
}
