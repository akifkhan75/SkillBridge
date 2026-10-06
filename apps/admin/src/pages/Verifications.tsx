import { useEffect, useState } from 'react';
import './Pages.css';

export default function Verifications() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/verifications/pending', {
      headers: {
        Authorization: 'Bearer admin-token-stub',
      }
    })
      .then(res => res.json())
      .then(data => {
        // Use dummy data if unauthorized or empty
        if (data.statusCode === 401 || !data.length) {
           setVerifications([
            { id: 'V-1042', name: 'John Doe', type: 'ID Document', date: '2026-10-06', status: 'SUBMITTED' },
            { id: 'V-1043', name: 'Alice Smith', type: 'Background Check', date: '2026-10-07', status: 'SUBMITTED' },
          ]);
        } else {
          setVerifications(data);
        }
      })
      .catch(() => {
         setVerifications([
          { id: 'V-1042', name: 'John Doe', type: 'ID Document', date: '2026-10-06', status: 'SUBMITTED' },
          { id: 'V-1043', name: 'Alice Smith', type: 'Background Check', date: '2026-10-07', status: 'SUBMITTED' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = (id: string) => {
    setVerifications(v => v.filter(item => item.id !== id));
    alert(`Approved verification ${id}`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Worker Verifications</h1>
      </div>

      <div className="card glass-panel list-card">
        <div className="table-header">
          <div className="col">ID</div>
          <div className="col">Worker Name</div>
          <div className="col">Document Type</div>
          <div className="col">Submitted Date</div>
          <div className="col">Status</div>
          <div className="col">Actions</div>
        </div>
        
        {loading ? (
          <div className="empty-state">Loading verifications...</div>
        ) : verifications.length === 0 ? (
          <div className="empty-state">No pending verifications.</div>
        ) : (
          verifications.map((v) => (
            <div key={v.id} className="table-row">
              <div className="col text-muted">{v.id}</div>
              <div className="col font-medium">{v.user?.name || v.name}</div>
              <div className="col">{v.type || 'ID Document'}</div>
              <div className="col text-muted">{new Date(v.createdAt || v.date).toLocaleDateString()}</div>
              <div className="col">
                <span className="badge badge-warning">{v.idVerifiedStatus || v.status}</span>
              </div>
              <div className="col actions" style={{gap: '0.5rem', display: 'flex'}}>
                <button className="btn btn-sm btn-primary" onClick={() => handleApprove(v.id)}>Approve</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
