import React, { useState, useEffect } from 'react';

export function VendorChecklist({ items, eventId }) {
  const storageKey = `checklist_${eventId}`;
  
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return items;
  });

  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    setChecklist(items);
  }, [items]);

  const toggleStatus = (id) => {
    const updated = checklist.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'completed' 
          ? 'pending' 
          : (item.status === 'booked' ? 'completed' : 'booked');
        return { ...item, status: nextStatus };
      }
      return item;
    });
    setChecklist(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const categories = ['ALL', ...new Set(checklist.map(i => i.category))];

  const filteredItems = selectedCategory === 'ALL'
    ? checklist
    : checklist.filter(i => i.category === selectedCategory);

  const completedCount = checklist.filter(i => i.status === 'completed' || i.status === 'booked').length;
  const progressPct = Math.round((completedCount / Math.max(checklist.length, 1)) * 100);

  return (
    <div className="content-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <h2 className="card-title" style={{ margin: 0 }}>
          📑 Vendor Procurement & Task Checklist
        </h2>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Progress: <strong>{completedCount}/{checklist.length} Booked ({progressPct}%)</strong>
        </span>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-bg" style={{ height: '10px', marginBottom: '1.25rem' }}>
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #10b981, #06b6d4)' }}
        ></div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            className={`dietary-chip ${selectedCategory === cat ? 'selected' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checklist Table */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>Done</th>
              <th>Category</th>
              <th>Task / Deliverable</th>
              <th>Target Deadline</th>
              <th>Estimated Cost</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => {
              const isDone = item.status === 'completed' || item.status === 'booked';
              return (
                <tr key={item.id} style={{ opacity: item.status === 'completed' ? 0.75 : 1 }}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => toggleStatus(item.id)}
                      aria-label={`Toggle status for ${item.title}`}
                      style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                    />
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', background: 'var(--bg-card)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {item.category}
                    </span>
                  </td>
                  <td>
                    <strong style={{ textDecoration: isDone ? 'line-through' : 'none' }}>
                      {item.title}
                    </strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {item.description}
                    </p>
                  </td>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--accent-amber)', fontSize: '0.85rem' }}>
                    {item.suggested_booking_deadline}
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    ${item.estimated_cost.toLocaleString()}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => toggleStatus(item.id)}
                      className={`badge-status badge-${item.status}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      title="Click to cycle status"
                    >
                      {item.status}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
