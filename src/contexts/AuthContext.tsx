import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { authAPI, CognitoUser } from '@/integrations/aws/cognito';
import { profileAPI } from '@/integrations/aws/api';
import type { Profile } from '@/integrations/aws/dynamodb';

interface AuthContextType {
  user: CognitoUser | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const DEMO_MODE = (() => {
    const val = (import.meta as any)?.env?.VITE_DEMO_MODE;
    // Default to true for a simple working prototype, unless explicitly disabled
    if (val === 'false') return false;
    return true;
  })();
  const DEMO_AUTO_RESTORE = ((import.meta as any)?.env?.VITE_DEMO_AUTO_RESTORE === 'true');

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      if (DEMO_MODE) {
        // Restore from localStorage for prototype continuity
        if (DEMO_AUTO_RESTORE) {
          const storedUser = localStorage.getItem('demo_user');
          const storedProfile = localStorage.getItem('demo_profile');
          if (storedUser && storedProfile) {
            setUser(JSON.parse(storedUser));
            setProfile(JSON.parse(storedProfile));
          } else {
            setUser(null);
            setProfile(null);
          }
        } else {
          // Do not auto-restore; start signed out in demo mode unless user explicitly signs in
          setUser(null);
          setProfile(null);
        }
        return;
      }
      const currentUser = await authAPI.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        
        // Get user profile
        const userProfile = await profileAPI.getByUserId(currentUser.userId);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (DEMO_MODE) {
        const mockUser: CognitoUser = {
          userId: `demo-${btoa(email).slice(0,8)}`,
          username: email,
          email,
          attributes: { email, name: email.split('@')[0] }
        };
        const now = new Date().toISOString();
        const mockProfile: any = {
          id: `prof-${mockUser.userId}`,
          userId: mockUser.userId,
          fullName: mockUser.attributes.name,
          email,
          role: 'user',
          createdAt: now,
          updatedAt: now,
        };
        setUser(mockUser);
        setProfile(mockProfile);
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        localStorage.setItem('demo_profile', JSON.stringify(mockProfile));
        toast({ title: 'Demo sign-in', description: 'Signed in (demo mode).' });
        return { error: null };
      }
      const { error } = await authAPI.signIn(email, password);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message,
        });
      } else {
        await checkAuthState();
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to your account.",
        });
      }
      
      return { error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: errorMessage,
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      if (DEMO_MODE) {
        // In demo mode, treat sign up like a local registration without verification
        const mockUser: CognitoUser = {
          userId: `demo-${btoa(email).slice(0,8)}`,
          username: email,
          email,
          attributes: { email, name: fullName || email.split('@')[0] }
        };
        const now = new Date().toISOString();
        const mockProfile: any = {
          id: `prof-${mockUser.userId}`,
          userId: mockUser.userId,
          fullName: fullName || mockUser.attributes.name,
          email,
          role: 'user',
          createdAt: now,
          updatedAt: now,
        };
        setUser(mockUser);
        setProfile(mockProfile);
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        localStorage.setItem('demo_profile', JSON.stringify(mockProfile));
        toast({ title: 'Demo account created', description: 'You are now signed in (demo mode).' });
        return { error: null };
      }
      const { error } = await authAPI.signUp(email, password, fullName);
      
      if (error) {
        console.error('Sign up error:', error);
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Sign up exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: errorMessage,
      });
      return { error: { message: errorMessage } };
    }
  };

  const signOut = async () => {
    try {
      if (DEMO_MODE) {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('demo_user');
        localStorage.removeItem('demo_profile');
        toast({ title: 'Signed out', description: 'You have been signed out (demo mode).' });
        return;
      }
      // Check if user is actually authenticated before attempting to sign out
      if (!user) {
        // User is already signed out, just clear local state
        setUser(null);
        setProfile(null);
        return;
      }

      await authAPI.signOut();
      setUser(null);
      setProfile(null);
      toast({
        title: "Signed out",
        description: "Successfully signed out of your account.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, clear the local state
      setUser(null);
      setProfile(null);
      toast({
        title: "Signed out",
        description: "You have been signed out.",
      });
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};