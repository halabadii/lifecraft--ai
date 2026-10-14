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
  const goals = Array.isArray(state.goals) ? state.goals : [];

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
    { id: 'body', name: 'القوة البدنية', icon: '💪', xp: xpFor(bodyHabits, 20) + xpFor(bodyTasks, 15) },
    { id: 'knowledge', name: 'المعرفة', icon: '📚', xp: xpFor(study, 30) + xpFor(skills, 15) },
    { id: 'discipline', name: 'الانضباط', icon: '🔥', xp: xpFor(tasks, 10) + xpFor(habits, 15) },
    { id: 'social', name: 'المهارات الاجتماعية', icon: '🗣️', xp: xpFor(socialSkills, 25) + xpFor(socialTasks, 15) },
    { id: 'finance', name: 'الإدارة المالية', icon: '💰', xp: xpFor(money, 20) + xpFor(financeTasks, 15) + xpFor(financeGoals, 10) }
  ].map(domain => ({
    ...domain,
    level: Math.floor(domain.xp / 100) + 1,
    progress: domain.xp % 100,
    nextLevelXp: 100
  }));

  const totalXp = domains.reduce((sum, domain) => sum + domain.xp, 0);
  return {
    domains,
    totalXp,
    level: Math.floor(totalXp / 500) + 1,
    completedItems: [tasks, habits, study, skills, money, goals].reduce(
      (sum, items) => sum + items.filter(item => done(item) || Number(item?.progress) >= 100).length, 0
    )
  };
}
