import React, { useState } from 'react';

const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const makeId = () => globalThis.crypto?.randomUUID?.() || String(Date.now()+Math.random());
const starterSteps = title => [
  { id: makeId(), title: 'حدد النتيجة النهائية ومقياس النجاح', done: false },
  { id: makeId(), title: 'نفّذ أول خطوة صغيرة نحو ' + title, done: false },
  { id: makeId(), title: 'راجع التقدم وحدد الخطوة التالية', done: false }
];

export default function GoalCenter({ s, save, setP }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('شخصي');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const goals = s.goals || [];
  const tasks = s.tasks || [];
  const progressOf = goal => {
    const steps = Array.isArray(goal.milestones) ? goal.milestones : [];
    if (steps.length) return Math.round(steps.filter(step => step.done).length / steps.length * 100);
    return Math.max(0, Math.min(100, Number(goal.progress) || 0));
  };
  const addGoal = () => {
    const clean = title.trim();
    if (!clean) { setMessage('اكتب اسم الهدف أولًا.'); return; }
    const duplicate = goals.some(goal => String(goal.title || '').trim().toLocaleLowerCase() === clean.toLocaleLowerCase());
    if (duplicate) { setMessage('هذا الهدف موجود بالفعل.'); return; }
    save({ ...s, goals: [...goals, { id: makeId(), title: clean, category, deadline, description: description.trim(), createdAt: new Date().toISOString(), milestones: starterSteps(clean), progress: 0, done: false }] });
    setTitle(''); setDescription(''); setDeadline(''); setMessage('تم إنشاء الهدف مع ثلاث مراحل أولية.');
  };
  const toggleStep = (goal, stepId) => {
    const milestones = (goal.milestones || []).map(step => step.id === stepId ? { ...step, done: !step.done, completedAt: !step.done ? new Date().toISOString() : null } : step);
    const progress = Math.round(milestones.filter(step => step.done).length / Math.max(1, milestones.length) * 100);
    save({ ...s, goals: goals.map(item => item.id === goal.id ? { ...item, milestones, progress, done: progress === 100 } : item) });
  };
  const addStep = goal => {
    const name = globalThis.prompt('اكتب اسم المرحلة الجديدة');
    if (!name?.trim()) return;
    const milestones = [...(goal.milestones || []), { id: makeId(), title: name.trim(), done: false }];
    const progress = Math.round(milestones.filter(step => step.done).length / milestones.length * 100);
    save({ ...s, goals: goals.map(item => item.id === goal.id ? { ...item, milestones, progress, done: false } : item) });
  };
  const createTask = (goal, step) => {
    const exists = tasks.some(task => !task.done && (task.milestoneId === step.id || String(task.title || '').trim().toLocaleLowerCase() === step.title.trim().toLocaleLowerCase()));
    if (exists) { setMessage('لديك مهمة مفتوحة مرتبطة بهذه الخطوة أو تحمل الاسم نفسه.'); return; }
    save({ ...s, tasks: [...tasks, { id: makeId(), title: step.title, done: false, priority: 'medium', dueDate: goal.deadline || todayKey(), duration: 25, goalId: goal.id, milestoneId: step.id, createdAt: new Date().toISOString() }] });
    setMessage('أُضيفت الخطوة إلى مركز المهام.');
  };
  const removeGoal = goal => {
    if (!globalThis.confirm('حذف هذا الهدف ومراحله؟ لن تُحذف المهام التي أُنشئت منه.')) return;
    save({ ...s, goals: goals.filter(item => item.id !== goal.id) });
  };
  return <div className="goal-center">
    <section className="hero"><span className="eyebrow">GOAL SYSTEM · نظام الأهداف</span><h1>حوّل الهدف إلى خطوات قابلة للتنفيذ.</h1><p>قسّم الهدف إلى مراحل، حدّد موعدًا، وسجّل إنجازك. نسبة التقدم هنا تُحسب من المراحل المكتملة عندما تكون المراحل متوفرة.</p><div className="hero-meta"><span>🎯 {goals.length} هدف</span><span>✅ {goals.filter(goal => progressOf(goal) === 100).length} مكتمل</span><span>🧩 {goals.reduce((sum, goal) => sum + (goal.milestones || []).length, 0)} مرحلة</span></div></section>
    <section className="panel"><h3>＋ إنشاء هدف</h3><div className="goal-create">
      <label>اسم الهدف<input value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && addGoal()} placeholder="مثال: إنهاء فصل دراسي" /></label>
      <label>المجال<select value={category} onChange={e => setCategory(e.target.value)}>{['شخصي','دراسة','صحة','مال','مهارات','عبادة','علاقات'].map(item => <option key={item}>{item}</option>)}</select></label>
      <label>الموعد النهائي<input type="date" min={todayKey()} value={deadline} onChange={e => setDeadline(e.target.value)} /></label>
      <label className="goal-description">وصف مختصر (اختياري)<input value={description} onChange={e => setDescription(e.target.value)} placeholder="كيف ستعرف أنك حققت الهدف؟" /></label>
      <button onClick={addGoal}>＋ إنشاء الهدف</button>
    </div>{message && <p className="task-message" role="status">{message}</p>}</section>
    {goals.length ? goals.map(goal => {
      const steps = Array.isArray(goal.milestones) ? goal.milestones : [];
      const progress = progressOf(goal);
      return <section className="panel goal-detail" key={goal.id}>
        <div className="goal-detail-head"><div><span className="goal-category">{goal.category || 'شخصي'}</span><h3>{goal.title}</h3>{goal.description && <p className="muted">{goal.description}</p>}</div><button className="delete" onClick={() => removeGoal(goal)} aria-label="حذف الهدف">×</button></div>
        <div className="goal-progress-line"><div className="progress"><span style={{width: progress + '%'}} /></div><strong>{progress}%</strong></div>
        <div className="goal-meta">{goal.deadline && <span>📅 الموعد: {goal.deadline}</span>}<span>{progress === 100 ? '🎉 اكتمل الهدف' : 'المتبقي: ' + (steps.filter(step => !step.done).length || (steps.length ? 0 : '—')) + (steps.length ? ' مراحل' : '')}</span></div>
        {steps.length ? <div className="goal-milestones">{steps.map((step, index) => {
          const taskExists = tasks.some(task => !task.done && (task.milestoneId === step.id || String(task.title || '').trim().toLocaleLowerCase() === step.title.trim().toLocaleLowerCase()));
          return <div className={'goal-step ' + (step.done ? 'is-complete' : '')} key={step.id}><button className="check" onClick={() => toggleStep(goal, step.id)} aria-label={step.done ? 'إلغاء إنجاز المرحلة' : 'إنجاز المرحلة'}>{step.done ? '✓' : '○'}</button><span className="goal-step-index">{index + 1}</span><span className="goal-step-title">{step.title}</span>{!step.done && <button className="goal-step-task" onClick={() => createTask(goal, step)}>{taskExists ? 'مهمة موجودة' : '＋ مهمة'}</button>}</div>;
        })}</div> : <p className="muted">هذا هدف قديم بلا مراحل. أضف مرحلة لتتبع التقدم التفصيلي.</p>}
        <div className="goal-actions"><button onClick={() => addStep(goal)}>＋ إضافة مرحلة</button><button onClick={() => setP('tasks')}>فتح مركز المهام ↗</button></div>
      </section>;
    }) : <section className="panel"><p className="muted">ابدأ بهدف واحد فقط. ستُنشأ له ثلاث مراحل قابلة للتعديل تلقائيًا.</p></section>}
  </div>;
}
