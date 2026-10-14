import { describe, expect, it } from 'vitest';
import { formatFocusTime, getFocusStats } from './focus.js';

describe('focus utilities', () => {
  it('formats a countdown as minutes and seconds', () => {
    expect(formatFocusTime(1505)).toBe('25:05');
    expect(formatFocusTime(0)).toBe('00:00');
  });
  it('summarizes today and the rolling seven-day window', () => {
    const sessions = [
      { dateKey: '2026-10-14', durationMinutes: 25 },
      { dateKey: '2026-10-10', durationMinutes: 15 },
      { dateKey: '2026-10-06', durationMinutes: 50 },
      { dateKey: '2026-10-14', durationMinutes: 10 }
    ];
    expect(getFocusStats(sessions, '2026-10-14')).toEqual({ todaySessions: 2, todayMinutes: 35, weekMinutes: 50 });
  });
  it('handles missing or invalid durations safely', () => {
    expect(getFocusStats([{ dateKey: '2026-10-14', durationMinutes: 'bad' }], '2026-10-14').todayMinutes).toBe(0);
  });
});
