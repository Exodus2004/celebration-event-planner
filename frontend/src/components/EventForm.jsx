import React, { useState } from 'react';

const PRESETS = [
  {
    label: "💍 Sarah & Alex Autumn Nuptials",
    sub: "Vineyard Wedding · $38,000 · 120 Guests",
    data: {
      event_name: "Sarah & Alex Autumn Nuptials",
      event_type: "wedding",
      total_budget: 38000,
      guest_count: 120,
      target_date: "2027-10-16",
      location: "Napa Valley, CA",
      theme_preference: "Rustic Vineyard Elegance",
      dietary_preferences: ["Vegetarian", "Gluten-Free"],
      special_notes: "Sunset outdoor ceremony followed by covered pavilion dinner with live jazz band."
    }
  },
  {
    label: "🎂 Leo's 30th Studio 54 Bash",
    sub: "Milestone Birthday · $6,500 · 45 Guests",
    data: {
      event_name: "Leo's 30th Studio 54 Bash",
      event_type: "birthday",
      total_budget: 6500,
      guest_count: 45,
      target_date: "2027-11-20",
      location: "Austin, TX",
      theme_preference: "Studio 54 Retro Disco Fever",
      dietary_preferences: ["Vegan", "Nut-Free"],
      special_notes: "Neon cocktail bar, custom sparkler drip cake, and 360-degree video booth."
    }
  },
  {
    label: "🎪 Oakland Community Harvest Festival",
    sub: "Civic Gathering · $28,000 · 850 Guests",
    data: {
      event_name: "Oakland Community Harvest Festival",
      event_type: "community_event",
      total_budget: 28000,
      guest_count: 850,
      target_date: "2027-09-25",
      location: "Oakland Lake Park, CA",
      theme_preference: "Unity & Heritage Community Festival",
      dietary_preferences: ["Halal", "Vegan", "Kosher"],
      special_notes: "Public mainstage performances, artisanal food truck alley, and zero-waste stations."
    }
  }
];

const DIETARY_OPTIONS = ["Vegetarian", "Vegan", "Gluten-Free", "Halal", "Kosher", "Nut-Free", "Dairy-Free"];

export function EventForm({ onGeneratePlan, isLoading }) {
  const [formData, setFormData] = useState(PRESETS[0].data);
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePresetSelect = (preset, idx) => {
    setActivePresetIndex(idx);
    setFormData(preset.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleDietary = (diet) => {
    setFormData(prev => {
      const exists = prev.dietary_preferences.includes(diet);
      return {
        ...prev,
        dietary_preferences: exists
          ? prev.dietary_preferences.filter(d => d !== diet)
          : [...prev.dietary_preferences, diet]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGeneratePlan(formData);
  };

  return (
    <section aria-labelledby="planner-form-title">
      {/* Presets Selection */}
      <div className="presets-section">
        <p className="presets-label">⚡ Quick Presets (1-Click Instant Demo)</p>
        <div className="presets-grid" role="group" aria-label="Preset event blueprints">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              className={`preset-card ${activePresetIndex === idx ? 'active' : ''}`}
              onClick={() => handlePresetSelect(preset, idx)}
            >
              <span className="preset-title">{preset.label}</span>
              <span className="preset-subtitle">{preset.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="event_name">Celebration / Event Name *</label>
            <input
              id="event_name"
              name="event_name"
              type="text"
              required
              value={formData.event_name}
              onChange={handleChange}
              placeholder="e.g. Maya's Quinceañera or Summer Block Party"
            />
          </div>

          <div className="form-group">
            <label htmlFor="event_type">Event Category *</label>
            <select
              id="event_type"
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
            >
              <option value="wedding">💍 Wedding & Reception</option>
              <option value="birthday">🎂 Birthday & Milestone Celebration</option>
              <option value="community_event">🎪 Community Festival & Gathering</option>
              <option value="custom">✨ Custom Celebration</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="total_budget">Total Budget ($ USD) *</label>
            <input
              id="total_budget"
              name="total_budget"
              type="number"
              min="100"
              max="10000000"
              step="50"
              required
              value={formData.total_budget}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="guest_count">Estimated Guest Count *</label>
            <input
              id="guest_count"
              name="guest_count"
              type="number"
              min="1"
              max="50000"
              required
              value={formData.guest_count}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="target_date">Target Celebration Date *</label>
            <input
              id="target_date"
              name="target_date"
              type="date"
              required
              value={formData.target_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">City / Venue Location *</label>
            <input
              id="location"
              name="location"
              type="text"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="theme_preference">Aesthetic Theme / Mood Preference</label>
            <input
              id="theme_preference"
              name="theme_preference"
              type="text"
              value={formData.theme_preference || ''}
              onChange={handleChange}
              placeholder="e.g. Enchanted Forest, Boho Chic, Retro Disco, Royal Elegance"
            />
          </div>

          <div className="form-group full-width">
            <label>Dietary Restrictions / Catering Focus</label>
            <div className="dietary-tags-container">
              {DIETARY_OPTIONS.map(diet => {
                const isSelected = formData.dietary_preferences.includes(diet);
                return (
                  <button
                    key={diet}
                    type="button"
                    className={`dietary-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleDietary(diet)}
                    aria-pressed={isSelected}
                  >
                    {isSelected ? '✓ ' : '+ '}{diet}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group full-width">
            <button
              type="button"
              className="btn-secondary"
              style={{ width: 'fit-content' }}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? '▴ Hide Advanced Options' : '▾ Advanced Settings & Optional API Key'}
            </button>
          </div>

          {showAdvanced && (
            <>
              <div className="form-group full-width">
                <label htmlFor="special_notes">Special Constraints / Operational Notes</label>
                <textarea
                  id="special_notes"
                  name="special_notes"
                  rows="2"
                  value={formData.special_notes || ''}
                  onChange={handleChange}
                  placeholder="e.g. Needs wheelchair accessible ramps, outdoor acoustic noise ordinance at 10 PM."
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="gemini_api_key">Optional Gemini API Key (Default uses automated zero-downtime engine)</label>
                <input
                  id="gemini_api_key"
                  name="gemini_api_key"
                  type="password"
                  value={formData.gemini_api_key || ''}
                  onChange={handleChange}
                  placeholder="AIzaSy... (Leave blank to use built-in offline engine)"
                />
              </div>
            </>
          )}
        </div>

        <div className="form-footer">
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            aria-live="polite"
          >
            {isLoading ? '⏳ Synthesizing Blueprint...' : '⚡ Generate Master Event Blueprint'}
          </button>
        </div>
      </form>
    </section>
  );
}
