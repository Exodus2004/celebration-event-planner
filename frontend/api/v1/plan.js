export default async function handler(req, res) {
  // Set universal CORS & OWASP headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  const body = req.body || {};
  const totalBudget = Number(body.total_budget) || 10000;
  const guestCount = Number(body.guest_count) || 50;
  const eventType = body.event_type || 'wedding';
  const location = body.location || 'San Francisco, CA';
  const targetDate = body.target_date || '2027-09-15';
  const eventName = body.event_name || 'Signature Celebration';
  const themeInput = (body.theme_preference || '').toLowerCase();

  const perGuest = Math.round((totalBudget / Math.max(guestCount, 1)) * 100) / 100;

  let categoriesConfig = [];
  let milestones = [];
  let runOfShow = [];
  let vendorItems = [];
  let ideas = {};

  if (eventType === 'wedding') {
    categoriesConfig = [
      { name: "Venue & Rental Space", pct: 28.0, desc: "Ceremony & reception hall rental, tables, chairs, bridal suite access.", tip: "Book off-peak days (Friday or Sunday) or shoulder months to save up to 25% on venue fee." },
      { name: "Catering, Bar & Wedding Cake", pct: 32.0, desc: "Multi-course plated or buffet dining, licensed bartending, signature cocktails, cake.", tip: "Opt for a dual-station buffet or family-style dinner over individual plated service to cut waitstaff costs." },
      { name: "Photography & Cinematography", pct: 12.0, desc: "Full-day photojournalist coverage, drone footage, digital edits, and archival album.", tip: "Contract 8 hours instead of 12 hours of coverage, focusing on key moments from first look to first dance." },
      { name: "Floral, Lighting & Decor", pct: 10.0, desc: "Ceremony arch, bridal party bouquets, centerpieces, ambient uplighting.", tip: "Repurpose ceremony altar arrangements as sweetheart table and bar centerpieces." },
      { name: "DJ, Live Music & Audio", pct: 8.0, desc: "Live acoustic prelude, wireless microphones, ceremony sound, and dynamic DJ/MC reception.", tip: "Combine ceremony and reception audio under a single vendor package to eliminate redundant equipment fees." },
      { name: "Contingency & Emergency Reserve", pct: 10.0, desc: "Weather modifications, extra guest arrivals, tip buffers, unexpected delivery fees.", tip: "Keep this untouched until 7 days prior to absorb last-minute headcounts or overtime fees without stress." }
    ];

    milestones = [
      { id: "ms-w-1", timeframe: "9-12 Months Before", title: "Lock Venue & Set Total Budget", description: "Secure ceremony and reception locations, place initial deposits, and establish maximum financial boundaries.", owner_role: "Couple & Lead Planner", is_critical: true },
      { id: "ms-w-2", timeframe: "6-8 Months Before", title: "Book High-Demand Vendors", description: "Contract photographer, videographer, caterer, and band/DJ before their calendar fills.", owner_role: "Couple", is_critical: true },
      { id: "ms-w-3", timeframe: "3-5 Months Before", title: "Attire, Floral Design & Save The Dates", description: "Finalize bridal party attire, select floral palette, and dispatch save-the-date notices.", owner_role: "Lead Planner & Florist", is_critical: false },
      { id: "ms-w-4", timeframe: "6-8 Weeks Before", title: "Formal Invitations & Menu Tasting", description: "Mail formal invitations with dietary RSVP options; attend final menu tasting session.", owner_role: "Couple & Caterer", is_critical: true },
      { id: "ms-w-5", timeframe: "2-3 Weeks Before", title: "Final Headcount & Seating Chart", description: "Lock headcount with venue and caterer; assemble detailed table seating blueprint.", owner_role: "Lead Planner", is_critical: true },
      { id: "ms-w-6", timeframe: "Day Prior", title: "Ceremony Rehearsal & Vendor Confirmation", description: "Walk through ceremony pacing with wedding party; confirm all vendor arrival slots.", owner_role: "Officiant & Wedding Coordinator", is_critical: true }
    ];

    runOfShow = [
      { id: "ros-w-1", time: "09:00 AM", duration_minutes: 180, activity: "Bridal Suite Hair, Makeup & Getting Ready", lead_person: "Beauty Stylists & Bridal Party", location_zone: "Bridal Suite", contingency_note: "Keep steaming kits and hydration snacks ready." },
      { id: "ros-w-2", time: "12:00 PM", duration_minutes: 90, activity: "Vendor Load-In & Decor Assembly", lead_person: "Venue Coordinator & Florist", location_zone: "Main Hall & Ceremony Lawn", contingency_note: "Verify power drop access for DJ sound consoles." },
      { id: "ros-w-3", time: "01:30 PM", duration_minutes: 60, activity: "First Look & Wedding Party Portraits", lead_person: "Lead Photographer", location_zone: "Courtyard Gardens", contingency_note: "Shaded outdoor location to prevent direct midday sun glare." },
      { id: "ros-w-4", time: "03:30 PM", duration_minutes: 30, activity: "Guest Arrival & Acoustic Prelude Music", lead_person: "Ushers & Acoustic Musician", location_zone: "Ceremony Lawn", contingency_note: "Welcome beverage station active immediately upon arrival." },
      { id: "ros-w-5", time: "04:00 PM", duration_minutes: 45, activity: "Ceremony Processional & Vows Exchange", lead_person: "Officiant & Couple", location_zone: "Ceremony Altar", contingency_note: "Sound engineer on standby with backup wireless lavalier." },
      { id: "ros-w-6", time: "04:45 PM", duration_minutes: 75, activity: "Cocktail Hour & Passed Hors d'oeuvres", lead_person: "Banquet Captain & Bartenders", location_zone: "Terrace Patio", contingency_note: "Photographer completes extended family formal portraits." },
      { id: "ros-w-7", time: "06:00 PM", duration_minutes: 30, activity: "Grand Reception Entrance & First Dance", lead_person: "DJ / MC", location_zone: "Main Ballroom Dance Floor", contingency_note: "Coordinate spotlight lighting with venue technician." },
      { id: "ros-w-8", time: "06:30 PM", duration_minutes: 90, activity: "Dinner Service & Curated Toasts", lead_person: "Catering Lead & Best Man / MOH", location_zone: "Main Ballroom", contingency_note: "Toasts capped strictly at 3 minutes each." },
      { id: "ros-w-9", time: "08:00 PM", duration_minutes: 30, activity: "Ceremonial Cake Cutting & Dessert Station", lead_person: "Couple & Pastry Chef", location_zone: "Dessert Showcase Table", contingency_note: "Background ambient track cues immediately prior to transition." },
      { id: "ros-w-10", time: "08:30 PM", duration_minutes: 150, activity: "High-Energy Open Dancing & Party Celebration", lead_person: "DJ & Entertainment", location_zone: "Main Dance Floor", contingency_note: "Late-night comfort snack station opens at 10:00 PM." },
      { id: "ros-w-11", time: "11:00 PM", duration_minutes: 30, activity: "Sparkler Grand Send-Off & Teardown Commencement", lead_person: "Day-of Coordinator & Security", location_zone: "Exterior Grand Driveway", contingency_note: "Extinguisher sand buckets on site for cold sparklers." }
    ];

    vendorItems = [
      { id: "v-wed-1", category: "Venue", title: "Contract Ceremony & Reception Hall", description: "Secure venue contract with alcohol licensing, insurance requirements, and load-in timings.", suggested_booking_deadline: "9 Months Before", estimated_cost: Math.round(totalBudget * 0.28), status: "booked" },
      { id: "v-wed-2", category: "Catering & Bar", title: "Sign Caterer & Schedule Menu Tasting", description: "Finalize cocktail hour hors d'oeuvres, dinner entree options, and beverage corkage policy.", suggested_booking_deadline: "7 Months Before", estimated_cost: Math.round(totalBudget * 0.32), status: "contacted" },
      { id: "v-wed-3", category: "Photography", title: "Book Wedding Photographer & Videographer", description: "Review portfolio albums, lock 8-hour day-of coverage, and schedule engagement portrait session.", suggested_booking_deadline: "8 Months Before", estimated_cost: Math.round(totalBudget * 0.12), status: "contacted" },
      { id: "v-wed-4", category: "Floral & Styling", title: "Engage Floral Designer & Event Stylist", description: "Curate bridal bouquets, ceremony arch blooms, table centerpieces, and rental candelabras.", suggested_booking_deadline: "5 Months Before", estimated_cost: Math.round(totalBudget * 0.10), status: "pending" },
      { id: "v-wed-5", category: "Music & Audio", title: "Retain DJ / MC & Ceremony Acoustic Musician", description: "Book DJ with wireless mic setup, uplighting bundle, and submit favorite tracks.", suggested_booking_deadline: "6 Months Before", estimated_cost: Math.round(totalBudget * 0.08), status: "pending" },
      { id: "v-wed-6", category: "Bakery & Sweets", title: "Order Custom Tiered Wedding Cake", description: "Conduct flavor tasting and confirm delivery window with cake stand rentals.", suggested_booking_deadline: "3 Months Before", estimated_cost: Math.round(totalBudget * 0.03), status: "pending" },
      { id: "v-wed-7", category: "Stationery & Day-Of Paper", title: "Print Invitations, Menus & Seating Chart", description: "Design typography suite, foil-stamped table numbers, place cards, and welcome sign.", suggested_booking_deadline: "2 Months Before", estimated_cost: Math.round(totalBudget * 0.02), status: "pending" }
    ];

    ideas = {
      theme_title: "Rustic Vineyard Elegance",
      theme_description: `An enchanting blend of warm reclaimed oak, cascading greenery, and candlelit ambiance in ${location}.`,
      color_palette: [
        { name: "Eucalyptus Sage", hex_code: "#87A96B", usage: "Foliage & Linens" },
        { name: "Warm Champagne", hex_code: "#F7E7CE", usage: "Drapery & Silk Ribbons" },
        { name: "Terracotta Clay", hex_code: "#E2725B", usage: "Accent Florals & Stationery" },
        { name: "Aged Walnut", hex_code: "#5C4033", usage: "Wood Tables & Signage" }
      ],
      menu_concepts: [
        "Signature Cocktail: 'The Blushing Union' (Elderflower cordial, sparkling prosecco, rosemary sprig).",
        "First Course: Artisan burrata with heirloom tomatoes, aged balsamic reduction, and micro basil.",
        "Entree: Slow-braised beef short rib or wild mushroom truffle risotto with charred asparagus.",
        "Dessert: Vanilla bean sponge cake with wild blackberry compote and espresso bar."
      ],
      interactive_activities: [
        "Audio Guestbook: Vintage rotary telephone for guests to leave heartfelt recorded voicemails.",
        "Live Wedding Painter: Fine artist capturing the ceremony or first dance in real time.",
        "Polaroid Photo Wall: Guests peg their snapshots with personalized notes into an illuminated shadow box."
      ],
      speech_or_toast_prompt: `Raise a glass to love that builds bridges and inspires everyone around it. Here's to ${eventName}—may your journey together be as luminous, resilient, and joyful as tonight!`,
      invitation_copy: `Together with their families, you are cordially invited to celebrate the marriage and union of ${eventName}. Join us for an evening of joy, dining, and dancing on ${targetDate} in ${location}.`
    };

  } else {
    // Birthday & Community events default configurations
    categoriesConfig = [
      { name: "Venue & Atmosphere", pct: 25.0, desc: "Event space rental, tables, chairs, staging.", tip: "Check off-peak booking windows." },
      { name: "Food & Beverage", pct: 35.0, desc: "Curated dining, artisanal desserts, signature bar.", tip: "Select local seasonal menus." },
      { name: "Entertainment & Music", pct: 15.0, desc: "DJ, live host, interactive sound.", tip: "Book multi-service packages." },
      { name: "Decor & Photography", pct: 15.0, desc: "Thematic styling and professional photo coverage.", tip: "Focus on entrance and stage focal zones." },
      { name: "Contingency Reserve", pct: 10.0, desc: "Safety buffer for incidentals.", tip: "Preserve until final supplier settlement." }
    ];

    milestones = [
      { id: "ms-1", timeframe: "8 Weeks Before", title: "Lock Venue & Scope", description: "Reserve location and establish budget boundaries.", owner_role: "Host", is_critical: true },
      { id: "ms-2", timeframe: "4 Weeks Before", title: "Dispatch Invitations & Retain Vendors", description: "Send invites and contract core suppliers.", owner_role: "Planner", is_critical: true },
      { id: "ms-3", timeframe: "1 Week Before", title: "Final Headcount & Briefing", description: "Confirm final numbers and review day-of schedule.", owner_role: "Team", is_critical: true }
    ];

    runOfShow = [
      { id: "ros-1", time: "04:00 PM", duration_minutes: 60, activity: "Site Setup & Technical Audio Check", lead_person: "Lead Coordinator", location_zone: "Main Space", contingency_note: "Verify power backups." },
      { id: "ros-2", time: "05:00 PM", duration_minutes: 60, activity: "Guest Welcome & Prelude Drinks", lead_person: "Greeting Team", location_zone: "Reception", contingency_note: "Welcome station ready." },
      { id: "ros-3", time: "06:00 PM", duration_minutes: 120, activity: "Main Celebration & Dining Service", lead_person: "Host & Catering", location_zone: "Dining Hall", contingency_note: "Dietary plates separated." },
      { id: "ros-4", time: "08:00 PM", duration_minutes: 120, activity: "Music, Dance & Festivities", lead_person: "DJ / Entertainment", location_zone: "Floor", contingency_note: "Monitor sound levels." }
    ];

    vendorItems = [
      { id: "v-1", category: "Venue", title: "Secure Main Facility Agreement", description: "Finalize facility usage contract.", suggested_booking_deadline: "6 Weeks Out", estimated_cost: Math.round(totalBudget * 0.25), status: "booked" },
      { id: "v-2", category: "Catering", title: "Confirm Dining & Beverage Service", description: "Finalize menu and dietary selections.", suggested_booking_deadline: "4 Weeks Out", estimated_cost: Math.round(totalBudget * 0.35), status: "contacted" },
      { id: "v-3", category: "Entertainment", title: "Retain Audio / DJ Talent", description: "Review setlist and sound setup.", suggested_booking_deadline: "4 Weeks Out", estimated_cost: Math.round(totalBudget * 0.15), status: "pending" }
    ];

    ideas = {
      theme_title: "Signature Celebration Gala",
      theme_description: `An elevated event designed for connection and joy in ${location}.`,
      color_palette: [
        { name: "Royal Purple", hex_code: "#7C3AED", usage: "Main Lighting & Accents" },
        { name: "Cyan Spark", hex_code: "#06B6D4", usage: "Table Ribbons & Stationery" },
        { name: "Warm Amber", hex_code: "#F59E0B", usage: "Candles & Uplighting" },
        { name: "Pure Slate", hex_code: "#64748B", usage: "Linens & Signage" }
      ],
      menu_concepts: [
        "Artisanal small bites and chef-crafted appetizers.",
        "Seasonal entrees accommodating vegan and gluten-free preferences.",
        "Signature mocktail and craft cocktail pairings."
      ],
      interactive_activities: [
        "Interactive photo wall with digital instant sharing.",
        "Community memory book or digital guest message hub."
      ],
      speech_or_toast_prompt: `A heartfelt thank you to everyone joining us for ${eventName}!`,
      invitation_copy: `You are cordially invited to celebrate ${eventName} on ${targetDate} in ${location}.`
    };
  }

  const categories = categoriesConfig.map(c => ({
    name: c.name,
    allocated_amount: Math.round(totalBudget * (c.pct / 100) * 100) / 100,
    percentage: c.pct,
    description: c.desc,
    cost_saving_tip: c.tip
  }));

  const contingency = categories.find(c => c.name.includes("Contingency"))?.allocated_amount || Math.round(totalBudget * 0.1);

  const payload = {
    event_id: `evt-vcl-${Math.random().toString(36).substring(2, 9)}`,
    event_name: eventName,
    event_type: eventType,
    guest_count: guestCount,
    location: location,
    target_date: targetDate,
    generated_at: new Date().toISOString(),
    engine_used: "vercel-serverless-api",
    budget_summary: {
      total_budget: totalBudget,
      per_guest_cost: perGuest,
      contingency_reserve: contingency,
      categories: categories,
      ai_budget_insights: [
        `Target guest allowance averages $${perGuest.toFixed(2)} per person across all categories.`,
        `A dedicated contingency buffer of $${contingency.toLocaleString()} protects against unforeseen supplier surcharges.`,
        "Priority allocation is directed toward attendee experience (Dining & Atmosphere) for maximum satisfaction."
      ]
    },
    timeline_plan: {
      milestones: milestones,
      run_of_show: runOfShow
    },
    vendor_checklist: vendorItems,
    personalized_ideas: ideas,
    executive_summary: `Master plan for '${eventName}' (${eventType}) with $${totalBudget.toLocaleString()} budget for ${guestCount.toLocaleString()} guests in ${location}.`
  };

  return res.status(200).json(payload);
}
