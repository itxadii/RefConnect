import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Job {
  id: string;
  title: string;
  company: string;
  description?: string;
  requirements?: string[];
  skills_required?: string[];
  location?: string;
  job_type?: string;
  salary_range?: string;
  posted_by?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
      }

      if (filters?.jobType) {
        query = query.eq('job_type', filters.jobType);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredJobs = data || [];

      // Filter by skills if provided
      if (filters?.skills && filters.skills.length > 0) {
        filteredJobs = filteredJobs.filter(job => 
          job.skills_required?.some(skill => 
            filters.skills!.some(filterSkill => 
              skill.toLowerCase().includes(filterSkill.toLowerCase())
            )
          )
        );
      }

      setJobs(filteredJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load jobs.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    fetchJobs,
  };
};