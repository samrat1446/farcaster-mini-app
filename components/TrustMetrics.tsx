import React, { useState } from 'react';
import { TrustMetrics as TrustMetricsType } from '@/types';
// Using cosmic styling instead of Card and ProgressBar

interface TrustMetricsProps {
  trustMetrics: TrustMetricsType;
}

// Removed spam-related functions since we're only showing real data

export const TrustMetrics: React.FC<TrustMetricsProps> = ({ trustMetrics }) => {
  const [showTips, setShowTips] = useState(false);
  
  // Only showing real data - Neynar Score

  return (
    <div className="cosmic-card mb-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="cosmic-title">Neynar Score</h2>
        <div className="cosmic-badge">
          ✅ Real Data
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Cosmic Score Circle */}
        <div className="score-circle">
          <div className="score-number">{trustMetrics.neynarScore}</div>
          <div className="score-label">Neynar Score</div>
        </div>
        
        {/* Score Description */}
        <div className="text-center">
          <p className="cosmic-text">
            Official quality score from Neynar trust model • Higher is better
          </p>
        </div>

        {/* Tips Toggle Button */}
        <button
          onClick={() => setShowTips(!showTips)}
          className="cosmic-button w-full justify-between"
        >
          <span>🔧 How to Improve Your Neynar Score</span>
          <span className="text-lg">{showTips ? '▼' : '▶'}</span>
        </button>

        {/* Tips Section */}
        {showTips && (
          <div className="bg-base-surface rounded-lg p-4 space-y-3 text-sm">
            {/* Personalized Recommendation */}
            {trustMetrics.neynarScore < 50 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <p className="text-xs font-bold text-yellow-800 mb-1">⚠️ Your Score Needs Attention</p>
                <p className="text-xs text-yellow-700">
                  Focus on creating 5 strong, authentic posts per week rather than posting frequently. Engage in meaningful conversations.
                </p>
              </div>
            )}

            {trustMetrics.neynarScore >= 50 && trustMetrics.neynarScore < 75 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <p className="text-xs font-bold text-blue-800 mb-1">💪 You're Doing Well!</p>
                <p className="text-xs text-blue-700">
                  Keep building on your authentic voice. Share more original content and engage deeply with your community.
                </p>
              </div>
            )}

            {trustMetrics.neynarScore >= 75 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                <p className="text-xs font-bold text-green-800 mb-1">🌟 Excellent Score!</p>
                <p className="text-xs text-green-700">
                  You're a valued community member. Continue sharing quality content and helping others grow.
                </p>
              </div>
            )}

            <div className="border-l-4 border-base-blue pl-3">
              <p className="font-semibold text-base-text mb-1">🟣 Quality Over Quantity</p>
              <p className="text-base-text-secondary text-xs">
                Neynar evaluates genuine, useful, and interesting content. It's not about activity for the sake of activity.
              </p>
            </div>

            <div className="border-l-4 border-base-blue pl-3">
              <p className="font-semibold text-base-text mb-1">🟣 Create Authentic Content</p>
              <p className="text-base-text-secondary text-xs">
                Show YOUR thoughts, stories, and emotions. The algorithm detects overly artificial texts. Add real emotion and experience.
              </p>
            </div>

            <div className="border-l-4 border-base-blue pl-3">
              <p className="font-semibold text-base-text mb-1">🟣 Add Value to the Community</p>
              <p className="text-base-text-secondary text-xs">
                Posts that receive meaningful comments, serve as useful advice, spark discussion, and keep people engaged boost your score.
              </p>
            </div>

            <div className="border-l-4 border-base-blue pl-3">
              <p className="font-semibold text-base-text mb-1">🟣 Use Original Content</p>
              <p className="text-base-text-secondary text-xs">
                Original photos and unique content rank higher. Neynar detects copied content from Pinterest or Google.
              </p>
            </div>

            <div className="border-l-4 border-base-blue pl-3">
              <p className="font-semibold text-base-text mb-1">🟣 Engage Meaningfully</p>
              <p className="text-base-text-secondary text-xs">
                Communication accounts for 50% of the score! Comments, dialogues, questions, and support all contribute to your rating.
              </p>
            </div>

            <div className="bg-base-blue-light bg-opacity-10 rounded p-3 mt-3">
              <p className="text-xs font-semibold text-base-blue mb-1">✨ The Secret:</p>
              <p className="text-xs text-base-text-secondary">
                Neynar evaluates your social usefulness. If your posts give something to people, your score goes up. If they clutter the feed, it goes down.
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-base-text-secondary italic">
                💡 Remember: 1 strong cast is better than 10 empty ones. Better to have 5 strong opinions a week than 20 posts a day.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
