import type { NextApiRequest, NextApiResponse } from 'next';
import { DetectUserResponse } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DetectUserResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // In a real Frame context, we would get FID from Frame SDK
    // For now, we'll accept it as a query parameter for testing
    const { fid } = req.query;

    if (!fid) {
      return res.status(400).json({
        success: false,
        error: 'FID not provided'
      });
    }

    const fidNumber = parseInt(fid as string, 10);

    if (isNaN(fidNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid FID format'
      });
    }

    return res.status(200).json({
      success: true,
      fid: fidNumber
    });
  } catch (error) {
    console.error('User detection error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to detect user'
    });
  }
}
