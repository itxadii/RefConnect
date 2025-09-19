import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  status: string;
  match_score?: number;
  cover_letter?: string;
  created_at: string;
  updated_at: string;
  jobs?: {
    title: string;
    company: string;
    job_type?: string;
  };
}

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchApplications = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs (
            title,
            company,
            job_type
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load applications.",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitApplication = async (jobId: string, coverLetter?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          user_id: user.id,
          cover_letter: coverLetter,
          status: 'applied'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application submitted successfully!",
      });

      fetchApplications(); // Refresh the list
    } catch (error: any) {
      console.error('Error submitting application:', error);
      if (error.code === '23505') {
        toast({
          variant: "destructive",
          title: "Already Applied",
          description: "You have already applied for this job.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to submit application.",
        });
      }
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  return {
    applications,
    loading,
    submitApplication,
    refetch: fetchApplications,
  };
};