'use client';

import { AppLayout } from '@/components/AppLayout';
import { DashboardClient } from '@/components/DashboardClient';
import { useAuth } from '@/components/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  return (
    <AppLayout>
      {loading ? (
        <div className="dashboard-grid">
            <Skeleton className="h-[250px] md:h-[300px]" />
            <Skeleton className="h-[250px] md:h-[300px]" />
            <Skeleton className="h-[250px] md:h-[300px] md:col-span-2" />
        </div>
      ) : (
        <DashboardClient user={user} />
      )}
    </AppLayout>
  );
}
