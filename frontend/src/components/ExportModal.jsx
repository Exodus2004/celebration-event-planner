import React, { useState } from 'react';
import { exportPlanToMarkdown } from '../services/apiClient.js';

export function ExportModal({ plan, onClose }) {
  const [copiedMd, setCopiedMd] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleCopyMarkdown = async () => {
    setIsExporting(true);
    try {
      const md = await exportPlanToMarkdown(plan);
      navigator.clipboard.writeText(md);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${plan.event_name.replace(/\s+/g, '_')}_Blueprint.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 9999
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-dialog-title"
    >
      <div 
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          maxWidth: '520px',
          width: '100%'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 id="export-dialog-title" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            📤 Export & Share Event Blueprint
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.25rem 0.6rem' }}
            aria-label="Close export dialog"
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Export the full master plan for <strong>{plan.event_name}</strong> to share with clients, vendors, or committee members.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleCopyMarkdown}
            disabled={isExporting}
          >
            {copiedMd ? '✓ Copied Markdown to Clipboard!' : '📋 Copy Clean Markdown Blueprint'}
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{ justifyContent: 'center', padding: '0.75rem' }}
            onClick={handlePrint}
          >
            🖨️ Print / Save as PDF (Clean Layout)
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{ justifyContent: 'center', padding: '0.75rem' }}
            onClick={handleDownloadJson}
          >
            💾 Download Full Data Schema (.JSON)
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
