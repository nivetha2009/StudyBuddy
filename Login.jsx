import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { useStudy } from '../context/StudyContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

/**
 * Local-only sign in.
 *
 * There is no account system yet: the name is saved in this browser so the
 * dashboard can greet the student. Wire this form to a real auth service
 * (Supabase, Firebase, Clerk or your own Express routes) when you need accounts.
 */
export default function Login() {
  const { setStudentName } = useStudy();
  const toast = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ name: '', email: '' });

  const submit = (event) => {
    event.preventDefault();
    const name = form.name.trim() || form.email.split('@')[0] || 'Student';
    setStudentName(name);
    toast.success(`Welcome, ${name}. Your progress is saved in this browser.`);
    navigate('/dashboard');
  };

  return (
    <div className="ruled min-h-[80vh]">
      <div className="container-page grid place-items-center py-16">
        <div className="card w-full max-w-md p-7 sm:p-9">
          <Logo />

          <h1 className="mt-6 text-3xl">{mode === 'signin' ? 'Welcome back' : 'Create your study space'}</h1>
          <p className="mt-2 text-[16px] text-muted">
            No account server is connected yet, so this only saves your name on this device.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            {mode === 'signup' && (
              <label className="block">
                <span className="mb-2 block text-[14px] font-semibold text-muted">Your name</span>
                <input
                  className="field"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Ananya"
                  required
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-[14px] font-semibold text-muted">Email</span>
              <input
                type="email"
                className="field"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="you@college.edu"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[14px] font-semibold text-muted">Password</span>
              <input type="password" className="field" placeholder="••••••••" required minLength={6} />
            </label>

            <button type="submit" className="btn btn-primary w-full">
              {mode === 'signin' ? 'Log in' : 'Sign up'}
            </button>
          </form>

          <p className="mt-5 text-center text-[15px] text-muted">
            {mode === 'signin' ? 'New to StudyBuddy?' : 'Already have a space?'}{' '}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="font-semibold text-pen underline"
            >
              {mode === 'signin' ? 'Create one' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
