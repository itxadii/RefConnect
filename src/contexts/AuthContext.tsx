import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session);
        
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          setSession(session);
          setUser(session?.user ?? null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        // Clear state on error
        setSession(null);
        setUser(null);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message,
        });
      } else {
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
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: fullName ? { full_name: fullName } : undefined,
        }
      });
      
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
      // Check if user is actually authenticated before attempting to sign out
      if (!user && !session) {
        // User is already signed out, just clear local state
        setUser(null);
        setSession(null);
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        // If signout fails due to missing session, just clear local state
        if (error.message.includes('session') || error.message.includes('missing')) {
          setUser(null);
          setSession(null);
          toast({
            title: "Signed out",
            description: "You have been signed out.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Sign out failed",
            description: error.message,
          });
        }
      } else {
        setUser(null);
        setSession(null);
        toast({
          title: "Signed out",
          description: "Successfully signed out of your account.",
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, clear the local state
      setUser(null);
      setSession(null);
      toast({
        title: "Signed out",
        description: "You have been signed out.",
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user && !!session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};