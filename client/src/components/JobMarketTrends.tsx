import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, DollarSign, MapPin, Users, Calendar, Briefcase, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface JobMarketTrendsProps {
  interestId: number;
  interestName: string;
}

interface JobTrend {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  salaryRange: string;
  postedDate: string;
  skills: string[];
  trend: 'up' | 'down' | 'stable';
  growth: number;
}

interface MarketData {
  jobPostings: JobTrend[];
  salaryTrends: Array<{ month: string; averageSalary: number; jobCount: number; }>;
  skillsDemand: Array<{ skill: string; demand: number; growth: number; }>;
  locationData: Array<{ location: string; jobCount: number; averageSalary: number; }>;
  industryGrowth: Array<{ industry: string; growth: number; color: string; }>;
}

export default function JobMarketTrends({ interestId, interestName }: JobMarketTrendsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: marketData, isLoading } = useQuery<MarketData>({
    queryKey: [`/api/job-market-trends`, interestId],
    queryFn: () => fetch(`/api/job-market-trends/${interestId}`).then(res => res.json()),
    staleTime: 0, // Always fetch fresh data when interest changes
    refetchOnMount: true
  });

  if (isLoading) {
    return (
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-500">Job Market Trends</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!marketData) {
    return (
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-500">Job Market Trends</h3>
        </div>
        <Card className="border-orange-200 dark:border-orange-800">
          <CardContent className="p-6 text-center">
            <Briefcase className="h-12 w-12 text-orange-500 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">
              Job Market Data Unavailable
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Connect to a job market API to view real-time trends and opportunities in {interestName}.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatSalary = (salary: number) => `$${(salary / 1000).toFixed(0)}K`;
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-500">
          {interestName} Job Market Trends
        </h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="salary">Salary Trends</TabsTrigger>
          <TabsTrigger value="skills">Skills Demand</TabsTrigger>
          <TabsTrigger value="location">Locations</TabsTrigger>
        </TabsList>

        <div className="min-h-[600px]">
          <TabsContent value="overview" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Active Jobs</span>
                </div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                  {marketData.jobPostings.length.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Avg Salary</span>
                </div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                  {formatSalary(marketData.salaryTrends[marketData.salaryTrends.length - 1]?.averageSalary || 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Growth</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-1">+12%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Top Location</span>
                </div>
                <p className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
                  {marketData.locationData[0]?.location || 'Austin, TX'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Job Postings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Job Postings
              </CardTitle>
              <CardDescription>Latest opportunities in {interestName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketData.jobPostings.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-neutral-900 dark:text-white">{job.jobTitle}</h4>
                        {getTrendIcon(job.trend)}
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                        {job.company} • {job.location}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {job.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600 dark:text-green-400">{job.salaryRange}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{job.postedDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </TabsContent>

          <TabsContent value="salary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Salary Trends Over Time</CardTitle>
              <CardDescription>Average salary progression in {interestName}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={marketData.salaryTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatSalary} />
                  <Tooltip formatter={(value) => [formatSalary(value as number), 'Average Salary']} />
                  <Line type="monotone" dataKey="averageSalary" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>In-Demand Skills</CardTitle>
              <CardDescription>Most sought-after skills in {interestName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketData.skillsDemand.map((skill, index) => (
                  <div key={skill.skill} className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-900 dark:text-white">{skill.skill}</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {skill.demand} job postings
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${skill.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {skill.growth > 0 ? '+' : ''}{skill.growth}%
                      </span>
                      {skill.growth > 0 ? 
                        <TrendingUp className="h-4 w-4 text-green-500" /> : 
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      }
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Locations</CardTitle>
              <CardDescription>Best markets for {interestName} careers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketData.locationData.map((location, index) => (
                  <div key={location.location} className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-purple-500" />
                      <h4 className="font-medium text-neutral-900 dark:text-white">{location.location}</h4>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Job Openings:</span>
                        <span className="text-sm font-medium">{location.jobCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Avg Salary:</span>
                        <span className="text-sm font-medium text-green-600">{formatSalary(location.averageSalary)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}