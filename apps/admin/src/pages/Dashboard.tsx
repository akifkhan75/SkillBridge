import { Users, Briefcase, DollarSign, AlertCircle } from 'lucide-react';
import './Pages.css';

export default function Dashboard() {
  const stats = [
    { title: 'Total Users', value: '12,450', change: '+12%', icon: Users, color: 'var(--info)' },
    { title: 'Active Jobs', value: '842', change: '+5%', icon: Briefcase, color: 'var(--accent-primary)' },
    { title: 'Revenue (MTD)', value: '$45,231', change: '+18%', icon: DollarSign, color: 'var(--success)' },
    { title: 'Pending Disputes', value: '12', change: '-2', icon: AlertCircle, color: 'var(--warning)' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Platform Overview</h1>
        <button className="btn btn-primary">Download Report</button>
      </div>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="card stat-card glass-panel">
            <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <div className="stat-value-row">
                <span className="stat-value">{stat.value}</span>
                <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
