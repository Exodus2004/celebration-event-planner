"""Algorithmic budget breakdown and financial optimization service."""

from app.schemas.event_schemas import BudgetCategory, BudgetSummary, EventType


def calculate_budget_summary(
    total_budget: float,
    guest_count: int,
    event_type: EventType,
) -> BudgetSummary:
    """Computes category allocations, per-guest numbers, and financial insights."""
    per_guest: float = round(total_budget / max(guest_count, 1), 2)

    categories_config: list[tuple[str, float, str, str]] = []

    if event_type == EventType.WEDDING:
        categories_config = [
            (
                "Venue & Rental Space",
                28.0,
                "Ceremony & reception hall rental, tables, chairs, bridal suite access.",
                "Book off-peak days (Friday or Sunday) or shoulder months to save up to 25% on venue fee.",
            ),
            (
                "Catering, Bar & Wedding Cake",
                32.0,
                "Multi-course plated or buffet dining, licensed bartending, signature cocktails, cake.",
                "Opt for a dual-station buffet or family-style dinner over individual plated service to cut waitstaff costs.",
            ),
            (
                "Photography & Cinematography",
                12.0,
                "Full-day photojournalist coverage, drone footage, digital edits, and archival album.",
                "Contract 8 hours instead of 12 hours of coverage, focusing on key moments from first look to first dance.",
            ),
            (
                "Floral, Lighting & Decor",
                10.0,
                "Ceremony arch, bridal party bouquets, centerpieces, ambient uplighting.",
                "Repurpose ceremony altar arrangements as sweetheart table and bar centerpieces.",
            ),
            (
                "DJ, Live Music & Audio",
                8.0,
                "Live acoustic prelude, wireless microphones, ceremony sound, and dynamic DJ/MC reception.",
                "Combine ceremony and reception audio under a single vendor package to eliminate redundant equipment fees.",
            ),
            (
                "Contingency & Emergency Reserve",
                10.0,
                "Weather modifications, extra guest arrivals, tip buffers, unexpected delivery fees.",
                "Keep this untouched until 7 days prior to absorb last-minute headcounts or overtime fees without stress.",
            ),
        ]
    elif event_type == EventType.BIRTHDAY:
        categories_config = [
            (
                "Venue & Event Atmosphere",
                25.0,
                "Private event lounge, rooftop, or hall rental with basic furniture.",
                "Consider private dining rooms with food and beverage minimums that waive the room rental fee.",
            ),
            (
                "Food, Artisanal Cake & Drinks",
                35.0,
                "Tapas, curated grazing stations, signature birthday cake, and specialty drinks.",
                "Order a smaller centerpiece display cake for cutting, accompanied by sheet cakes for guests.",
            ),
            (
                "Entertainment, Games & Music",
                15.0,
                "DJ, interactive party host, arcade rentals, photo booth with physical prints.",
                "Curate a custom playlist for early hours and hire the DJ for the peak 3-hour dance window.",
            ),
            (
                "Decor, Balloon Installations & Favors",
                10.0,
                "Custom backdrop, balloon arches, personalized signage, and take-home party gifts.",
                "Use oversized statement photo-opp backdrop rather than dressing every individual table.",
            ),
            (
                "Photography & Memories",
                10.0,
                "Candid party photographer capturing arrivals, toasts, and milestone celebrations.",
                "Hire an emerging photographer for a 3-hour highlight reel package.",
            ),
            (
                "Contingency & Incidentals",
                5.0,
                "Overtime room fees, extra appetizers, rideshare vouchers for VIP guests.",
                "Provides buffer for spontaneous guest additions or extended venue hours.",
            ),
        ]
    elif event_type == EventType.COMMUNITY_EVENT:
        categories_config = [
            (
                "Permits, Municipal Compliance & Security",
                15.0,
                "City street closure permits, licensed security, EMT standby, and insurance coverage.",
                "Apply for municipal civic grants or partner with local business improvement districts for permit fee waivers.",
            ),
            (
                "Venue, Stage, Tents & Sanitation",
                25.0,
                "Park permit, outdoor staging, commercial tents, generator power, and portable restrooms.",
                "Partner with local equipment sponsors in exchange for premier banner placement and stage naming rights.",
            ),
            (
                "Audio/Visual, Sound Engineering & Acts",
                20.0,
                "Mainstage line-array sound system, microphones, sound engineers, community performers.",
                "Invite talented local school bands and regional artists to perform alongside a headliner to balance artist fees.",
            ),
            (
                "Hospitality, Refreshments & Waste Management",
                20.0,
                "Volunteer meals, hydration stations, recycling/compost services, and sanitization stations.",
                "Invite curated food trucks who pay a vendor fee to attend, turning catering into a net-positive revenue stream.",
            ),
            (
                "Signage, Marketing & Accessibility",
                10.0,
                "Wayfinding signs, multilingual schedules, ramp rentals, social campaigns, printed programs.",
                "Utilize large-format QR codes linked to live digital schedules to eliminate printing waste and reprinting costs.",
            ),
            (
                "Contingency & Weather Preparedness",
                10.0,
                "Rain contingencies, wind ballast weights, emergency supply replenishment.",
                "Critical safety reserve for public gatherings to ensure smooth operational adaptations.",
            ),
        ]
    else:
        # Custom Event
        categories_config = [
            (
                "Venue & Physical Staging",
                30.0,
                "Location rental, staging, essential infrastructure.",
                "Inquire about multi-hour rates versus full-day flat fees.",
            ),
            (
                "Food & Beverage Hospitality",
                35.0,
                "Curated dining, bar service, dietary specialty items.",
                "Opt for seasonal, locally sourced produce to minimize supplier premiums.",
            ),
            (
                "Production, Audio & Visual",
                15.0,
                "Microphones, lighting, ambiance, multimedia.",
                "Test in-house venue equipment before contracting external AV rentals.",
            ),
            (
                "Decor, Styling & Branding",
                10.0,
                "Aesthetic elements, focal centerpieces, personalized signage.",
                "Focus investment on primary greeting and photo focal zones.",
            ),
            (
                "Contingency Reserve",
                10.0,
                "Incidentals and unplanned logistics buffer.",
                "Maintain intact until post-event reconciliation.",
            ),
        ]

    categories: list[BudgetCategory] = []
    contingency_amount: float = 0.0

    for name, pct, desc, tip in categories_config:
        allocated: float = round(total_budget * (pct / 100.0), 2)
        if "Contingency" in name:
            contingency_amount = allocated
        categories.append(
            BudgetCategory(
                name=name,
                allocated_amount=allocated,
                percentage=pct,
                description=desc,
                cost_saving_tip=tip,
            )
        )

    insights: list[str] = [
        f"Target guest allowance averages ${per_guest:,.2f} per person across all categories.",
        f"A dedicated contingency buffer of ${contingency_amount:,.2f} protects against unforeseen supplier surcharges.",
        "Priority allocation is directed toward attendee experience (Dining & Atmosphere) for maximum satisfaction.",
    ]

    return BudgetSummary(
        total_budget=total_budget,
        per_guest_cost=per_guest,
        contingency_reserve=contingency_amount,
        categories=categories,
        ai_budget_insights=insights,
    )
