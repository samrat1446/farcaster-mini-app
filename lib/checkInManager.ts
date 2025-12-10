import { CheckInData } from '@/types';

export class CheckInManager {
  private storageKey: string;

  constructor(fid: number) {
    this.storageKey = `warpprofile_checkin_${fid}`;
  }

  canCheckInToday(): boolean {
    const data = this.getCheckInData();
    const today = new Date().toISOString().split('T')[0];
    return data.lastCheckIn !== today;
  }

  recordCheckIn(): CheckInData {
    const today = new Date().toISOString().split('T')[0];
    const existing = this.getCheckInData();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (existing.lastCheckIn === yesterdayStr) {
      newStreak = existing.streak + 1;
    }

    const newHistory = [...existing.history, today];

    const newData: CheckInData = {
      lastCheckIn: today,
      streak: newStreak,
      history: newHistory
    };

    this.saveCheckInData(newData);
    return newData;
  }

  getCheckInData(): CheckInData {
    if (typeof window === 'undefined') {
      return {
        lastCheckIn: '',
        streak: 0,
        history: []
      };
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return {
          lastCheckIn: '',
          streak: 0,
          history: []
        };
      }

      return JSON.parse(stored);
    } catch (error) {
      console.error('Error reading check-in data:', error);
      return {
        lastCheckIn: '',
        streak: 0,
        history: []
      };
    }
  }

  calculateStreak(history: string[]): number {
    if (history.length === 0) return 0;

    const sortedHistory = [...history].sort().reverse();
    let streak = 1;
    const today = new Date();

    for (let i = 0; i < sortedHistory.length - 1; i++) {
      const current = new Date(sortedHistory[i]);
      const next = new Date(sortedHistory[i + 1]);
      const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  private saveCheckInData(data: CheckInData): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving check-in data:', error);
    }
  }
}
