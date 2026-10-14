import { describe, expect, it } from 'vitest';
import { getHabitStats } from './habits.js';

describe('habit streak statistics',()=>{
  it('counts today, current streak, and best streak',()=>{
    expect(getHabitStats({history:{'2026-10-12':true,'2026-10-13':true,'2026-10-14':true}},'2026-10-14')).toEqual({total:3,current:3,best:3,doneToday:true});
  });
  it('keeps the previous streak alive until today ends',()=>{
    expect(getHabitStats({history:{'2026-10-13':true,'2026-10-10':true,'2026-10-11':true}},'2026-10-14')).toEqual({total:3,current:1,best:2,doneToday:false});
  });
  it('does not count unchecked days and preserves the best historical streak',()=>{
    expect(getHabitStats({history:{'2026-10-01':true,'2026-10-02':true,'2026-10-04':true}},'2026-10-14')).toEqual({total:3,current:0,best:2,doneToday:false});
  });
  it('handles empty or malformed history',()=>{
    expect(getHabitStats({history:null},'2026-10-14')).toEqual({total:0,current:0,best:0,doneToday:false});
  });
});
