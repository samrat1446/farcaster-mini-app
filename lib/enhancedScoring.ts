// Enhanced scoring algorithms using real Neynar data
export interface EnhancedUserData {
  fid: number;
  username: string;
  displayName: string;
  followerCount: number;
  followingCount: number;
  neynarScore: number; // Real from API
  hasVerifiedAddress: boolean;
  hasBio: boolean;
  hasDisplayName: boolean;
  accountAge?: number; // Days since creation
  powerBadge?: boolean;
}

export class EnhancedScoring {
  
  // Calculate realistic Quotient-like score based on real data
  static calculateQuotientScore(userData: EnhancedUserData): {
    score: number;
    tier: string;
    confidence: 'high' | 'medium' | 'low';
  } {
    const {
      followerCount,
      followingCount,
      neynarScore,
      hasVerifiedAddress,
      hasBio,
      hasDisplayName,
      powerBadge
    } = userData;

    let score = 0.3; // Base score
    let confidence: 'high' | 'medium' | 'low' = 'medium';

    // 1. Neynar Score Weight (40% of total)
    const neynarWeight = (neynarScore / 100) * 0.4;
    score += neynarWeight;

    // 2. Follower Quality (30% of total)
    const ratio = followingCount > 0 ? followerCount / followingCount : 0;
    let followerQuality = 0;
    
    if (followerCount > 10000 && ratio > 2) {
      followerQuality = 0.3; // Excellent
      confidence = 'high';
    } else if (followerCount > 5000 && ratio > 1) {
      followerQuality = 0.25; // Very good
    } else if (followerCount > 1000 && ratio > 0.5) {
      followerQuality = 0.2; // Good
    } else if (followerCount > 500) {
      followerQuality = 0.15; // Average
    } else if (followerCount > 100) {
      followerQuality = 0.1; // Below average
    } else {
      followerQuality = 0.05; // Low
      confidence = 'low';
    }
    
    score += followerQuality;

    // 3. Account Quality Indicators (20% of total)
    let qualityBonus = 0;
    if (powerBadge) qualityBonus += 0.08;
    if (hasVerifiedAddress) qualityBonus += 0.06;
    if (hasBio) qualityBonus += 0.04;
    if (hasDisplayName) qualityBonus += 0.02;
    
    score += qualityBonus;

    // 4. Spam Detection Penalty (10% of total)
    let spamPenalty = 0;
    if (followingCount > followerCount * 10 && followingCount > 500) {
      spamPenalty = 0.2; // Heavy penalty
      confidence = 'low';
    } else if (followingCount > followerCount * 5 && followingCount > 200) {
      spamPenalty = 0.1; // Medium penalty
    } else if (followingCount > followerCount * 3 && followingCount > 100) {
      spamPenalty = 0.05; // Light penalty
    }
    
    score -= spamPenalty;

    // Cap score between 0 and 1
    score = Math.max(0, Math.min(1, score));

    // Determine tier
    let tier = 'Active';
    if (score < 0.3) tier = 'Inactive';
    else if (score < 0.5) tier = 'Casual';
    else if (score < 0.7) tier = 'Active';
    else if (score < 0.8) tier = 'Influential';
    else if (score < 0.9) tier = 'Elite';
    else tier = 'Exceptional';

    return { score, tier, confidence };
  }

  // Enhanced spam detection using real patterns
  static detectSpam(userData: EnhancedUserData): {
    spamScore: 0 | 2;
    confidence: 'high' | 'medium' | 'low';
    reason?: string;
  } {
    const {
      followerCount,
      followingCount,
      neynarScore,
      hasVerifiedAddress,
      hasBio,
      hasDisplayName
    } = userData;

    let spamScore: 0 | 2 = 2; // Default: not spam
    let confidence: 'high' | 'medium' | 'low' = 'medium';
    let reason: string | undefined;

    // High confidence spam indicators
    if (followingCount > followerCount * 10 && followingCount > 1000) {
      spamScore = 0;
      confidence = 'high';
      reason = 'Following 10x+ more than followers (bot pattern)';
    } else if (followingCount > followerCount * 5 && followingCount > 500 && neynarScore < 30) {
      spamScore = 0;
      confidence = 'high';
      reason = 'High following ratio + low Neynar score';
    } else if (followerCount < 10 && followingCount > 500 && !hasVerifiedAddress && !hasBio) {
      spamScore = 0;
      confidence = 'high';
      reason = 'New account with excessive following, no verification';
    }
    // Medium confidence indicators
    else if (followingCount > followerCount * 3 && followingCount > 200 && neynarScore < 40) {
      spamScore = 0;
      confidence = 'medium';
      reason = 'Suspicious following pattern + low engagement';
    } else if (followerCount < 50 && followingCount > 200 && !hasDisplayName) {
      spamScore = 0;
      confidence = 'medium';
      reason = 'Low followers, high following, minimal profile setup';
    }
    // Low confidence indicators
    else if (followingCount > followerCount * 2 && followingCount > 100 && neynarScore < 50) {
      spamScore = 0;
      confidence = 'low';
      reason = 'Moderate following imbalance + below average score';
    }

    return { spamScore, confidence, reason };
  }

  // Calculate overall trust score
  static calculateTrustScore(userData: EnhancedUserData): number {
    const quotient = this.calculateQuotientScore(userData);
    const spam = this.detectSpam(userData);
    
    let trustScore = quotient.score * 100; // Convert to 0-100
    
    // Apply spam penalty
    if (spam.spamScore === 0) {
      if (spam.confidence === 'high') trustScore *= 0.3;
      else if (spam.confidence === 'medium') trustScore *= 0.5;
      else trustScore *= 0.7;
    }
    
    return Math.round(trustScore);
  }
}