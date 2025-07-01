'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/AppLayout';
import { DashboardClient } from '@/components/DashboardClient';
import { useAuth } from '@/components/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <AppLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[300px] lg:col-span-1" />
            <Skeleton className="h-[300px] lg:col-span-2" />
            <Skeleton className="h-[300px] lg:col-span-2" />
            <Skeleton className="h-[300px] lg:col-span-1" />
            <Skeleton className="h-[300px] lg:col-span-1" />
            <Skeleton className="h-[300px] lg:col-span-2" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <DashboardClient user={user} />
    </AppLayout>
  );
}
