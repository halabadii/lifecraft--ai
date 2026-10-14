import { describe, expect, it } from 'vitest';
import { taskIsOverdue, taskPriority } from './task-filters.js';

describe('task filters', () => {
  it('marks only unfinished tasks with a past due date as overdue', () => {
    expect(taskIsOverdue({ done: false, dueDate: '2026-10-13' }, '2026-10-14')).toBe(true);
    expect(taskIsOverdue({ done: true, dueDate: '2026-10-13' }, '2026-10-14')).toBe(false);
    expect(taskIsOverdue({ done: false, dueDate: '2026-10-15' }, '2026-10-14')).toBe(false);
  });
  it('uses a safe default for unknown priorities', () => {
    expect(taskPriority({ priority: 'urgent' })).toBe('medium');
    expect(taskPriority({ priority: 'high' })).toBe('high');
  });
});
