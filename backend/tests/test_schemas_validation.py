"""Unit tests for input schema validation and boundary constraints."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_valid_event_plan_request() -> None:
    """Tests successful processing of a compliant wedding plan payload."""
    payload = {
        "event_name": "Sarah & Alex Autumn Nuptials",
        "event_type": "wedding",
        "total_budget": 35000.0,
        "guest_count": 120,
        "target_date": "2027-10-18",
        "location": "Napa Valley, CA",
        "theme_preference": "Rustic Vineyard Elegance",
        "dietary_preferences": ["Vegetarian", "Gluten-Free"],
        "special_notes": "Outdoor ceremony with sunset cocktail hour.",
    }
    response = client.post("/api/v1/plan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["event_name"] == "Sarah & Alex Autumn Nuptials"
    assert data["event_type"] == "wedding"
    assert data["guest_count"] == 120
    assert "budget_summary" in data
    assert "timeline_plan" in data
    assert "vendor_checklist" in data
    assert "personalized_ideas" in data


def test_reject_negative_budget() -> None:
    """Verifies that non-positive budgets fail validation with 422 Unprocessable Entity."""
    payload = {
        "event_name": "Zero Budget Test",
        "event_type": "birthday",
        "total_budget": -500.0,
        "guest_count": 50,
        "target_date": "2027-05-01",
        "location": "Denver, CO",
    }
    response = client.post("/api/v1/plan", json=payload)
    assert response.status_code == 422


def test_reject_zero_guest_count() -> None:
    """Verifies that guest count < 1 is rejected."""
    payload = {
        "event_name": "Zero Guest Test",
        "event_type": "birthday",
        "total_budget": 5000.0,
        "guest_count": 0,
        "target_date": "2027-05-01",
        "location": "Denver, CO",
    }
    response = client.post("/api/v1/plan", json=payload)
    assert response.status_code == 422


def test_reject_invalid_event_type() -> None:
    """Verifies that invalid event types are caught."""
    payload = {
        "event_name": "Invalid Event Type Test",
        "event_type": "intergalactic_voyage",
        "total_budget": 5000.0,
        "guest_count": 25,
        "target_date": "2027-05-01",
        "location": "Denver, CO",
    }
    response = client.post("/api/v1/plan", json=payload)
    assert response.status_code == 422
