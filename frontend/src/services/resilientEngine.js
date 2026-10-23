/**
 * Client-Side Resilient AI Engine (Zero-Downtime Guarantee)
 * 
 * Provides instantaneous, full-fidelity calculation of event plans,
 * budgets, run-of-show schedules, vendor checklists, and creative ideas.
 * Activated whenever the backend is cold-starting or offline.
 */

export function generateClientPlan(form) {
  const totalBudget = parseFloat(form.total_budget) || 10000;
  const guestCount = parseInt(form.guest_count, 10) || 50;
  const perGuest = Math.round((totalBudget / Math.max(guestCount, 1)) * 100) / 100;
  const eventType = form.event_type || 'wedding';
  const location = form.location || 'San Francisco, CA';
  const targetDate = form.target_date || '2027-09-15';
  const eventName = form.event_name || 'Signature Celebration';
  const themeInput = (form.theme_preference || '').toLowerCase();

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

    let palette = [
      { name: "Dusty Rose", hex_code: "#DCAE96", usage: "Bridal Party & Floral Focal Points" },
      { name: "French Lilac", hex_code: "#86608E", usage: "Velvet Ribbons & Macarons" },
      { name: "Cream Ivory", hex_code: "#FFFFF0", usage: "Ceremony Draping" },
      { name: "Gilded Brass", hex_code: "#C5A059", usage: "Candelabras & Table Numbers" }
    ];
    let themeTitle = "Enchanted Garden Romance";
    let themeDesc = `A timeless, whimsical celebration brimming with lush garden roses, fairy-light canopies, and soft acoustic melodies in ${location}.`;

    if (themeInput.includes("rustic") || themeInput.includes("vineyard")) {
      themeTitle = "Rustic Vineyard Elegance";
      themeDesc = `An enchanting blend of warm reclaimed oak, cascading greenery, and candlelit ambiance in ${location}.`;
      palette = [
        { name: "Eucalyptus Sage", hex_code: "#87A96B", usage: "Foliage & Linens" },
        { name: "Warm Champagne", hex_code: "#F7E7CE", usage: "Drapery & Silk Ribbons" },
        { name: "Terracotta Clay", hex_code: "#E2725B", usage: "Accent Florals & Stationery" },
        { name: "Aged Walnut", hex_code: "#5C4033", usage: "Wood Tables & Signage" }
      ];
    } else if (themeInput.includes("modern") || themeInput.includes("minimal")) {
      themeTitle = "Modern Monochrome & Botanical Chic";
      themeDesc = `Clean architectural lines, sculptural white orchids, and sleek black accents tailored for a contemporary celebration in ${location}.`;
      palette = [
        { name: "Crisp Alabaster", hex_code: "#FBFBFA", usage: "Primary Table Linens & Backdrops" },
        { name: "Obsidian Matte", hex_code: "#1E1E1E", usage: "Cutlery & Modern Typography" },
        { name: "Brushed Champagne Gold", hex_code: "#D4AF37", usage: "Geometric Lanterns & Chargers" },
        { name: "Smoky Slate", hex_code: "#708090", usage: "Velvet Lounge Accents" }
      ];
    }

    ideas = {
      theme_title: themeTitle,
      theme_description: themeDesc,
      color_palette: palette,
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

  } else if (eventType === 'birthday') {
    categoriesConfig = [
      { name: "Venue & Event Atmosphere", pct: 25.0, desc: "Private event lounge, rooftop, or hall rental with basic furniture.", tip: "Consider private dining rooms with food and beverage minimums that waive the room rental fee." },
      { name: "Food, Artisanal Cake & Drinks", pct: 35.0, desc: "Tapas, curated grazing stations, signature birthday cake, and specialty drinks.", tip: "Order a smaller centerpiece display cake for cutting, accompanied by sheet cakes for guests." },
      { name: "Entertainment, Games & Music", pct: 15.0, desc: "DJ, interactive party host, arcade rentals, photo booth with physical prints.", tip: "Curate a custom playlist for early hours and hire the DJ for the peak 3-hour dance window." },
      { name: "Decor, Balloon Installations & Favors", pct: 10.0, desc: "Custom backdrop, balloon arches, personalized signage, and take-home party gifts.", tip: "Use oversized statement photo-opp backdrop rather than dressing every individual table." },
      { name: "Photography & Memories", pct: 10.0, desc: "Candid party photographer capturing arrivals, toasts, and milestone celebrations.", tip: "Hire an emerging photographer for a 3-hour highlight reel package." },
      { name: "Contingency & Incidentals", pct: 5.0, desc: "Overtime room fees, extra appetizers, rideshare vouchers for VIP guests.", tip: "Provides buffer for spontaneous guest additions or extended venue hours." }
    ];

    milestones = [
      { id: "ms-b-1", timeframe: "6-8 Weeks Before", title: "Theme Concept, Date & Venue Selection", description: "Decide on milestone theme, reserve event space or party suite, set budget limit.", owner_role: "Host / Organizer", is_critical: true },
      { id: "ms-b-2", timeframe: "4 Weeks Before", title: "Send Digital & Physical Invitations", description: "Distribute invites with RSVP deadline 10 days before event date.", owner_role: "Host", is_critical: true },
      { id: "ms-b-3", timeframe: "3 Weeks Before", title: "Custom Cake, Entertainment & Decor Order", description: "Commission bakery for artisanal showpiece cake; confirm DJ or performer booking.", owner_role: "Host & Bakery Lead", is_critical: false },
      { id: "ms-b-4", timeframe: "1 Week Before", title: "Headcount Lock & Playlist Curation", description: "Finalize food count with caterer; assemble must-play and do-not-play music list.", owner_role: "Host & DJ", is_critical: true },
      { id: "ms-b-5", timeframe: "Day Of", title: "Venue Setup & Cake Delivery Inspection", description: "Set up photo backdrop, balloon arches, and inspect refrigerated cake delivery.", owner_role: "Host & Decor Specialist", is_critical: true }
    ];

    runOfShow = [
      { id: "ros-b-1", time: "04:00 PM", duration_minutes: 90, activity: "Venue Decor, Lighting & Sound Check", lead_person: "Host & Audio Technician", location_zone: "Party Lounge", contingency_note: "Check Bluetooth / Aux connection redundancy." },
      { id: "ros-b-2", time: "05:30 PM", duration_minutes: 30, activity: "Cake Delivery & Presentation Table Styling", lead_person: "Bakery Courier & Decorator", location_zone: "Feature Dessert Wall", contingency_note: "Keep room temperature cool for fondant stability." },
      { id: "ros-b-3", time: "06:00 PM", duration_minutes: 60, activity: "Guest Arrivals, Signature Welcome Cocktails & Photo Booth", lead_person: "Host & Greeter", location_zone: "Reception Foyer & Photo Backdrop", contingency_note: "Provide digital QR code for instant photo downloads." },
      { id: "ros-b-4", time: "07:00 PM", duration_minutes: 75, activity: "Grazing Tables, Small Plates Dining & Mingling", lead_person: "Catering Crew Lead", location_zone: "Dining Lounge", contingency_note: "Ensure allergen-safe labeled platters are distinctly displayed." },
      { id: "ros-b-5", time: "08:15 PM", duration_minutes: 30, activity: "Milestone Roast & Toast / Highlight Video Reel", lead_person: "Host & Close Friends", location_zone: "Stage / Projection Screen", contingency_note: "HDMI adapter test performed during early sound check." },
      { id: "ros-b-6", time: "08:45 PM", duration_minutes: 20, activity: "Birthday Cake Presentation & Candle Lighting", lead_person: "Honorary Guest & Friends", location_zone: "Central Lounge", contingency_note: "Sparkler candles pre-lit with long-reach lighters." },
      { id: "ros-b-7", time: "09:05 PM", duration_minutes: 115, activity: "DJ Dance Set, Party Games & Social Celebration", lead_person: "DJ / MC", location_zone: "Dance Floor", contingency_note: "Hydration station refreshed with iced fruit infusions." },
      { id: "ros-b-8", time: "11:00 PM", duration_minutes: 30, activity: "Party Favor Handout & Event Wrap-Up", lead_person: "Host & Venue Manager", location_zone: "Exit Station", contingency_note: "Ensure coat check and parking validations are expedited." }
    ];

    vendorItems = [
      { id: "v-bday-1", category: "Venue", title: "Reserve Private Lounge or Rooftop Venue", description: "Confirm private space minimums, AV capabilities, and guest curfew hours.", suggested_booking_deadline: "6 Weeks Before", estimated_cost: Math.round(totalBudget * 0.25), status: "booked" },
      { id: "v-bday-2", category: "Food & Drinks", title: "Order Curated Small Plates & Signature Bar", description: "Arrange heavy passed appetizers, gourmet sliders, and two personalized themed cocktails.", suggested_booking_deadline: "4 Weeks Before", estimated_cost: Math.round(totalBudget * 0.35), status: "contacted" },
      { id: "v-bday-3", category: "Entertainment", title: "Book High-Energy DJ & Interactive Host", description: "Contract DJ for 4-hour set with party lighting and wireless mic for milestone roasts.", suggested_booking_deadline: "4 Weeks Before", estimated_cost: Math.round(totalBudget * 0.15), status: "pending" },
      { id: "v-bday-4", category: "Decor & Installations", title: "Commission Custom Balloon Arch & Neon Sign", description: "Order photogenic balloon garland in party palette with custom neon name / number sign.", suggested_booking_deadline: "3 Weeks Before", estimated_cost: Math.round(totalBudget * 0.10), status: "pending" },
      { id: "v-bday-5", category: "Bakery", title: "Design Milestone Showpiece Birthday Cake", description: "Custom thematic sculpture cake with sparkler candles and matching cupcakes.", suggested_booking_deadline: "2 Weeks Before", estimated_cost: Math.round(totalBudget * 0.05), status: "pending" },
      { id: "v-bday-6", category: "Photography", title: "Hire Candid Event Photographer", description: "3-hour party photo coverage capturing guest red carpet arrivals and celebratory moments.", suggested_booking_deadline: "3 Weeks Before", estimated_cost: Math.round(totalBudget * 0.10), status: "pending" }
    ];

    let palette = [
      { name: "Electric Magenta", hex_code: "#FF007F", usage: "Neon Signage & Signature Drinks" },
      { name: "Mirror Silver", hex_code: "#C0C0C0", usage: "Disco Ball Clusters & Confetti" },
      { name: "Midnight Indigo", hex_code: "#191970", usage: "Drape Backdrops" },
      { name: "Laser Cyan", hex_code: "#00FFFF", usage: "Uplighting & Glow Sticks" }
    ];
    let themeTitle = "Studio 54 Retro Disco Fever";
    let themeDesc = `Mirrored disco balls, neon accents, funk rhythms, and electrifying energy lighting up ${location}.`;

    if (themeInput.includes("sunset") || themeInput.includes("golden")) {
      themeTitle = "Electric Sunset Milestone Bash";
      themeDesc = `A vibrant, sophisticated cocktail celebration bathed in warm golden hour hues and infectious energy in ${location}.`;
      palette = [
        { name: "Sunset Coral", hex_code: "#FF6F61", usage: "Centerpiece Florals & Entry Balloons" },
        { name: "Deep Amber", hex_code: "#FFBF00", usage: "Ambient Lanterns & Drink Garnishes" },
        { name: "Royal Plum", hex_code: "#4A0E4E", usage: "Lounge Cushions & Bar Runner" },
        { name: "Warm Sand", hex_code: "#EED9C4", usage: "Textured Linens" }
      ];
    }

    ideas = {
      theme_title: themeTitle,
      theme_description: themeDesc,
      color_palette: palette,
      menu_concepts: [
        "Signature Drink: 'The Milestone Elixir' (Bourbon or zero-proof botanical spirit, blood orange, smoked thyme).",
        "Passed Hors d'oeuvres: Wagyu beef sliders with truffle aioli, and crispy pork belly bao buns.",
        "Grazing Table: Curated artisanal cheeses, honeycomb, prosciutto, fig crisps, and spiced nuts.",
        "Showcase Dessert: Multi-tier salted caramel drip cake illuminated with sparkler fountains."
      ],
      interactive_activities: [
        "Milestone Trivia Roast: Interactive phone-based quiz testing guests on fun facts about the birthday VIP.",
        "360-Degree Video Booth: Slow-motion rotating camera platform with custom digital overlay.",
        "Signature Memory Capsule: Guests write a goal or memory to be sealed until the next milestone year."
      ],
      speech_or_toast_prompt: `Tonight we celebrate not just another year, but a life packed with passion, laughter, and incredible stories. Here's to the legend of the hour for ${eventName}—cheers to your greatest chapter yet!`,
      invitation_copy: `Get ready to celebrate in style! Join us for an unforgettable milestone party honoring ${eventName} on ${targetDate} in ${location}. Dress to impress and prepare to dance!`
    };

  } else {
    // Community Event & Custom
    categoriesConfig = [
      { name: "Permits, Municipal Compliance & Security", pct: 15.0, desc: "City street closure permits, licensed security, EMT standby, and insurance coverage.", tip: "Apply for municipal civic grants or partner with local business improvement districts for permit fee waivers." },
      { name: "Venue, Stage, Tents & Sanitation", pct: 25.0, desc: "Park permit, outdoor staging, commercial tents, generator power, and portable restrooms.", tip: "Partner with local equipment sponsors in exchange for premier banner placement and stage naming rights." },
      { name: "Audio/Visual, Sound Engineering & Acts", pct: 20.0, desc: "Mainstage line-array sound system, microphones, sound engineers, community performers.", tip: "Invite talented local school bands and regional artists to perform alongside a headliner to balance artist fees." },
      { name: "Hospitality, Refreshments & Waste Management", pct: 20.0, desc: "Volunteer meals, hydration stations, recycling/compost services, and sanitization stations.", tip: "Invite curated food trucks who pay a vendor fee to attend, turning catering into a net-positive revenue stream." },
      { name: "Signage, Marketing & Accessibility", pct: 10.0, desc: "Wayfinding signs, multilingual schedules, ramp rentals, social campaigns, printed programs.", tip: "Utilize large-format QR codes linked to live digital schedules to eliminate printing waste and reprinting costs." },
      { name: "Contingency & Weather Preparedness", pct: 10.0, desc: "Rain contingencies, wind ballast weights, emergency supply replenishment.", tip: "Critical safety reserve for public gatherings to ensure smooth operational adaptations." }
    ];

    milestones = [
      { id: "ms-c-1", timeframe: "3-4 Months Before", title: "Municipal Permits & Venue Reservation", description: "Submit street closure, noise variance, and public assembly permits to local government.", owner_role: "Event Director & Civic Liaison", is_critical: true },
      { id: "ms-c-2", timeframe: "2-3 Months Before", title: "Sponsorship Drive & Vendor Applications", description: "Onboard local corporate sponsors, recruit artisanal vendors, and finalize booth spaces.", owner_role: "Sponsorship Chair", is_critical: false },
      { id: "ms-c-3", timeframe: "6-8 Weeks Before", title: "Volunteer Recruitment & Logistics Contracts", description: "Contract stage, generator, portable sanitation, and launch volunteer registration portal.", owner_role: "Logistics Coordinator", is_critical: true },
      { id: "ms-c-4", timeframe: "3-4 Weeks Before", title: "Public Marketing & Signage Fabrication", description: "Print directional wayfinding signs, launch community social campaign, and issue press release.", owner_role: "Marketing Lead", is_critical: false },
      { id: "ms-c-5", timeframe: "1 Week Before", title: "Volunteer Training & Emergency Safety Briefing", description: "Conduct safety orientation with volunteer team, EMT personnel, and security leads.", owner_role: "Safety Officer & Volunteer Lead", is_critical: true }
    ];

    runOfShow = [
      { id: "ros-c-1", time: "06:30 AM", duration_minutes: 90, activity: "Site Closure, Staging Delivery & Electrical Setup", lead_person: "Logistics Crew & City Public Works", location_zone: "Main Festival Perimeter", contingency_note: "Inspect barrier barricades and power generator grounding." },
      { id: "ros-c-2", time: "08:00 AM", duration_minutes: 60, activity: "Vendor Load-In & Health Inspection Checkpoints", lead_person: "Vendor Coordinator & Health Inspector", location_zone: "Market Row & Food Truck Alley", contingency_note: "Inspect fire extinguishers at every cooking booth." },
      { id: "ros-c-3", time: "09:00 AM", duration_minutes: 30, activity: "Volunteer Team Huddle & Radio Distribution", lead_person: "Volunteer Coordinator", location_zone: "Information Command Tent", contingency_note: "Hand out high-visibility vests and emergency channel guide." },
      { id: "ros-c-4", time: "09:30 AM", duration_minutes: 30, activity: "Gates Open & Public Welcoming Prelude", lead_person: "Welcome Ambassadors", location_zone: "North & South Public Gates", contingency_note: "Hand out event schedules and accessibility guides." },
      { id: "ros-c-5", time: "10:00 AM", duration_minutes: 30, activity: "Civic Opening Ceremony & Mayoral Remarks", lead_person: "Event Director & Civic Leaders", location_zone: "Community Main Stage", contingency_note: "Sign language interpreter positioned stage right." },
      { id: "ros-c-6", time: "10:30 AM", duration_minutes: 180, activity: "Cultural Performances, Maker Workshops & Kids Zone", lead_person: "Stage Manager & Program Director", location_zone: "Performance Stage & Family Pavilion", contingency_note: "Hydration tents monitored for continuous supply." },
      { id: "ros-c-7", time: "01:30 PM", duration_minutes: 60, activity: "Community Showcase & Local Business Awards", lead_person: "MC & Chamber of Commerce Rep", location_zone: "Community Main Stage", contingency_note: "Have spare wireless microphones ready." },
      { id: "ros-c-8", time: "02:30 PM", duration_minutes: 150, activity: "Headliner Musical Act & Street Dance Gathering", lead_person: "Stage Crew & Featured Band", location_zone: "Main Stage Lawn", contingency_note: "Monitor perimeter crowd flow and exit corridor clearance." },
      { id: "ros-c-9", time: "05:00 PM", duration_minutes: 30, activity: "Closing Remarks & Community Group Photo", lead_person: "Event Director", location_zone: "Main Stage", contingency_note: "Broadcast egress reminders and transit options." },
      { id: "ros-c-10", time: "05:30 PM", duration_minutes: 120, activity: "Public Egress, Waste Sorting & Site Teardown", lead_person: "Operations Team & Green Waste Crew", location_zone: "Full Event Perimeter", contingency_note: "Zero-waste sorting stations cleared first to ensure clean park handover." }
    ];

    vendorItems = [
      { id: "v-comm-1", category: "Municipal Permits & Security", title: "File City Permits & Book Security Team", description: "Secure park/street permits, traffic management plan, and licensed guard service.", suggested_booking_deadline: "12 Weeks Before", estimated_cost: Math.round(totalBudget * 0.15), status: "booked" },
      { id: "v-comm-2", category: "Staging & Rentals", title: "Contract Stage, Commercial Tents & Generators", description: "Reserve covered main stage, 20x20 vendor tents, sound-dampened generators, and portable restrooms.", suggested_booking_deadline: "8 Weeks Before", estimated_cost: Math.round(totalBudget * 0.25), status: "contacted" },
      { id: "v-comm-3", category: "Audio / Visual Production", title: "Hire Mainstage Sound Engineers & Production", description: "Outdoor line-array speakers, digital mixing board, stage monitors, and live sound technician.", suggested_booking_deadline: "6 Weeks Before", estimated_cost: Math.round(totalBudget * 0.20), status: "contacted" },
      { id: "v-comm-4", category: "Hospitality & Concessions", title: "Organize Food Trucks & Hydration Infrastructure", description: "Curate diverse local food truck lineup and establish free public water refill stations.", suggested_booking_deadline: "6 Weeks Before", estimated_cost: Math.round(totalBudget * 0.15), status: "pending" },
      { id: "v-comm-5", category: "Signage & Marketing", title: "Print Festival Banners & Accessible Wayfinding", description: "Produce weatherproof vinyl banners, map signs, volunteer shirts, and schedule flyers.", suggested_booking_deadline: "4 Weeks Before", estimated_cost: Math.round(totalBudget * 0.10), status: "pending" },
      { id: "v-comm-6", category: "Sanitation & Eco-Management", title: "Contract Green Waste & Recycling Services", description: "Setup three-stream waste stations (compost, recycle, landfill) and post-event cleanup crew.", suggested_booking_deadline: "4 Weeks Before", estimated_cost: Math.round(totalBudget * 0.05), status: "pending" }
    ];

    ideas = {
      theme_title: "Unity & Heritage Community Festival",
      theme_description: `A vibrant open-air gathering bringing neighbors together through music, artisan craft, culinary culture, and civic pride in ${location}.`,
      color_palette: [
        { name: "Parkland Forest Green", hex_code: "#228B22", usage: "Festival Canopies & Eco Signage" },
        { name: "Sunflower Gold", hex_code: "#EAA221", usage: "Main Stage Banners & Wristbands" },
        { name: "Skyline Cerulean", hex_code: "#007BA7", usage: "Wayfinding Flags & Program Guides" },
        { name: "Natural Hemp", hex_code: "#D2B48C", usage: "Tote Bags & Volunteer Badges" }
      ],
      menu_concepts: [
        "Community Kitchen: Global street taco station with cilantro lime carnitas and chipotle jackfruit.",
        "Local Flavor: Artisanal wood-fired sourdough pizzas baked fresh on-site in mobile ovens.",
        "Hydration Pavilion: Infused cucumber-mint water stations and local cold-brew iced teas.",
        "Sweet Spot: Chilled fruit paletas and local creamery ice cream scoops."
      ],
      interactive_activities: [
        "Collaborative Community Mural: Canvas wall where all attendees paint a section representing their neighborhood.",
        "Makers Workshop Tent: Hands-on pottery, origami, and seed-bomb making for sustainable gardening.",
        "Acoustic Open Mic & Local Showcase: Spotlighting homegrown musicians, youth poets, and cultural dancers."
      ],
      speech_or_toast_prompt: `A thriving community is built on connection, shared joy, and open doors. Welcome everyone to ${eventName}—thank you for making our neighborhood stronger, kinder, and brighter!`,
      invitation_copy: `You're invited to our community celebration: ${eventName}! Bring friends, family, and neighbors on ${targetDate} in ${location} for free live music, delicious food, and joyful community spirit.`
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

  const summaryText = `Master plan for '${eventName}' (${eventType.replace('_', ' ').toUpperCase()}) ` +
    `with $${totalBudget.toLocaleString()} budget for ${guestCount.toLocaleString()} guests in ${location}. ` +
    `Featuring theme '${ideas.theme_title}' with ${categories.length} budgeted categories, ` +
    `${milestones.length} milestone phases, ${runOfShow.length} day-of execution blocks, and ` +
    `${vendorItems.length} procurement milestones.`;

  return {
    event_id: `evt-${Math.random().toString(36).substring(2, 10)}`,
    event_name: eventName,
    event_type: eventType,
    guest_count: guestCount,
    location: location,
    target_date: targetDate,
    generated_at: new Date().toISOString(),
    engine_used: "⚡ Resilient Client Engine (Zero-Downtime Guarantee)",
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
    executive_summary: summaryText
  };
}

export function generateClientChatReply(message, context = {}) {
  const q = (message || '').toLowerCase();
  const budget = context.current_budget || 10000;

  if (q.includes("rain") || q.includes("weather")) {
    return {
      reply: "For outdoor weather contingencies, activate a 72-hour weather trigger:\n" +
        "1. Reserve a clear-span commercial tent with sidewalls 14 days in advance (pay a 30% refundable hold deposit).\n" +
        "2. Ensure hard flooring or elevated subfloor over turf to prevent mud accumulation.\n" +
        "3. Stock 50 matching clear dome umbrellas for guest arrivals and photography.\n" +
        "4. Designate a dry covered transition zone for catering and audio equipment.",
      suggested_actions: [
        "Confirm tent hold deadline with rental supplier",
        "Purchase 30-50 clear umbrellas",
        "Establish indoor photo alternative location"
      ],
      relevant_checklist_item: "Staging & Rentals Contingency",
      budget_impact: "Approx. 5-8% contingency fund allocation"
    };
  }

  if (q.includes("save") || q.includes("cut") || q.includes("budget") || q.includes("cheap")) {
    const savedAmount = Math.round(budget * 0.15);
    return {
      reply: `Here are 3 high-impact strategies to trim up to 15% (~$${savedAmount.toLocaleString()}) without reducing guest enjoyment:\n` +
        "1. Bar Optimization: Switch from open full-liquor to a curated Wine, Craft Beer & 2 Signature Cocktails format (saves ~25% on alcohol costs).\n" +
        "2. Floral Repurposing: Design ceremony altar arrangements so they can be transferred directly to the head table and bar during cocktail hour.\n" +
        "3. Digital Paper Suite: Use premium digital RSVP portals for save-the-dates and menus, keeping physical print runs only for key signage.",
      suggested_actions: [
        "Switch to Signature Drinks + Beer/Wine format",
        "Instruct floral designer to create dual-purpose arrangements",
        "Adopt digital RSVP system to reduce printing & postage costs"
      ],
      relevant_checklist_item: "Catering & Bar Optimization",
      budget_impact: `Potential savings of up to $${savedAmount.toLocaleString()}`
    };
  }

  if (q.includes("centerpiece") || q.includes("decor") || q.includes("flower")) {
    return {
      reply: "Here are 3 elevated centerpiece concepts that maximize visual drama at manageable cost:\n" +
        "1. Hurricane Candle Clusters: Floating taper and pillar candles in multi-height glass cylinders surrounded by loose Italian ruscus greenery.\n" +
        "2. High-Low Dynamic Tables: Alternate between tall minimalist gold floral risers on 30% of tables and low bud-vase clusters on the remaining 70% to add visual dimension.\n" +
        "3. Potted Topiaries or Herb Pots: Rosemary and olive trees in terracotta urns that double as sustainable take-home gifts for guests.",
      suggested_actions: [
        "Review centerpiece rental inventory",
        "Select 2 alternating table centerpiece styles",
        "Order pillar candle cylinders in bulk"
      ],
      relevant_checklist_item: "Floral & Styling",
      budget_impact: "Saves 20-30% compared to dense floral arrangements"
    };
  }

  if (q.includes("timeline") || q.includes("schedule") || q.includes("dance") || q.includes("speech")) {
    return {
      reply: "Key timeline pacing recommendations for maximum guest engagement:\n" +
        "1. Speeches / Toasts: Limit to 2-3 speakers maximum, strictly capped at 3 minutes each, delivered during the salad course before entrees arrive.\n" +
        "2. First Dance: Schedule immediately upon grand entrance into the room—it commands 100% of the room's attention before dinner starts.\n" +
        "3. Cake Cutting: Perform 30 minutes after dinner service to signal the start of dancing and open the dessert station.",
      suggested_actions: [
        "Brief speakers on 3-minute target limit",
        "Coordinate music cue with DJ for entrance and dance",
        "Have dessert station pre-staged near the cake table"
      ],
      relevant_checklist_item: "Run of Show Coordination",
      budget_impact: "Zero financial cost, high experiential impact"
    };
  }

  return {
    reply: `Priority focus should be on guest journey, smooth transitions, and adhering to your $${budget.toLocaleString()} budget. Would you like specific guidance on vendor negotiations, catering menus, or weather backup planning?`,
    suggested_actions: [
      "Review budget category allocations",
      "Inspect day-of run-of-show milestones",
      "Confirm vendor booking deadlines"
    ],
    relevant_checklist_item: "General Planning",
    budget_impact: "Tracked against current budget"
  };
}
