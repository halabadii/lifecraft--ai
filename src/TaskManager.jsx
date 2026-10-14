import React, { useMemo, useState } from 'react';
import { taskIsOverdue, taskPriority } from './lib/task-filters.js';

const localDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const filters = [
  ['all', 'الكل'], ['high', 'أولوية عالية'], ['medium', 'متوسطة'],
  ['low', 'منخفضة'], ['upcoming', 'قادمة'], ['overdue', 'متأخرة'], ['done', 'مكتملة']
];

export default function TaskManager({ s, save, toggle, remove }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(localDate());
  const [duration, setDuration] = useState('25');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const tasks = s.tasks || [];
  const today = localDate();

  const overdue = task => taskIsOverdue(task, today);
  const counts = useMemo(() => ({
    all: tasks.length,
    done: tasks.filter(t => t.done).length,
    overdue: tasks.filter(overdue).length,
    upcoming: tasks.filter(t => !t.done && t.dueDate && t.dueDate >= today).length
  }), [tasks, today]);

  const visible = tasks.filter(task => {
    if (query.trim() && !String(task.title || '').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())) return false;
    if (filter === 'all') return true;
    if (filter === 'done') return task.done;
    if (filter === 'overdue') return overdue(task);
    if (filter === 'upcoming') return !task.done && task.dueDate && task.dueDate >= today;
    return !task.done && taskPriority(task) === filter;
  }).sort((a, b) => Number(a.done) - Number(b.done) ||
    (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31'));

  const addTask = () => {
    const clean = title.trim();
    if (!clean) { setMessage('اكتب اسم المهمة أولًا.'); return; }
    const duplicate = tasks.some(t => !t.done && String(t.title || '').trim().toLocaleLowerCase() === clean.toLocaleLowerCase());
    if (duplicate) { setMessage('هذه المهمة موجودة بالفعل وغير مكتملة.'); return; }
    save({ ...s, tasks: [...tasks, {
      id: globalThis.crypto?.randomUUID?.() || String(Date.now() + Math.random()),
      title: clean, done: false, priority, dueDate, duration: Number(duration) || 25,
      createdAt: new Date().toISOString()
    }] });
    setTitle('');
    setMessage('تمت إضافة المهمة.');
  };

  return <section className="panel task-manager">
    <div className="section-title">
      <h3>✅ مركز المهام</h3>
      <span>{counts.done}/{counts.all} مكتملة</span>
    </div>
    <div className="task-form">
      <label>اسم المهمة
        <input value={title} onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="اكتب مهمة واضحة وقابلة للإنجاز" />
      </label>
      <div className="task-toolbar">
        <label>الأولوية
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="high">عالية</option><option value="medium">متوسطة</option><option value="low">منخفضة</option>
          </select>
        </label>
        <label>الموعد
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </label>
        <label>المدة
          <select value={duration} onChange={e => setDuration(e.target.value)}>
            {['5','10','15','25','30','45','60','90'].map(v => <option key={v} value={v}>{v} دقيقة</option>)}
          </select>
        </label>
        <button onClick={addTask}>＋ إضافة المهمة</button>
      </div>
      {message && <p className="task-message" role="status">{message}</p>}
    </div>
    <div className="task-filters">
      <input className="task-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="🔎 ابحث في مهامك..." aria-label="البحث في المهام" />
      {filters.map(([value, label]) => <button key={value}
        className={filter === value ? 'active-filter' : ''}
        onClick={() => setFilter(value)}>{label}{value === 'overdue' ? ` (${counts.overdue})` : ''}</button>)}
    </div>
    {visible.length ? visible.map(task => <div key={task.id}
      className={'task-row ' + (task.done ? 'task-complete' : '') + (overdue(task) ? ' task-overdue' : '')}>
      <button className="check" onClick={() => toggle('tasks', task.id)}
        aria-label={task.done ? 'إلغاء إكمال المهمة' : 'إكمال المهمة'}>{task.done ? '✓' : '○'}</button>
      <div className="task-row-main">
        <b>{task.title}</b>
        <div className="task-meta">
          <span className={'priority priority-' + taskPriority(task)}>{taskPriority(task) === 'high' ? 'أولوية عالية' : taskPriority(task) === 'low' ? 'أولوية منخفضة' : 'أولوية متوسطة'}</span>
          {task.dueDate && <span>{overdue(task) ? 'متأخرة · ' : 'موعد: '}{task.dueDate}</span>}
          {task.duration && <span>⏱ {task.duration} دقيقة</span>}
        </div>
      </div>
      <button className="delete" onClick={() => remove('tasks', task.id)} aria-label="حذف المهمة">×</button>
    </div>) : <p className="muted">لا توجد مهام ضمن هذا التصنيف.</p>}
    <p className="muted">تبقى بيانات المهام على جهازك ما لم تفعّل المزامنة السحابية بنفسك.</p>
  </section>;
}
