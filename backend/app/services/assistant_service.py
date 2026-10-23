"""Interactive AI planning assistant service for event advice and dilemma resolution."""

import os

from app.schemas.event_schemas import ChatRequest, ChatResponse


def generate_deterministic_assistant_reply(req: ChatRequest) -> ChatResponse:
    """Provides high-context event advice algorithmically without external network dependencies."""
    q: str = req.message.lower().strip()
    budget: float = req.current_budget or 10000.0

    if "rain" in q or "weather" in q:
        reply = (
            "For outdoor weather contingencies, activate a 72-hour weather trigger:\n"
            "1. Reserve a clear-span commercial tent with sidewalls 14 days in advance (pay a 30% refundable hold deposit).\n"
            "2. Ensure hard flooring or elevated subfloor over turf to prevent mud accumulation.\n"
            "3. Stock 50 matching clear dome umbrellas for guest arrivals and photography.\n"
            "4. Designate a dry covered transition zone for catering and audio equipment."
        )
        actions = [
            "Confirm tent hold deadline with rental supplier",
            "Purchase 30-50 clear umbrellas",
            "Establish indoor photo alternative location",
        ]
        return ChatResponse(
            reply=reply,
            suggested_actions=actions,
            relevant_checklist_item="Staging & Rentals Contingency",
            budget_impact="Approx. 5-8% contingency fund allocation",
        )

    if "save" in q or "cut" in q or "budget" in q or "cheap" in q:
        saved_amount = round(budget * 0.15, 2)
        reply = (
            f"Here are 3 high-impact strategies to trim up to 15% (~${saved_amount:,.2f}) without reducing guest enjoyment:\n"
            "1. Bar Optimization: Switch from open full-liquor to a curated Wine, Craft Beer & 2 Signature Cocktails format (saves ~25% on alcohol costs).\n"
            "2. Floral Repurposing: Design ceremony altar arrangements so they can be transferred directly to the head table and bar during cocktail hour.\n"
            "3. Digital Paper Suite: Use premium digital RSVP portals for save-the-dates and menus, keeping physical print runs only for key signage."
        )
        actions = [
            "Switch to Signature Drinks + Beer/Wine format",
            "Instruct floral designer to create dual-purpose arrangements",
            "Adopt digital RSVP system to reduce printing & postage costs",
        ]
        return ChatResponse(
            reply=reply,
            suggested_actions=actions,
            relevant_checklist_item="Catering & Bar Optimization",
            budget_impact=f"Potential savings of up to ${saved_amount:,.2f}",
        )

    if "centerpiece" in q or "decor" in q or "flower" in q:
        reply = (
            "Here are 3 elevated centerpiece concepts that maximize visual drama at manageable cost:\n"
            "1. Hurricane Candle Clusters: Floating taper and pillar candles in multi-height glass cylinders surrounded by loose Italian ruscus greenery.\n"
            "2. High-Low Dynamic Tables: Alternate between tall minimalist gold floral risers on 30% of tables and low bud-vase clusters on the remaining 70% to add visual dimension.\n"
            "3. Potted Topiaries or Herb Pots: Rosemary and olive trees in terracotta urns that double as sustainable take-home gifts for guests."
        )
        actions = [
            "Review centerpiece rental inventory",
            "Select 2 alternating table centerpiece styles",
            "Order pillar candle cylinders in bulk",
        ]
        return ChatResponse(
            reply=reply,
            suggested_actions=actions,
            relevant_checklist_item="Floral & Styling",
            budget_impact="Saves 20-30% compared to dense floral arrangements",
        )

    if "timeline" in q or "schedule" in q or "dance" in q or "speech" in q:
        reply = (
            "Key timeline pacing recommendations for maximum guest engagement:\n"
            "1. Speeches / Toasts: Limit to 2-3 speakers maximum, strictly capped at 3 minutes each, delivered during the salad course before entrees arrive.\n"
            "2. First Dance: Schedule immediately upon grand entrance into the room—it commands 100% of the room's attention before dinner starts.\n"
            "3. Cake Cutting: Perform 30 minutes after dinner service to signal the start of dancing and open the dessert station."
        )
        actions = [
            "Brief speakers on 3-minute target limit",
            "Coordinate music cue with DJ for entrance and dance",
            "Have dessert station pre-staged near the cake table",
        ]
        return ChatResponse(
            reply=reply,
            suggested_actions=actions,
            relevant_checklist_item="Run of Show Coordination",
            budget_impact="Zero financial cost, high experiential impact",
        )

    # General event planning assistant fallback
    event_label: str = req.event_type.value.replace("_", " ").title() if req.event_type else "Celebration"
    reply = (
        f"For your {event_label}, priority focus should be on guest journey, clear timing transitions, "
        f"and staying aligned with your ${budget:,.2f} budget allocation. "
        "Would you like recommendations on catering menus, vendor contract timelines, entertainment pacing, or budget rebalancing?"
    )
    actions = [
        "Review budget category allocations",
        "Inspect day-of run-of-show milestones",
        "Confirm vendor booking deadlines",
    ]
    return ChatResponse(
        reply=reply,
        suggested_actions=actions,
        relevant_checklist_item="General Planning",
        budget_impact="Tracked against current budget",
    )


async def ask_assistant_with_fallback(req: ChatRequest) -> ChatResponse:
    """Answers queries via Gemini API if available, falling back smoothly to deterministic assistant."""
    api_key: str | None = req.gemini_api_key or os.getenv("GEMINI_API_KEY")

    if not api_key:
        return generate_deterministic_assistant_reply(req)

    try:
        import google.generativeai as genai

        genai.configure(api_key=api_key)  # type: ignore[attr-defined]
        model = genai.GenerativeModel("gemini-1.5-flash")  # type: ignore[attr-defined]

        system_instruction = (
            "You are a master event planning consultant. Answer user questions with actionable, "
            "practical advice, specific numbers, and concise next steps."
        )

        prompt = (
            f"{system_instruction}\n\n"
            f"User Query: {req.message}\n"
            f"Event Type: {req.event_type.value if req.event_type else 'Not specified'}\n"
            f"Budget: ${req.current_budget:,.2f if req.current_budget else 0.0}\n"
            f"Guests: {req.guest_count or 'Not specified'}\n\n"
            "Provide a helpful 2-4 paragraph response with actionable recommendations."
        )

        response = await model.generate_content_async(prompt)
        if response and response.text:
            text: str = response.text.strip()
            return ChatResponse(
                reply=text,
                suggested_actions=[
                    "Implement recommended adjustment in event checklist",
                    "Update timeline with new operational considerations",
                    "Recalibrate category budget allocation",
                ],
                relevant_checklist_item="AI Recommendation",
                budget_impact="Review category adjustment",
            )
    except Exception:
        pass

    return generate_deterministic_assistant_reply(req)
