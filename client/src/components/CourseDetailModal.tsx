import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, BookmarkPlus, CalendarClock } from 'lucide-react';
import { PathwayNode } from '@/types';
import { getStatusBadgeClasses, toTitleCase } from '@/lib/utils';

interface CourseDetailModalProps {
  node: PathwayNode;
  onClose: () => void;
}

export default function CourseDetailModal({ node, onClose }: CourseDetailModalProps) {
  // Example class time data - this would normally come from the backend
  const classTimeData = {
    'Intro to Robotics': {
      teacher: 'Mr. Rodriguez',
      schedule: 'Mon/Wed/Fri 10:15 AM - 11:45 AM',
      roomNumber: '203B',
      grade: 'A',
      progress: 100,
      description: 'Introduction to robotics and programming fundamentals. Students learn basic mechanical and electrical principles while building their own robot.',
      semester: 'Fall 2024 (Completed)',
      achievements: [
        { name: 'Design Challenge Winner', description: 'Best autonomous navigation solution' },
        { name: 'Perfect Attendance', description: 'Never missed a class throughout the semester' },
      ],
      skills: ['Basic Programming', 'Electronics', 'Mechanical Design', 'Problem Solving', 'Teamwork'],
      assignments: [
        { name: 'Robot Design Project', grade: 'A', score: '95/100', submitted: 'Oct 15, 2024', feedback: 'Excellent design choices and documentation' },
        { name: 'Programming Basics Quiz', grade: 'A-', score: '89/100', submitted: 'Sep 23, 2024', feedback: 'Good understanding of core concepts' },
        { name: 'Final Presentation', grade: 'A+', score: '98/100', submitted: 'Nov 12, 2024', feedback: 'Outstanding presentation skills and technical knowledge' },
        { name: 'Final Robot Competition', grade: 'A', score: '94/100', submitted: 'Dec 5, 2024', feedback: 'Robot performed exceptionally well in all challenges' }
      ]
    },
    'Engineering Principles': {
      teacher: 'Ms. Johnson',
      schedule: 'Tue/Thu 1:30 PM - 3:15 PM',
      roomNumber: '115A',
      grade: 'B+',
      progress: 75,
      description: 'Introduction to core engineering concepts including mechanics, materials, and design principles.',
      semester: 'Spring 2024 (In Progress)',
      achievements: [
        { name: 'Group Project Recognition', description: 'Outstanding teamwork on the bridge design project' }
      ],
      skills: ['Material Science', 'Engineering Design', 'Technical Drawing', 'Problem Analysis', 'Physics'],
      assignments: [
        { name: 'Material Strength Analysis', grade: 'B+', score: '88/100', submitted: 'Feb 15, 2024', feedback: 'Good analysis but could improve on calculations' },
        { name: 'Engineering Ethics Essay', grade: 'A-', score: '92/100', submitted: 'Mar 10, 2024', feedback: 'Excellent ethical reasoning and real-world examples' },
        { name: 'Midterm Exam', grade: 'B', score: '85/100', submitted: 'Mar 24, 2024', feedback: 'Good understanding of core concepts, but missed some key details' }
      ]
    }
  };
  
  // Define the types for our course data structure to avoid TypeScript errors
  interface Assignment {
    name: string;
    grade: string;
    score: string;
    submitted?: string;
    feedback?: string;
  }
  
  interface Achievement {
    name: string;
    description: string;
  }
  
  interface CourseData {
    teacher: string;
    schedule: string;
    roomNumber: string;
    grade: string;
    progress: number;
    description?: string;
    semester?: string;
    achievements?: Achievement[];
    skills?: string[];
    assignments: Assignment[];
  }
  
  // Add console log to debug the node title
  console.log("Course modal node:", node);
  
  // Simplify course data lookup with an exact match
  let courseData: CourseData | undefined = undefined;
  
  // Reset any course data based on pathway type and status
  // We'll control what shows in the UI by providing or not providing courseData
  console.log("Looking for course data for:", node.title, "with status:", node.status, "type:", node.pathwayType);
  
  // SCHOOL COURSES - Handle each pathway type and status differently
  if (node.pathwayType === 'course') {
    // Only use course data for completed courses that match our defined data
    if (node.status === "completed" && node.title === "Introduction to Robotics") {
      console.log("Found completed Intro to Robotics course");
      courseData = classTimeData["Intro to Robotics"];
    } 
    // For in-progress courses, use Engineering Principles data which has the right structure
    else if (node.status === "in-progress" && node.title.includes("Engineering Principles")) {
      console.log("Found in-progress Engineering Principles course");
      courseData = classTimeData["Engineering Principles"];
    }
    // For all other course types (available, eligible, etc.), don't show course data
    else {
      console.log("Course is available/not started - showing default message");
      courseData = undefined;
    }
  }
  
  // CERTIFICATIONS - Don't use any course data, instead rely on custom UI in the modal
  else if (node.pathwayType === 'certification') {
    console.log("Certification found - showing custom certification UI");
    courseData = undefined;
  }
  
  // COLLEGE MAJORS - Don't use any course data, rely on custom UI in the modal
  else if (node.pathwayType === 'major') {
    console.log("Major found - showing custom major UI");
    courseData = undefined;
  }
  
  // CAREERS - For any other pathway type (mainly careers), don't show course data
  else {
    console.log("Career or other type - showing default info");
    courseData = undefined;
  }
  
  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="bg-white dark:bg-neutral-900 max-w-2xl w-full animate-in fade-in duration-300" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-medium text-neutral-800 dark:text-neutral-200">{node.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Badge 
                  variant="outline"
                  className={`${getStatusBadgeClasses(node.status).bg} ${getStatusBadgeClasses(node.status).text}`}
                >
                  {toTitleCase(node.status)}
                </Badge>
                {courseData && (
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-2">
                    Current Grade: {courseData.grade}
                  </span>
                )}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">
              <X size={20} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Course Description</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{node.description}</p>
            </div>
            
            {courseData && (
              <>
                {/* Course Status Banner for completed courses */}
                {node.status === 'completed' && (
                  <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center">
                    <div className="w-8 h-8 mr-3 flex items-center justify-center bg-green-100 dark:bg-green-800 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-400">Course Completed</h3>
                      <p className="text-xs text-green-700 dark:text-green-500">{courseData.semester}</p>
                    </div>
                    <div className="ml-auto">
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-400">
                        Final Grade: {courseData.grade}
                      </Badge>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Class Details</h4>
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">Teacher</span>
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{courseData.teacher}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">Schedule</span>
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{courseData.schedule}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">Room</span>
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{courseData.roomNumber}</span>
                      </div>
                      {courseData.semester && (
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">Term</span>
                          <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{courseData.semester}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Progress</h4>
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">Course Completion</span>
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{courseData.progress}%</span>
                      </div>
                      <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            courseData.progress === 100 
                              ? 'bg-green-600 dark:bg-green-500' 
                              : 'bg-blue-600 dark:bg-blue-500'
                          }`}
                          style={{ width: `${courseData.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Skills section */}
                    {courseData.skills && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Skills Gained</h4>
                        <div className="flex flex-wrap gap-1">
                          {courseData.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Achievements section */}
                {courseData.achievements && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Achievements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {courseData.achievements.map((achievement, index) => (
                        <div 
                          key={index} 
                          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-amber-600 dark:text-amber-400 text-xl">emoji_events</span>
                            <h5 className="text-sm font-medium text-amber-800 dark:text-amber-400">{achievement.name}</h5>
                          </div>
                          <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">{achievement.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Assignments section */}
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    {node.status === 'completed' ? 'Completed Assignments' : 'Recent Assignments'}
                  </h4>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                    {courseData.assignments.map((assignment, index) => (
                      <div 
                        key={index} 
                        className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{assignment.name}</h5>
                            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                              <span>Score: {assignment.score}</span>
                              {assignment.submitted && <span>Submitted: {assignment.submitted}</span>}
                            </div>
                            {assignment.feedback && (
                              <p className="mt-2 text-xs italic text-neutral-600 dark:text-neutral-400">
                                "{assignment.feedback}"
                              </p>
                            )}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${assignment.grade.startsWith('A') 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : assignment.grade.startsWith('B') 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                              }
                            `}
                          >
                            {assignment.grade}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {!courseData && (
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                {/* Different content based on certification type and status */}
                {node.pathwayType === 'certification' && (
                  <>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 text-center">
                      {node.status === 'eligible' ? 'Certification Eligibility' : 
                       node.status === 'available' ? 'Available Certification' :
                       node.status === 'completed' ? 'Completed Certification' : 
                       'Certification Information'}
                    </h4>
                    
                    {/* Status banner - changes based on certification status */}
                    <div className={`mb-4 
                      ${node.status === 'eligible' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 
                        node.status === 'available' ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' :
                        node.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                        'bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'}
                      rounded-lg p-3`}>
                      <div className="flex items-center">
                        <div className={`w-8 h-8 mr-3 flex items-center justify-center rounded-full
                          ${node.status === 'eligible' ? 'bg-blue-100 dark:bg-blue-800' : 
                           node.status === 'available' ? 'bg-amber-100 dark:bg-amber-800' :
                           node.status === 'completed' ? 'bg-green-100 dark:bg-green-800' :
                           'bg-neutral-100 dark:bg-neutral-700'}`}>
                          {node.status === 'eligible' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                          )}
                          {node.status === 'available' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          )}
                          {node.status === 'completed' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                              <path d="M12 15l-8-8h16l-8 8z"></path>
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className={`text-sm font-medium 
                            ${node.status === 'eligible' ? 'text-blue-800 dark:text-blue-400' : 
                             node.status === 'available' ? 'text-amber-800 dark:text-amber-400' :
                             node.status === 'completed' ? 'text-green-800 dark:text-green-400' :
                             'text-neutral-800 dark:text-neutral-200'}`}>
                            {node.status === 'eligible' ? 'You\'re Eligible!' : 
                             node.status === 'available' ? 'Open for Registration' :
                             node.status === 'completed' ? 'Certification Completed' : 
                             'Certification Status'}
                          </h3>
                          <p className={`text-xs 
                            ${node.status === 'eligible' ? 'text-blue-700 dark:text-blue-500' : 
                             node.status === 'available' ? 'text-amber-700 dark:text-amber-500' :
                             node.status === 'completed' ? 'text-green-700 dark:text-green-500' :
                             'text-neutral-600 dark:text-neutral-400'}`}>
                            {node.status === 'eligible' 
                              ? 'Based on your completed courses, you qualify for this certification program.'
                              : node.status === 'available'
                                ? 'This certification is available for you to register. No prerequisites needed.'
                                : node.status === 'completed'
                                  ? 'You\'ve successfully completed this certification.'
                                  : 'Check with your counselor for enrollment requirements.'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Common certification info section */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Certification Details</h5>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        {node.title.includes("Robotics Programming") 
                          ? "This certification validates your skills in programming robots using industry-standard languages and platforms. You'll learn to create efficient code for robotics applications." 
                          : node.title.includes("Arduino")
                            ? "The Arduino Certification validates your ability to design, build, and program projects using Arduino hardware and software. Great for IoT and electronics enthusiasts."
                            : "This industry-recognized certification demonstrates your proficiency in specialized technical skills that are valued by employers in the field."}
                      </p>
                    </div>
                    
                    {/* What you'll learn section */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">What You'll Learn</h5>
                      <ul className="text-sm text-neutral-600 dark:text-neutral-400 list-disc pl-5 space-y-1 mb-3">
                        {node.title.includes("Robotics Programming") ? (
                          <>
                            <li>Robot programming fundamentals</li>
                            <li>Sensor integration and data processing</li>
                            <li>Autonomous navigation algorithms</li>
                            <li>Real-time control systems</li>
                          </>
                        ) : node.title.includes("Arduino") ? (
                          <>
                            <li>Arduino platform fundamentals</li>
                            <li>Circuit design and assembly</li>
                            <li>Sensors and actuators integration</li>
                            <li>IoT project development</li>
                          </>
                        ) : (
                          <>
                            <li>Technical skills specific to your field</li>
                            <li>Industry best practices</li>
                            <li>Hands-on application development</li>
                            <li>Problem-solving methodology</li>
                          </>
                        )}
                      </ul>
                    </div>
                    
                    {/* Action section based on status */}
                    <div className={`p-3 rounded-lg text-center 
                      ${node.status === 'eligible' ? 'bg-blue-50 dark:bg-blue-900/20' : 
                       node.status === 'available' ? 'bg-amber-50 dark:bg-amber-900/20' :
                       'bg-neutral-50 dark:bg-neutral-800'}`}>
                      {node.status === 'eligible' || node.status === 'available' ? (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 italic mb-2">
                          Speak with your counselor to register for this certification.
                        </p>
                      ) : node.status === 'completed' ? (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
                          Your certification is valid for 3 years. Consider pursuing advanced certifications.
                        </p>
                      ) : (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
                          Complete required prerequisites to become eligible.
                        </p>
                      )}
                    </div>
                  </>
                )}
                
                {node.pathwayType === 'major' && (
                  <>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 text-center">College Major Information</h4>
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <h5 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-1">Program Overview</h5>
                        <p className="text-sm text-blue-700 dark:text-blue-500">
                          {node.title} prepares students for careers in {node.title.includes("Mechanical") ? 
                            "mechanical systems design, manufacturing, and product development" : 
                            "electrical systems, electronics, and computer hardware design"}. 
                          This 4-year degree program combines theory and hands-on application.
                        </p>
                      </div>
                      
                      {node.additionalInfo?.schools && (
                        <div>
                          <h5 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Top Texas Programs</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {node.additionalInfo.schools.map((school, index) => (
                              <div key={index} className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3">
                                <h6 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{school}</h6>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                  {index === 0 ? 
                                    "Ranked #1 in Texas for this program" : 
                                    "Strong industry connections and internship opportunities"}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h5 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Career Outcomes</h5>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <span className="material-icons text-green-500 dark:text-green-400 text-sm mr-1">paid</span>
                            <span className="text-neutral-700 dark:text-neutral-300">
                              {node.title.includes("Mechanical") ? 
                                "Average Starting Salary: $72,000" :
                                "Average Starting Salary: $78,000"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="material-icons text-amber-500 dark:text-amber-400 text-sm mr-1">trending_up</span>
                            <span className="text-neutral-700 dark:text-neutral-300">
                              {node.title.includes("Mechanical") ? 
                                "Job Growth: 4% (TX)" :
                                "Job Growth: 7% (TX)"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Key Courses in Program</h5>
                        <ul className="text-sm text-neutral-600 dark:text-neutral-400 list-disc pl-5 space-y-1">
                          {node.title.includes("Mechanical") ? (
                            <>
                              <li>Thermodynamics</li>
                              <li>Mechanical Design</li>
                              <li>Manufacturing Processes</li>
                              <li>Fluid Mechanics</li>
                            </>
                          ) : (
                            <>
                              <li>Circuit Analysis</li>
                              <li>Digital Logic Design</li>
                              <li>Electromagnetics</li>
                              <li>Control Systems</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Default content for other types */}
                {(node.pathwayType !== 'certification' && node.pathwayType !== 'major') && (
                  <>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 text-center">Course Information</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                      {node.status === 'available' || node.status === 'eligible' 
                        ? 'You can enroll in this course in the upcoming semester.'
                        : 'Detailed course information not available.'}
                    </p>
                  </>
                )}
              </div>
            )}
            
            {node.additionalInfo?.schools && (
              <div>
                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Available at Schools</h4>
                <div className="flex flex-wrap gap-1">
                  {node.additionalInfo.schools.map((school, index) => (
                    <Badge key={index} variant="outline" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {school}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-4 flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
            <BookmarkPlus size={16} className="mr-1" />
            Add to Watch List
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={onClose}>
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return createPortal(modalContent, document.body);
}