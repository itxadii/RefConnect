import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { jobsAPI } from '@/integrations/aws/api';
import type { Job } from '@/integrations/aws/dynamodb';

// Job interface is now imported from api.ts

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchJobs = async (filters?: {
    search?: string;
    skills?: string[];
    jobType?: string;
  }) => {
    try {
      const DEMO_MODE = ((import.meta as any)?.env?.VITE_DEMO_MODE !== 'false');
      let allJobs: Job[] = [];
      if (DEMO_MODE) {
        const now = new Date().toISOString();
        allJobs = [
          {
            id: 'job-demo-1',
            title: 'Frontend Developer (React)',
            company: 'RefConnect Labs',
            description: 'Build delightful UIs with React and Tailwind.',
            requirements: ['React', 'TypeScript', 'TailwindCSS'],
            skillsRequired: ['React', 'TypeScript', 'TailwindCSS'],
            location: 'Remote',
            jobType: 'full-time',
            salaryRange: '₹8L–₹16L',
            postedBy: 'system',
            isActive: true,
            createdAt: now,
            updatedAt: now,
          },
          {
            id: 'job-demo-2',
            title: 'Backend Engineer (Node.js)',
            company: 'Acme Corp',
            description: 'Design APIs and services with Node.js and AWS.',
            requirements: ['Node.js', 'AWS', 'REST'],
            skillsRequired: ['Node.js', 'AWS', 'DynamoDB'],
            location: 'Bengaluru, IN',
            jobType: 'full-time',
            salaryRange: '₹12L–₹22L',
            postedBy: 'system',
            isActive: true,
            createdAt: now,
            updatedAt: now,
          },
          {
            id: 'job-demo-3',
            title: 'Data Analyst Intern',
            company: 'DataWorks',
            description: 'Analyze datasets and build dashboards.',
            requirements: ['SQL', 'Excel', 'Visualization'],
            skillsRequired: ['SQL', 'Python'],
            location: 'Pune, IN',
            jobType: 'internship',
            salaryRange: '₹20k–₹30k / month',
            postedBy: 'system',
            isActive: true,
            createdAt: now,
            updatedAt: now,
          },
        ];
      } else {
        allJobs = await jobsAPI.getAll();
      }

      let filteredJobs = allJobs.filter(job => job.isActive);

      // Apply filters
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower)
        );
      }

      if (filters?.jobType) {
        filteredJobs = filteredJobs.filter(job => job.jobType === filters.jobType);
      }

      // Filter by skills if provided
      if (filters?.skills && filters.skills.length > 0) {
        filteredJobs = filteredJobs.filter(job => 
          job.skillsRequired?.some(skill => 
            filters.skills!.some(filterSkill => 
              skill.toLowerCase().includes(filterSkill.toLowerCase())
            )
          )
        );
      }

      // Sort by created date (newest first)
      filteredJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setJobs(filteredJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // As a last-resort fallback, present demo data to keep the UI working
      const now = new Date().toISOString();
      const demo: Job[] = [
        {
          id: 'job-fallback-1',
          title: 'Junior Developer',
          company: 'Fallback Inc.',
          description: 'Entry-level developer role.',
          requirements: ['JavaScript'],
          skillsRequired: ['JavaScript'],
          location: 'Remote',
          jobType: 'full-time',
          salaryRange: '₹5L–₹8L',
          postedBy: 'system',
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ];
      setJobs(demo);
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const DEMO_MODE = ((import.meta as any)?.env?.VITE_DEMO_MODE !== 'false');
      if (DEMO_MODE) {
        const now = new Date().toISOString();
        const newJob: Job = {
          ...(jobData as Job),
          id: `job-demo-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
          isActive: (jobData as any).isActive ?? true,
          postedBy: (jobData as any).postedBy ?? 'system',
        };
        setJobs(prev => [newJob, ...prev]);
        return newJob;
      } else {
        const newJob = await jobsAPI.create(jobData);
        setJobs(prev => [newJob, ...prev]);
        return newJob;
      }
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create job.",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    fetchJobs,
    createJob,
    refetch: fetchJobs,
  };
};