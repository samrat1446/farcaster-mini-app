import type { NextApiRequest, NextApiResponse } from 'next';
import { ProfileResponse } from '@/types';
import { NeynarClient } from '@/lib/neynarClient';
import { AirstackClient } from '@/lib/airstackClient';
import { WarpcastClient } from '@/lib/warpcastClient'; // Only for basic profile data
import { EnhancedScoring } from '@/lib/enhancedScoring';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProfileResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { fid } = req.query;

    if (!fid) {
      return res.status(400).json({
        success: false,
        error: 'FID is required'
      });
    }

    const fidNumber = parseInt(fid as string, 10);

    if (isNaN(fidNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid FID format'
      });
    }

    const apiKey = process.env.NEYNAR_API_KEY;
    const quotientApiKey = process.env.QUOTIENT_API_KEY;
    const airstackApiKey = process.env.AIRSTACK_API_KEY;

    // Try Warpcast API for basic profile data only
    const warpcastClient = new WarpcastClient();
    let warpcastUser = null;

    try {
      console.log('Fetching profile data from Warpcast API...');
      warpcastUser = await warpcastClient.fetchUserProfile(fidNumber);
      if (warpcastUser) {
        console.log('✅ Profile data from Warpcast:', {
          username: warpcastUser.username,
          followers: warpcastUser.followerCount,
          following: warpcastUser.followingCount
        });
      }
    } catch (error) {
      console.error('Warpcast API failed:', error);
    }

    // Try Airstack API first, then fallback to demo
    if (airstackApiKey && airstackApiKey !== 'your_airstack_api_key_here') {
      try {
        console.log('Using Airstack API for FID:', fidNumber);
        
        const airstackClient = new AirstackClient(airstackApiKey);
        const airstackUser = await airstackClient.fetchUserProfile(fidNumber);
        
        if (airstackUser) {
          const scores = airstackClient.calculateScores(airstackUser);
          
          return res.status(200).json({
            success: true,
            data: {
              user: {
                fid: fidNumber,
                username: airstackUser.fname || `user${fidNumber}`,
                displayName: airstackUser.displayName || airstackUser.fname || `User ${fidNumber}`,
                pfpUrl: airstackUser.profileImage || '/default-avatar.png',
                bio: airstackUser.profileBio || '',
                ensName: airstackUser.verifiedAddresses?.ethereum?.[0] || undefined,
              },
              socialGraph: {
                followerCount: airstackUser.followerCount || 0,
                followingCount: airstackUser.followingCount || 0,
              },
              trustMetrics: {
                spamScore: scores.spamScore,
                neynarScore: scores.neynarScore,
                isApiSpamLabel: false,
                quotientScore: scores.quotientScore,
                quotientRank: Math.floor(100000 + (1 - scores.quotientScore) * 900000),
                quotientTier: scores.quotientTier,
                spamLabelBy: undefined,
                spamReportReason: scores.spamScore === 0 ? 'Suspicious follower/following pattern' : undefined,
              },
              // Removed activityMetrics - no real data available
            }
          });
        }
      } catch (error) {
        console.error('Airstack API failed:', error);
      }
    }

    // Try Neynar API with optimized single call
    if (apiKey) {
      try {
        console.log('Using optimized Neynar API call for FID:', fidNumber);
        
        // Single API call to get all user data
        const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fidNumber}&viewer_fid=${fidNumber}`, {
          headers: {
            'accept': 'application/json',
            'api_key': apiKey,
          },
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const user = data.users[0];

        console.log('✅ Neynar API Success for user:', user.username);

        // Calculate scores from single API response
        const followerCount = user.follower_count || 0;
        const followingCount = user.following_count || 0;
        
        // Neynar score calculation
        let neynarScore = 50;
        if (user.score !== undefined) {
          neynarScore = user.score <= 1 ? Math.round(user.score * 100) : user.score;
        } else if (user.experimental?.neynar_user_score !== undefined) {
          neynarScore = user.experimental.neynar_user_score <= 1 
            ? Math.round(user.experimental.neynar_user_score * 100) 
            : user.experimental.neynar_user_score;
        }

        // Enhanced scoring using real data
        const enhancedUserData = {
          fid: user.fid,
          username: user.username,
          displayName: user.display_name || user.username,
          followerCount,
          followingCount,
          neynarScore,
          hasVerifiedAddress: (user.verified_addresses?.eth_addresses?.length || 0) > 0,
          hasBio: !!(user.profile?.bio?.text && user.profile.bio.text.length > 10),
          hasDisplayName: !!(user.display_name && user.display_name !== user.username),
          powerBadge: user.power_badge || false,
        };

        // Real spam detection with confidence
        const spamDetection = EnhancedScoring.detectSpam(enhancedUserData);
        const spamScore = spamDetection.spamScore;
        const isApiSpamLabel = false; // Using enhanced algorithm
        
        // Real quotient score calculation
        const quotientResult = EnhancedScoring.calculateQuotientScore(enhancedUserData);
        const quotientScore = quotientResult.score;
        const quotientTier = quotientResult.tier;

        // Use real spam data from Warpcast if available
        let finalSpamScore = spamScore;
        let finalSpamLabelBy = 'Enhanced Algorithm';
        let finalIsApiSpamLabel = false;

        if (warpcastUser?.extras?.publicSpamLabel) {
          const warpcastSpam = warpcastClient.parseSpamLabel(warpcastUser.extras.publicSpamLabel);
          finalSpamScore = warpcastSpam.score;
          finalSpamLabelBy = 'Warpcast API (Real)';
          finalIsApiSpamLabel = true;
          console.log('✅ Using real spam data from Warpcast:', warpcastSpam);
        }

        // Use real follower counts from Warpcast if available (more accurate)
        const finalFollowerCount = warpcastUser?.followerCount || followerCount;
        const finalFollowingCount = warpcastUser?.followingCount || followingCount;

        console.log('Enhanced Scoring Results:', {
          spamScore: finalSpamScore,
          spamReason: spamDetection.reason,
          spamConfidence: spamDetection.confidence,
          quotientScore: Math.round(quotientScore * 100),
          quotientTier,
          quotientConfidence: quotientResult.confidence,
          // Removed activity data logging
        });

        // No activity metrics - removed since no reliable real data available

        return res.status(200).json({
          success: true,
          data: {
            user: {
              fid: user.fid,
              username: user.username,
              displayName: user.display_name || user.username,
              pfpUrl: user.pfp_url || '/default-avatar.png',
              bio: user.profile?.bio?.text || '',
              ensName: user.verified_addresses?.eth_addresses?.[0] || undefined,
            },
            socialGraph: {
              followerCount: finalFollowerCount,
              followingCount: finalFollowingCount,
            },
            trustMetrics: {
              spamScore: finalSpamScore,
              neynarScore,
              isApiSpamLabel: finalIsApiSpamLabel,
              quotientScore,
              quotientRank: Math.floor(100000 + (1 - quotientScore) * 900000),
              quotientTier: quotientTier + (finalIsApiSpamLabel ? '' : ' (Est.)'),
              spamLabelBy: finalSpamLabelBy,
              spamReportReason: finalIsApiSpamLabel ? undefined : spamDetection.reason,
            },
            // Removed activity metrics and metadata - keeping only real data
          }
        });
      } catch (error: any) {
        console.error('Neynar API failed:', error);
        // Continue to fallback options
      }
    }

    // Force demo mode for now due to API rate limits
    const forceDemo = false; // Using optimized single API call

    if (!apiKey || forceDemo) {
      // Demo mode - return realistic sample data based on FID
      const demoUsers: Record<number, any> = {
        3: {
          username: 'dwr',
          displayName: 'Dan Romero',
          bio: 'Working on Farcaster',
          followerCount: 609958,
          followingCount: 1426,
          neynarScore: 99,
          quotientScore: 0.99,
          quotientRank: 1,
          quotientTier: 'Exceptional'
        },
        2: {
          username: 'v',
          displayName: 'Varun Srinivasan',
          bio: 'Technowatermelon. Elder Millenial. Building Farcaster.',
          followerCount: 475146,
          followingCount: 1851,
          neynarScore: 99,
          quotientScore: 0.98,
          quotientRank: 2,
          quotientTier: 'Exceptional'
        },
        1: {
          username: 'farcaster',
          displayName: 'Farcaster',
          bio: 'Discover. Trade. Create.',
          followerCount: 76651,
          followingCount: 2,
          neynarScore: 100,
          quotientScore: 1.0,
          quotientRank: 1,
          quotientTier: 'Exceptional'
        }
      };

      const demoUser = demoUsers[fidNumber] || {
        username: `user${fidNumber}`,
        displayName: `Demo User ${fidNumber}`,
        bio: 'This is demo data. Real API temporarily unavailable due to rate limits.',
        followerCount: Math.floor(Math.random() * 10000) + 100,
        followingCount: Math.floor(Math.random() * 1000) + 50,
        neynarScore: Math.floor(Math.random() * 40) + 50,
        quotientScore: Math.random() * 0.5 + 0.5,
        quotientRank: Math.floor(Math.random() * 100000) + 1000,
        quotientTier: 'Active'
      };

      return res.status(200).json({
        success: true,
        data: {
          user: {
            fid: fidNumber,
            username: demoUser.username,
            displayName: demoUser.displayName,
            pfpUrl: '/default-avatar.png',
            bio: demoUser.bio,
            ensName: fidNumber <= 3 ? `${demoUser.username}.eth` : undefined,
          },
          socialGraph: {
            followerCount: demoUser.followerCount,
            followingCount: demoUser.followingCount,
          },
          trustMetrics: {
            spamScore: 2, // Always safe in demo
            neynarScore: demoUser.neynarScore,
            isApiSpamLabel: false,
            quotientScore: demoUser.quotientScore,
            quotientRank: demoUser.quotientRank,
            quotientTier: `${demoUser.quotientTier} (Demo)`,
            spamLabelBy: undefined,
            spamReportReason: undefined,
          },
          // Removed activityMetrics from demo mode
        }
      });
    }

    const client = new NeynarClient(apiKey, quotientApiKey);
    const profileData = await client.fetchCompleteProfile(fidNumber);

    return res.status(200).json({
      success: true,
      data: profileData
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to fetch profile'
    });
  }
}
