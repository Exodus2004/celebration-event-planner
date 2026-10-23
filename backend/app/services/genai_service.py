"""GenAI synthesis service with dual-mode cloud API and deterministic zero-downtime resilience."""

import json
import os

from app.schemas.event_schemas import (
    ColorPaletteItem,
    EventPlanRequest,
    EventType,
    PersonalizedIdeas,
)


def generate_deterministic_ideas(req: EventPlanRequest) -> PersonalizedIdeas:
    """Generates rich, context-aware personalized ideas algorithmically without external network dependencies."""
    theme_input: str = (req.theme_preference or "").strip().lower()

    if req.event_type == EventType.WEDDING:
        if "rustic" in theme_input or "barn" in theme_input:
            title = "Rustic Vineyard Elegance"
            desc = f"An enchanting blend of warm reclaimed oak, cascading greenery, and candlelit ambiance in {req.location}."
            palette = [
                ColorPaletteItem(name="Eucalyptus Sage", hex_code="#87A96B", usage="Foliage & Linens"),
                ColorPaletteItem(name="Warm Champagne", hex_code="#F7E7CE", usage="Drapery & Silk Ribbons"),
                ColorPaletteItem(name="Terracotta Clay", hex_code="#E2725B", usage="Accent Florals & Stationery"),
                ColorPaletteItem(name="Aged Walnut", hex_code="#5C4033", usage="Wood Tables & Signage"),
            ]
        elif "modern" in theme_input or "minimal" in theme_input:
            title = "Modern Monochrome & Botanical Chic"
            desc = f"Clean architectural lines, sculptural white orchids, and sleek black accents tailored for a contemporary celebration in {req.location}."
            palette = [
                ColorPaletteItem(name="Crisp Alabaster", hex_code="#FBFBFA", usage="Primary Table Linens & Backdrops"),
                ColorPaletteItem(name="Obsidian Matte", hex_code="#1E1E1E", usage="Cutlery & Modern Typography"),
                ColorPaletteItem(
                    name="Brushed Champagne Gold", hex_code="#D4AF37", usage="Geometric Lanterns & Chargers"
                ),
                ColorPaletteItem(name="Smoky Slate", hex_code="#708090", usage="Velvet Lounge Accents"),
            ]
        else:
            title = "Enchanted Garden Romance"
            desc = f"A timeless, whimsical celebration brimming with lush garden roses, fairy-light canopies, and soft acoustic melodies in {req.location}."
            palette = [
                ColorPaletteItem(name="Dusty Rose", hex_code="#DCAE96", usage="Bridal Party & Floral Focal Points"),
                ColorPaletteItem(name="French Lilac", hex_code="#86608E", usage="Velvet Ribbons & Macarons"),
                ColorPaletteItem(name="Cream Ivory", hex_code="#FFFFF0", usage="Ceremony Draping"),
                ColorPaletteItem(name="Gilded Brass", hex_code="#C5A059", usage="Candelabras & Table Numbers"),
            ]

        menu = [
            "Signature Cocktail: 'The Blushing Union' (Elderflower cordial, sparkling prosecco, rosemary sprig).",
            "First Course: Artisan burrata with heirloom tomatoes, balsamic glaze, and micro basil.",
            "Entree: Slow-braised short rib or wild mushroom truffle risotto with charred asparagus.",
            "Dessert: Vanilla bean sponge cake with wild blackberry compote and espresso bar.",
        ]
        activities = [
            "Audio Guestbook: Vintage rotary telephone for guests to leave heartfelt recorded voicemails.",
            "Live Wedding Painter: Fine artist capturing the ceremony or first dance in real time.",
            "Polaroid Photo Wall: Guests peg their snapshots with personalized notes into an illuminated shadow box.",
        ]
        speech = (
            f"Raise a glass to love that builds bridges and inspires everyone around it. "
            f"Here's to {req.event_name}—may your journey together be as luminous, resilient, and joyful as tonight!"
        )
        invitation = (
            f"Together with their families, you are cordially invited to celebrate the marriage and union of "
            f"{req.event_name}. Join us for an evening of joy, dining, and dancing on {req.target_date} in {req.location}."
        )

    elif req.event_type == EventType.BIRTHDAY:
        if "disco" in theme_input or "retro" in theme_input:
            title = "Studio 54 Retro Disco Fever"
            desc = (
                f"Mirrored disco balls, neon accents, funk rhythms, and electrifying energy lighting up {req.location}."
            )
            palette = [
                ColorPaletteItem(name="Electric Magenta", hex_code="#FF007F", usage="Neon Signage & Signature Drinks"),
                ColorPaletteItem(name="Mirror Silver", hex_code="#C0C0C0", usage="Disco Ball Clusters & Confetti"),
                ColorPaletteItem(name="Midnight Indigo", hex_code="#191970", usage="Drape Backdrops"),
                ColorPaletteItem(name="Laser Cyan", hex_code="#00FFFF", usage="Uplighting & Glow Sticks"),
            ]
        elif "hollywood" in theme_input or "glam" in theme_input:
            title = "Old Hollywood Golden Glamour"
            desc = f"Red carpets, vintage velvet stanchions, and timeless cinematic elegance celebrating in {req.location}."
            palette = [
                ColorPaletteItem(name="Crimson Velvet", hex_code="#990000", usage="Red Carpet & Floral Roses"),
                ColorPaletteItem(name="Gilded Gold", hex_code="#FFD700", usage="Champagne Coupes & Foil Details"),
                ColorPaletteItem(name="Jet Black", hex_code="#0A0A0A", usage="Tuxedo Chic Tablecloths"),
                ColorPaletteItem(name="Ivory Silk", hex_code="#FFF8DC", usage="Dinner Menus"),
            ]
        else:
            title = "Electric Sunset Milestone Bash"
            desc = f"A vibrant, sophisticated cocktail celebration bathed in warm golden hour hues and infectious energy in {req.location}."
            palette = [
                ColorPaletteItem(name="Sunset Coral", hex_code="#FF6F61", usage="Centerpiece Florals & Entry Balloons"),
                ColorPaletteItem(name="Deep Amber", hex_code="#FFBF00", usage="Ambient Lanterns & Drink Garnishes"),
                ColorPaletteItem(name="Royal Plum", hex_code="#4A0E4E", usage="Lounge Cushions & Bar Runner"),
                ColorPaletteItem(name="Warm Sand", hex_code="#EED9C4", usage="Textured Linens"),
            ]

        menu = [
            "Signature Drink: 'The Milestone Elixir' (Bourbon or zero-proof botanical spirit, blood orange, smoked thyme).",
            "Passed Hors d'oeuvres: Wagyu beef sliders with truffle aioli, and crispy pork belly bao buns.",
            "Grazing Table: Curated artisanal cheeses, honeycomb, prosciutto, fig crisps, and spiced nuts.",
            "Showcase Dessert: Multi-tier salted caramel drip cake illuminated with sparkler fountains.",
        ]
        activities = [
            "Milestone Trivia Roast: Interactive phone-based quiz testing guests on fun facts about the birthday VIP.",
            "360-Degree Video Booth: Slow-motion rotating camera platform with custom digital overlay.",
            "Signature Memory Capsule: Guests write a goal or memory to be sealed until the next milestone year.",
        ]
        speech = (
            f"Tonight we celebrate not just another year, but a life packed with passion, laughter, and incredible stories. "
            f"Here's to the legend of the hour for {req.event_name}—cheers to your greatest chapter yet!"
        )
        invitation = (
            f"Get ready to celebrate in style! Join us for an unforgettable milestone party honoring "
            f"{req.event_name} on {req.target_date} in {req.location}. Dress to impress and prepare to dance!"
        )

    elif req.event_type == EventType.COMMUNITY_EVENT:
        title = "Unity & Heritage Community Festival"
        desc = f"A vibrant open-air gathering bringing neighbors together through music, artisan craft, culinary culture, and civic pride in {req.location}."
        palette = [
            ColorPaletteItem(name="Parkland Forest Green", hex_code="#228B22", usage="Festival Canopies & Eco Signage"),
            ColorPaletteItem(name="Sunflower Gold", hex_code="#EAA221", usage="Main Stage Banners & Wristbands"),
            ColorPaletteItem(name="Skyline Cerulean", hex_code="#007BA7", usage="Wayfinding Flags & Program Guides"),
            ColorPaletteItem(name="Natural Hemp", hex_code="#D2B48C", usage="Tote Bags & Volunteer Badges"),
        ]
        menu = [
            "Community Kitchen: Global street taco station with cilantro lime carnitas and chipotle jackfruit.",
            "Local Flavor: Artisanal wood-fired sourdough pizzas baked fresh on-site in mobile ovens.",
            "Hydration Pavilion: Infused cucumber-mint water stations and local cold-brew iced teas.",
            "Sweet Spot: Chilled fruit paletas and local creamery ice cream scoops.",
        ]
        activities = [
            "Collaborative Community Mural: Canvas wall where all attendees paint a section representing their neighborhood.",
            "Makers Workshop Tent: Hands-on pottery, origami, and seed-bomb making for sustainable gardening.",
            "Acoustic Open Mic & Local Showcase: Spotlighting homegrown musicians, youth poets, and cultural dancers.",
        ]
        speech = (
            f"A thriving community is built on connection, shared joy, and open doors. "
            f"Welcome everyone to {req.event_name}—thank you for making our neighborhood stronger, kinder, and brighter!"
        )
        invitation = (
            f"You're invited to our community celebration: {req.event_name}! Bring friends, family, and neighbors "
            f"on {req.target_date} in {req.location} for free live music, delicious food, and joyful community spirit."
        )

    else:
        # Custom event
        title = "Bespoke Signature Gathering"
        desc = f"A tailored experience designed with precision, aesthetic harmony, and seamless hospitality in {req.location}."
        palette = [
            ColorPaletteItem(name="Pacific Teal", hex_code="#008080", usage="Branded Accents"),
            ColorPaletteItem(name="Platinum Silver", hex_code="#E5E4E2", usage="Infrastructure & Badges"),
            ColorPaletteItem(name="Charcoal Steel", hex_code="#36454F", usage="Text & Typography"),
            ColorPaletteItem(name="Golden Sunrise", hex_code="#FFC000", usage="Lighting Accents"),
        ]
        menu = [
            "Welcome Beverage: Seasonal fruit infusion spritzer.",
            "Chef's Choice: Seasonal tasting menu honoring dietary preferences.",
            "Artisanal Coffee & Tea station with handcrafted pastries.",
        ]
        activities = [
            "Interactive Keynote / Icebreaker Session.",
            "Photo Memory Wall with instant digital printing.",
            "Networking Lounge with acoustic ambient soundtrack.",
        ]
        speech = (
            f"Welcome everyone to {req.event_name}. We are delighted to gather together for this remarkable occasion."
        )
        invitation = f"Please join us for {req.event_name} on {req.target_date} in {req.location}."

    return PersonalizedIdeas(
        theme_title=title,
        theme_description=desc,
        color_palette=palette,
        menu_concepts=menu,
        interactive_activities=activities,
        speech_or_toast_prompt=speech,
        invitation_copy=invitation,
    )


async def generate_personalized_ideas_with_fallback(
    req: EventPlanRequest,
) -> tuple[PersonalizedIdeas, str]:
    """Attempts to call Google Gemini API if configured; smoothly falls back to deterministic engine."""
    api_key: str | None = req.gemini_api_key or os.getenv("GEMINI_API_KEY")

    if not api_key:
        return generate_deterministic_ideas(req), "resilient-deterministic-v1"

    try:
        import google.generativeai as genai

        genai.configure(api_key=api_key)  # type: ignore[attr-defined]
        model = genai.GenerativeModel("gemini-1.5-flash")  # type: ignore[attr-defined]

        prompt = (
            f"You are an expert event planner. Create personalized creative ideas for an event.\n"
            f"Event Name: {req.event_name}\n"
            f"Event Type: {req.event_type.value}\n"
            f"Budget: ${req.total_budget:,.2f}\n"
            f"Guests: {req.guest_count}\n"
            f"Location: {req.location}\n"
            f"Theme Preference: {req.theme_preference or 'None specified'}\n"
            f"Special Notes: {req.special_notes or 'None'}\n\n"
            f"Return ONLY valid JSON matching this schema:\n"
            f"{{\n"
            f'  "theme_title": "string",\n'
            f'  "theme_description": "string",\n'
            f'  "color_palette": [\n'
            f'    {{"name": "string", "hex_code": "#HEX", "usage": "string"}}\n'
            f"  ],\n"
            f'  "menu_concepts": ["item 1", "item 2", "item 3", "item 4"],\n'
            f'  "interactive_activities": ["activity 1", "activity 2", "activity 3"],\n'
            f'  "speech_or_toast_prompt": "string",\n'
            f'  "invitation_copy": "string"\n'
            f"}}"
        )

        response = await model.generate_content_async(
            prompt,
            generation_config={"response_mime_type": "application/json"},
        )

        if response and response.text:
            data = json.loads(response.text)
            palette = [
                ColorPaletteItem(
                    name=item.get("name", "Custom Color"),
                    hex_code=item.get("hex_code", "#333333"),
                    usage=item.get("usage", "Accent"),
                )
                for item in data.get("color_palette", [])
            ]
            return (
                PersonalizedIdeas(
                    theme_title=data.get("theme_title", "Celebration Concept"),
                    theme_description=data.get("theme_description", "Custom event experience"),
                    color_palette=palette,
                    menu_concepts=data.get("menu_concepts", []),
                    interactive_activities=data.get("interactive_activities", []),
                    speech_or_toast_prompt=data.get("speech_or_toast_prompt", ""),
                    invitation_copy=data.get("invitation_copy", ""),
                ),
                "gemini-1.5-flash",
            )
    except Exception:
        # Fall back to zero-downtime deterministic engine on any failure
        pass

    return generate_deterministic_ideas(req), "resilient-deterministic-v1"
