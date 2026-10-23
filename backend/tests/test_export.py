"""Unit tests for the markdown export endpoint."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_markdown_export_roundtrip() -> None:
    """Verifies generating a plan and exporting it as Markdown."""
    plan_payload = {
        "event_name": "Summer Block Party 2027",
        "event_type": "community_event",
        "total_budget": 15000.0,
        "guest_count": 500,
        "target_date": "2027-07-24",
        "location": "Oakland Community Park",
    }
    plan_res = client.post("/api/v1/plan", json=plan_payload)
    assert plan_res.status_code == 200
    plan_data = plan_res.json()

    export_res = client.post("/api/v1/export/markdown", json=plan_data)
    assert export_res.status_code == 200
    export_data = export_res.json()
    md = export_data["markdown_content"]

    assert "# Summer Block Party 2027" in md
    assert "Community Event" in md
    assert "Executive Summary" in md
    assert "Financial Breakdown" in md
    assert "Vendor Procurement Checklist" in md
    assert "Day-Of 'Run of Show'" in md
