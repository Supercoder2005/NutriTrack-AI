'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
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
import { analyzeFoodImage } from '@/ai/flows/analyze-food-image';
import { addFoodLog } from '@/lib/firebase/firestore';
import { uploadFile } from '@/lib/firebase/storage';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Camera, FileUp, LoaderCircle, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const analysisResultSchema = z.object({
  foodName: z.string().min(1, 'Food name is required'),
  calories: z.coerce.number().min(0),
  protein: z.coerce.number().min(0),
  fat: z.coerce.number().min(0),
  carbohydrates: z.coerce.number().min(0),
});

interface AnalyzeMealFormProps {
  onSuccess: () => void;
}

export default function AnalyzeMealForm({ onSuccess }: AnalyzeMealFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<'idle' | 'analyzing' | 'saving'>('idle');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<z.infer<typeof analysisResultSchema>>({
    resolver: zodResolver(analysisResultSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        handleAnalyze(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (dataUri: string) => {
    setLoading('analyzing');
    form.reset();
    try {
      const result = await analyzeFoodImage({ photoDataUri: dataUri });
      form.setValue('foodName', 'Analyzed Meal'); // AI doesn't return name
      form.setValue('calories', result.calories);
      form.setValue('protein', result.protein);
      form.setValue('fat', result.fat);
      form.setValue('carbohydrates', result.carbohydrates);
      toast({ title: 'Analysis Complete!', description: 'Review the details below and save.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Could not analyze the image. Please try again or enter manually.' });
    } finally {
      setLoading('idle');
    }
  };

  const onSubmit = async (values: z.infer<typeof analysisResultSchema>) => {
    if (!user || !imagePreview) return;
    setLoading('saving');

    try {
      // Upload image and get URL
      const path = `food-images/${user.uid}/${Date.now()}.jpg`;
      const { url } = await uploadFile(path, imagePreview);

      await addFoodLog(user.uid, { ...values, imageUrl: url || undefined });
      toast({ title: 'Meal Logged!', description: 'Your meal has been added to your log.' });
      onSuccess();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save your meal log.' });
    } finally {
      setLoading('saving');
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <Input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Card
        className="relative flex h-48 cursor-pointer items-center justify-center border-2 border-dashed bg-muted hover:border-primary hover:bg-muted/50"
        onClick={() => fileInputRef.current?.click()}
      >
        {imagePreview ? (
          <Image src={imagePreview} alt="Meal preview" layout="fill" objectFit="cover" className="rounded-lg" data-ai-hint="food meal"/>
        ) : (
          <div className="text-center text-muted-foreground">
            <FileUp className="mx-auto h-8 w-8" />
            <p>Click to upload a photo</p>
            <p className="text-xs">Let AI do the work!</p>
          </div>
        )}
      </Card>

      {loading === 'analyzing' && (
        <Alert>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          <AlertTitle>Analyzing...</AlertTitle>
          <AlertDescription>The AI is working its magic. This may take a moment.</AlertDescription>
        </Alert>
      )}

      {form.formState.isDirty && (
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="foodName" render={({ field }) => (
                    <FormItem><FormLabel>Food Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="calories" render={({ field }) => (
                        <FormItem><FormLabel>Calories</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="protein" render={({ field }) => (
                        <FormItem><FormLabel>Protein (g)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="fat" render={({ field }) => (
                        <FormItem><FormLabel>Fat (g)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="carbohydrates" render={({ field }) => (
                        <FormItem><FormLabel>Carbs (g)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                <Button type="submit" className="w-full" disabled={loading !== 'idle'}>
                    {loading === 'saving' ? 'Saving...' : 'Save to Log'}
                </Button>
            </form>
         </Form>
      )}
    </div>
  );
}
