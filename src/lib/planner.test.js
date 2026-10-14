import { describe, expect, it } from 'vitest';
import { defaultState, normalizeState, makePlan } from './planner.js';

describe('ASCEND local life planner', () => {
  it('normalizes missing data without losing default profile fields', () => {
    const state = normalizeState({ profile: { goal: 'تعلم البرمجة' }, tasks: 'invalid' });
    expect(state.profile.goal).toBe('تعلم البرمجة');
    expect(state.profile.destination).toBe(defaultState.profile.destination);
    expect(state.tasks).toEqual([]);
    expect(state.goals).toEqual([]);
  });

  it('creates three practical daily actions from the profile', () => {
    const plan = makePlan({ goal: 'الدراسة والجامعة', hours: 3 });
    expect(plan.today).toHaveLength(3);
    expect(plan.title).toContain('الدراسة والجامعة');
    expect(plan.next).toBeTruthy();
  });

  it('keeps the daily time estimate within supported limits', () => {
    const low = makePlan({ goal: 'تنظيم الحياة', hours: 0 });
    const high = makePlan({ goal: 'تنظيم الحياة', hours: 99 });
    expect(low.context.hours).toBe(4);
    expect(high.context.hours).toBe(24);
  });
});
