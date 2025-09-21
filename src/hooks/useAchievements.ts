import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { achievementsAPI } from '@/integrations/aws/api';

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
      const list = await achievementsAPI.getAll();
      // Map camelCase (DB) to snake_case used by UI types
      const mapped: Achievement[] = (list || []).map((a) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        icon: a.icon,
        points_reward: a.pointsReward,
        requirement_type: a.requirementType,
        requirement_value: a.requirementValue,
        created_at: a.createdAt,
      }));
      setAchievements(mapped);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchUserAchievements = async () => {
    if (!user) return;

    try {
      const [userAchList, achievementsList] = await Promise.all([
        achievementsAPI.getByUserId(user.userId),
        achievementsAPI.getAll(),
      ]);

      const achMap = new Map(achievementsList.map(a => [a.id, a]));

      const mapped: UserAchievement[] = (userAchList || [])
        .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
        .map(ua => {
          const a = achMap.get(ua.achievementId);
          return {
            id: ua.id,
            user_id: ua.userId,
            achievement_id: ua.achievementId,
            earned_at: ua.earnedAt,
            achievements: a ? {
              name: a.name,
              description: a.description || '',
              icon: a.icon || '',
              points_reward: a.pointsReward,
              requirement_type: a.requirementType,
            } : {
              name: '', description: '', icon: '', points_reward: 0, requirement_type: ''
            }
          } as UserAchievement;
        });

      setUserAchievements(mapped);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchAchievements();
      if (user) {
        await fetchUserAchievements();
      }
      setLoading(false);
    })();
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