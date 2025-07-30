import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, BookmarkPlus, Calendar } from 'lucide-react';
import { PathwayNode } from '@/types';
import { getStatusBadgeClasses, toTitleCase } from '@/lib/utils';

interface DetailedViewProps {
  node: PathwayNode;
  onClose: () => void;
}

export default function DetailedView({ node, onClose }: DetailedViewProps) {
  return (
    <Card className="mt-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium text-neutral-800 dark:text-neutral-200">{node.title}</CardTitle>
            <CardDescription>Detailed career information</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">
            <X size={20} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Job Description</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{node.description}</p>
            
            {node.additionalInfo?.skills && (
              <>
                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mt-4 mb-2">Skills Required</h4>
                <div className="flex flex-wrap gap-1">
                  {node.additionalInfo.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Texas Opportunities</h4>
            <div className="space-y-3">
              {node.additionalInfo?.companies ? (
                node.additionalInfo.companies.map((company, index) => (
                  <div key={index} className="border border-neutral-200 dark:border-neutral-800 rounded p-3 bg-white dark:bg-neutral-900">
                    <div className="flex justify-between">
                      <h5 className="font-medium text-neutral-800 dark:text-neutral-200 text-sm">{company.name}</h5>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">{company.location}</span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{company.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">No specific company information available.</p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Prerequisites</h4>
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="h-full w-0.5 bg-neutral-200 dark:bg-neutral-800 mx-auto"></div>
              </div>
              
              <div className="relative flex flex-col space-y-6">
                {node.additionalInfo?.requiredSteps ? (
                  node.additionalInfo.requiredSteps.map((step, index) => {
                    let iconBg = "bg-neutral-200 dark:bg-neutral-700";
                    let iconColor = "text-neutral-500 dark:text-neutral-400";
                    let icon = "school";
                    
                    if (step.status === 'completed') {
                      iconBg = "bg-green-500";
                      iconColor = "text-white";
                      icon = "check";
                    } else if (step.status === 'in-progress') {
                      iconBg = "bg-blue-500";
                      iconColor = "text-white";
                      icon = "play_arrow";
                    } else if (step.status === 'required') {
                      icon = "lock_open";
                    }
                    
                    return (
                      <div key={index} className="relative flex items-start group">
                        <span className={`h-5 w-5 rounded-full ${iconBg} flex items-center justify-center ring-4 ring-white dark:ring-neutral-900`}>
                          <span className={`material-icons ${iconColor} text-sm`}>{icon}</span>
                        </span>
                        <div className="ml-3">
                          <h5 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{step.name}</h5>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">{toTitleCase(step.status)}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-neutral-500 dark:text-neutral-400 text-sm">
                    No specific prerequisites available for this path.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 flex flex-col sm:flex-row sm:justify-between gap-2">
        <Button variant="outline" className="w-full sm:w-auto text-neutral-700 dark:text-neutral-300">
          <BookmarkPlus size={16} className="mr-1" />
          Save to My Goals
        </Button>
        <Button className="w-full sm:w-auto">
          <Calendar size={16} className="mr-1" />
          Schedule Counselor Meeting
        </Button>
      </CardFooter>
    </Card>
  );
}
