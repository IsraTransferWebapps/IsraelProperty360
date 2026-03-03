import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { supabase } from '@/api/supabaseClient';
import { setAuthMethods } from '@/api/base44Client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const authMethodsInjected = useRef(false);

  // Fetch the user's profile row from the profiles table
  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    // PGRST116 = "no rows returned" — profile doesn't exist yet
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  };

  // Auth methods that mirror the Base44 SDK interface.
  // Injected into the compatibility bridge so `base44.auth.me()` etc. work.
  const authMethods = {
    me: async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw { status: 401, message: 'Not authenticated' };
      const profile = await fetchProfile(currentUser.id);
      return { ...profile, email: currentUser.email };
    },

    updateMe: async (updates) => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw { status: 401, message: 'Not authenticated' };
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: currentUser.id, email: currentUser.email, ...updates })
        .select()
        .single();
      if (error) throw error;
      setUser(data);
      return data;
    },

    redirectToLogin: async (returnUrl) => {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: returnUrl || window.location.href },
      });
    },

    loginWithRedirect: async (returnUrl) => {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: returnUrl || window.location.href },
      });
    },

    logout: async (redirectUrl) => {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      if (redirectUrl) window.location.href = redirectUrl;
    },
  };

  // Inject auth methods into the bridge object once
  if (!authMethodsInjected.current) {
    setAuthMethods(authMethods);
    authMethodsInjected.current = true;
  }

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setUser(profile ? { ...profile, email: session.user.email } : { email: session.user.email });
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth init failed:', err);
        setAuthError({ type: 'unknown', message: err.message });
      } finally {
        setIsLoadingAuth(false);
      }
    };

    initAuth();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setUser(profile ? { ...profile, email: session.user.email } : { email: session.user.email });
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setIsLoadingAuth(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const logout = async (shouldRedirect = true) => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) {
      window.location.href = window.location.origin;
    }
  };

  const navigateToLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings: false,
      authError,
      appPublicSettings: {},
      logout,
      navigateToLogin,
      checkAppState: () => {},
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
