// Type definitions for the Career Path Explorer application

// User/Student types
export interface Student {
  id: number;
  name: string;
  grade: number;
  school: string;
  studentId: string;
  gpa: number;
  awardsCount: number;
  portfolioCount: number;
  imageUrl?: string;
}

// Career path related types
export interface CareerInterest {
  id: number;
  name: string;
  icon: string;
  isActive?: boolean;
}

export interface ProgressItem {
  id: number;
  name: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'required';
}

export interface Progress {
  interestId: number;
  percentage: number;
  completedSteps: ProgressItem[];
}

export type PathwayNodeStatus = 'completed' | 'in-progress' | 'available' | 'eligible' | 'recommended' | 'option';

export interface PathwayNode {
  id: number;
  title: string;
  description: string;
  status: PathwayNodeStatus;
  isActivePath?: boolean;
  pathwayType: 'course' | 'certification' | 'major' | 'career';
  additionalInfo?: {
    schools?: string[];
    salary?: string;
    growthRate?: string;
    companies?: Array<{ name: string; location: string; description: string }>;
    skills?: string[];
    requiredSteps?: ProgressItem[];
  };
}

export interface Career {
  id: number;
  title: string;
  description: string;
  salary: string;
  growthRate: string;
  txCompanies: Array<{ name: string; location: string; description: string }>;
  skills: string[];
  requiredSteps: ProgressItem[];
}

export interface Pathway {
  interestId: number;
  courses: PathwayNode[];
  certifications: PathwayNode[];
  majors: PathwayNode[];
  careers: PathwayNode[];
}

export interface SimilarPathway {
  id: number;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  tags: string[];
}
