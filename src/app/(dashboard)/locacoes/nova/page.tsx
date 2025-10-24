import { Suspense } from 'react';
import { NovaLocacaoWizard } from '@/components/locacao/NovaLocacaoWizard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function NovaLocacaoPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Suspense fallback={<LoadingSkeleton />}>
          <NovaLocacaoWizard />
        </Suspense>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>

      <Skeleton className="h-2 w-full" />

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Skeleton className="h-96 w-full" />
    </div>
  );
}
