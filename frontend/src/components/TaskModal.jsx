import { useState } from 'react';

export const emptyTask = {
  title: '',
  description: '',
  status: 'Todo',
  priority: 'Medium',
  dueDate: ''
};

export default function TaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState(task || emptyTask);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const editing = Boolean(task?._id);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-wrap" role="dialog" aria-modal="true" aria-label={editing ? 'Edit task' : 'Create task'}>
      <form className="modal" onSubmit={handleSubmit}>
        <div className="modal-title">
          <div>
            <p className="eyebrow">TASK DETAILS</p>
            <h2>{editing ? 'Edit task' : 'Create a task'}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close task form">×</button>
        </div>

        {error && <div className="error">{error}</div>}

        <label>Title<input name="title" required value={form.title} onChange={updateField} placeholder="What needs to be done?" /></label>
        <label>Description<textarea name="description" value={form.description} onChange={updateField} placeholder="Add a little context…" /></label>
        <div className="field-grid">
          <label>Status<select name="status" value={form.status} onChange={updateField}><option>Todo</option><option>In Progress</option><option>Done</option></select></label>
          <label>Priority<select name="priority" value={form.priority} onChange={updateField}><option>Low</option><option>Medium</option><option>High</option></select></label>
        </div>
        <label>Due date<input name="dueDate" required type="date" value={form.dueDate ? form.dueDate.slice(0, 10) : ''} onChange={updateField} /></label>

        <div className="modal-actions">
          <button type="button" className="secondary" onClick={onClose}>Cancel</button>
          <button className="primary" disabled={saving}>{saving ? 'Saving…' : 'Save task'}</button>
        </div>
      </form>
    </div>
  );
}
