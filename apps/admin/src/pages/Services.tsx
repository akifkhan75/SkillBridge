import { listCategories } from '../api';
import { useLoad } from '../hooks';
import './Pages.css';

export default function Services() {
  const { data, loading, error, reload } = useLoad(listCategories);
  return (
    <div className="page-container">
      <div className="page-header"><h1 className="page-title">Service catalogue</h1></div>
      <div className="card glass-panel list-card">
        <div className="table-header">
          <div className="col">Category</div><div className="col">Urdu name</div><div className="col">Services</div><div className="col">Common problems</div>
        </div>
        {loading && !data ? <div className="state-box">Loading…</div>
          : error && !data ? <div className="state-box"><p>{error}</p><button className="btn btn-primary" onClick={reload}>Try again</button></div>
          : !data?.length ? <div className="state-box">The catalogue is empty. Run the catalogue seed (pnpm --filter @fixli/api db:seed:catalog).</div>
          : data.map((c) => (
            <div key={c.id} className="table-row">
              <div className="col font-medium">{c.translations?.en?.name ?? c.name}</div>
              <div className="col" dir="rtl">{c.translations?.ur?.name ?? '—'}</div>
              <div className="col text-muted">{c.services.length}</div>
              <div className="col text-muted">{c.issues.length}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
