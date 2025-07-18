import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  AuthError,
} from 'firebase/auth';
import { auth } from './config';

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string): Promise<{ result: any; error: AuthError | null }> {
  let result = null, error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e as AuthError;
  }
  return { result, error };
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string): Promise<{ result: any; error: AuthError | null }> {
  let result = null, error = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e as AuthError;
  }
  return { result, error };
}

// Sign in with Google
export async function signInWithGoogle(): Promise<{ result: any; error: AuthError | null }> {
  const provider = new GoogleAuthProvider();
  let result = null, error = null;
  try {
    result = await signInWithPopup(auth, provider);
  } catch (e) {
    error = e as AuthError;
  }
  return { result, error };
}

// Sign out
export async function signOut(): Promise<{ error: AuthError | null }> {
  let error = null;
  try {
    await firebaseSignOut(auth);
  } catch (e) {
    error = e as AuthError;
  }
  return { error };
}
