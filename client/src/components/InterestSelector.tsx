import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CareerInterest } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface InterestSelectorProps {
  selectedInterestId: number;
  onSelectInterest: (interestId: number) => void;
}

export default function InterestSelector({ selectedInterestId, onSelectInterest }: InterestSelectorProps) {
  const { data: interests, isLoading } = useQuery({
    queryKey: ['/api/interests'],
  });
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((index) => (
          <Card 
            key={index} 
            className="p-2 animate-pulse"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
            }}
          >
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-200 to-blue-300" />
              <Skeleton className="h-4 w-32 ml-3 bg-gradient-to-r from-gray-200 to-gray-300" />
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {interests?.map((interest: CareerInterest) => {
        const isSelected = interest.id === selectedInterestId;
        
        return (
          <div key={interest.id} className="relative">
            <Button
              variant="ghost"
              className={`w-full flex items-center justify-between text-left p-3 h-auto ${
                isSelected 
                  ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40' 
                  : 'border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
              onClick={() => onSelectInterest(interest.id)}
            >
              <div className="flex items-center">
                <span className={`${isSelected ? 'bg-primary text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'} rounded-full p-2`}>
                  <span className="material-icons">{interest.icon}</span>
                </span>
                <span className={`ml-3 font-medium ${isSelected ? 'text-primary dark:text-blue-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
                  Robotics & En...
                </span>
              </div>
              {isSelected && <CheckCircle className="text-primary dark:text-blue-400" size={20} />}
            </Button>
          </div>
        );
      })}
      
      <div className="relative">
        <Button
          variant="ghost"
          className="w-full flex items-center text-left border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 h-auto"
        >
          <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full p-2">
            <span className="material-icons">add</span>
          </span>
          <span className="ml-3 font-medium text-neutral-700 dark:text-neutral-300">
            Explore More Interests
          </span>
        </Button>
      </div>
    </div>
  );
}
