import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { profileAPI } from '@/integrations/aws/api';

export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  university?: string;
  graduation_year?: number;
  skills?: string[];
  experience_level?: string;
  resume_url?: string;
  points: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const dbProfile = await profileAPI.getByUserId(user.userId);
      if (dbProfile) {
        // Map camelCase (DB) to snake_case (UI expectations)
        const mapped: Profile = {
          id: dbProfile.id,
          user_id: dbProfile.userId,
          full_name: dbProfile.fullName,
          email: dbProfile.email || user.email,
          phone: dbProfile.phone,
          university: dbProfile.university,
          graduation_year: dbProfile.graduationYear,
          skills: dbProfile.skills,
          experience_level: dbProfile.experienceLevel,
          resume_url: dbProfile.resumeUrl,
          points: dbProfile.points ?? 0,
          level: dbProfile.level ?? 1,
          created_at: dbProfile.createdAt,
          updated_at: dbProfile.updatedAt,
        };
        setProfile(mapped);
      } else {
        // Create a default in-memory profile for prototype use
        const now = new Date().toISOString();
        const fallback: Profile = {
          id: `prof-${user.userId}`,
          user_id: user.userId,
          full_name: user.attributes?.name || user.email || user.username,
          email: user.email,
          phone: '',
          university: '',
          graduation_year: undefined,
          skills: [],
          experience_level: 'fresher',
          resume_url: undefined,
          points: 0,
          level: 1,
          created_at: now,
          updated_at: now,
        };
        setProfile(fallback);
      }
    } catch (error) {
      console.warn('Profile API unavailable, using default profile for prototype:', error);
      // Create a default in-memory profile for prototype use
      const now = new Date().toISOString();
      const fallback: Profile = {
        id: `prof-${user.userId}`,
        user_id: user.userId,
        full_name: user.attributes?.name || user.email || user.username,
        email: user.email,
        phone: '',
        university: '',
        graduation_year: undefined,
        skills: [],
        experience_level: 'fresher',
        resume_url: undefined,
        points: 0,
        level: 1,
        created_at: now,
        updated_at: now,
      };
      setProfile(fallback);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;

    try {
      const DEMO_MODE = ((import.meta as any)?.env?.VITE_DEMO_MODE !== 'false');
      if (DEMO_MODE) {
        // Update local in-memory profile and persist to localStorage for demo continuity
        const next: Profile = { ...profile, ...updates } as Profile;
        setProfile(next);
        // Also mirror to demo_profile used by AuthContext demo mode if present
        const storedDemo = localStorage.getItem('demo_profile');
        if (storedDemo) {
          const parsed = JSON.parse(storedDemo);
          // Map snake_case back to camelCase for storage shape used there
          parsed.fullName = next.full_name ?? parsed.fullName;
          parsed.email = next.email ?? parsed.email;
          parsed.resumeUrl = next.resume_url ?? parsed.resumeUrl;
          parsed.updatedAt = new Date().toISOString();
          localStorage.setItem('demo_profile', JSON.stringify(parsed));
        }
        toast({ title: "Success", description: "Profile updated successfully (demo)." });
        return;
      }

      // Map snake_case updates to camelCase for DB
      const updatesCamel: any = {};
      if (updates.full_name !== undefined) updatesCamel.fullName = updates.full_name;
      if (updates.email !== undefined) updatesCamel.email = updates.email;
      if (updates.phone !== undefined) updatesCamel.phone = updates.phone;
      if (updates.university !== undefined) updatesCamel.university = updates.university;
      if (updates.graduation_year !== undefined) updatesCamel.graduationYear = updates.graduation_year;
      if (updates.skills !== undefined) updatesCamel.skills = updates.skills;
      if (updates.experience_level !== undefined) updatesCamel.experienceLevel = updates.experience_level as any;
      if (updates.resume_url !== undefined) updatesCamel.resumeUrl = updates.resume_url as any;
      if (updates.points !== undefined) updatesCamel.points = updates.points;
      if (updates.level !== undefined) updatesCamel.level = updates.level;

      await profileAPI.update(profile.id, updatesCamel);

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile.",
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile,
  };
};