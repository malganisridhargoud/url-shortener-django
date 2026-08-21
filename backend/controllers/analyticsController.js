import Task from '../models/Task.js';

export async function getAnalytics(req, res, next) {
  try {
    const rows = await Task.aggregate([{ $match: { user: req.user._id } }, { $group: { _id: '$status', count: { $sum: 1 } } }]);
    const counts = Object.fromEntries(rows.map((row) => [row._id, row.count]));
    const totalTasks = rows.reduce((sum, row) => sum + row.count, 0);
    const completedTasks = counts.Done || 0;
    res.json({ success: true, totalTasks, completedTasks, pendingTasks: totalTasks - completedTasks, completionPercentage: totalTasks ? Number(((completedTasks / totalTasks) * 100).toFixed(1)) : 0, byStatus: { Todo: counts.Todo || 0, 'In Progress': counts['In Progress'] || 0, Done: completedTasks } });
  } catch (err) { next(err); }
}
