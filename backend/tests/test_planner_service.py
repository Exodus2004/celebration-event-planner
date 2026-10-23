"""Unit tests for domain logic across weddings, birthdays, and community events."""

from app.schemas.event_schemas import EventPlanRequest, EventType
from app.services.budget_service import calculate_budget_summary
from app.services.genai_service import generate_deterministic_ideas
from app.services.timeline_service import generate_timeline_plan
from app.services.vendor_service import generate_vendor_checklist


def test_wedding_budget_allocation_integrity() -> None:
    """Verifies that wedding budget categories correctly sum to 100%."""
    total_budget = 40000.0
    guests = 100
    summary = calculate_budget_summary(total_budget, guests, EventType.WEDDING)

    total_allocated = sum(c.allocated_amount for c in summary.categories)
    assert abs(total_allocated - total_budget) < 1.0
    assert summary.per_guest_cost == 400.0
    assert summary.contingency_reserve > 0.0
    assert len(summary.categories) == 6


def test_birthday_budget_allocation_integrity() -> None:
    """Verifies birthday budget calculations."""
    total_budget = 5000.0
    guests = 25
    summary = calculate_budget_summary(total_budget, guests, EventType.BIRTHDAY)

    total_allocated = sum(c.allocated_amount for c in summary.categories)
    assert abs(total_allocated - total_budget) < 1.0
    assert summary.per_guest_cost == 200.0
    assert len(summary.categories) == 6


def test_community_event_budget_allocation() -> None:
    """Verifies community event budget includes municipal compliance and sanitation."""
    total_budget = 25000.0
    guests = 800
    summary = calculate_budget_summary(total_budget, guests, EventType.COMMUNITY_EVENT)

    category_names = [c.name for c in summary.categories]
    assert any("Permit" in name for name in category_names)
    assert any("Sanitation" in name for name in category_names)
    assert summary.per_guest_cost == 31.25


def test_timeline_dual_tier_generation() -> None:
    """Verifies that milestone planning and day-of run-of-show are both populated."""
    wedding_tl = generate_timeline_plan(EventType.WEDDING, "Gala Nuptials")
    assert len(wedding_tl.milestones) >= 5
    assert len(wedding_tl.run_of_show) >= 8

    community_tl = generate_timeline_plan(EventType.COMMUNITY_EVENT, "Harbor Festival")
    assert len(community_tl.milestones) >= 4
    assert len(community_tl.run_of_show) >= 8


def test_vendor_checklist_generation() -> None:
    """Verifies vendor checklists have deadlines, costs, and valid statuses."""
    items = generate_vendor_checklist(EventType.WEDDING, 50000.0)
    assert len(items) >= 5
    for item in items:
        assert item.estimated_cost >= 0.0
        assert item.status in {"pending", "contacted", "booked", "completed"}
        assert len(item.suggested_booking_deadline) > 0


def test_deterministic_personalized_ideas() -> None:
    """Verifies creative synthesis generation for themes, palettes, and menus."""
    req = EventPlanRequest(
        event_name="Leo's 30th Birthday",
        event_type=EventType.BIRTHDAY,
        total_budget=8000.0,
        guest_count=40,
        target_date="2027-11-20",
        location="Austin, TX",
        theme_preference="Retro Disco",
    )
    ideas = generate_deterministic_ideas(req)
    assert "Disco" in ideas.theme_title
    assert len(ideas.color_palette) >= 3
    assert all(c.hex_code.startswith("#") for c in ideas.color_palette)
    assert len(ideas.menu_concepts) >= 3
    assert len(ideas.interactive_activities) >= 3
    assert len(ideas.speech_or_toast_prompt) > 20
    assert len(ideas.invitation_copy) > 20
