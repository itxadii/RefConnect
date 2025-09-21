import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileAPI } from '@/integrations/aws/api';

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      // Check if user has admin role in their profile via DynamoDB
      const profile = await profileAPI.getByUserId(user.userId);
      const hasAdminRole = profile?.role === 'admin' ||
                           user.email?.includes('admin') ||
                           user.attributes?.role === 'admin';
      setIsAdmin(!!hasAdminRole);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const promoteToAdmin = async (userId: string) => {
    try {
      // Find profile by userId (assuming id is different key)
      const profile = await profileAPI.getByUserId(userId);
      if (!profile) throw new Error('Profile not found');
      await profileAPI.update(profile.id, { role: 'admin' });
      return { success: true };
    } catch (error: any) {
      console.error('Error promoting user to admin:', error);
      return { success: false, error: error.message };
    }
  };

  const demoteFromAdmin = async (userId: string) => {
    try {
      const profile = await profileAPI.getByUserId(userId);
      if (!profile) throw new Error('Profile not found');
      await profileAPI.update(profile.id, { role: 'user' });
      return { success: true };
    } catch (error: any) {
      console.error('Error demoting user from admin:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    isAdmin,
    isLoading,
    promoteToAdmin,
    demoteFromAdmin,
    checkAdminStatus
  };
};
