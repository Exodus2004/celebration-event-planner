import React, { useState } from 'react';

export function BudgetBreakdown({ budgetSummary, totalBudget, onUpdateAllocations }) {
  const [categories, setCategories] = useState(budgetSummary.categories);

  const handleSliderChange = (idx, newPct) => {
    const updated = [...categories];
    updated[idx] = {
      ...updated[idx],
      percentage: Number(newPct),
      allocated_amount: Math.round(totalBudget * (Number(newPct) / 100))
    };
    setCategories(updated);
    if (onUpdateAllocations) {
      onUpdateAllocations(updated);
    }
  };

  const totalAllocated = categories.reduce((sum, c) => sum + c.allocated_amount, 0);
  const totalPercentage = categories.reduce((sum, c) => sum + c.percentage, 0);

  return (
    <div className="content-card">
      <h2 className="card-title">💰 Financial Allocation & Budget Health</h2>

      {/* Top Stat Boxes */}
      <div className="stats-grid">
        <div className="stat-box">
          <p className="stat-label">Total Allocated</p>
          <p className="stat-value">${totalBudget.toLocaleString()}</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">Per-Guest Allowance</p>
          <p className="stat-value">${budgetSummary.per_guest_cost.toFixed(2)}</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">Contingency Reserve</p>
          <p className="stat-value" style={{ color: '#34d399' }}>
            ${budgetSummary.contingency_reserve.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Rebalance Notice */}
      <div style={{ marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span>Dynamic Rebalancing: Total sum = </span>
        <strong style={{ color: Math.abs(totalPercentage - 100) < 1 ? '#34d399' : '#f59e0b' }}>
          {totalPercentage.toFixed(1)}% (${totalAllocated.toLocaleString()})
        </strong>
      </div>

      {/* Category Cards with Interactive Sliders */}
      <div className="categories-list">
        {categories.map((cat, idx) => (
          <div key={idx} className="category-item">
            <div className="category-header">
              <span>{cat.name}</span>
              <span className="category-pct">
                ${cat.allocated_amount.toLocaleString()} ({cat.percentage}%)
              </span>
            </div>

            <div className="progress-bar-bg" aria-hidden="true">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${Math.min(cat.percentage * 2, 100)}%` }}
              ></div>
            </div>

            {/* Accessible Range Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <label htmlFor={`slider-${idx}`} style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Tweak %:
              </label>
              <input
                id={`slider-${idx}`}
                type="range"
                min="0"
                max="60"
                step="1"
                value={cat.percentage}
                onChange={(e) => handleSliderChange(idx, e.target.value)}
                style={{ flex: 1, cursor: 'pointer' }}
                aria-label={`Adjust percentage for ${cat.name}`}
              />
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {cat.description}
            </p>

            <div className="category-tip">
              💡 <strong>Saving Tip:</strong> {cat.cost_saving_tip}
            </div>
          </div>
        ))}
      </div>

      {/* AI Budget Insights */}
      {budgetSummary.ai_budget_insights && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>
            🧠 Strategic Budget Insights
          </h3>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {budgetSummary.ai_budget_insights.map((insight, idx) => (
              <li key={idx} style={{ marginBottom: '0.35rem' }}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
