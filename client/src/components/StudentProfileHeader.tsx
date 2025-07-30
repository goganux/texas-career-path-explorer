import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import CircularProgress from '@/components/CircularProgress';
import CombinedProgressRing from '@/components/CombinedProgressRing';
import { Student } from '@/types';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { FileText, Download, File } from 'lucide-react';

interface StudentProfileHeaderProps {
  student: Student;
}

export default function StudentProfileHeader({ student }: StudentProfileHeaderProps) {
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showGpaModal, setShowGpaModal] = useState<boolean>(false);
  const [showAwardsModal, setShowAwardsModal] = useState<boolean>(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] = useState<string>("pdf");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Progress values for circular indicators
  const [academicProgress, setAcademicProgress] = useState<number>(0);
  const [competitionProgress, setCompetitionProgress] = useState<number>(0);
  const [projectProgress, setProjectProgress] = useState<number>(0);
  
  // Animate progress on component mount
  React.useEffect(() => {
    const timer1 = setTimeout(() => setAcademicProgress(78), 300);
    const timer2 = setTimeout(() => setCompetitionProgress(45), 600);
    const timer3 = setTimeout(() => setProjectProgress(92), 900);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleExport = () => {
    setIsGenerating(true);
    
    // Simulate generating the report
    setTimeout(() => {
      setIsGenerating(false);
      
      // Create a dummy download action
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', `student_report_${student.name.replace(/\s+/g, '_')}.${selectedFormat}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  return (
    <>

      
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm mb-6 p-6 relative">
        <div className="sm:flex sm:items-start sm:justify-between">
          {/* Left side with photo and basic info */}
          <div className="sm:flex sm:space-x-5">
            <div className="flex-shrink-0">
              {student.imageUrl ? (
                <img 
                  src={student.imageUrl} 
                  alt="Student profile photo" 
                  className="mx-auto h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto h-24 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-3xl text-neutral-500 dark:text-neutral-300">
                  {student.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 sm:flex sm:items-center">
                {student.name}
                <Badge variant="outline" className="ml-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Grade {student.grade}
                </Badge>
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{student.school} • Student ID: {student.studentId}</p>
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant="outline" 
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 flex items-center cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    onClick={() => setShowGpaModal(true)}
                  >
                    <span className="material-icons text-xs mr-1">school</span>
                    GPA: {student.gpa}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 flex items-center cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                    onClick={() => setShowAwardsModal(true)}
                  >
                    <span className="material-icons text-xs mr-1">emoji_events</span>
                    {student.awardsCount} Awards
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 flex items-center cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
                    onClick={() => setShowPortfolioModal(true)}
                  >
                    <span className="material-icons text-xs mr-1">assignment</span>
                    {student.portfolioCount} Portfolio Items
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100 flex items-center cursor-pointer hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors"
                    onClick={() => setShowExportModal(true)}
                  >
                    <span className="material-icons text-xs mr-1">print</span>
                    Export Report
                  </Badge>
                </div>
                
                {/* Extracurricular Activities & Interests Icons */}
                <div className="mt-3 border-t border-neutral-100 dark:border-neutral-800 pt-3">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Activities & Interests</div>
                  <div className="flex space-x-3">
                    {/* Robotics */}
                    <div className="group relative cursor-pointer">
                      <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center hover:shadow-md transition-all">
                        <span className="material-icons text-green-600 dark:text-green-400">science</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap transition-opacity">
                        Robotics
                      </div>
                    </div>
                    
                    {/* Coding */}
                    <div className="group relative cursor-pointer">
                      <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center hover:shadow-md transition-all">
                        <span className="material-icons text-blue-600 dark:text-blue-400">code</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap transition-opacity">
                        Coding
                      </div>
                    </div>
                    
                    {/* Soccer */}
                    <div className="group relative cursor-pointer">
                      <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center hover:shadow-md transition-all">
                        <span className="material-icons text-amber-600 dark:text-amber-400">sports_soccer</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap transition-opacity">
                        Soccer
                      </div>
                    </div>
                    
                    {/* Music */}
                    <div className="group relative cursor-pointer">
                      <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center hover:shadow-md transition-all">
                        <span className="material-icons text-purple-600 dark:text-purple-400">piano</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap transition-opacity">
                        Music
                      </div>
                    </div>
                    
                    {/* Chess */}
                    <div className="group relative cursor-pointer">
                      <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center hover:shadow-md transition-all">
                        <span className="material-icons text-red-600 dark:text-red-400">extension</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap transition-opacity">
                        Chess Club
                      </div>
                    </div>
                    
                    {/* Debate */}
                    <div className="group relative cursor-pointer">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center hover:shadow-md transition-all">
                        <span className="material-icons text-indigo-600 dark:text-indigo-400">chat</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap transition-opacity">
                        Debate Team
                      </div>
                    </div>
                    
                    {/* Maker Club */}
                    <div className="group relative cursor-pointer">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center hover:shadow-md transition-all">
                        <span className="material-icons text-emerald-600 dark:text-emerald-400">precision_manufacturing</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap transition-opacity">
                        Maker Club
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side with progress indicators */}
          <div className="mt-6 sm:mt-0 sm:ml-8">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 items-center">
              <div className="flex space-x-4">
                <CircularProgress 
                  progress={academicProgress} 
                  size={80} 
                  strokeWidth={6} 
                  color="stroke-blue-500 dark:stroke-blue-400" 
                  label="AP CS Goals"
                  subLabel="Robotics Track"
                />
                <CircularProgress 
                  progress={competitionProgress} 
                  size={80} 
                  strokeWidth={6} 
                  color="stroke-purple-500 dark:stroke-purple-400" 
                  label="TX Robotics"
                  subLabel="Competition"
                />
                <CircularProgress 
                  progress={projectProgress} 
                  size={80} 
                  strokeWidth={6} 
                  color="stroke-amber-500 dark:stroke-amber-400" 
                  label="Arduino Project"
                  subLabel="Completion"
                />
              </div>
              <div className="ml-4">
                <CombinedProgressRing 
                  progressValues={[academicProgress, competitionProgress, projectProgress]} 
                  colors={["stroke-blue-500 dark:stroke-blue-400", "stroke-purple-500 dark:stroke-purple-400", "stroke-amber-500 dark:stroke-amber-400"]}
                  strokeWidths={[8, 8, 8]}
                  size={130}
                  label="Overall Progress"
                  subLabel="Engineering Goals"
                  goalLabels={["AP CS", "TX Robotics", "Arduino"]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Export Report Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Export Student Report</DialogTitle>
            <DialogDescription>
              Generate a transcript and resume based on {student.name}'s profile data for college applications.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h3 className="text-sm font-medium mb-3 text-neutral-700 dark:text-neutral-300">Choose export format:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div 
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors 
                  ${selectedFormat === "pdf" 
                    ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700" 
                    : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                onClick={() => setSelectedFormat("pdf")}
              >
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mr-3">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 dark:text-neutral-200">PDF Format</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Universal document format</p>
                </div>
              </div>
              
              <div 
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors 
                  ${selectedFormat === "docx" 
                    ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700" 
                    : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                onClick={() => setSelectedFormat("docx")}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                  <File size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 dark:text-neutral-200">Word Document</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Editable document format</p>
                </div>
              </div>
              
              <div 
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors 
                  ${selectedFormat === "jpg" 
                    ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700" 
                    : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                onClick={() => setSelectedFormat("jpg")}
              >
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-3">
                  <span className="material-icons">image</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 dark:text-neutral-200">Image Format</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">For sharing on social media</p>
                </div>
              </div>
              
              <div 
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors 
                  ${selectedFormat === "txt" 
                    ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700" 
                    : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                onClick={() => setSelectedFormat("txt")}
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                  <span className="material-icons">text_fields</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 dark:text-neutral-200">Plain Text</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Universal compatibility</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                <span className="font-medium">Includes:</span> Academic transcript, extracurricular activities, awards, completed certifications, and skills gained through completed courses.
              </p>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" className="mr-2">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleExport} 
              className="text-white"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download {selectedFormat.toUpperCase()}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* GPA Modal */}
      <Dialog open={showGpaModal} onOpenChange={setShowGpaModal}>
        <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Academic Performance</DialogTitle>
            <DialogDescription>
              Breakdown of {student.name}'s grades and academic progress.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">Current GPA: {student.gpa}</h3>
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                Top 15% of class
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                <h4 className="font-medium text-neutral-800 dark:text-neutral-200 mb-2">Current Semester Grades</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">AP Computer Science</span>
                    <span className="font-medium text-green-600 dark:text-green-400">A (98%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Honors Physics</span>
                    <span className="font-medium text-green-600 dark:text-green-400">A- (92%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">English Literature</span>
                    <span className="font-medium text-green-600 dark:text-green-400">B+ (89%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Algebra II</span>
                    <span className="font-medium text-green-600 dark:text-green-400">A (95%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">US History</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">B (86%)</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                <h4 className="font-medium text-neutral-800 dark:text-neutral-200 mb-2">GPA Trend</h4>
                <div className="h-32 flex items-end space-x-2">
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-500 dark:bg-blue-600 w-8 h-20 rounded-t-md"></div>
                    <span className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">9th</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-500 dark:bg-blue-600 w-8 h-24 rounded-t-md"></div>
                    <span className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">10th</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-neutral-300 dark:bg-neutral-600 w-8 h-28 rounded-t-md"></div>
                    <span className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">11th</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-neutral-300 dark:bg-neutral-600 w-8 h-30 rounded-t-md"></div>
                    <span className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">12th</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-right">
              <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View full grade book →
              </a>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Awards Modal */}
      <Dialog open={showAwardsModal} onOpenChange={setShowAwardsModal}>
        <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Student Awards & Achievements</DialogTitle>
            <DialogDescription>
              Recognition for {student.name}'s academic and extracurricular excellence.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-2">
                  <span className="material-icons text-amber-600 dark:text-amber-400">star</span>
                </div>
                <h4 className="font-medium text-neutral-800 dark:text-neutral-200">Academic Excellence</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Spring 2024</p>
              </div>
              
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                  <span className="material-icons text-blue-600 dark:text-blue-400">emoji_events</span>
                </div>
                <h4 className="font-medium text-neutral-800 dark:text-neutral-200">Robotics Competition</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">State Finalist</p>
              </div>
              
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                  <span className="material-icons text-green-600 dark:text-green-400">workspace_premium</span>
                </div>
                <h4 className="font-medium text-neutral-800 dark:text-neutral-200">Science Fair Winner</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">District Level</p>
              </div>
              
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
                  <span className="material-icons text-purple-600 dark:text-purple-400">school</span>
                </div>
                <h4 className="font-medium text-neutral-800 dark:text-neutral-200">Perfect Attendance</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">2023-2024</p>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2 flex items-center">
                <span className="material-icons text-sm mr-1">info</span>
                Recognition Details
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Awards are granted by teachers and program coordinators throughout the academic year. Achievements may qualify for college application enhancements and scholarship opportunities.
              </p>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Portfolio Items Modal */}
      <Dialog open={showPortfolioModal} onOpenChange={setShowPortfolioModal}>
        <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Student Portfolio</DialogTitle>
            <DialogDescription>
              Collection of {student.name}'s academic work and projects.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Document</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Size</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      <div className="flex items-center">
                        <span className="material-icons text-blue-500 mr-2">description</span>
                        <span>Robotics Project Documentation</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">04/15/2024</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">2.4 MB</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Download</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      <div className="flex items-center">
                        <span className="material-icons text-green-500 mr-2">insert_chart</span>
                        <span>Science Fair Presentation</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">03/10/2024</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">5.7 MB</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Download</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      <div className="flex items-center">
                        <span className="material-icons text-red-500 mr-2">picture_as_pdf</span>
                        <span>English Literature Essay</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">02/22/2024</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">756 KB</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Download</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      <div className="flex items-center">
                        <span className="material-icons text-purple-500 mr-2">movie</span>
                        <span>Coding Project Demo</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">01/30/2024</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">18.2 MB</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Download</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg text-sm text-neutral-600 dark:text-neutral-400">
              <p>
                <span className="font-medium">Note:</span> Portfolio items are uploaded by the student through the Portfolio Management system. Teachers may request specific documents to be added to your portfolio.
              </p>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
