import { 
  users, type User, type InsertUser, 
  students, type Student, type InsertStudent,
  careerInterests, type CareerInterest, type InsertCareerInterest,
  careerPathways, type CareerPathway, type InsertCareerPathway,
  studentProgress, type StudentProgress, type InsertStudentProgress,
  similarPathways, type SimilarPathway, type InsertSimilarPathway
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations (preserved from original storage)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Student operations
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByUserId(userId: number): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  
  // Career Interest operations
  getAllCareerInterests(): Promise<CareerInterest[]>;
  getCareerInterest(id: number): Promise<CareerInterest | undefined>;
  createCareerInterest(interest: InsertCareerInterest): Promise<CareerInterest>;
  
  // Career Pathway operations
  getPathwaysByInterest(interestId: number): Promise<{
    courses: CareerPathway[];
    certifications: CareerPathway[];
    majors: CareerPathway[];
    careers: CareerPathway[];
  }>;
  getCareerPathway(id: number): Promise<CareerPathway | undefined>;
  createCareerPathway(pathway: InsertCareerPathway): Promise<CareerPathway>;
  
  // Student Progress operations
  getStudentProgress(studentId: number, interestId: number): Promise<StudentProgress | undefined>;
  createOrUpdateStudentProgress(progress: InsertStudentProgress): Promise<StudentProgress>;
  
  // Job Market Trends operations
  getJobMarketTrends(interestId: number): Promise<any>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private students: Map<number, Student>;
  private careerInterests: Map<number, CareerInterest>;
  private careerPathways: Map<number, CareerPathway>;
  private studentProgress: Map<string, StudentProgress>;
  
  currentUserId: number;
  currentStudentId: number;
  currentInterestId: number;
  currentPathwayId: number;
  currentProgressId: number;

  constructor() {
    this.users = new Map();
    this.students = new Map();
    this.careerInterests = new Map();
    this.careerPathways = new Map();
    this.studentProgress = new Map();
    
    this.currentUserId = 1;
    this.currentStudentId = 1;
    this.currentInterestId = 1;
    this.currentPathwayId = 1;
    this.currentProgressId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // User operations (preserved from original storage)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Student operations
  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }
  
  async getStudentByUserId(userId: number): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(
      (student) => student.userId === userId,
    );
  }
  
  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = this.currentStudentId++;
    const student: Student = { ...insertStudent, id };
    this.students.set(id, student);
    return student;
  }
  
  // Career Interest operations
  async getAllCareerInterests(): Promise<CareerInterest[]> {
    return Array.from(this.careerInterests.values());
  }
  
  async getCareerInterest(id: number): Promise<CareerInterest | undefined> {
    return this.careerInterests.get(id);
  }
  
  async createCareerInterest(interest: InsertCareerInterest): Promise<CareerInterest> {
    const id = this.currentInterestId++;
    const careerInterest: CareerInterest = { ...interest, id };
    this.careerInterests.set(id, careerInterest);
    return careerInterest;
  }
  
  // Career Pathway operations
  async getPathwaysByInterest(interestId: number): Promise<{
    courses: CareerPathway[];
    certifications: CareerPathway[];
    majors: CareerPathway[];
    careers: CareerPathway[];
  }> {
    const pathways = Array.from(this.careerPathways.values()).filter(
      (pathway) => pathway.interestId === interestId
    );
    
    return {
      courses: pathways.filter(p => p.pathwayType === 'course'),
      certifications: pathways.filter(p => p.pathwayType === 'certification'),
      majors: pathways.filter(p => p.pathwayType === 'major'),
      careers: pathways.filter(p => p.pathwayType === 'career'),
    };
  }
  
  async getCareerPathway(id: number): Promise<CareerPathway | undefined> {
    return this.careerPathways.get(id);
  }
  
  async createCareerPathway(pathway: InsertCareerPathway): Promise<CareerPathway> {
    const id = this.currentPathwayId++;
    const careerPathway: CareerPathway = { ...pathway, id };
    this.careerPathways.set(id, careerPathway);
    return careerPathway;
  }
  
  // Student Progress operations
  async getStudentProgress(studentId: number, interestId: number): Promise<StudentProgress | undefined> {
    const key = `${studentId}-${interestId}`;
    return this.studentProgress.get(key);
  }
  
  async createOrUpdateStudentProgress(progress: InsertStudentProgress): Promise<StudentProgress> {
    const key = `${progress.studentId}-${progress.interestId}`;
    const existingProgress = this.studentProgress.get(key);
    
    if (existingProgress) {
      const updatedProgress: StudentProgress = { 
        ...existingProgress, 
        percentage: progress.percentage,
        completedSteps: progress.completedSteps
      };
      this.studentProgress.set(key, updatedProgress);
      return updatedProgress;
    } else {
      const id = this.currentProgressId++;
      const newProgress: StudentProgress = { ...progress, id };
      this.studentProgress.set(key, newProgress);
      return newProgress;
    }
  }
  
  // Job Market Trends operations
  async getJobMarketTrends(interestId: number): Promise<any> {
    const interestMap: { [key: number]: string } = {
      1: 'robotics engineer',
      2: 'chef cook culinary restaurant',
      3: 'business analyst manager',
      4: 'nurse healthcare medical',
      5: 'graphic designer artist creative'
    };
    
    const searchQuery = interestMap[interestId] || 'technology';
    
    try {
      // Fetch real job data from Indeed API
      const apiUrl = `https://indeed12.p.rapidapi.com/jobs/search?query=${encodeURIComponent(searchQuery)}&location=Texas&page_id=1`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '883f592189msh05ac8a2c7748f73p1a3c67jsn798d24f642bb',
          'X-RapidAPI-Host': 'indeed12.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`Indeed API error: ${response.status}`);
      }

      const apiData = await response.json();
      console.log('Indeed API Response:', JSON.stringify(apiData, null, 2));
      const jobs = apiData.hits || [];
      console.log('Jobs found:', jobs.length);

      // Transform Indeed data to our format
      const jobPostings = jobs.slice(0, 10).map((job: any, index: number) => ({
        id: index + 1,
        jobTitle: job.title,
        company: job.company_name,
        location: job.location,
        salaryRange: job.salary && job.salary.min && job.salary.max
          ? `$${(job.salary.min / 1000).toFixed(0)}K - $${(job.salary.max / 1000).toFixed(0)}K`
          : 'Salary not disclosed',
        postedDate: job.formatted_relative_time || 'Recently',
        skills: ["Communication", "Problem Solving", "Teamwork"],
        trend: "up",
        growth: Math.floor(Math.random() * 20) + 5
      }));

      // Generate realistic supporting data based on actual job count
      const jobCount = jobs.length;
      
      return {
        jobPostings,
        salaryTrends: Array.from({ length: 6 }, (_, i) => ({
          month: new Date(2024, i + 6).toLocaleString('default', { month: 'short' }),
          averageSalary: 65000 + (i * 2500) + (interestId * 1500),
          jobCount: Math.max(50, jobCount - 20 + (i * 15))
        })),
        skillsDemand: this.generateSkillsDemand(searchQuery),
        locationData: [
          { location: "Austin, TX", jobCount: Math.floor(jobCount * 0.4), averageSalary: 75000 + (interestId * 2000) },
          { location: "Houston, TX", jobCount: Math.floor(jobCount * 0.3), averageSalary: 68000 + (interestId * 1800) },
          { location: "Dallas, TX", jobCount: Math.floor(jobCount * 0.25), averageSalary: 72000 + (interestId * 1900) },
          { location: "San Antonio, TX", jobCount: Math.floor(jobCount * 0.05), averageSalary: 62000 + (interestId * 1500) }
        ],
        industryGrowth: [
          { industry: "Technology", growth: 15 + (interestId === 1 ? 10 : 0), color: "#3b82f6" },
          { industry: "Healthcare", growth: 12 + (interestId === 4 ? 8 : 0), color: "#10b981" },
          { industry: "Finance", growth: 8 + (interestId === 3 ? 6 : 0), color: "#f59e0b" },
          { industry: "Hospitality", growth: 6 + (interestId === 2 ? 7 : 0), color: "#8b5cf6" }
        ]
      };
    } catch (error) {
      console.error('Error fetching from JSearch API:', error);
      
      // Fallback to demo data if API fails
      return {
        jobPostings: [
          {
            id: 1,
            jobTitle: `${searchQuery} Position`,
            company: "Texas Company",
            location: "Austin, TX",
            salaryRange: "$65K - $85K",
            postedDate: "2 days ago",
            skills: ["Communication", "Problem Solving", "Teamwork"],
            trend: "up",
            growth: 15
          }
        ],
        salaryTrends: Array.from({ length: 6 }, (_, i) => ({
          month: new Date(2024, i + 6).toLocaleString('default', { month: 'short' }),
          averageSalary: 65000 + (i * 2000),
          jobCount: 100 + (i * 20)
        })),
        skillsDemand: [
          { skill: "Communication", demand: 950, growth: 18 },
          { skill: "Problem Solving", demand: 850, growth: 22 },
          { skill: "Leadership", demand: 650, growth: 15 }
        ],
        locationData: [
          { location: "Austin, TX", jobCount: 300, averageSalary: 70000 },
          { location: "Houston, TX", jobCount: 250, averageSalary: 65000 },
          { location: "Dallas, TX", jobCount: 280, averageSalary: 68000 },
          { location: "San Antonio, TX", jobCount: 150, averageSalary: 60000 }
        ],
        industryGrowth: [
          { industry: "Technology", growth: 15, color: "#3b82f6" },
          { industry: "Healthcare", growth: 12, color: "#10b981" },
          { industry: "Finance", growth: 8, color: "#f59e0b" },
          { industry: "Education", growth: 6, color: "#8b5cf6" }
        ]
      };
    }
  }
  
  private formatJobDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    return `${Math.floor(diffDays / 7)} weeks ago`;
  }
  
  private generateSkillsDemand(searchQuery: string): Array<{ skill: string; demand: number; growth: number; }> {
    const skillSets = {
      'robotics': [
        { skill: "Python Programming", demand: 1450, growth: 28 },
        { skill: "ROS (Robot Operating System)", demand: 890, growth: 35 },
        { skill: "Computer Vision", demand: 1120, growth: 22 },
        { skill: "Machine Learning", demand: 1340, growth: 31 },
        { skill: "PLC Programming", demand: 780, growth: 15 }
      ],
      'chef': [
        { skill: "Menu Development", demand: 650, growth: 15 },
        { skill: "Food Safety Certification", demand: 890, growth: 18 },
        { skill: "Team Leadership", demand: 720, growth: 12 },
        { skill: "Culinary Arts", demand: 1200, growth: 10 },
        { skill: "Restaurant Management", demand: 580, growth: 14 }
      ],
      'business': [
        { skill: "Data Analysis", demand: 1850, growth: 24 },
        { skill: "Project Management", demand: 1650, growth: 19 },
        { skill: "Business Strategy", demand: 1200, growth: 16 },
        { skill: "SQL", demand: 1450, growth: 22 },
        { skill: "Leadership", demand: 1320, growth: 18 }
      ]
    };
    
    const key = Object.keys(skillSets).find(k => searchQuery.includes(k));
    return skillSets[key as keyof typeof skillSets] || [
      { skill: "Communication", demand: 950, growth: 18 },
      { skill: "Problem Solving", demand: 850, growth: 22 },
      { skill: "Leadership", demand: 650, growth: 15 },
      { skill: "Teamwork", demand: 800, growth: 12 },
      { skill: "Technical Skills", demand: 750, growth: 20 }
    ];
  }
  
  // Initialize mock data
  private initializeData() {
    // Create a test user
    const user: User = {
      id: 1,
      username: "roberto",
      password: "password123",
    };
    this.users.set(user.id, user);
    this.currentUserId++;
    
    // Create a student
    const student: Student = {
      id: 1,
      name: "Roberto Garcia",
      grade: 10,
      school: "Austin High School",
      studentId: "2023589",
      gpa: "3.8",
      userId: 1,
      imageUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=96&h=96"
    };
    this.students.set(student.id, student);
    this.currentStudentId++;
    
    // Create career interests
    const interests: InsertCareerInterest[] = [
      { name: "Robotics & Engineering", icon: "computer" },
      { name: "Culinary Arts", icon: "restaurant" },
      { name: "Business & Entrepreneurship", icon: "business" },
      { name: "Healthcare Sciences", icon: "medical_services" },
      { name: "Creative Arts & Design", icon: "palette" }
    ];
    
    interests.forEach(interest => {
      const id = this.currentInterestId++;
      const careerInterest: CareerInterest = { ...interest, id };
      this.careerInterests.set(id, careerInterest);
    });
    
    // Create robotics pathways (Interest ID: 1)
    const roboticsId = 1;
    
    // Courses
    const roboticsCourses: InsertCareerPathway[] = [
      {
        interestId: roboticsId,
        pathwayType: "course",
        title: "Introduction to Robotics",
        description: "Learn the basics of robotics and programming.",
        status: "completed",
        additionalInfo: null
      },
      {
        interestId: roboticsId,
        pathwayType: "course",
        title: "Engineering Principles",
        description: "Core concepts of mechanical and electrical engineering.",
        status: "in-progress",
        additionalInfo: null
      },
      {
        interestId: roboticsId,
        pathwayType: "course",
        title: "Advanced Robotics",
        description: "Build and program advanced robotic systems.",
        status: "available",
        additionalInfo: null
      },
      {
        interestId: roboticsId,
        pathwayType: "course",
        title: "AI for Robotics",
        description: "Implement AI algorithms for autonomous systems.",
        status: "available",
        additionalInfo: null
      }
    ];
    
    // Certifications
    const roboticsCertifications: InsertCareerPathway[] = [
      {
        interestId: roboticsId,
        pathwayType: "certification",
        title: "Robotics Programming Level 1",
        description: "Entry-level robotics programming certification.",
        status: "eligible",
        additionalInfo: null
      },
      {
        interestId: roboticsId,
        pathwayType: "certification",
        title: "Arduino Certification",
        description: "Proficiency in Arduino platform development.",
        status: "available",
        additionalInfo: null
      },
      {
        interestId: roboticsId,
        pathwayType: "certification",
        title: "Robotics Technology Associate",
        description: "Industry-recognized robotics technician credential.",
        status: "available",
        additionalInfo: null
      }
    ];
    
    // Majors
    const roboticsMajors: InsertCareerPathway[] = [
      {
        interestId: roboticsId,
        pathwayType: "major",
        title: "Mechanical Engineering",
        description: "Design and analyze mechanical systems.",
        status: "recommended",
        additionalInfo: {
          schools: ["UT Austin", "Texas A&M"]
        }
      },
      {
        interestId: roboticsId,
        pathwayType: "major",
        title: "Electrical Engineering",
        description: "Focus on electrical systems and components.",
        status: "recommended",
        additionalInfo: {
          schools: ["UT Dallas", "Texas Tech"]
        }
      },
      {
        interestId: roboticsId,
        pathwayType: "major",
        title: "Computer Science",
        description: "Algorithms, programming and software development.",
        status: "option",
        additionalInfo: null
      }
    ];
    
    // Careers
    const roboticsCareers: InsertCareerPathway[] = [
      {
        interestId: roboticsId,
        pathwayType: "career",
        title: "Robotics Engineer",
        description: "Design and develop robotic systems and automation.",
        status: "recommended",
        additionalInfo: {
          salary: "$85,000 - $110,000",
          growthRate: "Growing 15% (TX)",
          companies: [
            { name: "Texas Instruments", location: "Dallas, TX", description: "Developing next-gen automation systems for manufacturing." },
            { name: "NASA Johnson Space Center", location: "Houston, TX", description: "Creating robotic systems for space exploration." },
            { name: "Austin Robotics Institute", location: "Austin, TX", description: "Research and development of AI-driven robots." }
          ],
          skills: ["Programming", "Mechanical Design", "Electrical Systems", "CAD", "Problem-Solving"],
          requiredSteps: [
            { id: 1, name: "Intro to Robotics", status: "completed" },
            { id: 2, name: "Engineering Principles", status: "in-progress" },
            { id: 3, name: "Robotics Programming Certificate", status: "required" },
            { id: 4, name: "Mechanical Engineering", status: "recommended" }
          ]
        }
      },
      {
        interestId: roboticsId,
        pathwayType: "career",
        title: "Automation Specialist",
        description: "Develop and implement automated systems for industries.",
        status: "option",
        additionalInfo: {
          salary: "$70,000 - $95,000",
          growthRate: "Growing 12% (TX)",
          skills: ["PLC Programming", "SCADA Systems", "Industrial Controls", "Troubleshooting"],
          requiredSteps: [
            { id: 1, name: "Intro to Robotics", status: "completed" },
            { id: 5, name: "Automation Technician Certification", status: "required" },
            { id: 6, name: "Industrial Engineering", status: "recommended" }
          ]
        }
      },
      {
        interestId: roboticsId,
        pathwayType: "career",
        title: "AI Robotics Researcher",
        description: "Research and develop AI systems for robotics applications.",
        status: "option",
        additionalInfo: {
          salary: "$95,000 - $130,000",
          growthRate: "Growing 22% (TX)",
          skills: ["Machine Learning", "Computer Vision", "Python", "TensorFlow", "Research Methods"],
          requiredSteps: [
            { id: 2, name: "Engineering Principles", status: "in-progress" },
            { id: 8, name: "Artificial Intelligence Certificate", status: "required" },
            { id: 9, name: "Computer Science", status: "recommended" }
          ]
        }
      },
      {
        interestId: roboticsId,
        pathwayType: "career",
        title: "Robotics Technician",
        description: "Maintain, repair and operate robotic equipment.",
        status: "option",
        additionalInfo: {
          salary: "$50,000 - $70,000",
          growthRate: "Growing 10% (TX)"
        }
      }
    ];
    
    // Create culinary arts pathways (Interest ID: 2)
    const culinaryId = 2;
    
    // Courses
    const culinaryCourses: InsertCareerPathway[] = [
      {
        interestId: culinaryId,
        pathwayType: "course",
        title: "Culinary Foundations",
        description: "Introduction to cooking techniques, knife skills, and kitchen safety.",
        status: "available",
        additionalInfo: null
      },
      {
        interestId: culinaryId,
        pathwayType: "course",
        title: "Baking and Pastry Arts",
        description: "Basics of baking, pastry preparation, and dessert creation.",
        status: "available",
        additionalInfo: null
      },
      {
        interestId: culinaryId,
        pathwayType: "course",
        title: "Texas Regional Cuisine",
        description: "Exploration of Texas culinary traditions and regional specialties.",
        status: "available",
        additionalInfo: null
      },
      {
        interestId: culinaryId,
        pathwayType: "course",
        title: "Restaurant Management",
        description: "Introduction to kitchen operations and restaurant management.",
        status: "available",
        additionalInfo: null
      }
    ];
    
    // Certifications
    const culinaryCertifications: InsertCareerPathway[] = [
      {
        interestId: culinaryId,
        pathwayType: "certification",
        title: "ServSafe Food Handler",
        description: "Essential food safety certification for culinary professionals.",
        status: "available",
        additionalInfo: null
      },
      {
        interestId: culinaryId,
        pathwayType: "certification",
        title: "Certified Culinarian",
        description: "Entry-level professional culinary certification.",
        status: "available",
        additionalInfo: null
      },
      {
        interestId: culinaryId,
        pathwayType: "certification",
        title: "Certified Pastry Culinarian",
        description: "Professional certification for baking and pastry arts.",
        status: "available",
        additionalInfo: null
      }
    ];
    
    // Majors
    const culinaryMajors: InsertCareerPathway[] = [
      {
        interestId: culinaryId,
        pathwayType: "major",
        title: "Culinary Arts",
        description: "Professional cooking techniques and culinary skills development.",
        status: "recommended",
        additionalInfo: {
          schools: ["Culinary Institute of Texas", "Austin Culinary Arts School"]
        }
      },
      {
        interestId: culinaryId,
        pathwayType: "major",
        title: "Food Science & Nutrition",
        description: "Study of food composition, nutrition, and food technology.",
        status: "option",
        additionalInfo: {
          schools: ["Texas A&M", "UT Austin"]
        }
      },
      {
        interestId: culinaryId,
        pathwayType: "major",
        title: "Hospitality Management",
        description: "Business management focused on hospitality and food service industries.",
        status: "option",
        additionalInfo: {
          schools: ["University of Houston", "Texas Tech"]
        }
      }
    ];
    
    // Careers
    const culinaryCareers: InsertCareerPathway[] = [
      {
        interestId: culinaryId,
        pathwayType: "career",
        title: "Executive Chef",
        description: "Lead kitchen operations, create menus, and manage culinary staff.",
        status: "recommended",
        additionalInfo: {
          salary: "$60,000 - $95,000",
          growthRate: "Growing 8% (TX)",
          companies: [
            { name: "Uchi Restaurant Group", location: "Austin, TX", description: "Award-winning restaurant group specializing in Japanese cuisine." },
            { name: "Landry's Inc.", location: "Houston, TX", description: "Hospitality group with numerous restaurant concepts across Texas." },
            { name: "H-E-B", location: "Multiple Locations, TX", description: "Texas-based grocery chain with culinary and prepared food operations." }
          ],
          skills: ["Cooking Techniques", "Menu Planning", "Team Management", "Food Safety", "Creativity"],
          requiredSteps: [
            { id: 5, name: "Culinary Basics (Grade 9)", status: "completed" },
            { id: 6, name: "Food Safety & Sanitation", status: "completed" },
            { id: 7, name: "Advanced Culinary Techniques", status: "in-progress" },
            { id: 17, name: "ServSafe Food Handler", status: "required" }
          ]
        }
      },
      {
        interestId: culinaryId,
        pathwayType: "career",
        title: "Pastry Chef",
        description: "Specialize in creating desserts, baked goods, and pastries.",
        status: "option",
        additionalInfo: {
          salary: "$45,000 - $65,000",
          growthRate: "Growing 7% (TX)",
          requiredSteps: [
            { id: 5, name: "Culinary Basics (Grade 9)", status: "completed" },
            { id: 6, name: "Food Safety & Sanitation", status: "completed" },
            { id: 19, name: "Certified Pastry Culinarian", status: "required" }
          ]
        }
      },
      {
        interestId: culinaryId,
        pathwayType: "career",
        title: "Food Service Manager",
        description: "Oversee daily operations of restaurants or food service establishments.",
        status: "option",
        additionalInfo: {
          salary: "$50,000 - $75,000",
          growthRate: "Growing 9% (TX)",
          requiredSteps: [
            { id: 5, name: "Culinary Basics (Grade 9)", status: "completed" },
            { id: 6, name: "Food Safety & Sanitation", status: "completed" },
            { id: 8, name: "Restaurant Management", status: "upcoming" },
            { id: 17, name: "ServSafe Food Handler", status: "required" }
          ]
        }
      },
      {
        interestId: culinaryId,
        pathwayType: "career",
        title: "Food Stylist/Photographer",
        description: "Prepare and style food for photography, media, and marketing.",
        status: "option",
        additionalInfo: {
          salary: "$40,000 - $70,000",
          growthRate: "Growing 15% (TX)"
        }
      }
    ];
    
    // Create business pathways (Interest ID: 3)
    const businessId = 3;
    
    // Courses
    const businessCourses: InsertCareerPathway[] = [
      {
        interestId: businessId,
        pathwayType: "course",
        title: "Introduction to Business",
        description: "Foundational concepts in business management and operations.",
        status: "available",
        additionalInfo: null
      },
      {
        interestId: businessId,
        pathwayType: "course",
        title: "Entrepreneurship Basics",
        description: "Introduction to starting and operating a small business.",
        status: "available",
        additionalInfo: null
      },
      {
        interestId: businessId,
        pathwayType: "course",
        title: "Marketing Principles",
        description: "Fundamentals of marketing strategy and consumer behavior.",
        status: "available",
        additionalInfo: null
      },
      {
        interestId: businessId,
        pathwayType: "course",
        title: "Financial Literacy",
        description: "Understanding financial statements, budgeting, and investing.",
        status: "available",
        additionalInfo: null
      }
    ];
    
    // Certifications
    const businessCertifications: InsertCareerPathway[] = [
      {
        interestId: businessId,
        pathwayType: "certification",
        title: "Entrepreneurship & Small Business",
        description: "Certification validating knowledge of entrepreneurship fundamentals.",
        status: "available",
        additionalInfo: null
      },
      {
        interestId: businessId,
        pathwayType: "certification",
        title: "Microsoft Office Specialist",
        description: "Certification in essential business productivity tools.",
        status: "available",
        additionalInfo: null
      },
      {
        interestId: businessId,
        pathwayType: "certification",
        title: "QuickBooks Certified User",
        description: "Proficiency in small business accounting software.",
        status: "available",
        additionalInfo: null
      }
    ];
    
    // Majors
    const businessMajors: InsertCareerPathway[] = [
      {
        interestId: businessId,
        pathwayType: "major",
        title: "Business Administration",
        description: "Broad foundation in business principles and management.",
        status: "recommended",
        additionalInfo: {
          schools: ["UT Austin McCombs School", "Texas A&M Mays Business School"]
        }
      },
      {
        interestId: businessId,
        pathwayType: "major",
        title: "Entrepreneurship",
        description: "Specialized focus on new venture creation and small business management.",
        status: "recommended",
        additionalInfo: {
          schools: ["Baylor University", "University of Houston"]
        }
      },
      {
        interestId: businessId,
        pathwayType: "major",
        title: "Marketing",
        description: "Specialized study of marketing principles and consumer behavior.",
        status: "option",
        additionalInfo: {
          schools: ["SMU Cox School of Business", "UT Dallas"]
        }
      }
    ];
    
    // Careers
    const businessCareers: InsertCareerPathway[] = [
      {
        interestId: businessId,
        pathwayType: "career",
        title: "Entrepreneur/Business Owner",
        description: "Start and operate your own business venture.",
        status: "recommended",
        additionalInfo: {
          salary: "Variable (typically $40,000 - $150,000+)",
          growthRate: "Growing 10% (TX)",
          companies: [
            { name: "Self-employed", location: "Various, TX", description: "Start your own business in various industries." },
            { name: "Texas Startups", location: "Austin, TX", description: "Join the thriving startup ecosystem in tech, food, or retail." },
            { name: "Small Business Development Centers", location: "Multiple Locations, TX", description: "Resources and support for Texas entrepreneurs." }
          ],
          skills: ["Business Planning", "Financial Management", "Marketing", "Leadership", "Problem-Solving"],
          requiredSteps: [
            { id: 9, name: "Intro to Business (Grade 9)", status: "completed" },
            { id: 10, name: "Marketing Fundamentals", status: "in-progress" },
            { id: 11, name: "Financial Literacy", status: "upcoming" },
            { id: 30, name: "Entrepreneurship & Small Business", status: "required" }
          ]
        }
      },
      {
        interestId: businessId,
        pathwayType: "career",
        title: "Marketing Manager",
        description: "Develop and implement marketing strategies and campaigns.",
        status: "option",
        additionalInfo: {
          salary: "$60,000 - $100,000",
          growthRate: "Growing 14% (TX)",
          requiredSteps: [
            { id: 9, name: "Intro to Business (Grade 9)", status: "completed" },
            { id: 10, name: "Marketing Fundamentals", status: "in-progress" },
            { id: 31, name: "Microsoft Office Specialist", status: "required" }
          ]
        }
      },
      {
        interestId: businessId,
        pathwayType: "career",
        title: "Business Consultant",
        description: "Advise businesses on improving operations and profitability.",
        status: "option",
        additionalInfo: {
          salary: "$70,000 - $120,000",
          growthRate: "Growing 12% (TX)",
          requiredSteps: [
            { id: 9, name: "Intro to Business (Grade 9)", status: "completed" },
            { id: 11, name: "Financial Literacy", status: "upcoming" },
            { id: 32, name: "QuickBooks Certified User", status: "required" }
          ]
        }
      },
      {
        interestId: businessId,
        pathwayType: "career",
        title: "Sales Manager",
        description: "Lead sales teams and develop strategies to increase revenue.",
        status: "option",
        additionalInfo: {
          salary: "$65,000 - $110,000",
          growthRate: "Growing 9% (TX)",
          requiredSteps: [
            { id: 9, name: "Intro to Business (Grade 9)", status: "completed" },
            { id: 10, name: "Marketing Fundamentals", status: "in-progress" },
            { id: 31, name: "Microsoft Office Specialist", status: "required" }
          ]
        }
      }
    ];
    
    // Add all pathways
    [
      ...roboticsCourses, ...roboticsCertifications, ...roboticsMajors, ...roboticsCareers,
      ...culinaryCourses, ...culinaryCertifications, ...culinaryMajors, ...culinaryCareers,
      ...businessCourses, ...businessCertifications, ...businessMajors, ...businessCareers
    ].forEach(pathway => {
      const id = this.currentPathwayId++;
      const careerPathway: CareerPathway = { ...pathway, id };
      this.careerPathways.set(id, careerPathway);
    });
    
    // Add student progress data
    const roboticsProgress: InsertStudentProgress = {
      studentId: 1,
      interestId: roboticsId,
      percentage: 60,
      completedSteps: [
        { id: 1, name: "Introduction to Robotics (Grade 9)", status: "completed" },
        { id: 2, name: "Engineering Principles (Grade 10)", status: "completed" },
        { id: 3, name: "Advanced Robotics (Upcoming)", status: "upcoming" },
        { id: 4, name: "Robotics Certification", status: "required" }
      ]
    };
    
    const culinaryProgress: InsertStudentProgress = {
      studentId: 1,
      interestId: culinaryId,
      percentage: 45,
      completedSteps: [
        { id: 5, name: "Culinary Basics (Grade 9)", status: "completed" },
        { id: 6, name: "Food Safety & Sanitation", status: "completed" },
        { id: 7, name: "Advanced Culinary Techniques", status: "in-progress" },
        { id: 8, name: "Restaurant Management", status: "upcoming" }
      ]
    };
    
    const businessProgress: InsertStudentProgress = {
      studentId: 1,
      interestId: businessId,
      percentage: 30,
      completedSteps: [
        { id: 9, name: "Intro to Business (Grade 9)", status: "completed" },
        { id: 10, name: "Marketing Fundamentals", status: "in-progress" },
        { id: 11, name: "Financial Literacy", status: "upcoming" },
        { id: 12, name: "Business Certification", status: "required" }
      ]
    };
    
    // Healthcare interest - ID 4
    const healthcareProgress: InsertStudentProgress = {
      studentId: 1,
      interestId: 4,
      percentage: 15,
      completedSteps: [
        { id: 13, name: "Biology (Grade 9)", status: "completed" },
        { id: 14, name: "Anatomy & Physiology", status: "upcoming" },
        { id: 15, name: "Medical Terminology", status: "required" },
        { id: 16, name: "CPR & First Aid Certification", status: "required" }
      ]
    };
    
    // Art & Design interest - ID 5
    const artProgress: InsertStudentProgress = {
      studentId: 1,
      interestId: 5,
      percentage: 10,
      completedSteps: [
        { id: 17, name: "Introduction to Design", status: "completed" },
        { id: 18, name: "Digital Art Fundamentals", status: "upcoming" },
        { id: 19, name: "Portfolio Development", status: "required" },
        { id: 20, name: "Adobe Creative Suite", status: "required" }
      ]
    };
    
    // Save all progress data
    const roboticsStudentProgress: StudentProgress = { ...roboticsProgress, id: 1 };
    this.studentProgress.set(`${roboticsProgress.studentId}-${roboticsProgress.interestId}`, roboticsStudentProgress);
    
    const culinaryStudentProgress: StudentProgress = { ...culinaryProgress, id: 2 };
    this.studentProgress.set(`${culinaryProgress.studentId}-${culinaryProgress.interestId}`, culinaryStudentProgress);
    
    const businessStudentProgress: StudentProgress = { ...businessProgress, id: 3 };
    this.studentProgress.set(`${businessProgress.studentId}-${businessProgress.interestId}`, businessStudentProgress);
    
    const healthcareStudentProgress: StudentProgress = { ...healthcareProgress, id: 4 };
    this.studentProgress.set(`${healthcareProgress.studentId}-${healthcareProgress.interestId}`, healthcareStudentProgress);
    
    const artStudentProgress: StudentProgress = { ...artProgress, id: 5 };
    this.studentProgress.set(`${artProgress.studentId}-${artProgress.interestId}`, artStudentProgress);
    
    this.currentProgressId = 6;
    
    // Add similar pathways for all interests
    const allSimilarPathways: InsertSimilarPathway[] = [
      // Robotics similar pathways
      {
        interestId: roboticsId,
        title: "Biotechnology",
        description: "Combine biology with technology for innovative solutions in healthcare, agriculture, and more.",
        icon: "biotech",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        tags: ["BioTech", "Science"]
      },
      {
        interestId: roboticsId,
        title: "Manufacturing Technology",
        description: "Learn to design, implement, and maintain advanced manufacturing systems and processes.",
        icon: "precision_manufacturing",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        tags: ["Industrial", "Engineering"]
      },
      {
        interestId: roboticsId,
        title: "Embedded Systems",
        description: "Design computer systems and software for specialized devices and applications.",
        icon: "developer_board",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        tags: ["Hardware", "Software"]
      },
      
      // Culinary Arts similar pathways
      {
        interestId: 2, // Culinary Arts
        title: "Food Science",
        description: "Study the chemistry, biology, and physical properties of food and ingredients.",
        icon: "science",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        tags: ["Science", "Nutrition"]
      },
      {
        interestId: 2, // Culinary Arts
        title: "Event Management",
        description: "Plan and execute culinary events, catering, and food-centric gatherings.",
        icon: "event",
        iconBg: "bg-pink-100",
        iconColor: "text-pink-600",
        tags: ["Events", "Hospitality"]
      },
      {
        interestId: 2, // Culinary Arts
        title: "Food Writing",
        description: "Develop skills in food journalism, recipe writing, and culinary content creation.",
        icon: "edit_note",
        iconBg: "bg-teal-100",
        iconColor: "text-teal-600",
        tags: ["Writing", "Media"]
      },
      
      // Business & Entrepreneurship similar pathways
      {
        interestId: 3, // Business
        title: "Digital Marketing",
        description: "Specialize in online marketing strategies, social media, and digital advertising.",
        icon: "campaign",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        tags: ["Marketing", "Digital"]
      },
      {
        interestId: 3, // Business
        title: "Financial Planning",
        description: "Focus on personal and business financial planning, investing, and wealth management.",
        icon: "savings",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        tags: ["Finance", "Planning"]
      },
      {
        interestId: 3, // Business
        title: "E-commerce",
        description: "Develop and manage online businesses and digital storefronts.",
        icon: "shopping_cart",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        tags: ["Retail", "Technology"]
      },
      
      // Healthcare Sciences similar pathways
      {
        interestId: 4, // Healthcare
        title: "Medical Research",
        description: "Focus on scientific research to advance medical knowledge and treatments.",
        icon: "biotech",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        tags: ["Research", "Science"]
      },
      {
        interestId: 4, // Healthcare
        title: "Health Informatics",
        description: "Combine healthcare and information technology to improve patient care and systems.",
        icon: "monitoring",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        tags: ["Technology", "Data"]
      },
      {
        interestId: 4, // Healthcare
        title: "Public Health",
        description: "Address health issues at the population level through education and policy.",
        icon: "groups",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        tags: ["Community", "Education"]
      },
      
      // Creative Arts similar pathways
      {
        interestId: 5, // Creative Arts
        title: "UX/UI Design",
        description: "Design user interfaces and experiences for digital products and services.",
        icon: "design_services",
        iconBg: "bg-pink-100",
        iconColor: "text-pink-600",
        tags: ["Digital", "Design"]
      },
      {
        interestId: 5, // Creative Arts
        title: "Animation",
        description: "Create moving images through various animation techniques and technologies.",
        icon: "animation",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        tags: ["Motion", "Visual"]
      },
      {
        interestId: 5, // Creative Arts
        title: "Content Creation",
        description: "Produce creative content for social media, streaming, and digital platforms.",
        icon: "videocam",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        tags: ["Media", "Digital"]
      }
    ];
    
    // Similar pathways removed - replaced with job market trends
  }
}

export const storage = new MemStorage();
