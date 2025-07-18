import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  height?: number; // in cm
  weight?: number; // in kg
  age?: number;
  gender?: 'male' | 'female' | 'other';
  goal?: 'lose' | 'maintain' | 'gain';
  onboarded?: boolean;
  calorieGoal?: number;
}

export interface FoodLog {
  id?: string;
  foodName: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  imageUrl?: string;
  timestamp: Timestamp;
}

export interface WorkoutLog {
  id?: string;
  activityName: string;
  duration: number; // in minutes
  caloriesBurned: number;
  timestamp: Timestamp;
}
