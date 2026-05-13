'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/lib/supabase';

interface SupabaseContextState {
  supabase: SupabaseClient;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const SupabaseContext = createContext<SupabaseContextState | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    // Initial session check
    supabaseClient.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setUserError(error);
      } else {
        setUser(session?.user ?? null);
      }
      setIsUserLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsUserLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const contextValue = useMemo(() => ({
    supabase: supabaseClient,
    user,
    isUserLoading,
    userError,
  }), [user, isUserLoading, userError]);

  return (
    <SupabaseContext.Provider value={contextValue}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

export const useUser = () => {
  const { user, isUserLoading, userError } = useSupabase();
  return { user, isUserLoading, userError };
};
