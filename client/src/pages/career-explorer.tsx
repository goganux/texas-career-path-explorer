import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import StudentProfileHeader from '@/components/StudentProfileHeader';
import NavigationTabs from '@/components/NavigationTabs';
import InterestSelector from '@/components/InterestSelector';
import ProgressTimeline from '@/components/ProgressTimeline';
import PathwayVisualization from '@/components/PathwayVisualization';
import Footer from '@/components/Footer';
import { Student, CareerInterest } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, File } from 'lucide-react';

const tabs = [
  { name: 'Career Path Explorer', path: '/career-explorer', icon: 'explore' },
  { name: 'Pathful', path: '/pathful', icon: 'route' }
];

interface CareerExplorerProps {
  onLogout?: () => void;
}

export default function CareerExplorer({ onLogout }: CareerExplorerProps) {
  const [selectedInterestId, setSelectedInterestId] = useState<number>(1); // Default to first interest
  const [isChangingInterest, setIsChangingInterest] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] = useState<string>("pdf");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const { data: student, isLoading: studentLoading } = useQuery<Student>({
    queryKey: ['/api/student/1'], // Default to student ID 1
  });
  
  const { data: interests, isLoading: interestsLoading } = useQuery<CareerInterest[]>({
    queryKey: ['/api/interests'],
  });
  
  const handleInterestSelect = (interestId: number) => {
    setIsChangingInterest(true);
    setSelectedInterestId(interestId);
    
    // Simulate loading time when changing interests
    setTimeout(() => {
      setIsChangingInterest(false);
    }, 800);
  };
  
  const getSelectedInterestName = () => {
    if (!interests) return '';
    const selected = interests.find(interest => interest.id === selectedInterestId);
    return selected ? selected.name : '';
  };
  
  const renderSkeletonProfile = () => (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm mb-6 p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex sm:space-x-5">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="mt-4 sm:mt-0">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64 mb-3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-0">
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="flex flex-col min-h-screen">
      <div 
        className="opacity-0"
        style={{ animation: 'fadeInUp 0.6s ease-out 0s both' }}
      >
        <Header 
          studentName={student?.name}
          studentImage={student?.imageUrl}
          onLogout={onLogout}
        />
      </div>
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div 
            className="opacity-0"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}
          >
            {studentLoading ? (
              renderSkeletonProfile()
            ) : (
              student && <StudentProfileHeader student={student} />
            )}
          </div>
          
          <div 
            className="mb-4 opacity-0"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.15s both' }}
          >
            <NavigationTabs tabs={tabs} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left column: Career Interest Selection */}
            <div 
              className="lg:col-span-1 opacity-0"
              style={{ animation: 'slideInLeft 0.8s ease-out 0.2s both' }}
            >
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 mb-6 border border-neutral-100 dark:border-neutral-800">
                <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-500 mb-2">Career Interests</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">Select an area of interest to explore potential career paths.</p>
                
                {interestsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((index) => (
                      <Skeleton key={index} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div>
                    {/* Make the selected interest a dropdown itself */}
                    <div className="relative">
                      {interests?.filter(i => i.id === selectedInterestId).map((interest: CareerInterest) => (
                        <button
                          key={interest.id}
                          onClick={() => {
                            const dropdown = document.getElementById('interests-dropdown');
                            if (dropdown) {
                              dropdown.classList.toggle('hidden');
                            }
                          }}
                          className="w-full flex items-center justify-between text-left px-3 py-2 h-auto
                            bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 
                            border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm transition-all hover:shadow-md"
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center w-8 h-8 shadow-sm">
                              <span className="material-icons text-sm">{interest.icon}</span>
                            </div>
                            <span 
                              className="ml-2 font-medium text-blue-700 dark:text-blue-400"
                              title={interest.name}
                            >
                              {interest.name.length > 14 ? `${interest.name.substring(0, 14)}...` : interest.name}
                            </span>
                          </div>
                          <span className="material-icons text-blue-500">expand_more</span>
                        </button>
                      ))}
                      
                      {/* Dropdown with all other interests */}
                      <div id="interests-dropdown" className="hidden absolute left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-10">
                        <div className="p-2">
                          {interests?.filter(i => i.id !== selectedInterestId).map((interest: CareerInterest) => (
                            <button
                              key={interest.id}
                              onClick={() => {
                                setSelectedInterestId(interest.id);
                                const dropdown = document.getElementById('interests-dropdown');
                                if (dropdown) {
                                  dropdown.classList.add('hidden');
                                }
                              }}
                              className="w-full flex items-center text-left p-3 h-auto rounded-lg hover:bg-blue-50
                                dark:hover:bg-blue-900/20 transition-all mb-1"
                            >
                              <div className="flex-shrink-0 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800/30 dark:to-indigo-800/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center w-9 h-9">
                                <span className="material-icons text-sm">{interest.icon}</span>
                              </div>
                              <span 
                                className="ml-3 font-medium text-neutral-700 dark:text-neutral-300"
                                title={interest.name}
                              >
                                {interest.name.length > 14 ? `${interest.name.substring(0, 14)}...` : interest.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Progress section moved up under selected interest */}
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-500 mb-2">My Progress</h2>
                  {student && selectedInterestId && (
                    <ProgressTimeline 
                      studentId={student.id}
                      interestId={selectedInterestId}
                      interestName={getSelectedInterestName()}
                    />
                  )}
                </div>
              </div>
            </div>
            
            {/* Right column: Career Path Visualization */}
            <div 
              className="lg:col-span-3 opacity-0"
              style={{ animation: 'slideInRight 0.8s ease-out 0.4s both' }}
            >
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 relative border border-neutral-100 dark:border-neutral-800">
                {isChangingInterest ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-neutral-900 bg-opacity-90 dark:bg-opacity-90 z-10">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
                      <span className="text-neutral-700 dark:text-neutral-300">Loading {getSelectedInterestName()} pathways...</span>
                    </div>
                  </div>
                ) : null}
                <PathwayVisualization 
                  interestId={selectedInterestId}
                  interestName={getSelectedInterestName()}
                />
              </div>
            </div>
          </div>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
