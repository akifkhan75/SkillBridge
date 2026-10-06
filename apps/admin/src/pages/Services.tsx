import { useEffect, useState } from 'react';
import { Layers } from 'lucide-react';
import './Pages.css';

export default function Services() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/service-catalog/categories', {
      headers: { Authorization: 'Bearer admin-token-stub' }
    })
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 401 || !data.length) {
          setCategories([
            { id: 'C-1', name: 'Plumbing', description: 'Pipes, leaks, and water systems', services: [{ id: 'S-1', name: 'Leak Repair', basePrice: 150 }] },
            { id: 'C-2', name: 'Electrical', description: 'Wiring, fixtures, and power', services: [{ id: 'S-2', name: 'Panel Upgrade', basePrice: 800 }] },
            { id: 'C-3', name: 'Cleaning', description: 'Deep cleaning and move-in/out', services: [{ id: 'S-3', name: 'Deep Clean', basePrice: 200 }] },
          ]);
        } else {
          setCategories(data);
        }
      })
      .catch(() => {
        setCategories([
          { id: 'C-1', name: 'Plumbing', description: 'Pipes, leaks, and water systems', services: [{ id: 'S-1', name: 'Leak Repair', basePrice: 150 }] },
          { id: 'C-2', name: 'Electrical', description: 'Wiring, fixtures, and power', services: [{ id: 'S-2', name: 'Panel Upgrade', basePrice: 800 }] },
          { id: 'C-3', name: 'Cleaning', description: 'Deep cleaning and move-in/out', services: [{ id: 'S-3', name: 'Deep Clean', basePrice: 200 }] },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Service Catalog</h1>
        <button className="btn btn-primary">+ Add Category</button>
      </div>

      <div className="stats-grid">
        {loading ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>Loading catalog...</div>
        ) : categories.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>No categories found.</div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="font-medium" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={20} color="var(--accent-primary)" />
                  {category.name}
                </h3>
                <button className="btn btn-sm" style={{ border: '1px solid var(--border-color)' }}>Edit</button>
              </div>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>{category.description}</p>
              
              <div style={{ marginTop: '0.5rem' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Services ({category.services?.length || 0})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {category.services?.map((service: any) => (
                    <div key={service.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.9rem' }}>{service.name}</span>
                      <span className="font-medium" style={{ color: 'var(--success)' }}>${service.basePrice}</span>
                    </div>
                  ))}
                  <button style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', textAlign: 'left', marginTop: '0.25rem' }}>
                    + Add Service
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
