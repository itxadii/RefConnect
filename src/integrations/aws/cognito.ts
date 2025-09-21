import { signIn, signUp, signOut, getCurrentUser, confirmSignUp, fetchAuthSession } from 'aws-amplify/auth';

export interface CognitoUser {
  userId: string;
  username: string;
  email: string;
  attributes: {
    email: string;
    name?: string;
    [key: string]: any;
  };
}

// Authentication API
export const authAPI = {
  // Sign up user
  async signUp(email: string, password: string, fullName?: string): Promise<{ error: any }> {
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

      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error };
    }
  },

  // Confirm sign up
  async confirmSignUp(email: string, code: string): Promise<{ error: any }> {
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      return { error: null };
    } catch (error: any) {
      console.error('Confirm sign up error:', error);
      return { error };
    }
  },

  // Sign in user
  async signIn(email: string, password: string): Promise<{ error: any }> {
    try {
      // First try default SRP flow
      try {
        await signIn({
          username: email,
          password,
        });
        return { error: null };
      } catch (e: any) {
        // If SRP is not enabled for the client, retry with USER_PASSWORD_AUTH
        const msg = String(e?.message || e);
        if (msg.toLowerCase().includes('srp_auth is not enabled') || msg.toLowerCase().includes('srp') ) {
          try {
            await signIn({
              username: email,
              password,
              options: { authFlowType: 'USER_PASSWORD_AUTH' as any },
            });
            return { error: null };
          } catch (innerErr: any) {
            return { error: innerErr };
          }
        }
        return { error: e };
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    }
  },

  // Sign out user
  async signOut(): Promise<void> {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  // Get current user
  async getCurrentUser(): Promise<CognitoUser | null> {
    try {
      const user = await getCurrentUser();
      return {
        userId: user.userId,
        username: user.username,
        email: user.signInDetails?.loginId || '',
        attributes: {
          email: user.signInDetails?.loginId || '',
          name: user.signInDetails?.loginId || '',
        },
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Get auth session
  async getAuthSession(): Promise<any> {
    try {
      const session = await fetchAuthSession();
      return session;
    } catch (error) {
      console.error('Get auth session error:', error);
      return null;
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      await getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default authAPI;

