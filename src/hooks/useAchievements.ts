import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Achievement {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  points_reward: number;
  requirement_type: string;
  requirement_value: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievements: {
    name: string;
    description: string;
    icon: string;
    points_reward: number;
    requirement_type: string;
  };
}

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('points_reward', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchUserAchievements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements (
            name,
            description,
            icon,
            points_reward,
            requirement_type
          )
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setUserAchievements(data || []);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
    }
  };

  useEffect(() => {
    fetchAchievements();
    if (user) {
      fetchUserAchievements();
    }
    setLoading(false);
  }, [user]);

  return {
    achievements,
    userAchievements,
    loading,
    refetch: () => {
      fetchAchievements();
      fetchUserAchievements();
    },
  };
};