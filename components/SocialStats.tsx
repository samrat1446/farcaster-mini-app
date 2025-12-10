import React from 'react';
import { SocialGraph } from '@/types';
import { Card } from './Card';

interface SocialStatsProps {
  socialGraph: SocialGraph;
}

export const SocialStats: React.FC<SocialStatsProps> = ({ socialGraph }) => {
  return (
    <div className="cosmic-card mb-6 p-6">
      <h2 className="cosmic-title mb-4">Social Graph</h2>
      <div className="grid grid-cols-2 gap-6">
        {/* Followers */}
        <div className="text-center">
          <p className="text-3xl font-bold mb-1" style={{
            background: 'linear-gradient(135deg, var(--base-blue-light), var(--base-blue))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {socialGraph.followerCount.toLocaleString()}
          </p>
          <p className="cosmic-text font-medium">
            Followers
          </p>
        </div>

        {/* Following */}
        <div className="text-center">
          <p className="text-3xl font-bold mb-1" style={{
            background: 'linear-gradient(135deg, var(--base-blue-light), var(--base-blue))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {socialGraph.followingCount.toLocaleString()}
          </p>
          <p className="cosmic-text font-medium">
            Following
          </p>
        </div>
      </div>
    </div>
  );
};
