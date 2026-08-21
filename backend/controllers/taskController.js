import Task from '../models/Task.js';

const allowed = ['title', 'description', 'status', 'priority', 'dueDate'];
const taskValues = (body) => Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));

export async function listTasks(req, res, next) {
  try {
    const { status, priority, search, sort = 'dueDate', order = 'asc' } = req.query;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const query = { user: req.user._id };
    if (['Todo', 'In Progress', 'Done'].includes(status)) query.status = status;
    if (['Low', 'Medium', 'High'].includes(priority)) query.priority = priority;
    if (search?.trim()) query.title = { $regex: search.trim(), $options: 'i' };
    const totalTasks = await Task.countDocuments(query);
    let tasks;
    if (sort === 'priority') {
      const priorityOrder = order === 'asc' ? ['Low', 'Medium', 'High'] : ['High', 'Medium', 'Low'];
      tasks = await Task.aggregate([{ $match: query }, { $addFields: { priorityRank: { $indexOfArray: [priorityOrder, '$priority'] } } }, { $sort: { priorityRank: 1, dueDate: 1 } }, { $skip: (page - 1) * limit }, { $limit: limit }]);
    } else {
      tasks = await Task.find(query).sort({ dueDate: order === 'desc' ? -1 : 1 }).skip((page - 1) * limit).limit(limit);
    }
    res.json({ success: true, tasks, page, limit, totalPages: Math.max(1, Math.ceil(totalTasks / limit)), totalTasks });
  } catch (err) { next(err); }
}

export async function createTask(req, res, next) {
  try {
    if (!req.body.title?.trim() || !req.body.dueDate) return res.status(400).json({ success: false, message: 'Title and due date are required' });
    const task = await Task.create({ ...taskValues(req.body), user: req.user._id });
    res.status(201).json({ success: true, task });
  } catch (err) { next(err); }
}

async function ownTask(req) { return Task.findOne({ _id: req.params.id, user: req.user._id }); }
export async function getTask(req, res, next) { try { const task = await ownTask(req); if (!task) return res.status(404).json({ success: false, message: 'Task not found' }); res.json({ success: true, task }); } catch (err) { next(err); } }
export async function updateTask(req, res, next) { try { const task = await ownTask(req); if (!task) return res.status(404).json({ success: false, message: 'Task not found' }); Object.assign(task, taskValues(req.body)); await task.save(); res.json({ success: true, task }); } catch (err) { next(err); } }
export async function deleteTask(req, res, next) { try { const task = await ownTask(req); if (!task) return res.status(404).json({ success: false, message: 'Task not found' }); await task.deleteOne(); res.json({ success: true, message: 'Task deleted' }); } catch (err) { next(err); } }
export async function completeTask(req, res, next) { try { const task = await ownTask(req); if (!task) return res.status(404).json({ success: false, message: 'Task not found' }); task.status = 'Done'; await task.save(); res.json({ success: true, task }); } catch (err) { next(err); } }
