import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, User, Users, GraduationCap, Heart, Moon, Sun, Loader2, Target, BarChart, Map, Users2 } from 'lucide-react';
import { useThemeContext } from '@/providers/ThemeProvider';

interface LoginProps {
  onLogin: (userType: string, rememberMe?: boolean) => void;
}

// Function to get background images for each slide
const getBackgroundImage = (slideId: number) => {
  const images = {
    1: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80', // Students collaborating with laptops
    2: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Student studying with charts/progress
    3: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // University campus/Texas building
    4: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'  // Diverse students planning/personalizing
  };
  return images[slideId as keyof typeof images] || '';
};

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme, toggleTheme } = useThemeContext();

  const slides = [
    {
      id: 1,
      title: "Interactive Career Pathways",
      description: "Visualize the courses, certifications, and majors that lead to your dream career",
      icon: Target,
      bgColor: "from-blue-600 to-indigo-600"
    },
    {
      id: 2,
      title: "Progress Tracking",
      description: "Monitor your academic journey with detailed progress indicators and milestones",
      icon: BarChart,
      bgColor: "from-purple-600 to-pink-600"
    },
    {
      id: 3,
      title: "Texas-Focused Resources",
      description: "Discover opportunities specific to Texas schools, universities, and employers",
      icon: Map,
      bgColor: "from-green-600 to-teal-600"
    },
    {
      id: 4,
      title: "Personalized Experience",
      description: "Get recommendations based on your interests, grades, and career goals",
      icon: Users2,
      bgColor: "from-orange-600 to-red-600"
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check credentials for Roberto Garcia
    if (email === 'rgarcia@email.com' && password === 'rgarciaWWT') {
      onLogin('student', rememberMe);
    } else {
      setIsLoading(false);
      setError('Invalid email or password. Please try again.');
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Theme Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </Button>

      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left side - Carousel Slider */}
        <div className="hidden lg:block relative overflow-hidden">
          <div className="relative h-full">
            {slides.map((slide, index) => {
              const IconComponent = slide.icon;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div 
                    className={`w-full h-full bg-gradient-to-br ${slide.bgColor} flex items-center justify-center p-12 relative`}
                    style={{
                      backgroundImage: `url(${getBackgroundImage(slide.id)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    {/* Color overlay to maintain contrast */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgColor} opacity-85`}></div>
                    <div className="text-center text-white max-w-md relative z-10">
                      <div className="mb-6 flex justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                          <IconComponent className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">
                        {slide.title}
                      </h2>
                      <p className="text-base opacity-90 leading-relaxed">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Slide indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
            
            {/* Branding overlay */}
            <div className="absolute top-8 left-8 text-white">
              <h1 className="text-2xl font-bold opacity-90">
                Texas Career Path Explorer
              </h1>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-neutral-800">
          <div className="w-full max-w-sm">
            {/* Mobile Header (shown only on mobile) */}
            <div className="text-center lg:hidden mb-8">
              <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">
                Texas Career Path Explorer
              </h1>
              <p className="text-neutral-600 dark:text-neutral-300">
                Discover your career pathway
              </p>
            </div>

            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                Welcome back
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Sign in to continue your journey
              </p>
            </div>

            {/* Login Form */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-xl">
              <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="focus:ring-blue-500 focus:border-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <Label 
                      htmlFor="remember-me" 
                      className="text-sm text-neutral-600 dark:text-neutral-300 cursor-pointer"
                    >
                      Remember me for 30 days
                    </Label>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Demo Credentials
                  </h4>
                  <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                    <p><strong>Email:</strong> rgarcia@email.com</p>
                    <p><strong>Password:</strong> rgarciaWWT</p>
                  </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                © 2025 Softchoice WWT EDU - Empowering Texas Students
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}