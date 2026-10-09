import { useState, type FormEvent } from 'react';
import { useAuth } from '../auth';
import { ApiError } from '../api';
import './Pages.css';

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? (err.status === 429 ? 'Too many tries. Please wait a minute.' : err.message) : 'Could not reach the server.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <form className="card glass-panel login-card" onSubmit={submit}>
        <img src="/logo-mark.png" alt="Fixli" width={56} height={56} />
        <h1 className="page-title">Fixli staff sign in</h1>
        <label>Email<input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
