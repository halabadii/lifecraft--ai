const done = item => Boolean(item?.done);
const titleOf = item => String(item?.title || '').toLowerCase();

function xpFor(items, points = 25) {
  return (Array.isArray(items) ? items : []).filter(done).length * points;
}

function matching(items, words) {
  return (Array.isArray(items) ? items : []).filter(item =>
    words.some(word => titleOf(item).includes(word))
  );
}

export function getProgression(state = {}) {
  const tasks = Array.isArray(state.tasks) ? state.tasks : [];
  const habits = Array.isArray(state.habits) ? state.habits : [];
  const study = Array.isArray(state.study) ? state.study : [];
  const skills = Array.isArray(state.skills) ? state.skills : [];
  const money = Array.isArray(state.money) ? state.money : [];
  const moneyTransactions = Array.isArray(state.moneyTransactions) ? state.moneyTransactions : [];
  const wellnessLogs = state.wellnessLogs && typeof state.wellnessLogs === 'object' ? state.wellnessLogs : {};
  const wellnessCheckins = Object.values(wellnessLogs).reduce((sum, log) => sum + Object.values(log || {}).filter(Boolean).length, 0);
  const learningModuleCompletions = skills.reduce((sum, skill) => sum + (Array.isArray(skill?.modules) ? skill.modules.filter(done).length : 0), 0);
  const goals = Array.isArray(state.goals) ? state.goals : [];
  const focusSessions = Array.isArray(state.focusSessions) ? state.focusSessions : [];
  const completedTasks = tasks.filter(done).length;
  const completedStudy = study.filter(done).length;
  const completedGoals = goals.filter(goal => Number(goal?.progress) >= 100 || (Array.isArray(goal?.milestones) && goal.milestones.length > 0 && goal.milestones.every(step => step.done))).length;
  const habitCheckins = habits.reduce((sum, habit) => sum + Object.values(habit?.history || {}).filter(Boolean).length, 0);

  const bodyWords = ['رياضة', 'تمرين', 'مشي', 'صحة', 'نوم', 'ماء', 'جسم', 'workout', 'walk', 'fitness'];
  const socialWords = ['تواصل', 'حديث', 'كلام', 'اجتماع', 'صديق', 'اجتماعي', 'عرض', 'social', 'speak'];
  const financeWords = ['مال', 'دخل', 'بيع', 'مشروع', 'ادخار', 'ميزانية', 'عمل', 'finance', 'money', 'business'];
  const bodyHabits = matching(habits, bodyWords);
  const bodyTasks = matching(tasks, bodyWords);
  const socialSkills = matching(skills, socialWords);
  const socialTasks = matching(tasks, socialWords);
  const financeTasks = matching(tasks, financeWords);
  const financeGoals = matching(goals, financeWords);

  const domains = [
    { id: 'body', name: 'القوة البدنية', icon: '💪', xp: xpFor(bodyHabits, 20) + xpFor(bodyTasks, 15) + wellnessCheckins * 5 },
    { id: 'knowledge', name: 'المعرفة', icon: '📚', xp: xpFor(study, 30) + xpFor(skills, 15) + learningModuleCompletions * 10 },
    { id: 'discipline', name: 'الانضباط', icon: '🔥', xp: xpFor(tasks, 10) + xpFor(habits, 15) + focusSessions.length * 10 + wellnessCheckins * 2 },
    { id: 'social', name: 'المهارات الاجتماعية', icon: '🗣️', xp: xpFor(socialSkills, 25) + xpFor(socialTasks, 15) },
    { id: 'finance', name: 'الإدارة المالية', icon: '💰', xp: xpFor(money, 20) + xpFor(financeTasks, 15) + xpFor(financeGoals, 10) + moneyTransactions.length * 5 }
  ].map(domain => ({
    ...domain,
    level: Math.floor(domain.xp / 100) + 1,
    progress: domain.xp % 100,
    nextLevelXp: 100
  }));

  const totalXp = domains.reduce((sum, domain) => sum + domain.xp, 0);
  const achievements = [
    { id: 'first-task', title: 'أول إنجاز', icon: '🌱', detail: 'أكمل أول مهمة', unlocked: completedTasks >= 1 },
    { id: 'ten-tasks', title: 'صانع الإنجاز', icon: '⚡', detail: 'أكمل 10 مهام', unlocked: completedTasks >= 10 },
    { id: 'first-focus', title: 'بداية التركيز', icon: '⏳', detail: 'أكمل أول جلسة تركيز', unlocked: focusSessions.length >= 1 },
    { id: 'five-focus', title: 'عقل حاضر', icon: '🧠', detail: 'أكمل 5 جلسات تركيز', unlocked: focusSessions.length >= 5 },
    { id: 'first-goal', title: 'وصلت للنهاية', icon: '🎯', detail: 'أكمل هدفًا مسجلًا', unlocked: completedGoals >= 1 },
    { id: 'study-five', title: 'متعلم مستمر', icon: '📚', detail: 'أكمل 5 عناصر دراسة', unlocked: completedStudy >= 5 },
    { id: 'habit-seven', title: 'أسبوع من الالتزام', icon: '🔥', detail: 'سجّل 7 إنجازات عادات', unlocked: habitCheckins >= 7 },
    { id: 'balanced', title: 'توازن المجالات', icon: '⚖️', detail: 'ارفع مستويين من المجالات إلى المستوى 2', unlocked: domains.filter(domain => domain.level >= 2).length >= 2 },
    { id: 'wellness-start', title: 'اهتمام بالنفس', icon: '🌿', detail: 'سجّل أول خطوة في روتين العناية', unlocked: wellnessCheckins >= 1 },
    { id: 'learning-start', title: 'تعلم بالتطبيق', icon: '🧩', detail: 'أكمل أول وحدة من مسار مهارة', unlocked: learningModuleCompletions >= 1 },
    { id: 'money-log', title: 'وعي مالي', icon: '🧾', detail: 'سجّل أول عملية في الإدارة المالية', unlocked: moneyTransactions.length >= 1 }
  ].map(item => ({ ...item, unlocked: Boolean(item.unlocked) }));
  return {
    domains,
    achievements,
    totalXp,
    level: Math.floor(totalXp / 500) + 1,
    completedItems: [tasks, habits, study, skills, money, goals].reduce(
      (sum, items) => sum + items.filter(item => done(item) || Number(item?.progress) >= 100).length, 0
    )
  };
}
