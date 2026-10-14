import React, { useEffect, useRef, useState } from 'react';
import { focusDateKey, formatFocusTime, getFocusStats } from './lib/focus.js';

export default function FocusRoom({ s, save }) {
  const [minutes, setMinutes] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState('focus');
  const [taskId, setTaskId] = useState('');
  const [message, setMessage] = useState('');
  const completedRef = useRef(false);
  const sessions = s.focusSessions || [];
  const tasks = (s.tasks || []).filter(task => !task.done);
  const today = focusDateKey();
  const stats = getFocusStats(sessions, today);
  const todaySessions = sessions.filter(session => session.dateKey === today);
  const todayMinutes = stats.todayMinutes;
  const week = stats.weekMinutes;

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => setRemaining(value => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!running || remaining !== 0) return;
    setRunning(false);
    if (mode === 'focus' && !completedRef.current) {
      completedRef.current = true;
      const task = tasks.find(item => item.id === taskId);
      const entry = {
        id: globalThis.crypto?.randomUUID?.() || String(Date.now()),
        dateKey: today,
        durationMinutes: minutes,
        completedAt: new Date().toISOString(),
        taskTitle: task?.title || ''
      };
      save({ ...s, focusSessions: [...sessions, entry] });
      setMessage('أحسنت! انتهت جلسة التركيز وسُجّلت في إحصائياتك 🎉');
    } else if (mode === 'break') {
      setMessage('انتهت الاستراحة. خذ نفسًا وارجع عندما تكون مستعدًا.');
    }
  }, [running, remaining, mode, minutes, taskId, s, save, sessions, tasks, today]);

  const chooseMinutes = value => {
    if (running) return;
    setMinutes(value);
    setRemaining(value * 60);
    setMessage('');
    completedRef.current = false;
  };
  const start = () => {
    if (remaining === 0) setRemaining(minutes * 60);
    completedRef.current = false;
    setMessage('');
    setRunning(true);
  };
  const reset = () => {
    setRunning(false);
    setRemaining(minutes * 60);
    completedRef.current = false;
    setMessage('');
  };
  const startBreak = () => {
    setRunning(false);
    setMode('break');
    setMinutes(5);
    setRemaining(5 * 60);
    completedRef.current = false;
    setMessage('استراحة قصيرة: ابتعد عن الشاشة واشرب ماءً.');
  };
  const returnToFocus = () => {
    setRunning(false);
    setMode('focus');
    setMinutes(25);
    setRemaining(25 * 60);
    completedRef.current = false;
    setMessage('');
  };

  return <section className="panel focus-room">
    <div className="section-title"><h3>⏳ غرفة التركيز</h3><span>وقتك يُسجّل عند إكمال الجلسة</span></div>
    <div className="focus-stats">
      <div><strong>{todaySessions.length}</strong><span>جلسات اليوم</span></div>
      <div><strong>{todayMinutes}</strong><span>دقيقة اليوم</span></div>
      <div><strong>{week}</strong><span>دقيقة خلال 7 أيام</span></div>
    </div>
    <div className="focus-clock">
      <span className="focus-mode-label">{mode === 'focus' ? 'جلسة تركيز' : 'استراحة قصيرة'}</span>
      <div className="focus-time" role="timer" aria-live="off">{formatFocusTime(remaining)}</div>
      <p>{mode === 'focus' ? 'اختَر مهمة واحدة، وأغلق المشتتات قدر الإمكان.' : 'استرح بهدوء؛ لا تحتاج إلى إنجاز شيء الآن.'}</p>
      {mode === 'focus' && <div className="focus-presets">{[15,25,50].map(value => <button key={value} disabled={running} className={minutes === value ? 'active-filter' : ''} onClick={() => chooseMinutes(value)}>{value} دقيقة</button>)}</div>}
      <div className="focus-controls">
        {!running ? <button onClick={start}>▶ {remaining === minutes * 60 ? 'ابدأ' : remaining === 0 ? 'ابدأ من جديد' : 'متابعة'}</button> : <button onClick={() => setRunning(false)}>Ⅱ إيقاف مؤقت</button>}
        <button onClick={reset}>↺ إعادة ضبط</button>
        {mode === 'focus' ? <button onClick={startBreak}>☕ استراحة 5 دقائق</button> : <button onClick={returnToFocus}>العودة للتركيز</button>}
      </div>
    </div>
    {mode === 'focus' && <label className="focus-task-label">المهمة التي تعمل عليها
      <select value={taskId} onChange={event => setTaskId(event.target.value)} disabled={running}>
        <option value="">جلسة عامة بدون مهمة محددة</option>
        {tasks.map(task => <option key={task.id} value={task.id}>{task.title}</option>)}
      </select>
    </label>}
    {message && <p className="focus-message" role="status">{message}</p>}
    <div className="focus-history">
      <h4>آخر الجلسات المكتملة</h4>
      {sessions.length ? [...sessions].slice(-5).reverse().map(session => <div className="focus-history-row" key={session.id}>
        <span>✓ {session.taskTitle || 'جلسة تركيز عامة'}</span><b>{session.durationMinutes} د</b><small>{session.dateKey}</small>
      </div>) : <p className="muted">ستظهر جلساتك هنا بعد إكمال أول جلسة.</p>}
    </div>
    <p className="muted">تُحفظ الجلسات المكتملة في بيانات ASCEND المحلية. إيقاف المؤقت أو إعادة ضبطه لا يُحتسب كجلسة مكتملة.</p>
  </section>;
}
