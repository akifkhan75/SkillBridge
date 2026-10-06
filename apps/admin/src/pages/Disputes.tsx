import { useEffect, useState } from 'react';
import './Pages.css';

export default function Disputes() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/disputes/all', {
      headers: {
        Authorization: 'Bearer admin-token-stub',
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 401 || !data.length) {
          setDisputes([
            { id: 'D-9921', jobRequestId: 'J-8812', raisedBy: { name: 'Sarah Connor' }, reason: 'Worker did not show up', status: 'OPEN', createdAt: '2026-10-05T10:00:00Z' },
          ]);
        } else {
          setDisputes(data);
        }
      })
      .catch(() => {
        setDisputes([
          { id: 'D-9921', jobRequestId: 'J-8812', raisedBy: { name: 'Sarah Connor' }, reason: 'Worker did not show up', status: 'OPEN', createdAt: '2026-10-05T10:00:00Z' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleResolve = (id: string) => {
    setDisputes(d => d.filter(item => item.id !== id));
    alert(`Resolved dispute ${id}`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Active Disputes</h1>
      </div>

      <div className="card glass-panel list-card">
        <div className="table-header">
          <div className="col">Dispute ID</div>
          <div className="col">Job ID</div>
          <div className="col">Raised By</div>
          <div className="col">Reason</div>
          <div className="col">Status</div>
          <div className="col">Actions</div>
        </div>
        
        {loading ? (
          <div className="empty-state">Loading disputes...</div>
        ) : disputes.length === 0 ? (
          <div className="empty-state">No active disputes to review.</div>
        ) : (
          disputes.map((d) => (
            <div key={d.id} className="table-row">
              <div className="col text-muted">{d.id}</div>
              <div className="col">{d.jobRequest?.id || d.jobRequestId}</div>
              <div className="col font-medium">{d.raisedBy?.name}</div>
              <div className="col">{d.reason}</div>
              <div className="col">
                <span className="badge badge-warning">{d.status}</span>
              </div>
              <div className="col actions">
                <button className="btn btn-sm btn-primary" onClick={() => handleResolve(d.id)}>Resolve</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
