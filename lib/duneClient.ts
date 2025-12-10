export class DuneClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.dune.com/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      'X-Dune-API-Key': this.apiKey,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }

  async getFarcasterSpamScore(fid: number): Promise<{ spamScore: 0 | 2; neynarScore: number } | null> {
    try {
      // Dune query ID for Farcaster spam scores (you need to create this query on Dune)
      // Example query: SELECT fid, spam_score, neynar_score FROM farcaster.spam_scores WHERE fid = {{fid}}
      const queryId = 'your_query_id_here'; // Replace with actual Dune query ID
      
      const response = await this.fetchWithAuth(
        `${this.baseUrl}/query/${queryId}/results`,
        {
          method: 'POST',
          body: JSON.stringify({
            query_parameters: {
              fid: fid.toString(),
            },
          }),
        }
      );

      if (!response.ok) {
        console.log('Dune API failed:', response.statusText);
        return null;
      }

      const data = await response.json();
      
      if (data.result?.rows && data.result.rows.length > 0) {
        const row = data.result.rows[0];
        return {
          spamScore: (row.spam_score || 2) as 0 | 2,
          neynarScore: Math.round((row.neynar_score || 0.5) * 100),
        };
      }

      return null;
    } catch (error) {
      console.error('Dune API error:', error);
      return null;
    }
  }
}
