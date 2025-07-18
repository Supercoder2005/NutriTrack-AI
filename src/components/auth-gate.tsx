'use client';

import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/auth/AuthForm';
import OnboardingForm from '@/components/onboarding/OnboardingForm';
import Dashboard from '@/components/dashboard/Dashboard';
import FullPageSpinner from './shared/FullPageSpinner';

export default function AuthGate() {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return <FullPageSpinner />;
  }

  if (!user) {
    return <AuthForm />;
  }

  if (!userProfile?.onboarded) {
    return <OnboardingForm />;
  }

  return <Dashboard />;
}
