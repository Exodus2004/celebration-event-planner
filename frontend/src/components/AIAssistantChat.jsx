import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/apiClient.js';

const QUICK_PROMPTS = [
  "🌧️ What if rain is forecast for our outdoor reception?",
  "💰 How do I cut 15% from catering without guests noticing?",
  "🕯️ Suggest 3 affordable luxury centerpiece ideas",
  "⏱️ When should we schedule speeches and the first dance?"
];

export function AIAssistantChat({ currentPlan, onUpdateEngine }) {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello! I'm your GenAI Event Planning Consultant. I can help you solve logistics dilemmas, renegotiate supplier budgets, or design weather backups for '${currentPlan.event_name}'. How can I assist you right now?`,
      actions: ["Ask about rain backups", "Explore budget-cutting tactics", "Review timeline pacing"]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    const userMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsSending(true);

    try {
      const payload = {
        message: text,
        context_event_id: currentPlan.event_id,
        event_type: currentPlan.event_type,
        current_budget: currentPlan.budget_summary.total_budget,
        guest_count: currentPlan.guest_count
      };

      const result = await sendChatMessage(payload);
      if (onUpdateEngine) {
        onUpdateEngine(result.source);
      }

      const botMessage = {
        sender: 'assistant',
        text: result.data.reply,
        actions: result.data.suggested_actions,
        checklist_item: result.data.relevant_checklist_item,
        budget_impact: result.data.budget_impact
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: "I'm available to consult on your event parameters. Please try again or rephrase your question.",
          actions: []
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="content-card">
      <h2 className="card-title">🤖 Interactive GenAI Planning Consultant</h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Instant advice on budgeting dilemmas, supplier negotiations, and contingency protocols.
      </p>

      <div className="chat-container">
        {/* Quick Prompts */}
        <div className="chat-quick-prompts" role="group" aria-label="Quick question prompts">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className="quick-prompt-chip"
              onClick={() => handleSend(prompt)}
              disabled={isSending}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Log */}
        <div className="chat-messages" aria-live="polite">
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-bubble ${m.sender}`}>
              <p>{m.text}</p>

              {m.budget_impact && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#38bdf8' }}>
                  📊 <strong>Financial Note:</strong> {m.budget_impact}
                </div>
              )}

              {m.actions && m.actions.length > 0 && (
                <div className="chat-actions-container">
                  {m.actions.map((act, aIdx) => (
                    <span key={aIdx} className="chat-action-badge">
                      ✓ {act}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isSending && (
            <div className="chat-bubble assistant" style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
              Consultant is synthesizing recommendations...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          className="chat-input-bar"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <label htmlFor="chat-input-field" className="visually-hidden" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}>
            Ask the AI event planning assistant
          </label>
          <input
            id="chat-input-field"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about rain backups, cutting costs, seating arrangements..."
            disabled={isSending}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
            disabled={isSending || !inputText.trim()}
          >
            {isSending ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
