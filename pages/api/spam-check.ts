import type { NextApiRequest, NextApiResponse } from 'next';

interface SpamCheckResponse {
  success: boolean;
  spamScore?: 0 | 2;
  neynarScore?: number;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SpamCheckResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { fid } = req.query;

    if (!fid) {
      return res.status(400).json({ success: false, error: 'FID is required' });
    }

    // Try Warpcast API
    const warpcastResponse = await fetch(
      `https://client.warpcast.com/v2/user-by-fid?fid=${fid}`
    );

    if (warpcastResponse.ok) {
      const data = await warpcastResponse.json();
      
      const spamScore = data.result?.user?.experimental?.spamScore as 0 | 2 | undefined;
      const neynarScore = data.result?.user?.experimental?.neynarScore;

      if (spamScore !== undefined) {
        return res.status(200).json({
          success: true,
          spamScore,
          neynarScore: neynarScore ? Math.round(neynarScore * 100) : undefined,
        });
      }
    }

    // Fallback - no data available
    return res.status(200).json({
      success: false,
      error: 'Spam data not available',
    });
  } catch (error: any) {
    console.error('Spam check error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to check spam status',
    });
  }
}
