import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface TabItem {
  name: string;
  path: string;
  icon: string;
}

interface NavigationTabsProps {
  tabs: TabItem[];
}

export default function NavigationTabs({ tabs }: NavigationTabsProps) {
  const [location] = useLocation();
  
  return (
    <div className="bg-white dark:bg-neutral-900 shadow-sm rounded-xl mb-6">
      <nav className="flex overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = location === tab.path;
          
          return (
            <Link key={tab.path} href={tab.path}>
              <div
                className={cn(
                  "whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 focus:outline-none cursor-pointer",
                  isActive 
                    ? "text-primary border-primary" 
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 border-transparent hover:border-neutral-300 dark:hover:border-neutral-700"
                )}
              >
                <span className="material-icons text-sm mr-1 align-text-bottom">{tab.icon}</span>
                {tab.name}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
