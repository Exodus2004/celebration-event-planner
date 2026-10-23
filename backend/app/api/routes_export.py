"""Export services converting structured event plans into shareable Markdown documents."""

from fastapi import APIRouter, status
from pydantic import BaseModel

from app.schemas.event_schemas import EventPlanResponse

router = APIRouter(prefix="/api/v1", tags=["Export"])


class ExportMarkdownResponse(BaseModel):
    markdown_content: str


@router.post(
    "/export/markdown",
    response_model=ExportMarkdownResponse,
    status_code=status.HTTP_200_OK,
    summary="Export plan as formatted Markdown document",
)
async def export_plan_markdown(plan: EventPlanResponse) -> ExportMarkdownResponse:
    """Renders the comprehensive event plan into clean, print-ready Markdown text."""
    lines: list[str] = [
        f"# {plan.event_name} — Master Event Blueprint",
        f"**Event Type:** {plan.event_type.value.replace('_', ' ').title()}  ",
        f"**Date:** {plan.target_date} | **Location:** {plan.location}  ",
        f"**Guest Count:** {plan.guest_count:,} | **Total Budget:** ${plan.budget_summary.total_budget:,.2f}  ",
        f"**Engine:** `{plan.engine_used}` | **Generated:** {plan.generated_at}  \n",
        "---",
        "## 1. Executive Summary",
        plan.executive_summary,
        "\n---",
        "## 2. Creative Concept & Personalized Theme",
        f"### {plan.personalized_ideas.theme_title}",
        plan.personalized_ideas.theme_description,
        "\n#### Color Palette",
        "| Color Name | Hex Code | Role / Usage |",
        "|---|---|---|",
    ]

    for c in plan.personalized_ideas.color_palette:
        lines.append(f"| {c.name} | `{c.hex_code}` | {c.usage} |")

    lines.extend(
        [
            "\n#### Curated Menu & Dining Concepts",
        ]
    )
    for m in plan.personalized_ideas.menu_concepts:
        lines.append(f"- {m}")

    lines.extend(
        [
            "\n#### Interactive Activities & Experiences",
        ]
    )
    for a in plan.personalized_ideas.interactive_activities:
        lines.append(f"- {a}")

    lines.extend(
        [
            "\n#### Speech & Toast Prompt",
            f"> {plan.personalized_ideas.speech_or_toast_prompt}",
            "\n#### Invitation Copy",
            f"> {plan.personalized_ideas.invitation_copy}",
            "\n---",
            "## 3. Financial Breakdown & Budget Allocation",
            f"- **Per Guest Allowance:** ${plan.budget_summary.per_guest_cost:,.2f}",
            f"- **Contingency Reserve:** ${plan.budget_summary.contingency_reserve:,.2f}\n",
            "| Category | Allocation | % | Description & Savings Tip |",
            "|---|---|---|---|",
        ]
    )

    for b in plan.budget_summary.categories:
        lines.append(
            f"| **{b.name}** | ${b.allocated_amount:,.2f} | {b.percentage:.1f}% | {b.description} *Tip: {b.cost_saving_tip}* |"
        )

    lines.extend(
        [
            "\n---",
            "## 4. Vendor Procurement Checklist",
            "| Status | Category | Task | Deadline | Est. Cost |",
            "|---|---|---|---|---|",
        ]
    )

    for v in plan.vendor_checklist:
        status_badge = (
            "✅ Booked" if v.status == "booked" else ("⏳ Contacted" if v.status == "contacted" else "⬜ Pending")
        )
        lines.append(
            f"| {status_badge} | {v.category} | **{v.title}**: {v.description} | {v.suggested_booking_deadline} | ${v.estimated_cost:,.2f} |"
        )

    lines.extend(
        [
            "\n---",
            "## 5. Timeline & Execution Roadmap",
            "### A. Milestone Planning Countdown",
        ]
    )

    for ms in plan.timeline_plan.milestones:
        star = "⭐ " if ms.is_critical else ""
        lines.append(f"- {star}**[{ms.timeframe}] {ms.title}** (Lead: *{ms.owner_role}*): {ms.description}")

    lines.extend(
        [
            "\n### B. Day-Of 'Run of Show' Minute-by-Minute Schedule",
            "| Time | Duration | Activity | Lead | Zone | Contingency / Pacing |",
            "|---|---|---|---|---|---|",
        ]
    )

    for r in plan.timeline_plan.run_of_show:
        lines.append(
            f"| **{r.time}** | {r.duration_minutes}m | {r.activity} | {r.lead_person} | {r.location_zone} | {r.contingency_note} |"
        )

    md = "\n".join(lines)
    return ExportMarkdownResponse(markdown_content=md)
