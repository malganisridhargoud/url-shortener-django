import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { completeTask, createTask, deleteTask, getTask, listTasks, updateTask } from '../controllers/taskController.js';
const router = Router();
router.use(protect);
router.route('/').get(listTasks).post(createTask);
router.patch('/:id/complete', completeTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);
export default router;
