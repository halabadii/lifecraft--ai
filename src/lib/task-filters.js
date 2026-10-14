export const taskIsOverdue = (task, today) => Boolean(task && !task.done && task.dueDate && task.dueDate < today);
export const taskPriority = task => ['high', 'medium', 'low'].includes(task?.priority) ? task.priority : 'medium';
