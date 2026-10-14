import React from 'react';
import { focusDateKey } from './lib/focus.js';

const dayKey = date => focusDateKey(date);
const shiftDay = (date, amount) => { const d = new Date(date); d.setDate(d.getDate() + amount); return d; };
const shortDay = date => new Intl.DateTimeFormat('ar-JO', { weekday: 'short' }).format(date);

export default function WeeklyReview({ s }) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = shiftDay(today, index - 6);
    const key = dayKey(date);
    const sessions = (s.focusSessions || []).filter(item => item.dateKey === key);
    const habitCheckins = (s.habits || []).filter(habit => Boolean(habit.history?.[key])).length;
    return { key, label: shortDay(date), date: key.slice(5), focus: sessions.reduce((sum, item) => sum + (Number(item.durationMinutes) || 0), 0), sessions: sessions.length, habits: habitCheckins };
  });
  const totalFocus = days.reduce((sum, day) => sum + day.focus, 0);
  const totalSessions = days.reduce((sum, day) => sum + day.sessions, 0);
  const totalHabitCheckins = days.reduce((sum, day) => sum + day.habits, 0);
  const maxFocus = Math.max(1, ...days.map(day => day.focus));
  const completedTasks = (s.tasks || []).filter(task => task.done).length;
  const openTasks = (s.tasks || []).filter(task => !task.done).length;
  const bestDay = [...days].sort((a, b) => b.focus - a.focus)[0];
  return <section className="panel weekly-review">
    <div className="section-title"><h3>📈 مراجعة الأسبوع</h3><span>آخر 7 أيام · من بياناتك المسجلة</span></div>
    <div className="focus-stats weekly-metrics">
      <div><strong>{totalFocus}</strong><span>دقيقة تركيز</span></div>
      <div><strong>{totalSessions}</strong><span>جلسة مكتملة</span></div>
      <div><strong>{totalHabitCheckins}</strong><span>إنجاز عادة مسجّل</span></div>
    </div>
    <h4>التركيز يومًا بيوم</h4>
    <div className="weekly-bars" role="img" aria-label="مخطط دقائق التركيز لكل يوم خلال آخر سبعة أيام">
      {days.map(day => <div className="weekly-bar-column" key={day.key}>
        <strong>{day.focus}</strong>
        <div className="weekly-bar-track"><span style={{ height: (day.focus / maxFocus * 100) + '%' }} /></div>
        <span className="weekly-day">{day.label}</span>
        <small>{day.date}</small>
      </div>)}
    </div>
    <div className="weekly-insights">
      <h4>ماذا تقول بياناتك؟</h4>
      {totalFocus > 0 ? <p>أكثر يوم تركيزًا ضمن الفترة هو <b>{bestDay.label}</b> ({bestDay.focus} دقيقة). جرّب تكرار الظروف التي ساعدتك في ذلك اليوم.</p> : <p>لم تُسجّل جلسات تركيز مكتملة خلال هذه الفترة بعد. ابدأ بجلسة قصيرة، وستظهر هنا بياناتك الفعلية.</p>}
      <div className="weekly-task-summary"><span>المهام المكتملة المسجلة حاليًا</span><b>{completedTasks}</b><span>المهام المتبقية</span><b>{openTasks}</b></div>
      <p className="muted">هذه لوحة متابعة وليست تقييمًا علميًا للشخصية أو للصحة. لا تستنتج البيانات غير المسجلة، واستخدم الأرقام لتعديل خطتك بلطف لا لمعاقبة نفسك.</p>
    </div>
  </section>;
}
