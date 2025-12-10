// Airstack API Client for Farcaster data
export interface AirstackUser {
  fid: string;
  fname: string;
  displayName: string;
  profileImage: string;
  profileBio: string;
  followerCount: number;
  followingCount: number;
  verifiedAddresses: {
    ethereum: string[];
  };
}

export interface AirstackResponse {
  data: {
    Socials: {
      Social: AirstackUser[];
    };
  };
}

export class AirstackClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.airstack.xyz/gql';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchUserProfile(fid: number): Promise<AirstackUser | null> {
    const query = `
      query GetFarcasterUser($fid: String!) {
        Socials(
          input: {
            filter: {
              dappName: {_eq: farcaster}
              userId: {_eq: $fid}
            }
            blockchain: ethereum
          }
        ) {
          Social {
            fid: userId
            fname: profileName
            displayName: profileDisplayName
            profileImage
            profileBio
            followerCount
            followingCount
            verifiedAddresses: userAssociatedAddresses
          }
        }
      }
    `;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey,
        },
        body: JSON.stringify({
          query,
          variables: { fid: fid.toString() }
        }),
      });

      if (!response.ok) {
        throw new Error(`Airstack API error: ${response.status} ${response.statusText}`);
      }

      const data: AirstackResponse = await response.json();
      
      console.log('Airstack API Response:', data);
      
      const users = data.data?.Socials?.Social;
      return users && users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Airstack API failed:', error);
      return null;
    }
  }

  // Calculate estimated scores based on Airstack data
  calculateScores(user: AirstackUser): {
    neynarScore: number;
    quotientScore: number;
    quotientTier: string;
    spamScore: 0 | 2;
  } {
    const followerCount = user.followerCount || 0;
    const followingCount = user.followingCount || 0;
    const hasVerifiedAddress = user.verifiedAddresses?.ethereum?.length > 0;
    const hasBio = user.profileBio && user.profileBio.length > 10;
    const hasDisplayName = user.displayName && user.displayName !== user.fname;

    // Calculate Neynar-like score (0-100)
    let neynarScore = 50; // Base score

    // Follower-based scoring
    if (followerCount > 10000) neynarScore += 25;
    else if (followerCount > 1000) neynarScore += 20;
    else if (followerCount > 500) neynarScore += 15;
    else if (followerCount > 100) neynarScore += 10;

    // Quality indicators
    if (hasVerifiedAddress) neynarScore += 10;
    if (hasBio) neynarScore += 5;
    if (hasDisplayName) neynarScore += 5;

    // Follower/following ratio
    const ratio = followingCount > 0 ? followerCount / followingCount : 0;
    if (ratio > 2) neynarScore += 5;
    if (ratio > 5) neynarScore += 5;

    // Cap at 100
    neynarScore = Math.min(neynarScore, 100);

    // Calculate Quotient-like score (0-1)
    let quotientScore = 0.5; // Base score

    // High-quality account indicators
    if (followerCount > 5000 && ratio > 1) quotientScore = 0.85;
    else if (followerCount > 1000 && ratio > 0.5) quotientScore = 0.75;
    else if (followerCount > 500) quotientScore = 0.65;
    else if (followerCount > 100) quotientScore = 0.58;

    // Quality bonuses
    if (hasVerifiedAddress) quotientScore += 0.05;
    if (hasBio) quotientScore += 0.03;
    if (hasDisplayName) quotientScore += 0.02;

    // Cap at 0.99
    quotientScore = Math.min(quotientScore, 0.99);

    // Determine tier
    let quotientTier = 'Active';
    if (quotientScore < 0.5) quotientTier = 'Inactive';
    else if (quotientScore < 0.6) quotientTier = 'Casual';
    else if (quotientScore < 0.75) quotientTier = 'Active';
    else if (quotientScore < 0.8) quotientTier = 'Influential';
    else if (quotientScore < 0.89) quotientTier = 'Elite';
    else quotientTier = 'Exceptional';

    // Spam detection
    let spamScore: 0 | 2 = 2; // Default: not spam

    // Spam indicators
    if (followingCount > followerCount * 5 && followingCount > 200) spamScore = 0;
    else if (followingCount > followerCount * 3 && followingCount > 500) spamScore = 0;
    else if (followerCount < 50 && followingCount > 200) spamScore = 0;
    else if (!hasBio && !hasVerifiedAddress && followerCount < 10) spamScore = 0;

    return {
      neynarScore,
      quotientScore,
      quotientTier: quotientTier + ' (Est.)',
      spamScore,
    };
  }
}