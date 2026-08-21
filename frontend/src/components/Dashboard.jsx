import { formatDate } from '../utils/formatters';

const stats = (analytics) => [
  ['All tasks', analytics?.totalTasks || 0, '◫'],
  ['Completed', analytics?.completedTasks || 0, '✓'],
  ['In progress', analytics?.byStatus?.['In Progress'] || 0, '↗'],
  ['To do', analytics?.byStatus?.Todo || 0, '○']
];

export default function Dashboard({ analytics, tasks, user, onCreateTask, onViewTasks }) {
  const byStatus = analytics?.byStatus || {};
  const total = analytics?.totalTasks || 0;
  const statusRows = [
    ['Todo', byStatus.Todo || 0],
    ['In progress', byStatus['In Progress'] || 0],
    ['Completed', byStatus.Done || 0]
  ];

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Good morning, {user.name.split(' ')[0]}.</h1>
          <p className="muted">Here’s a clear view of your work.</p>
        </div>
        <button className="primary" onClick={onCreateTask}>+ Create task</button>
      </div>

      <section className="stats">
        {stats(analytics).map(([label, value, icon]) => (
          <article className="stat" key={label}>
            <span className="stat-icon">{icon}</span><p>{label}</p><strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="panel progress-panel">
          <div className="panel-header"><div><h2>Your progress</h2><p className="muted">Tasks completed this cycle</p></div><strong className="percentage">{analytics?.completionPercentage || 0}%</strong></div>
          <div className="progress"><i style={{ width: `${analytics?.completionPercentage || 0}%` }} /></div>
          <div className="status-bars">
            {statusRows.map(([label, count]) => (
              <div key={label}><span>{label}</span><b><i style={{ width: `${total ? (count / total) * 100 : 0}%` }} /></b><em>{count}</em></div>
            ))}
          </div>
        </article>

        <article className="panel focus-panel">
          <div className="panel-header"><div><h2>Up next</h2><p className="muted">Your nearest deadlines</p></div><button className="text-btn" onClick={onViewTasks}>View all</button></div>
          {tasks.slice(0, 4).map((task) => (
            <div className="mini-task" key={task._id}>
              <span className={`dot ${task.priority.toLowerCase()}`} />
              <div><strong>{task.title}</strong><small>Due {formatDate(task.dueDate)}</small></div>
              <span className={`badge ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
            </div>
          ))}
          {!tasks.length && <p className="empty">Nothing is due yet. Enjoy the calm.</p>}
        </article>
      </section>
    </>
  );
}
