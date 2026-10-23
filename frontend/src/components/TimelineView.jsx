import React, { useState } from 'react';

export function TimelineView({ timelinePlan }) {
  const [activeView, setActiveView] = useState('run_of_show'); // 'milestones' or 'run_of_show'

  return (
    <div className="content-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <h2 className="card-title" style={{ margin: 0 }}>
          ⏱️ Timelines & Execution Roadmap
        </h2>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className={`btn-secondary ${activeView === 'run_of_show' ? 'active' : ''}`}
            onClick={() => setActiveView('run_of_show')}
            style={{ borderColor: activeView === 'run_of_show' ? 'var(--accent-purple)' : 'var(--border-subtle)' }}
          >
            📋 Day-Of Run-Of-Show ({timelinePlan.run_of_show.length} Blocks)
          </button>
          <button
            type="button"
            className={`btn-secondary ${activeView === 'milestones' ? 'active' : ''}`}
            onClick={() => setActiveView('milestones')}
            style={{ borderColor: activeView === 'milestones' ? 'var(--accent-purple)' : 'var(--border-subtle)' }}
          >
            📅 Milestone Countdown ({timelinePlan.milestones.length} Phases)
          </button>
        </div>
      </div>

      {/* View 1: Day-Of Run-of-Show Table */}
      {activeView === 'run_of_show' && (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Duration</th>
                <th>Execution Activity</th>
                <th>Lead Role</th>
                <th>Zone / Location</th>
                <th>Contingency / Pacing Protocol</th>
              </tr>
            </thead>
            <tbody>
              {timelinePlan.run_of_show.map(block => (
                <tr key={block.id}>
                  <td style={{ fontWeight: 800, color: 'var(--accent-cyan)', whiteSpace: 'nowrap' }}>
                    {block.time}
                  </td>
                  <td>{block.duration_minutes}m</td>
                  <td style={{ fontWeight: 600 }}>{block.activity}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{block.lead_person}</td>
                  <td>
                    <span style={{ fontSize: '0.8rem', background: 'var(--bg-card)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {block.location_zone}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    {block.contingency_note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View 2: High-Level Milestones */}
      {activeView === 'milestones' && (
        <div className="milestones-list">
          {timelinePlan.milestones.map(ms => (
            <div 
              key={ms.id} 
              className="category-item" 
              style={{ borderLeft: ms.is_critical ? '4px solid #f43f5e' : '4px solid #38bdf8' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 800, color: ms.is_critical ? '#f43f5e' : '#38bdf8', fontSize: '0.85rem' }}>
                  {ms.timeframe} {ms.is_critical && '• CRITICAL PATH'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Lead: {ms.owner_role}
                </span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>{ms.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{ms.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
