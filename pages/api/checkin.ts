import type { NextApiRequest, NextApiResponse } from 'next';
import { CheckInResponse, CheckInRequest } from '@/types';

// In-memory storage for demo (in production, use a database)
const checkIns: Map<number, { lastCheckIn: string; streak: number; history: string[] }> = new Map();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckInResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, streak: 0, error: 'Method not allowed' });
  }

  try {
    const { fid }: CheckInRequest = req.body;

    if (!fid) {
      return res.status(400).json({
        success: false,
        streak: 0,
        error: 'FID is required'
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const existing = checkIns.get(fid);

    if (existing && existing.lastCheckIn === today) {
      return res.status(400).json({
        success: false,
        streak: existing.streak,
        error: 'Already checked in today'
      });
    }

    let newStreak = 1;
    let history: string[] = [today];

    if (existing) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (existing.lastCheckIn === yesterdayStr) {
        newStreak = existing.streak + 1;
      }

      history = [...existing.history, today];
    }

    checkIns.set(fid, {
      lastCheckIn: today,
      streak: newStreak,
      history
    });

    return res.status(200).json({
      success: true,
      streak: newStreak
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return res.status(500).json({
      success: false,
      streak: 0,
      error: 'Failed to record check-in'
    });
  }
}
