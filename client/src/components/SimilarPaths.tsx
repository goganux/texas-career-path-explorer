import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { SimilarPathway } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface SimilarPathsProps {
  interestId: number;
}

export default function SimilarPaths({ interestId }: SimilarPathsProps) {
  const { data: similarPathways, isLoading } = useQuery<SimilarPathway[]>({
    queryKey: [`/api/similar-pathways/${interestId}`],
  });
  
  if (isLoading) {
    return (
      <div className="mt-6">
        <Skeleton className="h-6 w-64 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="p-0">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-5 w-32 ml-3" />
                </div>
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex justify-between items-center">
                  <div className="flex space-x-1">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (!similarPathways || similarPathways.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-500 mb-4">Similar Pathways You Might Like</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {similarPathways.map((pathway) => (
          <Card 
            key={pathway.id} 
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex items-center">
                <div 
                  className={`rounded-full flex items-center justify-center ${pathway.iconBg} ${pathway.iconColor} overflow-hidden`} 
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    minWidth: '40px', 
                    minHeight: '40px',
                    maxWidth: '40px',
                    maxHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span className="material-icons text-sm">{pathway.icon}</span>
                </div>
                <h4 className="ml-3 font-medium text-neutral-800 dark:text-neutral-200">{pathway.title}</h4>
              </div>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{pathway.description}</p>
              <div className="mt-3 flex justify-between items-center">
                <div className="flex flex-wrap gap-1">
                  {pathway.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <ChevronRight className="text-neutral-400 dark:text-neutral-600" size={20} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
