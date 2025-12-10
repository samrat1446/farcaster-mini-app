import React from 'react';
import { ProfileData } from '@/types';
import { ProfileHeader } from './ProfileHeader';
import { SocialStats } from './SocialStats';
import { TrustMetrics } from './TrustMetrics';
// Removed ActivityAnalytics - no real data available
import { CheckInSection } from './CheckInSection';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface ProfileContainerProps {
  profileData?: ProfileData;
  isLoading: boolean;
  error?: string;
  onRetry?: () => void;
}

interface ProfileContainerProps {
  profileData?: ProfileData;
  isLoading: boolean;
  error?: string;
  onRetry?: () => void;
  onSwitchUser?: () => void; // New prop for switching users
}

export const ProfileContainer: React.FC<ProfileContainerProps> = ({
  profileData,
  isLoading,
  error,
  onRetry,
  onSwitchUser
}) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (!profileData || !profileData.user) {
    return <ErrorMessage message="No profile data available" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Switch User Button */}
      <div className="mb-6 text-center">
        <button
          onClick={onSwitchUser}
          className="cosmic-button px-6 py-2 text-sm"
        >
          🔄 Switch User / View Another Profile
        </button>
      </div>

      <ProfileHeader user={profileData.user} />
      <SocialStats socialGraph={profileData.socialGraph} />
      <TrustMetrics trustMetrics={profileData.trustMetrics} />
      <CheckInSection fid={profileData.user.fid} />
    </div>
  );
};
