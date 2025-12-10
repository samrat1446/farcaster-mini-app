import React from 'react';
import { ActivityMetrics } from '@/types';
import { Card } from './Card';

interface ActivityAnalyticsProps {
  activityMetrics: ActivityMetrics;
  metadata?: {
    isRealActivityData?: boolean;
    dataSource?: {
      activity?: string;
    };
  };
}

export const ActivityAnalytics: React.FC<ActivityAnalyticsProps> = ({ activityMetrics, metadata }) => {
  return (
    <Card className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-base-text">Activity Analytics</h2>
        
        {/* Data Source Indicator */}
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
          metadata?.isRealActivityData 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
          {metadata?.isRealActivityData ? (
            <>✅ Real Data</>
          ) : (
            <>📊 Estimated</>
          )}
        </div>
      </div>
      
      {/* Data Source Details */}
      {metadata?.dataSource?.activity && (
        <div className={`mb-4 rounded-lg p-3 border text-xs ${
          metadata.isRealActivityData 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
          <strong>Data Source:</strong> {metadata.dataSource.activity}
          {metadata.isRealActivityData ? (
            <div className="mt-2 space-y-1">
              <div>✅ <strong>Real Data:</strong> Recasts, Comments from Warpcast API</div>
              <div>⚠️ <strong>Limited:</strong> Likes not available in free API tier</div>
            </div>
          ) : (
            <span className="block mt-1">
              Real activity data requires paid API access. Showing intelligent estimation based on follower patterns.
            </span>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Outgoing Activity */}
        <div>
          <h3 className="text-lg font-semibold text-base-blue mb-3">
            What You Gave
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-base-text-secondary">Likes Given</span>
              <span className="text-xl font-bold text-base-text">
                {activityMetrics.outgoing.likesGiven}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base-text-secondary">Comments Posted</span>
              <span className="text-xl font-bold text-base-text">
                {activityMetrics.outgoing.commentsPosted}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base-text-secondary">Recasts Shared</span>
              <span className="text-xl font-bold text-base-text">
                {activityMetrics.outgoing.recastsShared}
              </span>
            </div>
          </div>
        </div>

        {/* Incoming Activity */}
        <div>
          <h3 className="text-lg font-semibold text-base-blue mb-3">
            What You Received
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-base-text-secondary">Likes Received</span>
              <span className="text-xl font-bold text-base-text">
                {activityMetrics.incoming.likesReceived}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base-text-secondary">Comments Received</span>
              <span className="text-xl font-bold text-base-text">
                {activityMetrics.incoming.commentsReceived}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base-text-secondary">Recasts Received</span>
              <span className="text-xl font-bold text-base-text">
                {activityMetrics.incoming.recastsReceived}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
