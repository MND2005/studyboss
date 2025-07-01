'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import type { User } from 'firebase/auth';
import { AppLayout } from '@/components/AppLayout';
import { DashboardClient } from '@/components/DashboardClient';
import { useAuth } from '@/components/AuthProvider';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      redirect('/login');
    }
  }, [user, loading]);

  if (loading || !user) {
    return null;
  }

  return (
    <AppLayout>
      <DashboardClient user={user as User} />
    </AppLayout>
  );
}
