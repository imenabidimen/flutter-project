import { FormEvent, useEffect, useState } from 'react';
import { api } from './api';

type Task = { id: string; title: string; completed: boolean };
type AuthMode = 'login' | 'register';

export default function App() {
  const [authed, setAuthed] = useState(Boolean(localStorage.getItem('accessToken')));
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    api('/tasks')
      .then(setTasks)
      .catch(() => setError('Could not load your work.'))
      .finally(() => setLoading(false));
  }, [authed]);

  async function submitAuth(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      const result = await api(path, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('accessToken', result.accessToken);
      setAuthed(true);
    } catch {
      setError(mode === 'login' ? 'Unable to sign in. Check your credentials.' : 'Could not create your account.');
    } finally {
      setBusy(false);
    }
  }

  async function addTask(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    setError('');
    try {
      const task = await api('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: title.trim() }),
      });
      setTasks((current) => [task, ...current]);
      setTitle('');
    } catch {
      setError('Could not add that task.');
    } finally {
      setBusy(false);
    }
  }

  async function completeTask(id: string) {
    setError('');
    try {
      const updated = await api('/tasks/' + id + '/complete', { method: 'POST' });
      setTasks((current) => current.map((task) => task.id === id ? updated : task));
    } catch {
      setError('Could not update that task.');
    }
  }

  function logout() {
    localStorage.removeItem('accessToken');
    setAuthed(false);
    setTasks([]);
  }

  if (!authed) {
    return (
      <main className="auth-layout">
        <section className="card">
          <p className="eyebrow">ClientHub</p>
          <h1>{mode === 'login' ? 'Welcome back' : 'Create your workspace'}</h1>
          <p className="muted">A small workspace for keeping client work moving.</p>
          <form onSubmit={submitAuth}>
            <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required /></label>
            <label>Password<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required /></label>
            <button disabled={busy}>{busy ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
          </form>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="link-button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main>
      <header className="topbar">
        <div><p className="eyebrow">ClientHub</p><h1>My work</h1></div>
        <button className="secondary" onClick={logout}>Log out</button>
      </header>
      <section className="card">
        <form className="task-form" onSubmit={addTask}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task…" aria-label="New task" required />
          <button disabled={busy}>Add</button>
        </form>
        {error && <p className="error" role="alert">{error}</p>}
        {loading && <p className="muted">Loading your work…</p>}
        {!loading && tasks.length === 0 && <p className="empty">Nothing here yet. Add the first task when you're ready.</p>}
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id}>
              <span className={task.completed ? 'done' : ''}>{task.title}</span>
              <button className="secondary" disabled={task.completed} onClick={() => completeTask(task.id)}>
                {task.completed ? 'Done' : 'Complete'}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
