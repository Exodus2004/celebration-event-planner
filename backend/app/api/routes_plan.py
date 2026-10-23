"""Event planning API endpoints."""

import datetime
import uuid

from fastapi import APIRouter, status

from app.schemas.event_schemas import EventPlanRequest, EventPlanResponse
from app.services.budget_service import calculate_budget_summary
from app.services.genai_service import generate_personalized_ideas_with_fallback
from app.services.timeline_service import generate_timeline_plan
from app.services.vendor_service import generate_vendor_checklist

router = APIRouter(prefix="/api/v1", tags=["Planner"])


@router.post(
    "/plan",
    response_model=EventPlanResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate comprehensive event plan",
)
async def create_event_plan(req: EventPlanRequest) -> EventPlanResponse:
    """Creates a complete celebration and event plan with budget, timeline, checklist, and ideas."""
    event_id: str = f"evt-{uuid.uuid4().hex[:8]}"
    now_iso: str = datetime.datetime.now(datetime.UTC).isoformat()

    # Calculate financial breakdown
    budget_summary = calculate_budget_summary(
        total_budget=req.total_budget,
        guest_count=req.guest_count,
        event_type=req.event_type,
    )

    # Generate milestone & day-of timelines
    timeline_plan = generate_timeline_plan(
        event_type=req.event_type,
        event_name=req.event_name,
    )

    # Generate vendor checklists
    vendor_checklist = generate_vendor_checklist(
        event_type=req.event_type,
        total_budget=req.total_budget,
    )

    # Synthesize personalized creative ideas (Gemini or deterministic engine)
    ideas, engine_used = await generate_personalized_ideas_with_fallback(req)

    summary = (
        f"Master plan for '{req.event_name}' ({req.event_type.value.replace('_', ' ').title()}) "
        f"with ${req.total_budget:,.2f} budget for {req.guest_count} guests in {req.location}. "
        f"Featuring theme '{ideas.theme_title}' with {len(budget_summary.categories)} budgeted categories, "
        f"{len(timeline_plan.milestones)} milestone phases, {len(timeline_plan.run_of_show)} day-of execution blocks, "
        f"and {len(vendor_checklist)} procurement milestones."
    )

    return EventPlanResponse(
        event_id=event_id,
        event_name=req.event_name,
        event_type=req.event_type,
        guest_count=req.guest_count,
        location=req.location,
        target_date=req.target_date,
        generated_at=now_iso,
        engine_used=engine_used,
        budget_summary=budget_summary,
        timeline_plan=timeline_plan,
        vendor_checklist=vendor_checklist,
        personalized_ideas=ideas,
        executive_summary=summary,
    )
