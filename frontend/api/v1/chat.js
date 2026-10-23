export default function handler(req, res) {
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

  const { message = '', current_budget = 10000 } = req.body || {};
  const q = message.toLowerCase();

  let reply = "Here are recommendations based on your event specifications.";
  let actions = ["Review budget breakdown", "Check milestone schedule"];
  let checklistItem = "General Planning";
  let budgetImpact = "Tracked against current budget";

  if (q.includes("rain") || q.includes("weather")) {
    reply = "Weather Contingency Plan:\n1. Reserve a clear-span commercial tent with sidewalls 14 days in advance.\n2. Ensure hard subfloor over turf to prevent mud accumulation.\n3. Keep 50 clear dome umbrellas on standby for arrivals.\n4. Designate a dry covered staging area for catering and sound gear.";
    actions = ["Lock tent reservation deadline", "Order clear umbrellas", "Establish indoor photo plan"];
    checklistItem = "Staging & Rentals Contingency";
    budgetImpact = "Approx. 5-8% contingency reserve";
  } else if (q.includes("save") || q.includes("cut") || q.includes("budget") || q.includes("cheap")) {
    const saved = Math.round(current_budget * 0.15);
    reply = `High-Impact Cost Reduction Tactics (Save ~$${saved.toLocaleString()}):\n1. Switch from open full-bar to Signature Cocktails + Craft Beer/Wine (saves 25% on alcohol).\n2. Dual-purpose florals: repurpose ceremony altar arrangements as table centerpieces.\n3. Digitize RSVP and paper suites to reduce printing and postage costs.`;
    actions = ["Switch to Signature Drink format", "Repurpose ceremony flowers", "Use digital RSVP"];
    checklistItem = "Catering & Bar Optimization";
    budgetImpact = `Potential savings up to $${saved.toLocaleString()}`;
  } else if (q.includes("centerpiece") || q.includes("decor") || q.includes("flower")) {
    reply = "Cost-Effective Elegant Centerpiece Ideas:\n1. Hurricane candle clusters with floating tapers and Italian ruscus.\n2. High-Low table layout: alternating tall floral risers with low bud vases.\n3. Potted topiaries or herbs in terracotta pots that double as guest favors.";
    actions = ["Review candle cylinder inventory", "Select alternating table styles", "Order bulk pillar candles"];
    checklistItem = "Floral & Styling";
    budgetImpact = "Saves 20-30% vs dense floral arrangements";
  } else if (q.includes("dance") || q.includes("speech") || q.includes("timeline")) {
    reply = "Timeline Pacing Guidelines:\n1. Speeches: 2-3 speakers maximum, strictly capped at 3 minutes each during salad course.\n2. First Dance: Perform immediately after grand entrance while all guests are focused.\n3. Cake Cutting: 30 minutes after dinner service to signal the start of dancing.";
    actions = ["Brief speakers on 3-minute cap", "Coordinate DJ entrance music cue", "Stage dessert table"];
    checklistItem = "Run of Show Coordination";
    budgetImpact = "Zero cost, high experiential impact";
  }

  return res.status(200).json({
    reply,
    suggested_actions: actions,
    relevant_checklist_item: checklistItem,
    budget_impact: budgetImpact
  });
}
