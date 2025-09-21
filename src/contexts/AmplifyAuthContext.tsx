import React, { createContext, useContext, useEffect, useState } from 'react';
import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { useToast } from '@/hooks/use-toast';

interface User {
  userId: string;
  username: string;
  email: string;
  attributes: {
    email: string;
    name?: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signInUser: (email: string, password: string) => Promise<{ error: any }>;
  signUpUser: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOutUser: () => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<{ error: any }>;
}

const AmplifyAuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAmplifyAuth = () => {
  const context = useContext(AmplifyAuthContext);
  if (context === undefined) {
    throw new Error('useAmplifyAuth must be used within an AmplifyAuthProvider');
  }
  return context;
};

export const AmplifyAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signInUser = async (email: string, password: string) => {
    try {
      const { isSignedIn } = await signIn({
        username: email,
        password,
      });
      
      if (isSignedIn) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to your account.",
        });
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || 'An error occurred during sign in',
      });
      return { error };
    }
  };

  const signUpUser = async (email: string, password: string, fullName?: string) => {
    try {
      const { isSignUpComplete, userId } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name: fullName || '',
          },
        },
      });

      if (isSignUpComplete) {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || 'An error occurred during sign up',
      });
      return { error };
    }
  };

  const confirmSignUp = async (email: string, code: string) => {
    try {
      const { isSignUpComplete } = await signUp({
        username: email,
        password: '', // Not needed for confirmation
        options: {
          userAttributes: {
            email,
          },
        },
      });

      if (isSignUpComplete) {
        toast({
          title: "Email confirmed!",
          description: "Your account has been verified successfully.",
        });
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Confirm sign up error:', error);
      toast({
        variant: "destructive",
        title: "Confirmation failed",
        description: error.message || 'An error occurred during confirmation',
      });
      return { error };
    }
  };

  const signOutUser = async () => {
    try {
      await signOut();
      setUser(null);
      toast({
        title: "Signed out",
        description: "Successfully signed out of your account.",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Still clear local state even if signout fails
      setUser(null);
      toast({
        title: "Signed out",
        description: "You have been signed out.",
      });
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signInUser,
    signUpUser,
    signOutUser,
    confirmSignUp,
  };

  return <AmplifyAuthContext.Provider value={value}>{children}</AmplifyAuthContext.Provider>;
};
