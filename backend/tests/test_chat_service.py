"""Unit tests for the AI planning assistant chat service."""

from app.schemas.event_schemas import ChatRequest, EventType
from app.services.assistant_service import generate_deterministic_assistant_reply


def test_chat_rain_contingency() -> None:
    """Verifies that rain questions trigger weather contingency protocol."""
    req = ChatRequest(message="What if it rains during the reception?")
    resp = generate_deterministic_assistant_reply(req)
    assert "tent" in resp.reply.lower()
    assert "umbrellas" in resp.reply.lower()
    assert len(resp.suggested_actions) >= 2


def test_chat_budget_cut_advice() -> None:
    """Verifies that budget reduction queries provide dollar estimates."""
    req = ChatRequest(
        message="How can I cut 15% from catering and alcohol?",
        current_budget=20000.0,
        event_type=EventType.WEDDING,
    )
    resp = generate_deterministic_assistant_reply(req)
    assert "$3,000.00" in resp.reply
    assert len(resp.suggested_actions) >= 2


def test_chat_centerpiece_advice() -> None:
    """Verifies decorative design recommendations."""
    req = ChatRequest(message="Suggest affordable centerpiece ideas.")
    resp = generate_deterministic_assistant_reply(req)
    assert "candle" in resp.reply.lower()


def test_chat_timeline_pacing() -> None:
    """Verifies speech and dance timing recommendations."""
    req = ChatRequest(message="When should we schedule the speeches and first dance?")
    resp = generate_deterministic_assistant_reply(req)
    assert "speeches" in resp.reply.lower()
    assert "first dance" in resp.reply.lower()
