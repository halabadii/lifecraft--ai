const DAY=86400000;
const asDateKey=date=>{const d=new Date(date+'T00:00:00Z');return Number.isNaN(d.getTime())?null:d.toISOString().slice(0,10)};
const shift=(key,days)=>{const d=new Date(key+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10)};
export function getHabitStats(habit, todayKey=new Date().toISOString().slice(0,10)){
  const history=habit?.history&&typeof habit.history==='object'?habit.history:{};
  const completed=Object.keys(history).filter(key=>history[key]&&asDateKey(key)).sort();
  let best=0,run=0,previous=null;
  for(const key of completed){run=previous&&shift(previous,1)===key?run+1:1;best=Math.max(best,run);previous=key;}
  let cursor=history[todayKey]?todayKey:shift(todayKey,-1);
  let current=0;
  while(history[cursor]){current++;cursor=shift(cursor,-1);}
  return {total:completed.length,current,best,doneToday:Boolean(history[todayKey])};
}
