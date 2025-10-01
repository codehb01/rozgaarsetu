import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export interface UserProfile {
  id: string;
  name: string;
  role: "CUSTOMER" | "WORKER" | "UNASSIGNED";
  clerkUserId: string;
}

export function useUserProfile() {
  const { user, isLoaded } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!isLoaded) {
        setLoading(true);
        return;
      }
      
      if (!user) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            setUserProfile(null);
            setLoading(false);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const profile: UserProfile = await response.json();
        setUserProfile(profile);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [user, isLoaded]);

  return {
    userProfile,
    loading: loading || !isLoaded,
    error,
    isAuthenticated: !!user && !!userProfile,
  };
}