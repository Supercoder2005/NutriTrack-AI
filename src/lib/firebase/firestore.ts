import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from './config';
import type { UserProfile, FoodLog, WorkoutLog } from '@/types';

// Create a user profile
export async function createUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await setDoc(doc(db, 'users', uid), { ...data, uid }, { merge: true });
}

// Get a user profile
export async function getUserProfile(uid:string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
}

// Update a user profile
export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, data, { merge: true });
}

// Add a food log entry
export async function addFoodLog(uid: string, foodLog: Omit<FoodLog, 'id' | 'timestamp'>): Promise<void> {
  const foodLogWithTimestamp = { ...foodLog, timestamp: Timestamp.now() };
  await addDoc(collection(db, 'users', uid, 'food_logs'), foodLogWithTimestamp);
}

// Get food logs for a specific day
export async function getFoodLogs(uid: string, date: Date): Promise<FoodLog[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const startTimestamp = Timestamp.fromDate(startOfDay);
  const endTimestamp = Timestamp.fromDate(endOfDay);
  
  const q = query(
    collection(db, 'users', uid, 'food_logs'),
    where('timestamp', '>=', startTimestamp),
    where('timestamp', '<=', endTimestamp),
    orderBy('timestamp', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FoodLog));
}

// Add a workout log entry
export async function addWorkoutLog(uid: string, workoutLog: Omit<WorkoutLog, 'id' | 'timestamp'>): Promise<void> {
    const workoutLogWithTimestamp = { ...workoutLog, timestamp: Timestamp.now() };
    await addDoc(collection(db, 'users', uid, 'workout_logs'), workoutLogWithTimestamp);
}

// Get workout logs for a specific day
export async function getWorkoutLogs(uid: string, date: Date): Promise<WorkoutLog[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
  
    const startTimestamp = Timestamp.fromDate(startOfDay);
    const endTimestamp = Timestamp.fromDate(endOfDay);

    const q = query(
        collection(db, 'users', uid, 'workout_logs'),
        where('timestamp', '>=', startTimestamp),
        where('timestamp', '<=', endTimestamp),
        orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutLog));
}
