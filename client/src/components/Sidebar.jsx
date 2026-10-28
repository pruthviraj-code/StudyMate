const links = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'assignments', label: 'Assignments', icon: '✓' },
  { id: 'activities', label: 'Activities', icon: '◷' },
];

export default function Sidebar({ page, onNavigate, user, onLogout, theme, onToggleTheme }) {
  return (
    <aside className="sidebar flex shrink-0 flex-col border-b border-slate-200 bg-white p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:p-5">
      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 p-3 text-white shadow-lg shadow-sky-100 dark:shadow-none md:mb-8">
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/25 bg-white/15 text-xl font-extrabold">S</div>
        <div><span className="block text-xl font-extrabold tracking-tight">StudyMate</span><span className="text-[11px] font-medium tracking-wide text-sky-100">STUDY SMARTER</span></div>
      </div>
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
      <nav className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
        {links.map((link) => (
          <button key={link.id} onClick={() => onNavigate(link.id)} className={`nav-link flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition-all ${page === link.id ? 'nav-link-active bg-sky-50 text-sky-800 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-sky-700'}`}>
            <span className={`grid h-8 w-8 place-items-center rounded-lg text-base ${page === link.id ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>{link.icon}</span>
            {link.label}
            {page === link.id && <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-sky-500 md:block" />}
          </button>
        ))}
      </nav>
      <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700 md:mt-auto">
        <button onClick={onToggleTheme} className="theme-toggle mb-4 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
          <span className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-base shadow-sm dark:bg-slate-700">{theme === 'dark' ? '☀' : '☾'}</span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/80">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 font-bold text-blue-700 ring-1 ring-white dark:from-slate-700 dark:to-slate-600 dark:text-sky-200 dark:ring-slate-600">{(user?.name || 'S').charAt(0).toUpperCase()}</div>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{user?.name}</p><p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p></div>
          <button onClick={onLogout} title="Sign out" className="rounded-lg px-1 py-1 text-xs font-bold text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950 dark:hover:text-rose-300">Logout</button>
        </div>
      </div>
    </aside>
  );
}
