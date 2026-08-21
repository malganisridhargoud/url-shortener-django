export default function Sidebar({ user, view, isDark, onViewChange, onThemeToggle, onSignOut }) {
  return (
    <>
      <aside>
        <div className="brand"><span>✓</span> TaskFlow</div>
        <nav>
          <button className={view === 'dashboard' ? 'active' : ''} onClick={() => onViewChange('dashboard')}><span>▦</span> Dashboard</button>
          <button className={view === 'tasks' ? 'active' : ''} onClick={() => onViewChange('tasks')}><span>☷</span> My tasks</button>
        </nav>
        <div className="side-bottom">
          <button onClick={onThemeToggle}><span>{isDark ? '☀' : '◐'}</span>{isDark ? 'Light mode' : 'Dark mode'}</button>
          <div className="profile">
            <span>{user.name[0]}</span>
            <div><strong>{user.name}</strong><small>{user.email}</small></div>
            <button onClick={onSignOut} title="Sign out" aria-label="Sign out">↪</button>
          </div>
        </div>
      </aside>
      <header className="mobile-head">
        <div className="brand"><span>✓</span> TaskFlow</div>
        <button className="icon-btn" onClick={onSignOut} aria-label="Sign out">↪</button>
      </header>
    </>
  );
}
