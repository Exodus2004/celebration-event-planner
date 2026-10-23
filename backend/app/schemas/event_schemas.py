"""Event schemas with strict Pydantic V2 definitions for validation."""

from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class EventType(StrEnum):
    """Supported celebration and event types."""

    WEDDING = "wedding"
    BIRTHDAY = "birthday"
    COMMUNITY_EVENT = "community_event"
    CUSTOM = "custom"


class BudgetTier(StrEnum):
    """Budget tiers."""

    ECONOMY = "economy"
    MODERATE = "moderate"
    LUXURY = "luxury"
    ULTRA_LUXURY = "ultra_luxury"


class EventPlanRequest(BaseModel):
    """Inbound request model for generating a comprehensive event plan."""

    model_config = ConfigDict(extra="forbid")

    event_name: str = Field(..., min_length=2, max_length=120, description="Name of the celebration")
    event_type: EventType = Field(..., description="Category of the event")
    total_budget: float = Field(..., gt=0.0, le=10_000_000.0, description="Total budget in USD")
    guest_count: int = Field(..., ge=1, le=50_000, description="Estimated number of attendees")
    target_date: str = Field(..., min_length=4, max_length=50, description="Target celebration date")
    location: str = Field(..., min_length=2, max_length=120, description="City, venue, or region")
    theme_preference: str | None = Field(default=None, max_length=120, description="Desired theme or vibe")
    dietary_preferences: list[str] = Field(default_factory=list, description="Dietary guidelines")
    special_notes: str | None = Field(default=None, max_length=500, description="Specific requests or constraints")
    gemini_api_key: str | None = Field(default=None, max_length=200, description="Optional runtime Gemini API key")


class BudgetCategory(BaseModel):
    """Allocated budget bucket with financial and planning guidance."""

    name: str = Field(..., description="Category name (e.g., Venue, Catering)")
    allocated_amount: float = Field(..., ge=0.0, description="Calculated expenditure amount")
    percentage: float = Field(..., ge=0.0, le=100.0, description="Percentage of total budget")
    description: str = Field(..., description="Scope of items covered in this allocation")
    cost_saving_tip: str = Field(..., description="Actionable optimization recommendation")


class BudgetSummary(BaseModel):
    """Aggregated financial overview."""

    total_budget: float = Field(..., ge=0.0)
    per_guest_cost: float = Field(..., ge=0.0)
    contingency_reserve: float = Field(..., ge=0.0)
    categories: list[BudgetCategory]
    ai_budget_insights: list[str]


class MilestoneTask(BaseModel):
    """High-level timeline planning milestone task."""

    id: str
    timeframe: str
    title: str
    description: str
    owner_role: str
    is_critical: bool = False


class RunOfShowItem(BaseModel):
    """Minute-by-minute execution block for the day of the event."""

    id: str
    time: str
    duration_minutes: int = Field(..., ge=1)
    activity: str
    lead_person: str
    location_zone: str
    contingency_note: str


class TimelinePlan(BaseModel):
    """Two-tier timeline including milestone countdown and day-of run-of-show."""

    milestones: list[MilestoneTask]
    run_of_show: list[RunOfShowItem]


class VendorChecklistItem(BaseModel):
    """Vendor procurement and execution task item."""

    id: str
    category: str
    title: str
    description: str
    suggested_booking_deadline: str
    estimated_cost: float = Field(..., ge=0.0)
    status: str = Field(default="pending")  # pending, contacted, booked, completed


class ColorPaletteItem(BaseModel):
    """Color palette swatch and design role."""

    name: str
    hex_code: str
    usage: str


class PersonalizedIdeas(BaseModel):
    """AI-synthesized custom thematic, dining, and engagement concepts."""

    theme_title: str
    theme_description: str
    color_palette: list[ColorPaletteItem]
    menu_concepts: list[str]
    interactive_activities: list[str]
    speech_or_toast_prompt: str
    invitation_copy: str


class EventPlanResponse(BaseModel):
    """Comprehensive output payload for generated event plan."""

    event_id: str
    event_name: str
    event_type: EventType
    guest_count: int
    location: str
    target_date: str
    generated_at: str
    engine_used: str
    budget_summary: BudgetSummary
    timeline_plan: TimelinePlan
    vendor_checklist: list[VendorChecklistItem]
    personalized_ideas: PersonalizedIdeas
    executive_summary: str


class ChatRequest(BaseModel):
    """Inbound query to the GenAI event planning assistant."""

    message: str = Field(..., min_length=2, max_length=1000)
    context_event_id: str | None = Field(default=None, max_length=64)
    event_type: EventType | None = None
    current_budget: float | None = Field(default=None, ge=0.0)
    guest_count: int | None = Field(default=None, ge=1)
    gemini_api_key: str | None = Field(default=None, max_length=200)


class ChatResponse(BaseModel):
    """Assistant recommendation and structured guidance."""

    reply: str
    suggested_actions: list[str]
    relevant_checklist_item: str | None = None
    budget_impact: str | None = None
