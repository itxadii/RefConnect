import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { applicationsAPI, getApplicationsWithDetails } from '@/integrations/aws/api';
import type { Application } from '@/integrations/aws/dynamodb';

// Application interface is now imported from api.ts

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchApplications = async () => {
    if (!user) {
      setLoading(false);
      setApplications([]);
      return;
    }

    try {
      const DEMO_MODE = ((import.meta as any)?.env?.VITE_DEMO_MODE !== 'false');
      if (DEMO_MODE) {
        // Provide demo applications without backend
        const now = new Date().toISOString();
        const demoApps: Application[] = [
          {
            id: 'app-demo-1',
            jobId: 'job-demo-1',
            userId: user.userId,
            status: 'applied',
            matchScore: 82,
            coverLetter: 'Excited to apply!',
            createdAt: now,
            updatedAt: now,
          },
        ];
        setApplications(demoApps);
      } else {
        const userApplications = await applicationsAPI.getByUserId(user.userId);
        setApplications(userApplications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Keep UI working in demo mode or upon failure
      const now = new Date().toISOString();
      setApplications([
        {
          id: 'app-fallback-1',
          jobId: 'job-demo-2',
          userId: user?.userId || 'unknown',
          status: 'applied',
          createdAt: now,
          updatedAt: now,
        },
      ] as Application[]);
    } finally {
      setLoading(false);
    }
  };

  const submitApplication = async (jobId: string, coverLetter?: string) => {
    if (!user) return;

    try {
      const DEMO_MODE = ((import.meta as any)?.env?.VITE_DEMO_MODE !== 'false');
      if (DEMO_MODE) {
        const now = new Date().toISOString();
        const newApp: Application = {
          id: `app-demo-${Date.now()}`,
          jobId,
          userId: user.userId,
          status: 'applied',
          coverLetter,
          createdAt: now,
          updatedAt: now,
        };
        setApplications(prev => [newApp, ...prev]);
      } else {
        await applicationsAPI.create({
          jobId,
          userId: user.userId,
          coverLetter,
          status: 'applied'
        });
        await fetchApplications(); // Refresh the list
      }

      toast({ title: "Success", description: "Application submitted successfully!" });
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit application.",
      });
    }
  };

  const updateApplication = async (applicationId: string, updates: Partial<Application>) => {
    try {
      const DEMO_MODE = ((import.meta as any)?.env?.VITE_DEMO_MODE !== 'false');
      if (DEMO_MODE) {
        setApplications(prev => prev.map(app => app.id === applicationId ? { ...app, ...updates, updatedAt: new Date().toISOString() } as Application : app));
      } else {
        await applicationsAPI.update(applicationId, updates);
        await fetchApplications();
      }
      toast({ title: "Success", description: "Application updated successfully!" });
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update application.",
      });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  return {
    applications,
    loading,
    submitApplication,
    updateApplication,
    refetch: fetchApplications,
  };
};