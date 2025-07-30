import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PathwayNode from '@/components/PathwayNode';
import DetailedView from '@/components/DetailedView';
import CourseDetailModal from '@/components/CourseDetailModal';
import JobMarketTrends from '@/components/JobMarketTrends';
import { Pathway, PathwayNode as PathwayNodeType } from '@/types';
import { Filter, Share } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PathwayVisualizationProps {
  interestId: number;
  interestName: string;
}

export default function PathwayVisualization({ interestId, interestName }: PathwayVisualizationProps) {
  const [selectedNode, setSelectedNode] = useState<PathwayNodeType | null>(null);
  const [selectedCourseNode, setSelectedCourseNode] = useState<PathwayNodeType | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [careerSelected, setCareerSelected] = useState<boolean>(false);
  
  const filterOptions = [
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'available', label: 'Available' },
    { value: 'eligible', label: 'Eligible' },
    { value: 'recommended', label: 'Recommended' },
    { value: 'option', label: 'Optional' }
  ];
  
  const { data: pathways, isLoading } = useQuery<Pathway>({
    queryKey: [`/api/pathways/${interestId}`],
  });
  
  const handleNodeSelect = (node: PathwayNodeType) => {
    // If the node is a course, certification, or major, show the course detail modal
    if (node.pathwayType === 'course' || node.pathwayType === 'certification' || node.pathwayType === 'major') {
      setSelectedCourseNode(node);
    } else {
      // For careers, toggle selection if the same node is clicked again
      if (selectedNode && selectedNode.id === node.id) {
        // Deselect if the same career is clicked
        resetHighlights();
        setSelectedNode(null);
        setCareerSelected(false);
      } else {
        // For careers, highlight prerequisites without showing details
        highlightPrerequisites(node);
        setSelectedNode(node);
        setCareerSelected(true);
      }
    }
  };
  
  // Function to reset all highlights
  const resetHighlights = () => {
    if (pathways) {
      [...pathways.courses, ...pathways.certifications, ...pathways.majors, ...pathways.careers].forEach(node => {
        node.isActivePath = false;
      });
    }
    setHighlightedNodes([]);
  };
  
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
  };
  
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([]);
  
  const filterNodes = (nodes: PathwayNodeType[]) => {
    if (activeFilters.length === 0) return nodes;
    return nodes.filter(node => activeFilters.includes(node.status));
  };
  
  // Function to highlight prerequisites when a career is selected
  const highlightPrerequisites = (node: PathwayNodeType) => {
    // Reset any previous highlights - first clear any existing isActivePath flags
    if (pathways) {
      [...pathways.courses, ...pathways.certifications, ...pathways.majors, ...pathways.careers].forEach(node => {
        node.isActivePath = false;
      });
    }
    setHighlightedNodes([]);
    
    // If the node is a career and has prerequisites in additionalInfo
    if (node.additionalInfo?.requiredSteps) {
      // Set the selected career node as active path
      node.isActivePath = true;
      
      const requiredIds = node.additionalInfo.requiredSteps.map(step => step.id);
      setHighlightedNodes(requiredIds);
      
      // Find courses, certifications and majors that match these prerequisites
      if (pathways) {
        // Helper function to match node ID or name to the steps
        const matchesRequirement = (node: PathwayNodeType) => {
          return requiredIds.includes(node.id) || 
                 node.additionalInfo?.requiredSteps?.some(step => 
                   requiredIds.includes(step.id) || 
                   node.title.toLowerCase().includes(step.name.toLowerCase()));
        };
        
        // Mark all matching prerequisites as active
        [...pathways.courses, ...pathways.certifications, ...pathways.majors].forEach(prereq => {
          if (matchesRequirement(prereq)) {
            prereq.isActivePath = true;
          }
        });
      }
    }
  };
  
  // Handler to check if a node is a prerequisite for the selected career
  const isPrerequisite = (nodeId: number) => {
    return highlightedNodes.includes(nodeId);
  };
  
  // When interest changes, reset the selected node, filters, and highlights
  React.useEffect(() => {
    setSelectedNode(null);
    setSelectedCourseNode(null);
    setActiveFilters([]);
    setHighlightedNodes([]);
  }, [interestId]);
  
  if (isLoading) {
    return (
      <div className="animate-fadeIn">
        <div 
          className="flex justify-between items-center mb-4 opacity-0"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}
        >
          <Skeleton className="h-8 w-64 bg-gradient-to-r from-blue-200 to-blue-300" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20 bg-gradient-to-r from-gray-200 to-gray-300" />
            <Skeleton className="h-8 w-20 bg-gradient-to-r from-gray-200 to-gray-300" />
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, colIndex) => (
            <div 
              key={colIndex}
              className="opacity-0"
              style={{ animation: `fadeInUp 0.6s ease-out ${0.2 + colIndex * 0.1}s both` }}
            >
              <Skeleton className="h-6 w-32 mb-4 mx-auto bg-gradient-to-r from-purple-200 to-purple-300" />
              <div className="space-y-4">
                {[...Array(3)].map((_, nodeIndex) => (
                  <Card 
                    key={nodeIndex} 
                    className="p-0 opacity-0 transform translate-y-4"
                    style={{ animation: `fadeInUp 0.6s ease-out ${0.3 + colIndex * 0.1 + nodeIndex * 0.05}s both` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-2">
                        <Skeleton className="h-4 w-24 bg-gradient-to-r from-indigo-200 to-indigo-300" />
                        <Skeleton className="h-4 w-4 rounded-full bg-gradient-to-r from-green-200 to-green-300" />
                      </div>
                      <Skeleton className="h-5 w-full mb-2 bg-gradient-to-r from-gray-200 to-gray-300" />
                      <Skeleton className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!pathways) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-neutral-500 dark:text-neutral-400">
            No pathway data available for this interest. Please try another interest.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-500">{interestName} Career Pathways</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className={`text-neutral-700 dark:text-neutral-300 ${activeFilters.length > 0 ? 'border-blue-500 dark:border-blue-400' : ''}`}
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter size={16} className={`mr-1 ${activeFilters.length > 0 ? 'text-blue-600 dark:text-blue-400' : ''}`} />
              Filter {activeFilters.length > 0 && `(${activeFilters.length})`}
            </Button>
            
            {showFilterMenu && (
              <div className="absolute right-0 top-10 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-20 p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Filter by Status</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">Clear All</Button>
                </div>
                <div className="space-y-2">
                  {filterOptions.map(option => (
                    <div 
                      key={option.value} 
                      className={`flex items-center p-2 rounded-md cursor-pointer ${
                        activeFilters.includes(option.value) 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                      onClick={() => toggleFilter(option.value)}
                    >
                      <div className={`w-4 h-4 rounded-sm mr-2 flex items-center justify-center ${
                        activeFilters.includes(option.value) 
                          ? 'bg-blue-600 dark:bg-blue-500' 
                          : 'border border-neutral-300 dark:border-neutral-700'
                      }`}>
                        {activeFilters.includes(option.value) && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.5 2.5L4 7L1.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-neutral-700 dark:text-neutral-300"
            onClick={() => setShowShareModal(true)}
          >
            <Share size={16} className="mr-1" />
            Share
          </Button>
        </div>
      </div>
      
      {/* Share Modal */}
      {showShareModal && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg max-w-md w-full p-6 animate-in fade-in duration-300" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Share Career Pathway</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Share this {interestName} career pathway with others to help them understand your career interests and goals.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 dark:text-neutral-200">Counselor</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Share with your school counselor for guidance</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-sky-600 flex items-center justify-center text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 dark:text-neutral-200">Teacher</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Share with a teacher for mentorship</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 dark:text-neutral-200">Parents</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Share with your parents or guardians</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowShareModal(false)}>Close</Button>
            </div>
          </div>
        </div>,
        document.body
      )}
      
      <div 
        className="pathway-visualization overflow-x-auto pb-6" 
        style={{ minHeight: '600px' }}
        onClick={(e) => {
          // Only reset if clicking on the background, not on nodes
          if ((e.target as HTMLElement).classList.contains('pathway-visualization') || 
              (e.target as HTMLElement).classList.contains('pathway-container')) {
            resetHighlights();
            setSelectedNode(null);
            setCareerSelected(false);
          }
        }}
      >
        <div 
          className="pathway-container" 
          style={{ minWidth: '750px', maxWidth: '100%' }}
          onClick={(e) => {
            // Prevent event bubbling if clicking directly on container
            if (e.target === e.currentTarget) {
              resetHighlights();
              setSelectedNode(null);
              setCareerSelected(false);
            }
          }}
        >
          <div className="grid grid-cols-4 gap-4">
            {/* District Courses Column */}
            <div>
              <div className="mb-4 text-center">
                <h3 className="text-sm font-medium uppercase text-neutral-500 dark:text-neutral-400 tracking-wider">School Courses</h3>
              </div>
              
              <div className="space-y-4">
                {filterNodes(pathways.courses).map((course) => (
                  <PathwayNode 
                    key={course.id} 
                    node={course} 
                    onSelect={handleNodeSelect}
                    careerSelected={careerSelected}
                  />
                ))}
                {filterNodes(pathways.courses).length === 0 && (
                  <div className="text-center py-6 text-neutral-500 dark:text-neutral-400 text-sm">
                    No courses match your filters
                  </div>
                )}
              </div>
            </div>
            
            {/* Certifications Column */}
            <div>
              <div className="mb-4 text-center">
                <h3 className="text-sm font-medium uppercase text-neutral-500 dark:text-neutral-400 tracking-wider">Certifications</h3>
              </div>
              
              <div className="space-y-4">
                {filterNodes(pathways.certifications).map((certification) => (
                  <PathwayNode 
                    key={certification.id} 
                    node={certification} 
                    onSelect={handleNodeSelect}
                    careerSelected={careerSelected}
                  />
                ))}
                {filterNodes(pathways.certifications).length === 0 && (
                  <div className="text-center py-6 text-neutral-500 dark:text-neutral-400 text-sm">
                    No certifications match your filters
                  </div>
                )}
              </div>
            </div>
            
            {/* College Majors Column */}
            <div>
              <div className="mb-4 text-center">
                <h3 className="text-sm font-medium uppercase text-neutral-500 dark:text-neutral-400 tracking-wider">College Majors</h3>
              </div>
              
              <div className="space-y-4">
                {filterNodes(pathways.majors).map((major) => (
                  <PathwayNode 
                    key={major.id} 
                    node={major} 
                    onSelect={handleNodeSelect}
                    careerSelected={careerSelected}
                  />
                ))}
                {filterNodes(pathways.majors).length === 0 && (
                  <div className="text-center py-6 text-neutral-500 dark:text-neutral-400 text-sm">
                    No majors match your filters
                  </div>
                )}
              </div>
            </div>
            
            {/* Careers Column */}
            <div>
              <div className="mb-4 text-center">
                <h3 className="text-sm font-medium uppercase text-neutral-500 dark:text-neutral-400 tracking-wider">Careers</h3>
              </div>
              
              <div className="space-y-4">
                {filterNodes(pathways.careers).map((career) => (
                  <PathwayNode 
                    key={career.id} 
                    node={career} 
                    onSelect={(node) => {
                      handleNodeSelect(node);
                    }}
                    careerSelected={careerSelected}
                  />
                ))}
                {filterNodes(pathways.careers).length === 0 && (
                  <div className="text-center py-6 text-neutral-500 dark:text-neutral-400 text-sm">
                    No careers match your filters
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Career Detailed View - Removed based on user's request */}
      
      {/* Course Detail Modal */}
      {selectedCourseNode && (
        <CourseDetailModal 
          node={selectedCourseNode} 
          onClose={() => setSelectedCourseNode(null)}
        />
      )}
      
      {/* Job Market Trends */}
      <JobMarketTrends interestId={interestId} interestName={interestName} />
    </div>
  );
}
