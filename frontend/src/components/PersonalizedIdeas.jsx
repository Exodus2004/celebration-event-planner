import React, { useState } from 'react';

export function PersonalizedIdeas({ ideas }) {
  const [copiedHex, setCopiedHex] = useState(null);
  const [copiedSpeech, setCopiedSpeech] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const copyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const copyText = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'speech') {
      setCopiedSpeech(true);
      setTimeout(() => setCopiedSpeech(false), 2000);
    } else {
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2000);
    }
  };

  return (
    <div className="content-card">
      <h2 className="card-title">✨ Personalized Creative Vision & Experience</h2>

      {/* Theme Overview */}
      <div style={{ marginBottom: '1.75rem', padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
          {ideas.theme_title}
        </h3>
        <p style={{ marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {ideas.theme_description}
        </p>
      </div>

      {/* Color Palette Swatches */}
      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
        🎨 Curated Color Palette (Click to Copy Hex)
      </h4>
      <div className="palette-grid">
        {ideas.color_palette.map((swatch, idx) => (
          <button
            key={idx}
            type="button"
            className="swatch-card"
            onClick={() => copyHex(swatch.hex_code)}
            aria-label={`Copy hex code ${swatch.hex_code} for ${swatch.name}`}
          >
            <div className="swatch-color" style={{ backgroundColor: swatch.hex_code }}></div>
            <div className="swatch-info">
              <p className="swatch-name">{swatch.name}</p>
              <p className="swatch-hex">
                {copiedHex === swatch.hex_code ? '✓ Copied!' : swatch.hex_code}
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {swatch.usage}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Grid: Menu & Interactive Activities */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        {/* Menu Concepts */}
        <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fbbf24' }}>
            🍽️ Curated Dining & Signature Drinks
          </h4>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {ideas.menu_concepts.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Interactive Activities */}
        <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#38bdf8' }}>
            🎉 Interactive Experiences & Icebreakers
          </h4>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {ideas.interactive_activities.map((act, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{act}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copywriting: Speech & Invitation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Speech Draft */}
        <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
              🎙️ Personalized Speech / Toast Draft
            </h4>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              onClick={() => copyText(ideas.speech_or_toast_prompt, 'speech')}
            >
              {copiedSpeech ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <blockquote style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--accent-purple)', paddingLeft: '0.75rem' }}>
            "{ideas.speech_or_toast_prompt}"
          </blockquote>
        </div>

        {/* Invitation Copy */}
        <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
              💌 Custom Invitation Wording
            </h4>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              onClick={() => copyText(ideas.invitation_copy, 'invite')}
            >
              {copiedInvite ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <blockquote style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--accent-cyan)', paddingLeft: '0.75rem' }}>
            "{ideas.invitation_copy}"
          </blockquote>
        </div>
      </div>
    </div>
  );
}
