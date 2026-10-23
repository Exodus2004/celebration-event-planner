"""Unit tests for health endpoints, CORS, and OWASP security headers."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint() -> None:
    """Verifies that the health check endpoint returns 200 and healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "resilience_engine" in data
    assert "timestamp" in data


def test_root_endpoint() -> None:
    """Verifies root discovery endpoint response."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "docs_url" in data


def test_owasp_security_headers() -> None:
    """Ensures critical OWASP defensive security and telemetry headers are set."""
    response = client.get("/health")
    headers = response.headers

    assert headers.get("X-Content-Type-Options") == "nosniff"
    assert headers.get("X-Frame-Options") == "DENY"
    assert "Strict-Transport-Security" in headers
    assert headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert "camera=()" in headers.get("Permissions-Policy", "")
    assert headers.get("X-RateLimit-Limit") == "120"
    assert headers.get("X-RateLimit-Remaining") == "119"


def test_cors_headers_allowed() -> None:
    """Verifies that CORS headers permit universal access."""
    response = client.options(
        "/api/v1/plan",
        headers={
            "Origin": "https://example.com",
            "Access-Control-Request-Method": "POST",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "*"
