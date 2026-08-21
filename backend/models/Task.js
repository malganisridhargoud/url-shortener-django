import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueDate: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true });

taskSchema.index({ user: 1, status: 1, priority: 1, dueDate: 1 });
taskSchema.index({ user: 1, title: 1 });

export default mongoose.model('Task', taskSchema);
