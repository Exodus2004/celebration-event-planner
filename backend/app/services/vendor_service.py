"""Vendor procurement, checklist generation, and status management service."""

from app.schemas.event_schemas import EventType, VendorChecklistItem


def generate_vendor_checklist(
    event_type: EventType,
    total_budget: float,
) -> list[VendorChecklistItem]:
    """Generates structured vendor checklist with estimated budget allocations."""
    items: list[VendorChecklistItem] = []

    if event_type == EventType.WEDDING:
        items = [
            VendorChecklistItem(
                id="v-wed-1",
                category="Venue",
                title="Contract Ceremony & Reception Hall",
                description="Secure venue contract with alcohol licensing, insurance requirements, and load-in timings.",
                suggested_booking_deadline="9 Months Before",
                estimated_cost=round(total_budget * 0.28, 2),
                status="booked",
            ),
            VendorChecklistItem(
                id="v-wed-2",
                category="Catering & Bar",
                title="Sign Caterer & Schedule Menu Tasting",
                description="Finalize cocktail hour hors d'oeuvres, dinner entree options, and beverage corkage policy.",
                suggested_booking_deadline="7 Months Before",
                estimated_cost=round(total_budget * 0.32, 2),
                status="contacted",
            ),
            VendorChecklistItem(
                id="v-wed-3",
                category="Photography",
                title="Book Wedding Photographer & Videographer",
                description="Review portfolio albums, lock 8-hour day-of coverage, and schedule engagement portrait session.",
                suggested_booking_deadline="8 Months Before",
                estimated_cost=round(total_budget * 0.12, 2),
                status="contacted",
            ),
            VendorChecklistItem(
                id="v-wed-4",
                category="Floral & Styling",
                title="Engage Floral Designer & Event Stylist",
                description="Curate bridal bouquets, ceremony arch blooms, table centerpieces, and rental candelabras.",
                suggested_booking_deadline="5 Months Before",
                estimated_cost=round(total_budget * 0.10, 2),
                status="pending",
            ),
            VendorChecklistItem(
                id="v-wed-5",
                category="Music & Audio",
                title="Retain DJ / MC & Ceremony Acoustic Musician",
                description="Book DJ with wireless mic setup, uplighting bundle, and submit favorite / do-not-play tracks.",
                suggested_booking_deadline="6 Months Before",
                estimated_cost=round(total_budget * 0.08, 2),
                status="pending",
            ),
            VendorChecklistItem(
                id="v-wed-6",
                category="Bakery & Sweets",
                title="Order Custom Tiered Wedding Cake",
                description="Conduct flavor tasting (lemon curd, red velvet, salted caramel) and confirm delivery window.",
                suggested_booking_deadline="3 Months Before",
                estimated_cost=round(total_budget * 0.03, 2),
                status="pending",
            ),
            VendorChecklistItem(
                id="v-wed-7",
                category="Stationery & Day-Of Paper",
                title="Print Invitations, Menus & Seating Chart",
                description="Design typography suite, foil-stamped table numbers, place cards, and welcome sign.",
                suggested_booking_deadline="2 Months Before",
                estimated_cost=round(total_budget * 0.02, 2),
                status="pending",
            ),
        ]

    elif event_type == EventType.BIRTHDAY:
        items = [
            VendorChecklistItem(
                id="v-bday-1",
                category="Venue",
                title="Reserve Private Lounge or Rooftop Venue",
                description="Confirm private space minimums, AV capabilities, and guest curfew hours.",
                suggested_booking_deadline="6 Weeks Before",
                estimated_cost=round(total_budget * 0.25, 2),
                status="booked",
            ),
            VendorChecklistItem(
                id="v-bday-2",
                category="Food & Drinks",
                title="Order Curated Small Plates & Signature Bar",
                description="Arrange heavy passed appetizers, gourmet sliders, and two personalized themed cocktails.",
                suggested_booking_deadline="4 Weeks Before",
                estimated_cost=round(total_budget * 0.35, 2),
                status="contacted",
            ),
            VendorChecklistItem(
                id="v-bday-3",
                category="Entertainment",
                title="Book High-Energy DJ & Interactive Host",
                description="Contract DJ for 4-hour set with party lighting and wireless mic for milestone roasts.",
                suggested_booking_deadline="4 Weeks Before",
                estimated_cost=round(total_budget * 0.15, 2),
                status="pending",
            ),
            VendorChecklistItem(
                id="v-bday-4",
                category="Decor & Installations",
                title="Commission Custom Balloon Arch & Neon Sign",
                description="Order photogenic balloon garland in party palette with custom neon name / number sign.",
                suggested_booking_deadline="3 Weeks Before",
                estimated_cost=round(total_budget * 0.10, 2),
                status="pending",
            ),
            VendorChecklistItem(
                id="v-bday-5",
                category="Bakery",
                title="Design Milestone Showpiece Birthday Cake",
                description="Custom thematic sculpture cake with sparkler candles and matching cupcakes.",
                suggested_booking_deadline="2 Weeks Before",
                estimated_cost=round(total_budget * 0.05, 2),
                status="pending",
            ),
            VendorChecklistItem(
                id="v-bday-6",
                category="Photography",
                title="Hire Candid Event Photographer",
                description="3-hour party photo coverage capturing guest red carpet arrivals and celebratory moments.",
                suggested_booking_deadline="3 Weeks Before",
                estimated_cost=round(total_budget * 0.10, 2),
                status="pending",
            ),
        ]

    elif event_type == EventType.COMMUNITY_EVENT:
        items = [
            VendorChecklistItem(
                id="v-comm-1",
                category="Municipal Permits & Security",
                title="File City Permits & Book Security Team",
                description="Secure park/street permits, traffic management plan, and licensed guard service.",
                suggested_booking_deadline="12 Weeks Before",
                estimated_cost=round(total_budget * 0.15, 2),
                status="booked",
            ),
            VendorChecklistItem(
                id="v-comm-2",
                category="Staging & Rentals",
                title="Contract Stage, Commercial Tents & Generators",
                description="Reserve covered main stage, 20x20 vendor tents, sound-dampened generators, and portable restrooms.",
                suggested_booking_deadline="8 Weeks Before",
                estimated_cost=round(total_budget * 0.25, 2),
                status="contacted",
            ),
            VendorChecklistItem(
                id="v-comm-3",
                category="Audio / Visual Production",
                title="Hire Mainstage Sound Engineers & Production",
                description="Outdoor line-array speakers, digital mixing board, stage monitors, and live sound technician.",
                suggested_booking_deadline="6 Weeks Before",
                estimated_cost=round(total_budget * 0.20, 2),
                status="contacted",
            ),
            VendorChecklistItem(
                id="v-comm-4",
                category="Hospitality & Concessions",
                title="Organize Food Trucks & Hydration Infrastructure",
                description="Curate diverse local food truck lineup and establish free public water refill stations.",
                suggested_booking_deadline="6 Weeks Before",
                estimated_cost=round(total_budget * 0.15, 2),
                status="pending",
            ),
            VendorChecklistItem(
                id="v-comm-5",
                category="Signage & Marketing",
                title="Print Festival Banners & Accessible Wayfinding",
                description="Produce weatherproof vinyl banners, map signs, volunteer shirts, and schedule flyers.",
                suggested_booking_deadline="4 Weeks Before",
                estimated_cost=round(total_budget * 0.10, 2),
                status="pending",
            ),
            VendorChecklistItem(
                id="v-comm-6",
                category="Sanitation & Eco-Management",
                title="Contract Green Waste & Recycling Services",
                description="Setup three-stream waste stations (compost, recycle, landfill) and post-event cleanup crew.",
                suggested_booking_deadline="4 Weeks Before",
                estimated_cost=round(total_budget * 0.05, 2),
                status="pending",
            ),
        ]

    else:
        # Custom event
        items = [
            VendorChecklistItem(
                id="v-cust-1",
                category="Venue",
                title="Confirm Primary Location Agreement",
                description="Verify contract terms, capacity, and facility access.",
                suggested_booking_deadline="6 Weeks Before",
                estimated_cost=round(total_budget * 0.30, 2),
                status="booked",
            ),
            VendorChecklistItem(
                id="v-cust-2",
                category="Catering",
                title="Arrange Refreshments & Hospitality",
                description="Select menu options aligned with attendee preferences.",
                suggested_booking_deadline="4 Weeks Before",
                estimated_cost=round(total_budget * 0.35, 2),
                status="contacted",
            ),
            VendorChecklistItem(
                id="v-cust-3",
                category="Audio & Media",
                title="Reserve Technical & Presentation Gear",
                description="Ensure audio amplification and video displays are configured.",
                suggested_booking_deadline="3 Weeks Before",
                estimated_cost=round(total_budget * 0.15, 2),
                status="pending",
            ),
            VendorChecklistItem(
                id="v-cust-4",
                category="Supplies & Decor",
                title="Order Event Decor & Promotional Items",
                description="Acquire thematic styling and participant items.",
                suggested_booking_deadline="2 Weeks Before",
                estimated_cost=round(total_budget * 0.10, 2),
                status="pending",
            ),
        ]

    return items
