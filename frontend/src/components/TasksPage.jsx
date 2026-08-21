import { useState } from 'react';
import { api } from '../services/api';
import { formatDate } from '../utils/formatters';

function Filters({ filters, onChange }) {
  const update = (event) => onChange({ ...filters, [event.target.name]: event.target.value, page: 1 });
  const updateSort = (event) => {
    const [sort, order] = event.target.value.split('-');
    onChange({ ...filters, sort, order, page: 1 });
  };

  return <section className="filters panel">
    <input className="search" name="search" value={filters.search} onChange={update} placeholder="⌕  Search tasks" />
    <select name="status" value={filters.status} onChange={update}><option value="">All statuses</option><option>Todo</option><option>In Progress</option><option>Done</option></select>
    <select name="priority" value={filters.priority} onChange={update}><option value="">All priorities</option><option>High</option><option>Medium</option><option>Low</option></select>
    <select value={`${filters.sort}-${filters.order}`} onChange={updateSort}><option value="dueDate-asc">Due date ↑</option><option value="dueDate-desc">Due date ↓</option><option value="priority-desc">Priority ↓</option><option value="priority-asc">Priority ↑</option></select>
  </section>;
}

function TaskRow({ task, onEdit, onRefresh }) {
  const [deleting, setDeleting] = useState(false);
  const complete = async () => { if (task.status !== 'Done') { await api.completeTask(task._id); onRefresh(); } };
  const remove = async () => { if (!window.confirm('Delete this task?')) return; setDeleting(true); try { await api.deleteTask(task._id); onRefresh(); } finally { setDeleting(false); } };

  return <article className="task-row">
    <button className={`check ${task.status === 'Done' ? 'checked' : ''}`} onClick={complete} aria-label={`Mark ${task.title} complete`}>{task.status === 'Done' ? '✓' : ''}</button>
    <div className="task-main"><strong>{task.title}</strong>{task.description && <p>{task.description}</p>}<small>Due {formatDate(task.dueDate)}</small></div>
    <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
    <span className={`badge ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
    <div className="row-actions"><button onClick={() => onEdit(task)}>Edit</button><button className="danger" disabled={deleting} onClick={remove}>{deleting ? '…' : 'Delete'}</button></div>
  </article>;
}

export default function TasksPage({ tasks, meta, filters, onFiltersChange, onRefresh, onEdit, onCreateTask }) {
  return <>
    <div className="page-heading"><div><p className="eyebrow">TASKS</p><h1>Keep work moving.</h1><p className="muted">Plan, prioritise, and finish with confidence.</p></div><button className="primary" onClick={onCreateTask}>+ Create task</button></div>
    <Filters filters={filters} onChange={onFiltersChange} />
    <section className="task-list panel">{tasks.map((task) => <TaskRow key={task._id} task={task} onEdit={onEdit} onRefresh={onRefresh} />)}{!tasks.length && <div className="empty large"><strong>No tasks found</strong><p>Try adjusting your filters or create a new task.</p></div>}</section>
    {meta.totalPages > 1 && <div className="pagination"><button disabled={filters.page === 1} onClick={() => onFiltersChange({ ...filters, page: filters.page - 1 })}>← Previous</button><span>Page {meta.page} of {meta.totalPages}</span><button disabled={filters.page === meta.totalPages} onClick={() => onFiltersChange({ ...filters, page: filters.page + 1 })}>Next →</button></div>}
  </>;
}
