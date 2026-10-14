export const focusDateKey = (date = new Date()) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const formatFocusTime = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
export function getFocusStats(sessions = [], todayKey) {
  const todaySessions = sessions.filter(session => session.dateKey === todayKey);
  const cutoff = new Date(`${todayKey}T12:00:00Z`);
  cutoff.setUTCDate(cutoff.getUTCDate() - 6);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  const weekSessions = sessions.filter(session => session.dateKey >= cutoffKey && session.dateKey <= todayKey);
  return {
    todaySessions: todaySessions.length,
    todayMinutes: todaySessions.reduce((sum, session) => sum + (Number(session.durationMinutes) || 0), 0),
    weekMinutes: weekSessions.reduce((sum, session) => sum + (Number(session.durationMinutes) || 0), 0)
  };
}
