import { Users, Briefcase, ShieldCheck, AlertCircle, HardHat } from 'lucide-react';
import { getStats } from '../api';
import { useLoad } from '../hooks';
import './Pages.css';

const sum = (m: Record<string, number> = {}) => Object.values(m).reduce((a, b) => a + b, 0);

export default function Dashboard() {
  const { data, loading, error, reload } = useLoad(getStats);

  if (loading && !data) return <div className="state-box">Loading…</div>;
  if (error && !data) return <div className="state-box"><p>{error}</p><button className="btn btn-primary" onClick={reload}>Try again</button></div>;
  if (!data) return null;

  const stats = [
    { title: 'Customers', value: data.users.customer ?? 0, icon: Users, color: 'var(--info)' },
    { title: 'Workers (approved)', value: data.workers.ACTIVE ?? 0, sub: `${sum(data.workers)} registered`, icon: HardHat, color: 'var(--success)' },
    { title: 'Jobs', value: sum(data.jobs), sub: `${data.jobs.COMPLETED ?? 0} completed`, icon: Briefcase, color: 'var(--accent-primary)' },
    { title: 'Documents to review', value: data.pendingVerifications, icon: ShieldCheck, color: 'var(--warning)' },
    { title: 'Open disputes', value: data.openDisputes, icon: AlertCircle, color: 'var(--warning)' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Platform overview</h1>
        <button className="btn btn-ghost" onClick={reload}>Refresh</button>
      </div>
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.title} className="card stat-card glass-panel">
            <div className="stat-icon-wrapper" style={{ backgroundColor: `${s.color}20`, color: s.color }}><s.icon size={24} /></div>
            <div className="stat-content">
              <h3 className="stat-title">{s.title}</h3>
              <div className="stat-value-row"><span className="stat-value">{s.value}</span></div>
              {s.sub ? <span className="text-muted">{s.sub}</span> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
