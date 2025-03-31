import { signIn, signOut, useSession, getSession } from 'next-auth/react';
import { Session } from 'next-auth';

// Extend NextAuth types to include our custom fields
declare module 'next-auth' {
  interface User {
    id: string;
    githubUsername?: string;
    token?: string;
  }
}

declare module 'next-auth/react' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      githubUsername?: string | null;
      token?: string | null;
    };
  }
}

/**
 * Login a user using NextAuth credentials provider
 * @param email User's email
 * @param password User's password
 * @returns Promise that resolves when login completes
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      throw new Error(result.error || 'Login failed');
    }

    return result;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register a new user
 * @param userData User registration data
 * @returns Promise with registration result
 */
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  githubUsername?: string;
  githubUrl?: string;
}) => {
  try {
    // Log the registration attempt
    console.log('Attempting to register user:', { ...userData, password: '****' });
    
    // Create request data - include both githubUsername and githubUrl if available
    const requestData = { ...userData };
    
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = 'Registration failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (jsonError) {
        console.error('Failed to parse error response:', jsonError);
      }
      throw new Error(errorMessage);
    }

    // Parse and return successful response
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Log out the current user
 */
export const logout = async (): Promise<void> => {
  await signOut({ callbackUrl: '/' });
};

/**
 * Check if the user is authenticated using NextAuth
 * @returns Boolean indicating authentication status
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // We can check if the session exists in localStorage as a simple client-side check
  return document.cookie.indexOf('next-auth.session-token') > -1;
};

/**
 * Get user information from the session
 * @returns User information or null if not authenticated
 */
export const getUserInfo = async () => {
  // Use getSession instead of useSession to avoid hook rules violation
  const session = await getSession();
  
  if (!session || !session.user) {
    return null;
  }
  
  return {
    id: session.user.id,
    name: session.user.name || null,
    email: session.user.email || null,
    image: session.user.image || null,
    githubUsername: session.user.githubUsername || null,
    token: session.user.token || null
  };
};

/**
 * Get current user information from the server-side session
 * @returns Promise with user information
 */
export const getCurrentUser = async () => {
  try {
    const response = await fetch('/api/auth/session');
    if (!response.ok) throw new Error('Failed to get current user');
    
    const data = await response.json();
    return data.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get authentication token from session
 * @returns Token string or null if not available
 */
export const getToken = async (): Promise<string | null> => {
  try {
    const session = await getSession();
    return session?.user?.token || null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};
