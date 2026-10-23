import React from 'react';

export function Header({ engineSource, onToggleContrast, isHighContrast, onOpenExport }) {
  const isCloud = engineSource === 'cloud';

  return (
    <header className="app-header">
      <div className="header-brand">
        <h1>Celebration & Event Planner</h1>
        <p>GenAI-Powered Assistant for Weddings, Birthdays & Community Events</p>
      </div>

      <div className="header-actions">
        <div 
          className={`engine-badge ${isCloud ? 'cloud' : 'resilient'}`}
          role="status"
          aria-live="polite"
        >
          <span className="pulse-dot" aria-hidden="true"></span>
          <span>
            {isCloud 
              ? '🟢 Live Cloud Engine Active' 
              : '⚡ Resilient Zero-Downtime Engine Active'}
          </span>
        </div>

        <button 
          type="button" 
          className="btn-secondary" 
          onClick={onToggleContrast}
          aria-label="Toggle high contrast accessibility mode"
        >
          {isHighContrast ? '👁️ Standard Mode' : '🌓 High Contrast (AAA)'}
        </button>

        <button 
          type="button" 
          className="btn-secondary" 
          onClick={onOpenExport}
          aria-label="Open export and print options"
        >
          📤 Export / Print
        </button>
      </div>
    </header>
  );
}
