import React from 'react';
import { FarcasterUser } from '@/types';
import { Card } from './Card';

interface ProfileHeaderProps {
  user: FarcasterUser;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className="cosmic-card mb-6 p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            src={user.pfpUrl || '/default-avatar.png'}
            alt={user.displayName}
            className="w-24 h-24 rounded-full border-4"
            style={{
              borderColor: 'var(--base-blue)',
              boxShadow: '0 0 20px rgba(0, 82, 255, 0.5), 0 4px 15px rgba(0, 0, 0, 0.3)'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/default-avatar.png';
            }}
          />
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="cosmic-title mb-2">
            {user.displayName}
          </h1>
          <p className="cosmic-subtitle mb-2">
            @{user.username}
          </p>

          {/* Identity Badges */}
          {(user.ensName || user.bnsName) && (
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
              {user.ensName && (
                <span className="cosmic-badge">
                  {user.ensName}
                </span>
              )}
              {user.bnsName && (
                <span className="cosmic-badge">
                  {user.bnsName}
                </span>
              )}
            </div>
          )}

          {/* Bio */}
          {user.bio && (
            <p className="cosmic-text mb-3">
              {user.bio}
            </p>
          )}

          {/* FID */}
          <p className="cosmic-text">
            FID: <span className="font-mono font-semibold" style={{color: 'var(--base-blue-light)'}}>{user.fid}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
