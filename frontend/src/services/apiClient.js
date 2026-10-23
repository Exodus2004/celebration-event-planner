/**
 * High-Resilience API Client with Automatic Failover
 * Guarantees that neither network errors, CORS issues, nor server cold-starts
 * ever cause a user-facing failure.
 */

import { generateClientPlan, generateClientChatReply } from './resilientEngine.js';

const API_BASE = import.meta.env.VITE_API_URL || '';

async function fetchWithTimeout(resource, options = {}, timeoutMs = 3500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export async function requestEventPlan(formData) {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/api/v1/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }, 3000);

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return { data, source: 'cloud' };
  } catch (err) {
    console.warn('[Resilience Active] Fast-switching to internal client engine due to:', err.message);
    const fallbackData = generateClientPlan(formData);
    return { data: fallbackData, source: 'resilient' };
  }
}

export async function sendChatMessage(chatPayload) {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chatPayload)
    }, 3000);

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return { data, source: 'cloud' };
  } catch (err) {
    console.warn('[Resilience Active] Generating chat response via resilient assistant engine:', err.message);
    const fallbackReply = generateClientChatReply(chatPayload.message, chatPayload);
    return { data: fallbackReply, source: 'resilient' };
  }
}

export async function exportPlanToMarkdown(planData) {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/api/v1/export/markdown`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(planData)
    }, 2500);

    if (response.ok) {
      const result = await response.json();
      return result.markdown_content;
    }
  } catch (err) {
    console.warn('[Resilience Active] Exporting markdown on client:', err.message);
  }

  // Fallback client-side markdown generator
  let md = `# ${planData.event_name} — Master Event Blueprint\n\n`;
  md += `**Event Type:** ${planData.event_type} | **Date:** ${planData.target_date} | **Location:** ${planData.location}\n`;
  md += `**Total Budget:** $${planData.budget_summary.total_budget.toLocaleString()} | **Guests:** ${planData.guest_count.toLocaleString()}\n\n`;
  md += `## Executive Summary\n${planData.executive_summary}\n\n`;
  md += `## Theme: ${planData.personalized_ideas.theme_title}\n${planData.personalized_ideas.theme_description}\n\n`;
  md += `### Color Palette\n`;
  planData.personalized_ideas.color_palette.forEach(c => {
    md += `- **${c.name}** (${c.hex_code}): ${c.usage}\n`;
  });
  md += `\n### Budget Breakdown\n`;
  planData.budget_summary.categories.forEach(b => {
    md += `- **${b.name}**: $${b.allocated_amount.toLocaleString()} (${b.percentage}%) — ${b.cost_saving_tip}\n`;
  });
  return md;
}
