import React, { useState } from 'react';
import { exportPlanToMarkdown } from '../services/apiClient.js';

export function ExportModal({ plan, onClose }) {
  const [copiedMd, setCopiedMd] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

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
    setIsPrinting(true);

    const categoriesHtml = plan.budget_summary.categories.map(c => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td>$${c.allocated_amount.toLocaleString()}</td>
        <td>${c.percentage}%</td>
        <td>${c.description} <br/><em style="color:#0284c7;font-size:11px;">💡 Tip: ${c.cost_saving_tip}</em></td>
      </tr>
    `).join('');

    const vendorHtml = plan.vendor_checklist.map(v => `
      <tr>
        <td style="text-align:center;">${v.status === 'booked' ? '✅ Booked' : (v.status === 'contacted' ? '⏳ Contacted' : '⬜ Pending')}</td>
        <td><strong>${v.category}</strong></td>
        <td><strong>${v.title}</strong><br/><span style="color:#64748b;font-size:11px;">${v.description}</span></td>
        <td>${v.suggested_booking_deadline}</td>
        <td>$${v.estimated_cost.toLocaleString()}</td>
      </tr>
    `).join('');

    const runOfShowHtml = plan.timeline_plan.run_of_show.map(r => `
      <tr>
        <td style="font-weight:bold;color:#0284c7;white-space:nowrap;">${r.time}</td>
        <td>${r.duration_minutes}m</td>
        <td><strong>${r.activity}</strong></td>
        <td>${r.lead_person}</td>
        <td>${r.location_zone}</td>
        <td style="color:#64748b;font-size:11px;">${r.contingency_note}</td>
      </tr>
    `).join('');

    const milestonesHtml = plan.timeline_plan.milestones.map(m => `
      <li style="margin-bottom:8px;">
        <strong>[${m.timeframe}] ${m.title}</strong> (Lead: <em>${m.owner_role}</em>)${m.is_critical ? ' <span style="color:#e11d48;font-weight:bold;font-size:11px;">[CRITICAL]</span>' : ''}
        <br/><span style="color:#475569;font-size:12px;">${m.description}</span>
      </li>
    `).join('');

    const swatchesHtml = plan.personalized_ideas.color_palette.map(c => `
      <div style="display:inline-block;margin-right:16px;margin-bottom:8px;text-align:center;">
        <div style="width:50px;height:28px;background:${c.hex_code};border:1px solid #cbd5e1;border-radius:4px;margin-bottom:4px;"></div>
        <div style="font-weight:bold;font-size:11px;">${c.name}</div>
        <div style="color:#64748b;font-size:10px;font-family:monospace;">${c.hex_code}</div>
      </div>
    `).join('');

    const menuHtml = plan.personalized_ideas.menu_concepts.map(m => `
      <li style="margin-bottom:4px;">${m}</li>
    `).join('');

    const activitiesHtml = plan.personalized_ideas.interactive_activities.map(a => `
      <li style="margin-bottom:4px;">${a}</li>
    `).join('');

    const printHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${plan.event_name} — Master Event Blueprint</title>
  <style>
    @page {
      margin: 1.5cm;
      size: letter portrait;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.45;
      font-size: 12px;
      margin: 0;
      padding: 16px;
    }
    .header-box {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 22px;
      margin: 0 0 6px 0;
      color: #0f172a;
    }
    .meta-line {
      font-size: 12px;
      color: #475569;
      font-weight: 500;
    }
    .stats-row {
      display: flex;
      gap: 12px;
      margin: 14px 0;
    }
    .stat-card {
      flex: 1;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px;
      text-align: center;
    }
    .stat-lbl {
      font-size: 10px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .stat-val {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 2px;
    }
    h2 {
      font-size: 14px;
      color: #1e293b;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin-top: 20px;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      page-break-after: avoid;
    }
    h3 {
      font-size: 13px;
      color: #334155;
      margin: 10px 0 6px 0;
      page-break-after: avoid;
    }
    p {
      margin: 6px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      margin-bottom: 16px;
      font-size: 11px;
      page-break-inside: auto;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      font-weight: 700;
      text-align: left;
    }
    td {
      border: 1px solid #e2e8f0;
      padding: 6px 8px;
      vertical-align: top;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    blockquote {
      border-left: 3px solid #6366f1;
      padding-left: 10px;
      margin: 8px 0;
      font-style: italic;
      color: #334155;
      background: #f8fafc;
      padding: 8px 12px;
      border-radius: 0 4px 4px 0;
    }
    ul {
      padding-left: 18px;
      margin: 6px 0;
    }
    .two-col {
      display: flex;
      gap: 16px;
    }
    .col {
      flex: 1;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="header-box">
    <h1>${plan.event_name} — Master Event Blueprint</h1>
    <div class="meta-line">
      <strong>Category:</strong> ${plan.event_type.toUpperCase()} | 
      <strong>Target Date:</strong> ${plan.target_date} | 
      <strong>Location:</strong> ${plan.location} | 
      <strong>Engine:</strong> ${plan.engine_used}
    </div>
  </div>

  <div class="stats-row">
    <div class="stat-card">
      <div class="stat-lbl">Total Budget</div>
      <div class="stat-val">$${plan.budget_summary.total_budget.toLocaleString()}</div>
    </div>
    <div class="stat-card">
      <div class="stat-lbl">Guest Count</div>
      <div class="stat-val">${plan.guest_count.toLocaleString()}</div>
    </div>
    <div class="stat-card">
      <div class="stat-lbl">Per-Guest Cost</div>
      <div class="stat-val">$${plan.budget_summary.per_guest_cost.toFixed(2)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-lbl">Contingency Reserve</div>
      <div class="stat-val" style="color:#059669;">$${plan.budget_summary.contingency_reserve.toLocaleString()}</div>
    </div>
  </div>

  <h2>1. Executive Summary</h2>
  <p>${plan.executive_summary}</p>

  <h2>2. Financial Breakdown & Category Allocation</h2>
  <table>
    <thead>
      <tr>
        <th style="width:28%;">Category</th>
        <th style="width:18%;">Allocation ($)</th>
        <th style="width:10%;">%</th>
        <th>Scope Description & Cost-Saving Recommendation</th>
      </tr>
    </thead>
    <tbody>
      ${categoriesHtml}
    </tbody>
  </table>

  <h2>3. Creative Concept & Theme: ${plan.personalized_ideas.theme_title}</h2>
  <p>${plan.personalized_ideas.theme_description}</p>
  
  <h3>Color Palette</h3>
  <div style="margin-bottom:12px;">
    ${swatchesHtml}
  </div>

  <div class="two-col">
    <div class="col">
      <h3>Curated Dining Concepts</h3>
      <ul>${menuHtml}</ul>
    </div>
    <div class="col">
      <h3>Interactive Activities</h3>
      <ul>${activitiesHtml}</ul>
    </div>
  </div>

  <h3>Speech / Toast Draft</h3>
  <blockquote>"${plan.personalized_ideas.speech_or_toast_prompt}"</blockquote>

  <h3>Custom Invitation Wording</h3>
  <blockquote>"${plan.personalized_ideas.invitation_copy}"</blockquote>

  <h2>4. Vendor Procurement Checklist</h2>
  <table>
    <thead>
      <tr>
        <th style="width:12%;">Status</th>
        <th style="width:18%;">Category</th>
        <th>Task & Scope</th>
        <th style="width:18%;">Target Deadline</th>
        <th style="width:16%;">Estimated Cost</th>
      </tr>
    </thead>
    <tbody>
      ${vendorHtml}
    </tbody>
  </table>

  <h2>5. Timeline & Operational Roadmap</h2>
  <h3>A. Milestone Planning Countdown</h3>
  <ul>
    ${milestonesHtml}
  </ul>

  <h3>B. Day-Of 'Run of Show' Minute-by-Minute Schedule</h3>
  <table>
    <thead>
      <tr>
        <th style="width:12%;">Time</th>
        <th style="width:10%;">Duration</th>
        <th>Activity</th>
        <th style="width:18%;">Lead Role</th>
        <th style="width:16%;">Location / Zone</th>
        <th>Contingency Note</th>
      </tr>
    </thead>
    <tbody>
      ${runOfShowHtml}
    </tbody>
  </table>

  <div style="margin-top:24px;border-top:1px solid #e2e8f0;padding-top:8px;font-size:10px;color:#94a3b8;text-align:center;">
    Master Blueprint generated via Celebration & Event Planner (PromptWars Challenge 5) · Timestamp: ${plan.generated_at}
  </div>
</body>
</html>`;

    // Use an invisible iframe for seamless, 100% reliable printing without popup blocking
    let iframe = document.getElementById('event-planner-print-frame');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'event-planner-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(printHtml);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setIsPrinting(false);
    }, 350);
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
            style={{ justifyContent: 'center', padding: '0.75rem', fontWeight: 700 }}
            onClick={handlePrint}
            disabled={isPrinting}
          >
            {isPrinting ? '⏳ Preparing PDF...' : '🖨️ Print / Save as PDF (Complete Blueprint)'}
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
