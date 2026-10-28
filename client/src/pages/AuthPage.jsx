import { useState } from 'react';
import { api } from '../api';

export default function AuthPage({ onAuthenticated, theme = 'light', onToggleTheme }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isRegister = mode === 'register';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = isRegister
        ? await api.register({ name, email, password })
        : await api.login({ email, password });
      localStorage.setItem('studymate_token', result.token);
      localStorage.setItem('studymate_user', JSON.stringify(result.user));
      onAuthenticated(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-sky-900';

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-slate-50 to-blue-100 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <button type="button" onClick={onToggleTheme} className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white/90 px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Toggle color theme">{theme === 'dark' ? '☀' : '☾'}<span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span></button>
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-2xl shadow-sky-100/70 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20 md:grid-cols-2">
        <section className="hidden flex-col justify-between bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 p-10 text-white md:flex">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-xl font-bold">S</div>
              <span className="text-2xl font-bold tracking-tight">StudyMate</span>
            </div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Your study space</p>
            <h1 className="max-w-sm text-4xl font-bold leading-tight">Make every study session count.</h1>
            <p className="mt-5 max-w-sm leading-7 text-indigo-100">Keep assignments organised, track deadlines, and stay on top of your academic goals in one place.</p>
          </div>
          <p className="text-sm text-indigo-200">A little progress every day adds up.</p>
        </section>

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 font-bold text-white">S</div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">StudyMate</span>
          </div>
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold text-sky-700 dark:text-sky-300">WELCOME {isRegister ? 'ABOARD' : 'BACK'}</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{isRegister ? 'Create your account' : 'Sign in to StudyMate'}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{isRegister ? 'Create an account to keep your study work private.' : 'Enter your details to continue to your dashboard.'}</p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button type="button" onClick={() => { setMode('login'); setError(''); }} className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${!isRegister ? 'bg-white text-sky-700 shadow-sm dark:bg-slate-700 dark:text-sky-200' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}>Sign in</button>
            <button type="button" onClick={() => { setMode('register'); setError(''); }} className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isRegister ? 'bg-white text-sky-700 shadow-sm dark:bg-slate-700 dark:text-sky-200' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}>Create account</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && <label className="block space-y-1.5"><span className="text-sm font-medium text-slate-700 dark:text-slate-200">Full name</span><input className={inputClass} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Morgan" minLength={2} maxLength={80} required /></label>}
            <label className="block space-y-1.5"><span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email address</span><input className={inputClass} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" maxLength={254} required /></label>
            <label className="block space-y-1.5"><span className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</span><div className="relative"><input className={`${inputClass} pr-20`} type={showPassword ? 'text' : 'password'} autoComplete={isRegister ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'} minLength={isRegister ? 8 : undefined} maxLength={128} required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-700">{showPassword ? 'Hide' : 'Show'}</button></div></label>
            {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
            <button disabled={busy} className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:from-sky-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-sky-200 dark:shadow-none disabled:cursor-wait disabled:opacity-60">{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}</button>
          </form>
          <p className="mt-6 text-center text-xs leading-5 text-slate-400">Your password is securely hashed before it is stored. Never reuse a password you use for other important accounts.</p>
        </section>
      </div>
    </main>
  );
}
