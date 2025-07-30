import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getStatusBadgeClasses, toTitleCase } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { PathwayNode as PathwayNodeType } from '@/types';

interface PathwayNodeProps {
  node: PathwayNodeType;
  onSelect: (node: PathwayNodeType) => void;
  careerSelected?: boolean;
}

export default function PathwayNode({ node, onSelect, careerSelected = false }: PathwayNodeProps) {
  const statusClasses = getStatusBadgeClasses(node.status);
  const isActivePath = node.isActivePath || false;
  
  // Calculate the highlighted styles based on isActivePath and careerSelected
  let cardStyles = '';
  
  if (isActivePath) {
    // Highlighted styles for active path nodes - maintain a consistent border width to prevent layout shifting
    cardStyles = 'bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 shadow-md';
  } else if (careerSelected && !isActivePath) {
    // Grayed out styles for non-highlighted nodes when a career is selected
    cardStyles = 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 opacity-40 hover:opacity-80';
  } else {
    // Default styles when no career is selected
    cardStyles = 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30';
  }
    
  return (
    <Card 
      className={`pathway-node transition-all cursor-pointer ${cardStyles}`}
      onClick={() => onSelect(node)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline"
            className={`${statusClasses.bg} ${statusClasses.text}`}
          >
            {toTitleCase(node.status)}
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            className={isActivePath ? "text-primary dark:text-blue-400" : "text-neutral-300 dark:text-neutral-700"}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
        
        <h4 className="font-medium text-neutral-800 dark:text-neutral-200 mt-2">{node.title}</h4>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{node.description}</p>
        
        {/* Additional information based on node type */}
        {node.additionalInfo?.schools && (
          <div className="mt-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Top TX Schools:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {node.additionalInfo.schools.map((school, index) => (
                <Badge key={index} variant="outline" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {school}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {node.additionalInfo?.salary && (
          <div className="mt-2">
            <div className="flex items-center text-sm">
              <span className="material-icons text-green-500 dark:text-green-400 text-sm mr-1">paid</span>
              <span className="text-neutral-700 dark:text-neutral-300">{node.additionalInfo.salary}</span>
            </div>
            {node.additionalInfo.growthRate && (
              <div className="flex items-center text-sm mt-1">
                <span className="material-icons text-amber-500 dark:text-amber-400 text-sm mr-1">trending_up</span>
                <span className="text-neutral-700 dark:text-neutral-300">{node.additionalInfo.growthRate}</span>
              </div>
            )}
          </div>
        )}
        
        {node.additionalInfo?.companies && node.additionalInfo.companies.length > 0 && (
          <div className="mt-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">TX Companies:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {node.additionalInfo.companies.slice(0, 2).map((company, index) => (
                <Badge key={index} variant="outline" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {company.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
