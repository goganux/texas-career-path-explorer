import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationTabs from "@/components/NavigationTabs";
import StudentProfileHeader from "@/components/StudentProfileHeader";
import { useQuery } from "@tanstack/react-query";
import { Student } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface PathfulProps {
  onLogout?: () => void;
}

export default function Pathful({ onLogout }: PathfulProps) {
  const tabs = [
    { name: "Career Path Explorer", path: "/career-explorer", icon: "explore" },
    { name: "Pathful", path: "/pathful", icon: "route" },
  ];
  
  const { data: student, isLoading: studentLoading } = useQuery<Student>({
    queryKey: ['/api/student/1'], // Default to student ID 1
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200">
      <Header 
        studentName={student?.name}
        studentImage={student?.imageUrl}
        onLogout={onLogout}
      />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Student Profile Section */}
          {studentLoading ? (
            <div className="mb-6">
              <Skeleton className="h-[200px] w-full rounded-xl" />
            </div>
          ) : student ? (
            <div className="mb-6">
              <StudentProfileHeader student={student} />
            </div>
          ) : null}
          
          <div className="mb-4">
            <NavigationTabs tabs={tabs} />
          </div>
          
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                P
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Pathful Platform Integration</h2>
            <p className="mb-6 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Pathful is an education career planning platform that helps students discover, explore, and plan their educational and career journeys with confidence. Connect your student account to access additional resources and planning tools.
            </p>
            
            <div className="max-w-md mx-auto bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 mb-6">
              <h3 className="text-lg font-semibold mb-3">Single Sign-On</h3>
              <p className="text-sm mb-4 text-neutral-500 dark:text-neutral-400">
                Use your school credentials to access the Pathful platform without creating a new account.
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                size="lg"
              >
                <span className="material-icons mr-2">login</span>
                Connect to Pathful
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <span className="material-icons text-3xl text-blue-500 mb-2">travel_explore</span>
                <h3 className="font-medium mb-1">Career Discovery</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Explore thousands of career options based on your interests and strengths.
                </p>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <span className="material-icons text-3xl text-indigo-500 mb-2">account_balance</span>
                <h3 className="font-medium mb-1">College Research</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Compare schools, programs, and admission requirements.
                </p>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <span className="material-icons text-3xl text-purple-500 mb-2">auto_graph</span>
                <h3 className="font-medium mb-1">Skills Assessment</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Identify strengths and areas for growth to guide your path.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}