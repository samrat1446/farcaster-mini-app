// Core Farcaster User Interface
export interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  bio: string;
  ensName?: string;
  bnsName?: string;
}

// Social Graph Data
export interface SocialGraph {
  followerCount: number;
  followingCount: number;
}

// Trust and Safety Metrics
export interface TrustMetrics {
  spamScore: 0 | 2; // Only 0 and 2 are used by Farcaster
  neynarScore: number; // 0-100
  spamLabelBy?: string; // Who gave the spam label (e.g., "merkle")
  spamReportReason?: string; // Why the spam label was given
  isApiSpamLabel: boolean; // True if from API, false if estimated
  quotientScore?: number; // 0-1 scale from Quotient API
  quotientRank?: number; // Global rank from Quotient
  quotientTier?: string; // Quality tier (Inactive, Casual, Active, etc.)
}

// Activity Metrics
export interface ActivityMetrics {
  outgoing: {
    likesGiven: number;
    commentsPosted: number;
    recastsShared: number;
  };
  incoming: {
    likesReceived: number;
    commentsReceived: number;
    recastsReceived: number;
  };
}

// Check-In Data
export interface CheckInData {
  lastCheckIn: string; // ISO date
  streak: number;
  history: string[]; // Array of ISO dates
}

// Data Source Metadata
export interface DataSourceMetadata {
  profile?: string;
  activity?: string;
  spam?: string;
  quotient?: string;
}

export interface ProfileMetadata {
  dataSource: DataSourceMetadata;
  isRealActivityData: boolean;
  lastUpdated: string;
}

// Complete Profile Data - Only Real Data
export interface ProfileData {
  user: FarcasterUser;
  socialGraph: SocialGraph;
  trustMetrics: TrustMetrics;
  // Removed activityMetrics and metadata - no reliable real data available
}

// API Response Types
export interface ProfileResponse {
  success: boolean;
  data?: ProfileData;
  error?: string;
}

export interface DetectUserResponse {
  success: boolean;
  fid?: number;
  error?: string;
}

export interface CheckInRequest {
  fid: number;
}

export interface CheckInResponse {
  success: boolean;
  streak: number;
  error?: string;
}

// Error Types
export interface APIError {
  status: number;
  message: string;
  retryable: boolean;
}

export interface UserFacingError {
  message: string;
  retryable: boolean;
  action: 'retry' | 'queue' | 'none';
}

// Cache Configuration
export interface CacheConfig {
  revalidateOnFocus: boolean;
  revalidateOnReconnect: boolean;
  dedupingInterval: number;
  refreshInterval: number;
}
