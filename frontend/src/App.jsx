import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.jsx';
import { EventForm } from './components/EventForm.jsx';
import { BudgetBreakdown } from './components/BudgetBreakdown.jsx';
import { TimelineView } from './components/TimelineView.jsx';
import { VendorChecklist } from './components/VendorChecklist.jsx';
import { PersonalizedIdeas } from './components/PersonalizedIdeas.jsx';
import { AIAssistantChat } from './components/AIAssistantChat.jsx';
import { ExportModal } from './components/ExportModal.jsx';
import { requestEventPlan } from './services/apiClient.js';
import { generateClientPlan } from './services/resilientEngine.js';

export function App() {
  const [currentPlan, setCurrentPlan] = useState(() => {
    // Start with a rich initial preset so page load is never empty
    return generateClientPlan({
      event_name: "Sarah & Alex Autumn Nuptials",
      event_type: "wedding",
      total_budget: 38000,
      guest_count: 120,
      target_date: "2027-10-16",
      location: "Napa Valley, CA",
      theme_preference: "Rustic Vineyard Elegance",
      dietary_preferences: ["Vegetarian", "Gluten-Free"],
      special_notes: "Sunset outdoor ceremony followed by covered pavilion dinner."
    });
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [engineSource, setEngineSource] = useState('resilient');
  const [isLoading, setIsLoading] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Check backend health on initial mount
  useEffect(() => {
    fetch('/health')
      .then(res => {
        if (res.ok) setEngineSource('cloud');
      })
      .catch(() => {
        // Keeps resilient engine active smoothly
      });
  }, []);

  const handleToggleContrast = () => {
    setIsHighContrast(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.setAttribute('data-theme', 'high-contrast');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      return next;
    });
  };

  const handleGeneratePlan = async (formData) => {
    setIsLoading(true);
    setNotification(null);
    try {
      // Tactile pacing buffer so user visibly sees the synthesis reaction
      const [result] = await Promise.all([
        requestEventPlan(formData),
        new Promise(resolve => setTimeout(resolve, 450))
      ]);

      setCurrentPlan(result.data);
      setEngineSource(result.source);
      setNotification({
        message: `✨ Master Blueprint for "${result.data.event_name}" (${result.data.event_type.toUpperCase()}) successfully synthesized!`,
        type: 'success'
      });

      // Smooth scroll directly to the updated blueprint results section
      setTimeout(() => {
        const resultsEl = document.getElementById('blueprint-results');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      console.error("Plan generation error caught by boundary:", err);
      // Failsafe: calculate on client
      const clientFallback = generateClientPlan(formData);
      setCurrentPlan(clientFallback);
      setEngineSource('resilient');
      setNotification({
        message: `⚡ High-Speed Resilient Blueprint for "${clientFallback.event_name}" generated!`,
        type: 'success'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Header
        engineSource={engineSource}
        onToggleContrast={handleToggleContrast}
        isHighContrast={isHighContrast}
        onOpenExport={() => setShowExportModal(true)}
      />

      <main>
        {/* Input Form & Presets */}
        <EventForm
          onGeneratePlan={handleGeneratePlan}
          isLoading={isLoading}
        />

        {/* Results Anchor & Notification */}
        <div id="blueprint-results" className="results-anchor">
          {notification && (
            <div className="notification-banner success" role="alert" aria-live="assertive">
              <span>{notification.message}</span>
              <button 
                type="button" 
                onClick={() => setNotification(null)} 
                className="btn-close-toast"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="tabs-nav" aria-label="Event Blueprint Navigation">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📋 Master Overview
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            💰 Budget Breakdown
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            ⏱️ Timelines & Run-of-Show
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'vendors' ? 'active' : ''}`}
            onClick={() => setActiveTab('vendors')}
          >
            📑 Vendor Checklists
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'ideas' ? 'active' : ''}`}
            onClick={() => setActiveTab('ideas')}
          >
            ✨ Creative Ideas & Themes
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'assistant' ? 'active' : ''}`}
            onClick={() => setActiveTab('assistant')}
          >
            🤖 GenAI Planning Assistant
          </button>
        </nav>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="dashboard-grid">
            <section className="content-card" style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <h2 className="card-title" style={{ margin: 0 }}>
                  🌟 {currentPlan.event_name}
                </h2>
                <span className="badge-status badge-booked">
                  {currentPlan.event_type.toUpperCase()} BLUEPRINT
                </span>
              </div>

              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                {currentPlan.executive_summary}
              </p>

              <div className="stats-grid">
                <div className="stat-box">
                  <p className="stat-label">Total Budget</p>
                  <p className="stat-value">${currentPlan.budget_summary.total_budget.toLocaleString()}</p>
                </div>
                <div className="stat-box">
                  <p className="stat-label">Guest Count</p>
                  <p className="stat-value">{currentPlan.guest_count.toLocaleString()}</p>
                </div>
                <div className="stat-box">
                  <p className="stat-label">Per Guest</p>
                  <p className="stat-value">${currentPlan.budget_summary.per_guest_cost.toFixed(2)}</p>
                </div>
                <div className="stat-box">
                  <p className="stat-label">Target Date</p>
                  <p className="stat-value" style={{ fontSize: '1.25rem' }}>{currentPlan.target_date}</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setShowExportModal(true)}
                >
                  📤 Share / Export Blueprint
                </button>
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Budget */}
        {activeTab === 'budget' && (
          <BudgetBreakdown
            budgetSummary={currentPlan.budget_summary}
            totalBudget={currentPlan.budget_summary.total_budget}
          />
        )}

        {/* Tab 3: Timeline */}
        {activeTab === 'timeline' && (
          <TimelineView
            timelinePlan={currentPlan.timeline_plan}
          />
        )}

        {/* Tab 4: Vendors */}
        {activeTab === 'vendors' && (
          <VendorChecklist
            items={currentPlan.vendor_checklist}
            eventId={currentPlan.event_id}
          />
        )}

        {/* Tab 5: Creative Ideas */}
        {activeTab === 'ideas' && (
          <PersonalizedIdeas
            ideas={currentPlan.personalized_ideas}
          />
        )}

        {/* Tab 6: Assistant */}
        {activeTab === 'assistant' && (
          <AIAssistantChat
            currentPlan={currentPlan}
            onUpdateEngine={setEngineSource}
          />
        )}
      </main>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          plan={currentPlan}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}
