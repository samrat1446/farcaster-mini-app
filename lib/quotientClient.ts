// Quotient API Client for Farcaster reputation scores
export interface QuotientScore {
  fid: number;
  username: string;
  quotientScore: number; // 0-1 scale
  quotientScoreRaw: number;
  quotientRank: number;
  quotientProfileUrl: string;
}

export interface QuotientResponse {
  data: QuotientScore[];
  count: number;
}

export class QuotientClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.quotient.social';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchUserReputation(fids: number[]): Promise<QuotientScore[]> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/user-reputation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          fids: fids.slice(0, 1000), // Max 1000 FIDs
          api_key: this.apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Quotient API error: ${response.status} ${response.statusText}`);
      }

      const data: QuotientResponse = await response.json();
      
      console.log('Quotient API Response:', data);
      
      return data.data || [];
    } catch (error) {
      console.error('Quotient API failed:', error);
      return []; // Return empty array on failure
    }
  }

  async fetchSingleUserReputation(fid: number): Promise<QuotientScore | null> {
    const results = await this.fetchUserReputation([fid]);
    return results.length > 0 ? results[0] : null;
  }

  // Helper function to get quality tier description
  static getQualityTier(score: number): { tier: string; description: string; color: string } {
    if (score < 0.5) {
      return {
        tier: 'Inactive',
        description: 'Bot accounts, farmers, inactive users',
        color: 'text-red-600 bg-red-50 border-red-200'
      };
    } else if (score < 0.6) {
      return {
        tier: 'Casual',
        description: 'Occasional users, low engagement. Potentially spam or bot accounts.',
        color: 'text-orange-600 bg-orange-50 border-orange-200'
      };
    } else if (score < 0.75) {
      return {
        tier: 'Active',
        description: 'Regular contributors, solid engagement',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
      };
    } else if (score < 0.8) {
      return {
        tier: 'Influential',
        description: 'High-quality content, strong network',
        color: 'text-blue-600 bg-blue-50 border-blue-200'
      };
    } else if (score < 0.89) {
      return {
        tier: 'Elite',
        description: 'Top-tier creators, community leaders',
        color: 'text-purple-600 bg-purple-50 border-purple-200'
      };
    } else {
      return {
        tier: 'Exceptional',
        description: 'Platform superstars, maximum influence',
        color: 'text-green-600 bg-green-50 border-green-200'
      };
    }
  }
}