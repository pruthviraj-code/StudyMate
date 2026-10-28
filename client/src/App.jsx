import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import Sidebar from './components/Sidebar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import Activities from './pages/Activities';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('studymate_theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('studymate_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((current) => current === 'dark' ? 'light' : 'dark'), []);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studymate_user') || 'null'); } catch { return null; }
  });
  const [checkingAuth, setCheckingAuth] = useState(Boolean(localStorage.getItem('studymate_token')));

  const logout = useCallback(() => {
    localStorage.removeItem('studymate_token');
    localStorage.removeItem('studymate_user');
    setUser(null);
    setPage('dashboard');
  }, []);

  useEffect(() => {
    const onUnauthorized = () => logout();
    window.addEventListener('studymate:unauthorized', onUnauthorized);
    return () => window.removeEventListener('studymate:unauthorized', onUnauthorized);
  }, [logout]);

  useEffect(() => {
    if (!localStorage.getItem('studymate_token')) { setCheckingAuth(false); return; }
    api.me().then((currentUser) => {
      setUser(currentUser);
      localStorage.setItem('studymate_user', JSON.stringify(currentUser));
    }).catch(() => logout()).finally(() => setCheckingAuth(false));
  }, [logout]);

  if (checkingAuth) return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-300">Checking your session…</div>;
  if (!user) return <AuthPage onAuthenticated={setUser} theme={theme} onToggleTheme={toggleTheme} />;

  return (
    <div className="app-shell flex min-h-screen flex-col bg-slate-50 text-slate-800 md:flex-row">
      <Sidebar page={page} onNavigate={setPage} user={user} onLogout={logout} theme={theme} onToggleTheme={toggleTheme} />
      <main className="main-content w-full min-w-0 flex-1 p-4 sm:p-6 lg:p-9">
        <div className="mb-7 hidden items-center justify-between rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-blue-50 px-6 py-4 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:flex">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Your learning space</p><p className="mt-1 text-lg font-semibold text-slate-800 dark:text-slate-100">Small steps. Big progress.</p></div>
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-xl text-white shadow-md">✦</div>
        </div>
        {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
        {page === 'assignments' && <Assignments />}
        {page === 'activities' && <Activities />}
      </main>
    </div>
  );
}
