import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useState, useEffect } from "react";

import Profile from "@/pages/profile";
import CareerExplorer from "@/pages/career-explorer";
import Pathful from "@/pages/pathful";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";

function Router({ isAuthenticated, onLogout }: { isAuthenticated: boolean; onLogout: () => void }) {
  if (!isAuthenticated) {
    return null; // Login component will be rendered by App
  }

  return (
    <Switch>
      <Route path="/" component={() => <CareerExplorer onLogout={onLogout} />} />
      <Route path="/career-explorer" component={() => <CareerExplorer onLogout={onLogout} />} />
      <Route path="/profile" component={() => <Profile onLogout={onLogout} />} />
      <Route path="/pathful" component={() => <Pathful onLogout={onLogout} />} />
      {/* Placeholder routes for future implementation */}
      <Route path="/dashboard" component={() => <Redirect to="/career-explorer" />} />
      <Route path="/grades" component={() => <Redirect to="/career-explorer" />} />
      <Route path="/portfolio" component={() => <Redirect to="/career-explorer" />} />
      <Route path="/awards" component={() => <Redirect to="/career-explorer" />} />
      <Route path="/goals" component={() => <Redirect to="/career-explorer" />} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Simple redirect component for the router
function Redirect({ to }: { to: string }) {
  window.location.href = to;
  return null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  // Check for existing authentication on app load
  useEffect(() => {
    const savedAuth = localStorage.getItem('career-explorer-auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      const now = Date.now();
      
      // Check if authentication has expired
      if (authData.expires && now < authData.expires) {
        setIsAuthenticated(true);
        setUserType(authData.userType);
      } else {
        // Remove expired authentication
        localStorage.removeItem('career-explorer-auth');
      }
    }
  }, []);

  const handleLogin = (loginUserType: string, rememberMe: boolean = false) => {
    setIsAuthenticated(true);
    setUserType(loginUserType);
    
    // Save authentication state to localStorage with expiration
    const authData = {
      userType: loginUserType,
      timestamp: Date.now(),
      expires: rememberMe ? Date.now() + (30 * 24 * 60 * 60 * 1000) : Date.now() + (24 * 60 * 60 * 1000) // 30 days if remember me, 1 day otherwise
    };
    
    localStorage.setItem('career-explorer-auth', JSON.stringify(authData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    localStorage.removeItem('career-explorer-auth');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          {!isAuthenticated ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Router isAuthenticated={isAuthenticated} onLogout={handleLogout} />
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
