import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Progress } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface ProgressTimelineProps {
  studentId: number;
  interestId: number;
  interestName: string;
}

export default function ProgressTimeline({ studentId, interestId, interestName }: ProgressTimelineProps) {
  const { data: progress, isLoading } = useQuery<Progress>({
    queryKey: [`/api/progress/${studentId}/${interestId}`],
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-2.5 w-full mb-4" />
          <Skeleton className="h-4 w-32 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!progress) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">No progress data available.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{interestName}</span>
        <span className="text-sm font-medium text-primary dark:text-blue-400">{progress.percentage}%</span>
      </div>
      <ProgressBar value={progress.percentage} className="h-2.5 w-full" />
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Completed Steps:</h3>
        <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
          {progress.completedSteps.map((step) => (
            <li key={step.id} className="flex items-start">
              {step.status === 'completed' ? (
                <span className="material-icons text-green-500 text-sm mr-1">check_circle</span>
              ) : step.status === 'in-progress' ? (
                <span className="material-icons text-blue-500 text-sm mr-1">play_circle</span>
              ) : (
                <span className="material-icons text-neutral-300 dark:text-neutral-700 text-sm mr-1">radio_button_unchecked</span>
              )}
              <span className={
                step.status === 'completed' || step.status === 'in-progress' 
                  ? '' 
                  : 'text-neutral-400 dark:text-neutral-600'
              }>
                {step.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
