import { describe, expect, it } from 'vitest';
import { getProgression } from './progression.js';

describe('ASCEND character progression', () => {
  it('starts at level one when no progress is recorded', () => {
    const result = getProgression({});
    expect(result.level).toBe(1);
    expect(result.totalXp).toBe(0);
    expect(result.domains).toHaveLength(5);
  });

  it('awards knowledge XP for completed study sessions', () => {
    const result = getProgression({ study: [{ title: 'رياضيات', done: true }] });
    const knowledge = result.domains.find(domain => domain.id === 'knowledge');
    expect(knowledge.xp).toBe(30);
    expect(knowledge.level).toBe(1);
  });

  it('does not award XP for incomplete tasks', () => {
    const result = getProgression({ tasks: [{ title: 'مهمة غير مكتملة', done: false }] });
    expect(result.totalXp).toBe(0);
    expect(result.completedItems).toBe(0);
  });

  it('levels up when recorded achievements cross the XP threshold', () => {
    const tasks = Array.from({ length: 10 }, (_, i) => ({ id: String(i), title: 'مهمة ' + i, done: true }));
    const result = getProgression({ tasks });
    const discipline = result.domains.find(domain => domain.id === 'discipline');
    expect(discipline.xp).toBe(100);
    expect(discipline.level).toBe(2);
  });

  it('unlocks achievement badges from recorded progress', () => {
    const result = getProgression({
      tasks: [{ title: 'مهمة', done: true }],
      focusSessions: [{ durationMinutes: 25, dateKey: '2026-10-14' }],
      goals: [{ title: 'هدف', progress: 100 }]
    });
    expect(result.achievements.find(item => item.id === 'first-task').unlocked).toBe(true);
    expect(result.achievements.find(item => item.id === 'first-focus').unlocked).toBe(true);
    expect(result.achievements.find(item => item.id === 'first-goal').unlocked).toBe(true);
    expect(result.achievements.find(item => item.id === 'ten-tasks').unlocked).toBe(false);
  });

  it('awards discipline XP for completed focus sessions', () => {
    const result = getProgression({ focusSessions: [{ durationMinutes: 25 }, { durationMinutes: 15 }] });
    expect(result.domains.find(domain => domain.id === 'discipline').xp).toBe(20);
  });
});
