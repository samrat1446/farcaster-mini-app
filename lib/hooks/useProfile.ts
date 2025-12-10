import useSWR from 'swr';
import { ProfileData, ProfileResponse } from '@/types';

const fetcher = async (url: string): Promise<ProfileData> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  const data: ProfileResponse = await response.json();
  
  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch profile');
  }
  
  return data.data;
};

export const useProfile = (fid: number | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    fid ? `/api/profile?fid=${fid}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      refreshInterval: 60000, // 1 minute
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  return {
    profileData: data,
    isLoading: isLoading || (!data && !error), // Consider loading if no data yet
    error: error?.message,
    refetch: mutate,
  };
};
