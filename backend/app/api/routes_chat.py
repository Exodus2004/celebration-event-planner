"""Interactive GenAI event assistant endpoint."""

from fastapi import APIRouter, status

from app.schemas.event_schemas import ChatRequest, ChatResponse
from app.services.assistant_service import ask_assistant_with_fallback

router = APIRouter(prefix="/api/v1", tags=["Assistant"])


@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Consult the AI event planning assistant",
)
async def chat_with_assistant(req: ChatRequest) -> ChatResponse:
    """Answers user queries regarding budgets, weather backups, vendor negotiation, and timing."""
    return await ask_assistant_with_fallback(req)
